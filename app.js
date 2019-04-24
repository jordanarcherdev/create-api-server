#!/usr/bin/env node

//Console Colours
const { logHeading, logWarning, logError } = require('@jordanarcherdev/debug-console');
//Config file
const { createDirectories, buildPackage, mongoAddress } = require('./config');

const fs = require('fs');
// Get the current working directory from where the app has been run
const cwd = process.cwd();
const path = require('path');
//Arguments
const argv = require('yargs').argv;
let homename = argv.folderName;
let dbName = argv.dbName;

//Set default variables if no arguments recieved
if(!homename){
	homename = 'apiServer';
}
if(!dbName){
	dbName = '<YourDatabaseName>';
}

//Define directories to be created
const directories = createDirectories(homename);



//Promise to make directories before proceeding, otherwise the app tries to make the files withouth the directories
function makeDirectories(directories){
	const p = new Promise((resolve, reject) => {
		let counter = 0;
		for (let i = 0; i < directories.length; i++){
			let route = cwd + '/' + directories[i];
			//Using the recursive feature so save having to make individual directories
			fs.mkdir(route, {recursive: true}, (err) => {
				if(err) throw err;
				counter++;
				if(counter == directories.length){
					console.log('Creating directories: Complete!');
					resolve();
				}
			})

		}
	})
	return p;
}

//Continue when all directories have been made
makeDirectories(directories).then(() => {

	//Build the package.json object
	const package = buildPackage(homename);

	//Write package object to json
	let json = JSON.stringify(package);

	//Home directory for new app
	const homedir = path.resolve(`${cwd}/${homename}`);

	//Create package.json
	fs.writeFile(`/${homedir}/package.json`, json, (err) => {
		if(err) throw err;
		logHeading('Package.json: Created!');
});

//Copy over boilerplate files

//Declare boilerplate files directory
const dir = __dirname + '/boilerPlateFiles';

//Read all directoies in boilerplate files and copy files over,
//This means that if you put directories in the boilerplate folder
//The files will be copied over using the same file structure

function traverse(dir, result=[]){
	fs.readdirSync(dir).forEach((file) => {
		const filePath = path.resolve(dir, file);
		const fileStats = { file, path: filePath};
		if(fs.statSync(filePath).isDirectory()){
			fileStats.files=[];
			result.push(fileStats);
			return traverse(filePath, fileStats.files);
		}
		let fileDestination = filePath.split(`/boilerPlateFiles`).pop();

		result.push(fileStats);
		fs.copyFile(filePath, `/${homedir}/${fileDestination}`,(err) => {
			if(err)throw err;
		});
	})
	return result;
}

traverse(dir);

//Write config/keys.js
//Write the contents of the keys file
const keys = `module.exports = { mongoURI: "${mongoAddress}/${dbName}" }`;

fs.writeFile(`${homedir}/config/keys.js`, keys, (err) => {
	if(err) throw err;
	logHeading('Connected to database...');
})

//Install npm packages
const { exec } = require('child_process');
//Install dependencies
logWarning('Please wait for packages to install...');
exec(`npm install`, {cwd: `${homedir}`}, (err, stdout, stderr) => {
	if(err){
		logError(err);
		return;
	}
	console.log(`stdout: ${stdout}`);
	logError(stderr);
	console.log(`Server created! cd into ${homename} and type npm start to run server on port 5000`);
})

});
