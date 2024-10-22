#!/usr/bin/env
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var commander_1 = require("commander");
var simple_git_1 = require("simple-git");
var path_1 = require("path");
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var chalk_1 = require("chalk");
var figlet_1 = require("figlet");
var ora_1 = require("ora");
var add_cli_1 = require("./add-cli");
var package_json_1 = require("./package.json");
var git = (0, simple_git_1["default"])();
function showHeader() {
    console.log(chalk_1["default"].blue(figlet_1["default"].textSync('NTW CLI', { horizontalLayout: 'full' })));
    console.log(chalk_1["default"].green('Welcome to Node TypeScript Wizard! 🎩✨'));
    console.log(chalk_1["default"].yellow('Let’s create something magical... 🪄'));
}
function showTips(projectName) {
    console.log(chalk_1["default"].blue('\n✨✨ Project Setup Complete ✨✨\n'));
    console.log(chalk_1["default"].green("Your project ".concat(projectName, " is ready to go! \uD83C\uDF89")));
    console.log(chalk_1["default"].magenta('Here are some tips from the author to get you started:'));
    console.log(chalk_1["default"].cyan("\n1. To launch the project (in Docker - development):\n   ".concat(chalk_1["default"].bold('npm run docker:launch'))));
    console.log(chalk_1["default"].cyan("2. To launch the project (in Docker - production):\n   ".concat(chalk_1["default"].bold('npm run docker:launch:prod'))));
    console.log(chalk_1["default"].cyan('3. Explore the project structure.'));
    console.log(chalk_1["default"].cyan('4. Don’t forget to set up your environment variables!'));
    console.log(chalk_1["default"].yellow('\nHappy coding! 💻🚀'));
}
function encode(identifier) {
    return Buffer.from(identifier).toString('base64');
}
function decode(encodedIdentifier) {
    // Convert the Base64 encoded string back to its original form
    return Buffer.from(encodedIdentifier, 'base64').toString('utf-8');
}
function isNtwProject(projectPath) {
    // Check if the encoded id from the config contains our identifier.
    var configFilePath = path_1["default"].join(projectPath, 'ntw.config.json');
    var data = fs_1["default"].readFileSync(configFilePath, 'utf-8');
    var config = JSON.parse(data);
    var decodedIdentifier = decode(config.id);
    if (decodedIdentifier.includes('was made with NTW on')) {
        return true;
    }
    else {
        return false;
    }
}
function createConfigFile(projectPath, projectName) {
    return __awaiter(this, void 0, void 0, function () {
        var date, identifier, encodedIdentifier, config, configFilePath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    date = new Date().toUTCString();
                    identifier = "".concat(projectName, " was made with NTW on ").concat(date);
                    encodedIdentifier = encode(identifier);
                    config = {
                        name: projectName,
                        "id": encodedIdentifier,
                        "apps-path": "./src/apps",
                        dateCreated: date
                    };
                    configFilePath = path_1["default"].join(projectPath, 'ntw.config.json');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    fs_1["default"].writeFileSync(configFilePath, JSON.stringify(config, null, 2));
                    return [4 /*yield*/, git.add(configFilePath)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(chalk_1["default"].red('Error creating config file:', err_1));
                    return [2 /*return*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    createConfigFile: createConfigFile,
    encode: encode
};
commander_1.program
    .version(package_json_1["default"].version, '-v, --version', 'output the current version')
    .description('NTW CLI - Node TypeScript Wizard');
commander_1.program
    .command('init [projectName]')
    .alias('i')
    .description('Initialize a new project with TypeScript support')
    .action(function (projectName) {
    if (projectName === void 0) { projectName = 'new-ntw-project'; }
    showHeader();
    var projectPath = path_1["default"].join(process.cwd(), projectName);
    var spinner = (0, ora_1["default"])("Setting up your project: ".concat(projectName, "...")).start();
    git.clone('https://github.com/fless-lab/ntw-init.git', projectPath)
        .then(function () {
        spinner.text = 'Configuring project...';
        fs_1["default"].rmSync(path_1["default"].join(projectPath, '.git'), { recursive: true, force: true });
        return (0, simple_git_1["default"])(projectPath).init();
    })
        .then(function () {
        spinner.succeed('Project configured successfully.');
        var installSpinner = (0, ora_1["default"])('Step 1/2: Installing project dependencies. This may take a few moments...').start();
        (0, child_process_1.exec)('npm install', { cwd: projectPath }, function (err, stdout, stderr) {
            if (err) {
                installSpinner.fail('Failed to install dependencies.');
                console.error(chalk_1["default"].red("Error: ".concat(stderr)));
                return;
            }
            installSpinner.succeed('Step 1/2: All dependencies have been installed successfully.');
            installSpinner.start('Step 2/2: Finalizing project setup...');
            createConfigFile(projectPath, projectName);
            setTimeout(function () {
                installSpinner.succeed('Step 2/2: Project setup completed.');
                var newGit = (0, simple_git_1["default"])(projectPath);
                newGit.add('.', function () {
                    showTips(projectName);
                });
                //   .commit('Initial setup completed with NTW CLI 🎩✨', () => {
                //     showTips(projectName);
                // });
            }, 1000);
        });
    })["catch"](function (err) {
        spinner.fail('Error during project setup.');
        console.error(chalk_1["default"].red('Error:', err));
    });
});
var genDescription = {
    type: "Specify the type of resource to generate. E.g. can be \"application\" or its aliases.\n              Type can be one of:\n                 - application: Generate a new application structure",
    name: 'Optional: The name of the resource to be generated. Defaults to "new-ntw-resource".'
};
commander_1.program
    .command('generate <type> [name]')
    .aliases(['g', 'gen'])
    .description("Generate a new resource (e.g. an application) with TypeScript scaffolding.\n\nExample:\n  $ ntw g application MyApp\nEnsure that you call this from the root of a ntw project with a valid ntw.config.json file")
    .argument('<type>', "Specify the type of resource to generate. E.g. can be \"application\" or its aliases.\n  Type can be one of:\n       - application: Generate a new application structure")
    .argument('[name]', 'Optional: The name of the resource to be generated. Defaults to "new-ntw-resource".')
    .action(function (type, name) {
    if (name === void 0) { name = 'new-ntw-resource'; }
    var typeMapping = {
        application: 'application',
        // Aliases for 'application'
        a: 'application',
        app: 'application'
    };
    // Check if the provided type matches one of the aliases or full forms
    var normalizedType = typeMapping[type] || type;
    if (normalizedType === 'application') {
        var genAppSpinner = (0, ora_1["default"])('Generating a new NTW application.\n').start();
        var isNtw;
        try {
            isNtw = isNtwProject(process.cwd());
        }
        catch (error) {
            genAppSpinner.fail('Failed to generate a new NTW application.');
            console.error(chalk_1["default"].red("Error: ".concat(error, "\n\n") + "Please ensure you execute this command at the root of an NTW project with a valid ntw.config.json file."));
            return;
        }
        if (!isNtw) {
            genAppSpinner.fail('Failed to generate a new NTW application.');
            console.error(chalk_1["default"].red("Error: Current directory is not a NTW project. Please execute this command at the root of an NTW project with a valid ntw.config.json file."));
        }
        genAppSpinner.text = 'Creating folder structure...\n';
        (0, add_cli_1.createFolderStructure)(process.cwd(), name);
        genAppSpinner.succeed("New ".concat(name, " NTW Application sucessfully generated."));
    }
});
commander_1.program.on('--help', function () {
    console.log('');
    console.log('Example call:');
    console.log('  $ ntw init demo');
    console.log('');
    console.log('Additional Information:');
    console.log('  Ensure that ntw.json is present in order for commands like `ntw generate [appName]` to work.');
});
commander_1.program.parse(process.argv);
