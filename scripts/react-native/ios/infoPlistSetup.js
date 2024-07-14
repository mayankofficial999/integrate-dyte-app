const fs = require('fs');
const path = require('path');

function updateXML(filePath) {
    try {
        // Read the file synchronously
        const data = fs.readFileSync(filePath, 'utf8');

        // Define the new keys and their corresponding values as a JSON object
        const newEntriesJson = {
            "NSBluetoothPeripheralUsageDescription": "We will use your Bluetooth to access your Bluetooth headphones.",
            "NSBluetoothAlwaysUsageDescription": "We will use your Bluetooth to access your Bluetooth headphones.",
            "NSCameraUsageDescription": "For people to see you during meetings, we need access to your camera.",
            "NSMicrophoneUsageDescription": "For people to hear you during meetings, we need access to your microphone.",
            "NSPhotoLibraryUsageDescription": "For people to share, we need access to your photos."
        };

        // Check and generate the string from the JSON object
        let newEntries = '';
        for (const key in newEntriesJson) {
            if (newEntriesJson.hasOwnProperty(key)) {
                const keyString = `<key>${key}</key>`;
                if (!data.includes(keyString)) {
                    newEntries += `\t<key>${key}</key>\n\t<string>${newEntriesJson[key]}</string>\n`;
                }
            }
        }

        if (newEntries) {
            // Find the position to insert the new entries within the first <dict> tag
            const dictTagEndIndex = data.lastIndexOf('</dict>');

            if (dictTagEndIndex === -1) {
                throw new Error('No closing </dict> tag found.');
            }

            // Split the data and insert the new entries
            const updatedData = [
                data.slice(0, dictTagEndIndex),
                newEntries,
                data.slice(dictTagEndIndex)
            ].join('');

            // Write the updated data back to the file synchronously
            fs.writeFileSync(filePath, updatedData, 'utf8');
            console.log('Plist updated ✅');
        } else {
            console.log('No new entries needed; Info.plist setup complete ✅');
        }
    } catch (err) {
        console.error('Error updating plist:', err);
    }
}

const infoPlistSetup = (projectDir) => {
    const projectPackageJson = require(path.join(projectDir, 'package.json'));
    const infoPlistPath = path.join(projectDir, `ios/${projectPackageJson.name}/Info.plist`);
    try {
        if (infoPlistPath) {
            updateXML(infoPlistPath);
        }
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = infoPlistSetup;
