#!/usr/bin/env node

// Usage: npx integrate-dyte-app dir-name
const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const getDemoAuthToken = require('./demoAuth/auth.js');
const gradlePropertiesSetup = require('./scripts/react-native/android/gradlePropertiesSetup.js');
const proguardSetup = require('./scripts/react-native/android/proguardSetup.js');
const dependenciesSetup = require('./scripts/react-native/dependenciesSetup.js');
const infoPlistSetup = require('./scripts/react-native/ios/infoPlistSetup.js');

// Function to run a command and log the output
function runCommand(command, args, options) {
    const result = spawn.sync(command, args, options);
    if (result.error) {
        console.error(`Error executing ${command} ${args.join(' ')}:`, result.error);
        process.exit(result.status);
    }
}
// const projectName = process.argv[2];

const currentDir = process.cwd();
const projectDir = currentDir; // path.resolve(currentDir, projectName);

const token = getDemoAuthToken();
token.then((token)=> {
    const tokenJSON = require(path.join(__dirname, 'src/commonjs/mobile/token.json'));
    tokenJSON.authToken = token;
    fs.writeFileSync(
        path.join(__dirname, 'src/commonjs/mobile/token.json'),
        JSON.stringify(tokenJSON, null, 2)
      );
    setupIntegration()
});

const setupIntegration = () => {

    const templateDir = path.resolve(__dirname, 'src/commonjs/mobile');
    const dyteProjectDir = path.resolve(projectDir, 'src/dyte');
    fs.cpSync(templateDir, dyteProjectDir, { recursive: true });

    const isReactNative = true;
    const isExpo = false;

    if(isReactNative) {
        gradlePropertiesSetup(projectDir);
        proguardSetup(projectDir);
        infoPlistSetup(projectDir);
        dependenciesSetup(projectDir, isExpo);
    }

    // Run 'npm install'
    console.log('Running npm install in the root directory...');
    runCommand('npm', ['install'], { stdio: 'inherit' });

    console.log('npm install completed.');

    // Run 'pod install' inside the ios directory
    console.log('Running pod install in ios directory...');
    const iosPath = path.join(projectDir, 'ios');
    runCommand("pod", ['install'], { cwd: iosPath, stdio: 'inherit' });

    console.log('Pod install completed.');

    console.log('Success! Dyte Integrated into the app');
};
