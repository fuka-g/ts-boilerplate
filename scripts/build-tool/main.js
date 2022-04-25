import fse from "fs-extra";
import readdirp from "readdirp";
import JavaScriptObfuscator from "javascript-obfuscator";
/**
 * compiles a single file
 * @param path The file path
 */
function compileFile(basename, path, destination, parameters, obfuscate, obfuscationParameters) {
	// Reads the file's content
	const mainFile = fse.readFileSync(path).toString().split("\n");
	// The final script that will be written to the destination folder
	const builtFile = [];
	// List all instances of //# define
	const defineArray = [];
	// List all active filters (//# if's)
	const activeFiltersArray = [];
	// Values array (true if the key is in the array)
	const filtersValueArray = [];
	if (parameters) {
		parameters.forEach(element => {
			filtersValueArray.push(element);
		});
	}
	for (const line in mainFile) {
		// Trims the line so there are no leading spaces or tabs
		const trimmedLine = mainFile[line].trim();
		// If the line starts with the default prefix (//#)
		// We start parsing it and try to see what we want to do
		if (trimmedLine.startsWith("//#")) {
			// Arguments are separated by spaces
			const lineArguments = trimmedLine.replace("//#", "").trim().split(" ");
			const command = trimmedLine.substring(3, trimmedLine.length).trim();
			if (command.startsWith("define") || command.startsWith("define") ||
				command.startsWith("def") || command.startsWith("def")) {
				let ignoreDefine = false;
				for (const i in activeFiltersArray) {
					if (filtersValueArray.indexOf(activeFiltersArray[i]) === -1) {
						ignoreDefine = true;
					}
				}
				if (!ignoreDefine) {
					// command: "define  DEFINE_2 How_are_you_?"
					// firstCommandArgument: DEFINE_2
					let firstCommandArgument = command.substring(command.indexOf(" "), command.length).trim();
					// secondCommandArgument: How_are_you_?
					const secondCommandArgument = firstCommandArgument.substring(firstCommandArgument.indexOf(" "), firstCommandArgument.length).trim();
					firstCommandArgument = firstCommandArgument.substring(0, firstCommandArgument.indexOf(" ")).trim();
					// If the arguments are set
					if (firstCommandArgument && firstCommandArgument) {
						const indexOfExistingDefine = defineArray.indexOf(firstCommandArgument);
						if (indexOfExistingDefine !== -1 && !(indexOfExistingDefine % 2)) {
							defineArray.splice(indexOfExistingDefine, 2);
						}
						// Push the arguments in defineArray
						defineArray.push(firstCommandArgument);
						defineArray.push(secondCommandArgument);
					}
				}
			}
			if (command.startsWith("if") || command.startsWith("if")) {
				// Remove the if in the first element of the array
				lineArguments.shift();
				// Get the length of the array
				const lineArgumentsLength = lineArguments.length;
				// If the argument isn't already in the filter array
				if (activeFiltersArray.indexOf(lineArguments[lineArgumentsLength]) === -1) {
					// Push it to it
					activeFiltersArray.push(lineArguments[lineArgumentsLength - 1]);
				}
			}
			if (command.startsWith("endif") || command.startsWith("endif")) {
				// If there is an argument after endif (//#endif dev)
				if (lineArguments[1]) {
					//Get it's index in the active filter array
					const indexOfFilter = activeFiltersArray.indexOf(lineArguments[1]);
					// If it's in the array
					if (indexOfFilter !== -1) {
						// Remove it
						activeFiltersArray.splice(indexOfFilter);
					}
				}
				else {
					// If no argument is found, remove the newest filter provided
					activeFiltersArray.pop();
				}
			}
		}
		else {
			if (trimmedLine !== "") {
				// Apply //# define's
				for (const i in defineArray) {
					// parseInt because for some reason i is a string
					const arrayIndex = parseInt(i);
					// defineArray is alternating key and values
					// Only triggers when we're on a key
					if (!(arrayIndex % 2)) {
						mainFile[line] = mainFile[line].replace(defineArray[arrayIndex], defineArray[arrayIndex + 1]);
					}
				}
				let ignoreLine = false;
				// If the line starts with //, ignore it
				if (trimmedLine.startsWith("//"))
					ignoreLine = true;
				// If the line is in a filter where the corresponding variable isn't set,
				// ignore it
				for (const i in activeFiltersArray) {
					if (filtersValueArray.indexOf(activeFiltersArray[i]) === -1) {
						ignoreLine = true;
					}
				}
				if (!ignoreLine) {
					// Push the line of code to be written to the dest folder
					builtFile.push(mainFile[line]);
				}
			}
		}
	}
	let builtFileString = builtFile.join("\n");
	if (obfuscate) {
		const obfResult = JavaScriptObfuscator.obfuscate(builtFileString, obfuscationParameters);
		builtFileString = obfResult.getObfuscatedCode();
	}
	fse.writeFileSync(destination + "/" + basename, builtFileString);
	return builtFileString;
}
/**
 * Main function
 * @param root The source root folder
 */
export function main(parameters) {
	const config = JSON.parse(fse.readFileSync("./package.json")).buildConfig;
	let obfuscate = false;
	fse.ensureDirSync(config.src);
	fse.ensureDirSync(config.dest);
	if (config.src) {
		if (config.dest) {
			// If we provide parameters through the function call (cli arguments)
			// Use them, if not, use the default config in package.json
			if (parameters.length === 0)
				parameters = config.parameters;
			// Config data validation
			if (typeof config.src !== "string")
				throw new Error("config.src must be a string");
			if (typeof config.dest !== "string")
				throw new Error("config.dest must be a string");
			// Check if the parameters field is an array
			// Throw an error if not
			if (config.parameters && typeof config.parameters !== "object") {
				throw new Error("config.parameters must be an Array");
			}
			// If config.obfuscate is true or "true", use code obfusation
			if (config.obfuscate === "true" || config.obfuscate === true)
				obfuscate = true;
			else {
				// Conditional obfuscation
				// Use "obfuscate": "VAR" in package.json where VAR is a parameter name
				// The code will be obfuscated ONLY if the parameter is set
				if (config.obfuscate) {
					for (const i in parameters) {
						if (parameters[i] == config.obfuscate)
							obfuscate = true;
					}
				}
			}
			// If we don't provide an obfuscationParameters object, ignore obfuscation
			if (typeof config.obfuscationParameters !== "object")
				obfuscate = false;
			// Recursively read source folder
			readdirp(config.src, { fileFilter: "*.js", alwaysStat: false })
				.on("data", (entry) => {
					// Send the file to compileFile()
					compileFile(entry.basename, entry.fullPath, config.dest, parameters, obfuscate, config.obfuscationParameters);
				})
				.on("warn", error => console.error("non-fatal error", error))
				.on("error", error => console.error("fatal error", error));
		}
		else {
			throw new Error("No destination specified. Add buildConfig.dest in package.json");
		}
	}
	else {
		throw new Error("No source specified. Add buildConfig.src in package.json");
	}
}
const procargs = process.argv;
for (let i = 0; i < 2; i++) {
	procargs.shift();
}
// test, run, debug: node . dev && node test/dest/main
main(procargs);
