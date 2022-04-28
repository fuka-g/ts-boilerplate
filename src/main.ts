//# if dev
//# define PROJECT_ROOT src/
//# define ASSETS_ROOT assets/
//# endif dev

//# if build
//# define PROJECT_ROOT /snapshot/ts-boilerplate/
//# define ASSETS_ROOT /snapshot/ts-boilerplate/assets/
//# endif build

/* // ESM
import readdirp from "readdirp";
import fse from "fs-extra";
import hi from "./submodule/submodule.js";
hi();
*/

/* eslint-disable @typescript-eslint/no-var-requires */

const fse = require("fs-extra");

const submodule = require("./submodule/submodule");

console.log(submodule.hi()); 

// Reads package.json
const packageJson = JSON.parse(fse.readFileSync("PROJECT_ROOT../package.json"));

console.log(`${packageJson.name}-${packageJson.version}`);
//console.log(packageJson);


/* // Indicates if we have built the project or not
//# if dev
console.log("dev");
//# endif dev

//# if build
console.log("build");
//# endif build
*/

//console.log("Project root: PROJECT_ROOT");

/* // Reads the project filesystem, ignore if it's a dev build (lots of output)
//# if build
const readdirp = require("readdirp");
readdirp("PROJECT_ROOT../", { alwaysStat: false })
	.on("data", (entry) => {
		console.log(entry.fullPath);
	});
//# endif build
*/

/* // Log pacakge.json
console.log(JSON.parse(fse.readFileSync("PROJECT_ROOTpackage.json")));
*/