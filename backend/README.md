# Prerequistes
1. Install Nodejs v9+
2. Mongodb v3.6+

# Note: Use following command for installing global modules.
Example : npm run -g <module_name>

# Global Dependencies that Must be installed inorder to run and compile project successfully
1. typescript
2. yarn
3. nodemon
4. concurrently
5. webpack
6. webpack-cli

# To Run project on local machine use following command
# Note It compile and run project in auto-reload mode by detecing changed
1. npm run dev

# To Transpile Only use following command at the root of the project
1. tsc --watch

# To run the project in auto-reload mode use following mode
1. nodemon ./build/index.js
# If we don't want to auto-reload use following command
1. node ./build/index.js


# FUTURE WORKS
1. We may imlement wrapper of rabbitMQ "https://www.npmjs.com/package/rascal" if occur problems with native protocol implementation