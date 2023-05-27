const core = require("@actions/core");
const github = require("@actions/github");

const dns = require("dns");
const validateEmail = require("@williamharrison/validate-email");

try {
    const email = core.getInput("email");
    const validEmail = validateEmail(email);

    if(!validEmail) return core.setFailed({
        "success": false,
        "email": email,
        "test": "matches_format",
        "message": "The email address does not match the correct format!"
    })

    let mxRecords = null;

    dns.resolveMx(email.split("@").pop(), function(err, addresses) {
        if(!addresses) return core.setFailed({
            "success": false,
            "email": email,
            "test": "mx_exists",
            "message": `No MX records exist for the domain ${email.split("@").pop()}!`
        })

        mxRecords = addresses;
    })

    core.setOutput({
        "success": true,
        "email": email,
        "test_results": {
            "matches_format": true,
            "mx_exists": true
        },
        "results": {
            "domain": email.split("@").pop(),
            "mx_records": mxRecords
        }
    })

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
} catch(err) {
    core.setFailed({
        "success": false,
        "message": err.message
    })
}