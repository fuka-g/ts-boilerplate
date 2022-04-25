import fse from "fs-extra";
import fs from "fs";

const packageJson = JSON.parse(fse.readFileSync("./package.json"));

if (fs.existsSync(`dist/${packageJson.name}-linux`)) {
	fse.moveSync(`dist/${packageJson.name}-linux`, `dist/${packageJson.name}-${packageJson.version}-linux`, { overwrite: true });
}

if (fs.existsSync(`dist/${packageJson.name}-macos`)) {
	fse.moveSync(`dist/${packageJson.name}-macos`, `dist/${packageJson.name}-${packageJson.version}-macos`, { overwrite: true });
}

if (fs.existsSync(`dist/${packageJson.name}-win.exe`)) {
	fse.moveSync(`dist/${packageJson.name}-win.exe`, `dist/${packageJson.name}-${packageJson.version}-win.exe`, { overwrite: true });
}