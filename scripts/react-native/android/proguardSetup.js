const proguardSetup = (projectDir) => {
    const fs = require('fs');
    const path = require('path');
    const proguardPath = path.join(projectDir, 'android/app/proguard-rules.pro');

    // Read the proguard-rules.pro file
    let proguardFile = fs.readFileSync(proguardPath, 'utf8');

    // The lines to be added
    const linesToAdd = [
        '-keep class io.webrtc.** { *; }',
        '-dontwarn org.chromium.build.BuildHooksAndroid'
    ];

    let needsUpdate = false;

    // Check if each line is already present
    linesToAdd.forEach(line => {
        if (!proguardFile.includes(line)) {
            proguardFile += `\n${line}`;
            needsUpdate = true;
        }
    });

    // Write the updated content back to the proguard-rules.pro file if needed
    if (needsUpdate) {
        fs.writeFileSync(proguardPath, proguardFile, 'utf8');
        console.log('Lines added to proguard-rules.pro ✅');
    } else {
        console.log('Lines already present in proguard-rules.pro ✅');
    }
}

module.exports = proguardSetup