#!/usr/bin/env node

//Console Colours
const { logHeading, logWarning, logError } = require('@jordanarcherdev/debug-console')

const fs = require('fs');
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
	dbName = '< Your Database Name >';
}

//Define directories to be created
const directories = [
			`${homename}`,
			`${homename}/config`,
			`${homename}/routes/api`,
			`${homename}/models`,
			`${homename}/validation`
		    ];



//Promise to make directories before proceeding
function makeDirectories(directories){
	const p = new Promise((resolve, reject) => {
		let counter = 0;
		for (let i = 0; i < directories.length; i++){
			let route = cwd + '/' + directories[i];
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

	//Package.json config variables
	const description = 'A great new server';
	//Use dashes in variables
	const bodyParser = 'body-parser';

	const package = {
				name: homename,
				version: '0.0.1',
				description: description,
				main: 'server.js',
				scripts: {
					start: 'node server.js',
					rundev: 'nodemon'
					},
				author: '',
				license: 'ISC',
				dependencies: {
					express: 'latest',
					mongoose: 'latest',
					[bodyParser]: 'latest'
				}
			}

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
		const fileInfo = { file, path: filePath};
		if(fs.statSync(filePath).isDirectory()){
			fileInfo.files=[];
			result.push(fileStats);
			return traverse(filePath, fileInfo.files);
		}
		let fileDestination = filePath.split(`/boilerPlateFiles`).pop();

		result.push(fileInfo);
		fs.copyFile(filePath, `/${homedir}/${fileDestination}`,(err) => {
			if(err)throw err;
		});
	})
	return result;
}

traverse(dir);

//Write config/keys.js
//Address to local instance of mongodb
const mongoAddress = 'mongodb://127.0.0.1:27017';
//Write the contents of the keys file
const keys = `module.exports = { mongoURI: "${mongoAddress}/${dbName}" }`;

fs.writeFile(`${homedir}/config/keys.js`, keys, (err) => {
	if(err) throw err;
	logHeading('Connected to database...');
})

//Install npm packages
const { exec } = require('child_process');
logWarning('Please wait for packages to install...');
exec(`npm install`, {cwd: `${homedir}`}, (err, stdout, stderr) => {
	if(err){
		logError(err);
		return;
	}
	console.log(`stdout: ${stdout}`);
	logError(stderr);
	console.log(`Server created! cd into ${homename} and type npm start to run server`);
})

});
