#!/usr/bin/env node
import boxen from "boxen";
import chalk from "chalk";
import { Command } from "commander";
import Enquirer from "enquirer";
import figlet from "figlet";
import fs from "fs-extra";
import gradient from "gradient-string";
import ora from "ora";
import path from "path";

const program = new Command();
const enquirer = new Enquirer();

const REPO_RAW_BASE = "https://raw.githubusercontent.com/PabloNovaes/rn-kit/main/lib/src/components";
const REPO_API_URL = "https://api.github.com/repos/PabloNovaes/rn-kit/contents/lib/src/components";

function showBanner() {
    console.log(
        gradient([
            { color: '#61DAFB', pos: 0.5 },
            { color: 'rgba(32, 21, 53, 1)', pos: 1 },
        ], { interpolation: "rgb" })(figlet.textSync("Rnkit"))
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
    return true
}

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(chalk.green(`✓ Created directory: ${dirPath}`));
    }
}

async function copyComponent(file) {
    const spinner = ora(`Downloading ${file}...`).start();

    const url = `${REPO_RAW_BASE}/${file}`;
    const destDir = path.join(process.cwd(), "src", "components", "ui");
    const dest = path.join(destDir, file);

    if (fs.existsSync(dest)) {
        spinner.fail(`Component already exists: ${dest}`);
        return false;
    }

    try {
        const res = await fetch(url);

        if (!res.ok) {
            spinner.fail(`Failed to download ${file} - ${res.statusText}`);
            return false;
        }

        const content = await res.text();

        await fs.ensureDir(destDir);
        await fs.writeFile(dest, content);

        spinner.succeed(`${file} downloaded and saved to src/components/ui/`);
        return true;
    } catch (error) {
        spinner.fail(`Error downloading ${file}: ${error.message}`);
        return false;
    }
}

function getComponentName(component) {
    const map = { title: "Title" };
    return component.toLowerCase() === "all" ? "Title" : (map[component.toLowerCase()] || component);
}

async function fetchComponentsFromGithub() {
    try {
        const res = await fetch(REPO_API_URL);
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        // Pega só arquivos .tsx (ajuste extensão se precisar)
        const components = data
            .filter(item => item.type === 'file' && item.name.endsWith('.tsx'))
            .map(item => item.name.toLowerCase());

        return components;
    } catch (error) {
        console.error(chalk.red(`Failed to fetch components list: ${error.message}`));
        return [];
    }
}

function mapComponentsArrayToObject(arr) {
    const obj = {};
    arr.forEach(filename => {
        const key = path.basename(filename, '.tsx').toLowerCase();
        obj[key] = filename;
    });
    return obj;
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

        const content = `// rnkit Components\n// Add exports for installed components below\n\n// export { Title } from './title';\n`;
        fs.writeFileSync(indexPath, content);

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

        const componentsArray = await fetchComponentsFromGithub();
        const COMPONENTS = mapComponentsArrayToObject(componentsArray);

        let selected = component;

        if (!selected) {
            const answer = await enquirer.prompt({
                type: "select",
                name: "component",
                message: "Select a component to add",
                choices: [...Object.keys(COMPONENTS), "all"]
            });

            selected = answer.component;
        }

        const key = selected.toLowerCase();

        if (key === "all") {
            console.log(chalk.blue("📦 Installing all components...\n"));
            let success = 0;
            for (const file of Object.values(COMPONENTS)) {
                if (await copyComponent(file)) success++;
            }
            console.log(chalk.green(`\n🎉 ${success}/${Object.keys(COMPONENTS).length} components installed.`));
        } else if (COMPONENTS[key]) {
            if (await copyComponent(COMPONENTS[key])) {
                console.log(chalk.green(`\n🎉 Component "${key}" installed.`));
            }
        } else {
            console.log(chalk.red(`✗ Component "${key}" not found.`));
            console.log(chalk.yellow("\nAvailable components:"));
            Object.keys(COMPONENTS).forEach(k => {
                console.log(`  - ${k}`);
            });
            process.exit(1);
        }

        console.log(chalk.blue("\n📖 Usage:"));
        console.log(`  import { ${getComponentName(selected)} } from './src/components/ui';`);
    });

program
    .command("list")
    .description("List available components")
    .action(async () => {
        showBanner();

        const componentsArray = await fetchComponentsFromGithub();
        const COMPONENTS = mapComponentsArrayToObject(componentsArray);

        console.log(chalk.blue("📋 Available components:\n"));
        Object.keys(COMPONENTS).forEach(key => console.log(key));
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
