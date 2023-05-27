const core = require("@actions/core");
const dns = require("dns");
const util = require("util");

async function action() {
    try {
        const email = core.getInput("email");
        const domain = email.split("@").pop();

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(!email.match(emailRegex)) return core.setFailed("The email address does not match the correct format!");

        const getMXRecords = util.promisify(dns.resolveMx);
        let mxRecords = [];

        try {
            mxRecords = await getMXRecords(domain);
        } catch {}

        if(!mxRecords.length) return core.setFailed(`No MX records exist for the domain ${domain}!`);

        const result = {
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
