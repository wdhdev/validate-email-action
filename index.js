const core = require("@actions/core");
const github = require("@actions/github");

const dns = require("dns");
const validateEmail = require("@williamharrison/validate-email");

try {
    const email = core.getInput("email");
    const validEmail = validateEmail(email);

    if(!validEmail) return core.setFailed("The email address does not match the correct format!");

    let mxRecords = null;

    dns.resolveMx(email.split("@").pop(), function(err, addresses) {
        mxRecords = addresses;
    })

    if(!mxRecords) return core.setFailed(`No MX records exist for the domain ${email.split("@").pop()}!`);

    const result = {
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
    }

    console.log(result);
    core.setOutput("result", result);
} catch(err) {
    core.setFailed(err.message);
}
