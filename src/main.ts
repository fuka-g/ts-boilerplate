/* eslint-disable @typescript-eslint/no-var-requires */
//import fse from "fs-extra";
//import hi from "./submodule/submodule.js";

const fse = require("fs-extra");

const submodule = require("./submodule/submodule");

submodule.hi();
//hi();

const packageJson = JSON.parse(fse.readFileSync("./package.json"));

console.log(`${packageJson.name}-${packageJson.version}`);

//console.log(process.cwd());

//# if dev
//# define PROJECT_ROOT ./
//# endif dev

//# if build
//# define PROJECT_ROOT /snapshot/ts-boilerplate/
//# endif build

//# if dev
console.log("dev");
//# endif dev

//# if build
console.log("build");
//# endif build

console.log("PROJECT_ROOT");