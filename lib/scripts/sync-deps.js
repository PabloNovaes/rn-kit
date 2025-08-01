const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const shouldUpdate = args.includes("--update-existing");

const playgroundPkg = require("../../package.json");
const libPkgPath = path.join(__dirname, "../lib/package.json");
const libPkg = require(libPkgPath);

const ignoreList = ["expo", "expo-router", "expo-status-bar", "react", "react-native"];

if (!libPkg.dependencies) libPkg.dependencies = {};

const source = playgroundPkg.dependencies || {};
let added = 0;
let updated = 0;

for (const [dep, version] of Object.entries(source)) {
    if (!ignoreList.includes(dep)) {
        const current = libPkg.dependencies[dep];
        if (!current) {
            libPkg.dependencies[dep] = version;
            added++;
        } else if (shouldUpdate && current !== version) {
            libPkg.dependencies[dep] = version;
            updated++;
        }
    }
}

fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2));

console.log(`✅ ${added} nova(s) dependência(s) adicionada(s)`);
if (shouldUpdate) console.log(`♻️  ${updated} dependência(s) atualizada(s)`);
