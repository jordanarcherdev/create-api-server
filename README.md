# create-api-server
A command line application to create a node and express api server with boilerplate files and directories

# Installation
```npm i -g```

# Usage
From your current working directory
type ```create-api-server``` into the command line to start
The command line can take two arguments, folderName and dbName
folderName = the root directory of the application and the title of the application in package.json
dbName = the name of the local instance of mongodb you would like to use

# Example
```create-api-server --folderName="my-api" --dbName="mydatabase"```

This will create a folder name my-api in your current working directory.
In package.json the package name will appear as my-api
In your new project, your database location can be bound in config/keys.js as mongoURI
In this example mongoURI will be equal to mongodb://127.0.0.1:27017/mydatabase
