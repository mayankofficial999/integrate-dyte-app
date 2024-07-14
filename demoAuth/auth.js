async function getDemoAuthToken() {
    const meetingTitle = 'Integrate-Dyte';
    try {
        // Create the Meeting
        const resp = await fetch('https://demo.dyte.io/api/v2/meetings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: meetingTitle,
            record: false,
          }),
        });
        const meetCreateResp = await resp.json();
        // Add a participant
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            displayName: participantName.trim(),
            meetingId: meetCreateResp.id,
            presetName:
                presetIndex > 0
                ? presets[presetIndex - 1].label
                : 'group_call_host',
            clientSpecificId: `${Math.floor(Math.random() * 1000000)}`,
            }),
        };
        const addParticipantResp = await fetch(
            'https://demo.dyte.io/api/v2/participants',
            options
        );
        const meetResp = await addParticipantResp.json();
        return meetResp.token;
    } catch (err) {
        return "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6IjM5MGJmMjc0LTQxMzMtNDI2ZC04NDkxLWVhN2ExYTE5MDQ4YiIsIm1lZXRpbmdJZCI6ImJiYjU0MzMzLWJmNDgtNDgwMC04ZDU3LWVmNzIwOWY1MDlhNCIsInBhcnRpY2lwYW50SWQiOiJhYWExZTdmMi1iZGVkLTQ0NGItYTMxYy00OWY5YzFjZDIxZGYiLCJwcmVzZXRJZCI6IjJhZWI3Y2RhLWYxNGUtNDVlMC05MDk3LTM1ZWI3ODhjYzZjMiIsImlhdCI6MTcyMDkzMTg0MywiZXhwIjoxNzI5NTcxODQzfQ.AcFI4lg50GZ1B5fphpaPLK6G-pAzBgWAaQYB_wotHoqJE6RquTtfoqZD21YNAFhtctOr9RSz3DNyLXJTFhQiuCuJJtuOGBrCebNnAvu3PQgljMoK9JVDYV9VJ5tr12AVunzfsMprg4s69he3OGRLJM-1-KtZSnbRBepFgOHIoxHbmaBHlfbCaGfUUjMZApLJVwEuVJtzoPBtxrEzggVgomyZ6gdvUjgHeI7JHYt8tPliQT-RD_d8PFOBY722W5n9vOIvqgFTpRvAFXLBtrzKEwEOQKq7dI2oKqHrKSabAQLtJWxE2_DzoqlFrpoe3abiBwpDfHXq7jEQZe_L6n9LsA";
    }
}

module.exports = getDemoAuthToken;