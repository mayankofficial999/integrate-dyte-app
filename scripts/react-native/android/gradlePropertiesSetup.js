const gradlePropertiesSetup = (projectDir) => {
    const fs = require('fs')
    const path = require('path')
    const gradlePropertiesPath = path.join(projectDir, 'android/gradle.properties');

    // Read the gradle.properties file
    let gradlePropertiesFile = fs.readFileSync(gradlePropertiesPath, 'utf8');

    // The line to be added
    const lineToAdd = 'android.enableDexingArtifactTransform.desugaring=false';

    // Check if the line is already present
    if (!gradlePropertiesFile.includes(lineToAdd)) {
        // Append the line to the file content
        gradlePropertiesFile += `\n${lineToAdd}`;

        // Write the updated content back to the gradle.properties file
        fs.writeFileSync(gradlePropertiesPath, gradlePropertiesFile, 'utf8');
        console.log('Line added to gradle.properties ✅');
    } else {
        console.log('Line already present in gradle.properties ✅');
    }
}

module.exports = gradlePropertiesSetup