#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const ora = require('ora');

// Create a folder structure with the given name
function createFolderStructure(projectPath, name) {
	const lowerCaseName = name.toLowerCase();
	const appsPath = projectPath + "/apps";
	const baseDir = path.join(appsPath, lowerCaseName);

	// const formattedName = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);
	
	// Define the folder structure
	const folders = [
		path.join(baseDir, 'controllers'),
		path.join(baseDir, 'models'),
		path.join(baseDir, 'repositories'),
		path.join(baseDir, 'routes'),
		path.join(baseDir, 'services'),
		path.join(baseDir, 'types')
	];

	const files = {
		[path.join(baseDir, 'README.md')]: `# ${name}\n\nThis is the README for the ${name} application.`,
		[path.join(baseDir, 'controllers', 'index.ts')]: `// Index file for ${name} controllers`,
		[path.join(baseDir, 'controllers', `${name}.controller.ts`)]: `// Controller for ${name}`,
		[path.join(baseDir, 'index.ts')]: `// Entry point for ${name} module`,
		[path.join(baseDir, 'models', 'index.ts')]: `// Index file for ${name} models`,
		[path.join(baseDir, 'models', `${lowerCaseName}.model.ts`)]: `// Model definition for ${name}`,
		[path.join(baseDir, 'repositories', 'index.ts')]: `// Index file for ${name} repositories`,
		[path.join(baseDir, 'repositories', `${lowerCaseName}.repo.ts`)]: `// Repository for ${name}`,
		[path.join(baseDir, 'routes', 'index.ts')]: `// Index file for ${name} routes`,
		[path.join(baseDir, 'routes', `${lowerCaseName}.routes.ts`)]: `// Routes for ${name}`,
		[path.join(baseDir, 'services', 'index.ts')]: `// Index file for ${name} services`,
		[path.join(baseDir, 'services', `${lowerCaseName}.service.ts`)]: `// Service for ${name}`,
		[path.join(baseDir, 'types', 'index.ts')]: `// Index file for ${name} types`,
		[path.join(baseDir, 'types', `${lowerCaseName}.ts`)]: `// Type definitions for ${name}`
	};

	const addProjectSpinner = ora('Creating folders...').start();

	// Create folders
	folders.forEach((folder) => {
		if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder, { recursive: true });
		console.log(`Created folder: ${folder}`);
		}
	});

	addProjectSpinner.start('Creating files and adding template.');

	// Create files with content
	Object.entries(files).forEach(([filePath, content]) => {
		const updatedContent = content.replace(/todo/g, name);
		fs.writeFileSync(filePath, updatedContent);
		console.log(`Created file: ${filePath}`);
	});

	addProjectSpinner.succeed(`Additional project, ${name}, setup successfully.`);
}



// Parse command-line arguments
program.parse(process.argv);
