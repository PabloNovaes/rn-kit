#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const figlet = require("figlet");
const gradient = require("gradient-string");
const boxen = require("boxen").default;
const ora = require("ora").default;
const { prompt } = require("enquirer");

const program = new Command();

const COMPONENTS = {
    title: "title.tsx",
    all: ["title.tsx"],
};

function showBanner() {
    console.log(
        gradient.atlas(
            figlet.textSync("rnkit", { horizontalLayout: "default" })
        )
    );

    console.log(
        boxen("React Native UI CLI - Copy & Paste Components", {
            padding: 1,
            borderColor: "blue",
            align: "center",
        })
    );
}

function isReactNativeProject() {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!fs.existsSync(packageJsonPath)) return false;

    try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        return pkg.dependencies?.["react-native"] || pkg.dependencies?.expo;
    } catch {
        return false;
    }
}

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(chalk.green(`✓ Created directory: ${dirPath}`));
    }
}

function copyComponent(file) {
    const spinner = ora(`Copying ${file}...`).start();
    const src = path.join(__dirname, "..", "components", file);
    const destDir = path.join(process.cwd(), "src", "components", "ui");
    const dest = path.join(destDir, file);

    if (!fs.existsSync(src)) {
        spinner.fail(`Component not found: ${file}`);
        return false;
    }

    ensureDirectoryExists(destDir);

    try {
        fs.copyFileSync(src, dest);
        spinner.succeed(`${file} copied to src/components/ui/`);
        return true;
    } catch (error) {
        spinner.fail(`Failed to copy ${file}: ${error.message}`);
        return false;
    }
}

function updateIndexFile() {
    const indexPath = path.join(process.cwd(), "src", "components", "ui", "index.ts");
    const uiDir = path.join(process.cwd(), "src", "components", "ui");

    if (!fs.existsSync(uiDir)) return;

    const files = fs.readdirSync(uiDir).filter(f => f.endsWith(".tsx") && f !== "index.ts");

    let content = "// rnkit Components\n// Auto-generated exports\n\n";
    files.forEach(f => {
        const name = path.basename(f, ".tsx");
        content += `export { ${name} } from './${name}';\n`;
    });

    fs.writeFileSync(indexPath, content);
    console.log(chalk.green("✓ index.ts updated"));
}

function getComponentName(component) {
    const map = { title: "Title" };
    return component.toLowerCase() === "all" ? "Title" : (map[component.toLowerCase()] || component);
}

program
    .command("init")
    .description("Initialize component structure")
    .action(() => {
        showBanner();

        if (!isReactNativeProject()) {
            console.log(chalk.red("✗ Not a React Native/Expo project."));
            process.exit(1);
        }

        const uiDir = path.join(process.cwd(), "src", "components", "ui");
        ensureDirectoryExists(uiDir);

        const indexPath = path.join(uiDir, "index.ts");
        const content = `// rnkit Components\n// Add exports for installed components below\n\n// export { Title } from './title';\n`;
        fs.writeFileSync(indexPath, content);
        console.log(chalk.green("✓ index.ts created"));

        console.log(boxen("🎉 Initialization complete!", { padding: 1, borderColor: "green" }));
        console.log(chalk.blue("\n📌 Next steps:"));
        console.log("  - Add a component: npx rnkit add title");
        console.log("  - Import it:       import { Title } from './src/components/ui'");
    });

program
    .command("add [component]")
    .description("Add a specific component")
    .action(async (component) => {
        showBanner();

        if (!isReactNativeProject()) {
            console.log(chalk.red("✗ Not a React Native/Expo project."));
            process.exit(1);
        }

        let selected = component;

        if (!selected) {
            const answer = await prompt({
                type: "select",
                name: "component",
                message: "Select a component to add",
                choices: [...Object.keys(COMPONENTS).filter(k => k !== "all"), "all"]
            });

            selected = answer.component;
        }

        const key = selected.toLowerCase();

        if (key === "all") {
            console.log(chalk.blue("📦 Installing all components...\n"));
            let success = 0;
            COMPONENTS.all.forEach(file => {
                if (copyComponent(file)) success++;
            });
            console.log(chalk.green(`\n🎉 ${success}/${COMPONENTS.all.length} components installed.`));
        } else if (COMPONENTS[key]) {
            if (copyComponent(COMPONENTS[key])) {
                console.log(chalk.green(`\n🎉 Component "${key}" installed.`));
            }
        } else {
            console.log(chalk.red(`✗ Component "${key}" not found.`));
            console.log(chalk.yellow("\nAvailable components:"));
            Object.keys(COMPONENTS).filter(k => k !== "all").forEach(k => {
                console.log(`  - ${k}`);
            });
            process.exit(1);
        }

        updateIndexFile();

        console.log(chalk.blue("\n📖 Usage:"));
        console.log(`  import { ${getComponentName(selected)} } from './src/components/ui';`);
    });

program
    .command("list")
    .description("List available components")
    .action(() => {
        showBanner();

        console.log(chalk.blue("📋 Available components:\n"));
        Object.entries(COMPONENTS).forEach(([key, val]) => {
            if (key !== "all") {
                console.log(key);
            }
        });
        console.log("all");

        console.log(chalk.blue("\n💡 Examples:"));
        console.log("  npx rnkit add <component-name> or all");
    });

program
    .command("help")
    .description("Show help")
    .action(() => {
        showBanner();

        console.log(chalk.white("Available commands:"));
        console.log(chalk.green("  init") + "                    Initialize component structure");
        console.log(chalk.green("  add <component>") + "         Add a specific component");
        console.log(chalk.green("  list") + "                    List available components");
        console.log(chalk.green("  help") + "                    Show this help");

        console.log(chalk.blue("\n📖 Examples:"));
        console.log("  npx rnkit init");
        console.log("  npx rnkit add title");

        console.log(chalk.blue("\n✅ Recommended workflow:"));
        console.log("  cd your-project");
        console.log("  npx rnkit init");
        console.log("  npx rnkit add title");
    });

if (process.argv.length <= 2) {
    showBanner();
    program.commands.find(cmd => cmd.name() === "help").action();
} else {
    program.parse();
}
