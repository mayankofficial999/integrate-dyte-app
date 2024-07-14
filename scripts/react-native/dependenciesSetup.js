const fs = require('fs');
const path = require('path');

const dependenciesSetup = (projectDir, isExpo = false) => {
    let projectPackageJson;
    let appJson;

    // Try to read package.json
    try {
        projectPackageJson = require(path.join(projectDir, 'package.json'));
    } catch (err) {
        console.log('package.json not found');
        console.log('Please create an npm project first');
        return;
    }

    // Try to read app.json if it's an Expo project
    if (isExpo) {
        try {
            appJson = require(path.join(projectDir, 'app.json'));
        } catch (err) {
            console.log('app.json not found');
            console.log('Please create an Expo project first');
            return;
        }
    }

    // Define the dependencies to be added
    const dependenciesToAdd = {
        "@dytesdk/react-native-core": "*",
        "@dytesdk/react-native-ui-kit": "*",
        "@dyteinternals/react-native-webrtc": "*",
        "react-native-document-picker": "*",
        "react-native-file-viewer": "*",
        "react-native-fs": "*",
        "react-native-safe-area-context": "*",
        "react-native-sound-player": "*",
        "react-native-svg": "*",
        "react-native-webview": "*",
    };

    // Check and add dependencies if they are not present
    projectPackageJson.dependencies = projectPackageJson.dependencies || {};
    for (const [dependency, version] of Object.entries(dependenciesToAdd)) {
        if (!projectPackageJson.dependencies[dependency]) {
            projectPackageJson.dependencies[dependency] = version;
        }
    }

    // Additional Expo-specific dependencies and plugins
    if (isExpo) {
        projectPackageJson.dependencies["@expo/config-plugins"] = projectPackageJson.dependencies["@expo/config-plugins"] || "*";

        appJson.expo = appJson.expo || {};
        appJson.expo.plugins = appJson.expo.plugins || [];
        const expoPluginsToAdd = [
            "@dytesdk/react-native-core",
            "@dyteinternals/react-native-webrtc"
        ];

        for (const plugin of expoPluginsToAdd) {
            if (!appJson.expo.plugins.includes(plugin)) {
                appJson.expo.plugins.push(plugin);
            }
        }
    }

    // Write the updated package.json and app.json back to the project directory
    fs.writeFileSync(
        path.join(projectDir, 'package.json'),
        JSON.stringify(projectPackageJson, null, 2)
    );

    if (isExpo) {
        fs.writeFileSync(
            path.join(projectDir, 'app.json'),
            JSON.stringify(appJson, null, 2)
        );
    }

    console.log('Dependencies setup completed ✅');
};

module.exports = dependenciesSetup;
