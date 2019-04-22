module.exports = {
  
  //Directories to be created by the app
	createDirectories: (homename) => {
    	const directories = [
        	`${homename}`,
          	`${homename}/config`,
          	`${homename}/routes/api`,
          	`${homename}/models`,
          	`${homename}/validation`
        ];
      return directories;
    },
  
  //Build package.json object
  buildPackage: (homename) => {
  	//Package description 
    const description = 'A great new server!';
    //In order to pass variables with dashes and other characters, use es2016 syntax 
    const bodyParser = 'body-parser';
    
    //Create the package object
    const package = {
    	name: homename,
      	version: '0.0.1',
      	description: description,
      	main: 'server.js',
      	scripts: {
        	start: 'node server.js'
        },
      	author: '',
      	license: 'ISC',
      	dependencies: {
        	express: 'latest',
          	mongoose: 'latest',
          	[bodyParser]: 'latest'
        }
    }
    return package;
  },
  
  mongoAddress: 'mongodb://127.0.0.1:27017';
  
}
