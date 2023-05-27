const core = require("@actions/core");
const github = require("@actions/github");

const dns = require("dns");
const util = require("util");
const validateEmail = require("@williamharrison/validate-email");

async function action() {
    try {
        const email = core.getInput("email");
        const domain = email.split("@").pop();

        const validEmail = validateEmail(email);

        if(!validEmail) return core.setFailed("The email address does not match the correct format!");

        const getMXRecords = util.promisify(dns.resolveMx);
        const mxRecords = await getMXRecords(domain);

        if(!mxRecords.length) return core.setFailed(`No MX records exist for the domain ${domain}!`);

        const result = {
            "success": true,
            "email": email,
            "test_results": {
                "matches_format": true,
                "mx_exists": true
            },
            "results": {
                "domain": domain,
                "mx_records": mxRecords
            }
        }

        console.log(result);
        core.setOutput("result", result);
    } catch(err) {
        core.setFailed(err.message);
    }
}

action()
