#!/usr/bin/env ts-node
"use strict";
exports.__esModule = true;
exports.createFolderStructure = void 0;
var commander_1 = require("commander");
var fs_1 = require("fs");
var path_1 = require("path");
var ora_1 = require("ora");
var chalk_1 = require("chalk");
function prepareTemplate(relativeTemplateFilePath) {
    var fullTemplateFilePath = './app-template' + relativeTemplateFilePath;
    var templateContent = '';
    try {
        templateContent = fs_1["default"].readFileSync(fullTemplateFilePath, 'utf-8');
    }
    catch (error) {
        console.error("Error reading template file: ".concat(fullTemplateFilePath));
        return;
    }
    return templateContent;
}
// Create a folder structure with the given name
var createFolderStructure = function (projectPath, name) {
    var _a;
    var lowerCaseName = name.toLowerCase();
    var appsPath = projectPath + "/src/apps";
    var baseDir = path_1["default"].join(appsPath, lowerCaseName);
    var files = (_a = {},
        _a[path_1["default"].join(baseDir, 'README.md')] = "# ".concat(name, "\n\nThis is the README for the ").concat(name, " application."),
        _a[path_1["default"].join(baseDir, 'controllers', 'index.ts')] = "// Index file for ".concat(name, " controllers"),
        _a[path_1["default"].join(baseDir, 'controllers', "".concat(lowerCaseName, ".controller.ts"))] = "// Controller for ".concat(name),
        _a[path_1["default"].join(baseDir, 'index.ts')] = "// Entry point for ".concat(name, " module"),
        _a[path_1["default"].join(baseDir, 'models', 'index.ts')] = "// Index file for ".concat(name, " models"),
        _a[path_1["default"].join(baseDir, 'models', "".concat(lowerCaseName, ".model.ts"))] = "// Model definition for ".concat(name),
        _a[path_1["default"].join(baseDir, 'repositories', 'index.ts')] = "// Index file for ".concat(name, " repositories"),
        _a[path_1["default"].join(baseDir, 'repositories', "".concat(lowerCaseName, ".repo.ts"))] = "// Repository for ".concat(name),
        _a[path_1["default"].join(baseDir, 'routes', 'index.ts')] = "// Index file for ".concat(name, " routes"),
        _a[path_1["default"].join(baseDir, 'routes', "".concat(lowerCaseName, ".routes.ts"))] = "// Routes for ".concat(name),
        _a[path_1["default"].join(baseDir, 'services', 'index.ts')] = "// Index file for ".concat(name, " services"),
        _a[path_1["default"].join(baseDir, 'services', "".concat(lowerCaseName, ".service.ts"))] = "// Service for ".concat(name),
        _a[path_1["default"].join(baseDir, 'types', 'index.ts')] = "// Index file for ".concat(name, " types"),
        _a[path_1["default"].join(baseDir, 'types', "".concat(lowerCaseName, ".ts"))] = "// Type definitions for ".concat(name),
        _a);
    var addProjectSpinner = (0, ora_1["default"])('Creating files and adding template...\n\n').start();
    // Create files with content
    Object.entries(files).forEach(function (_a) {
        var filePath = _a[0], content = _a[1];
        // Ensure the directory exists
        var dirPath = path_1["default"].dirname(filePath);
        if (!fs_1["default"].existsSync(dirPath)) {
            fs_1["default"].mkdirSync(dirPath, { recursive: true });
            console.log(chalk_1["default"].green('CREATE ') + "".concat(dirPath));
        }
        fs_1["default"].writeFileSync(filePath, content);
    });
    addProjectSpinner.succeed("Additional ".concat(name, " application has been setup successfully."));
};
exports.createFolderStructure = createFolderStructure;
// Parse command-line arguments
commander_1.program.parse(process.argv);
