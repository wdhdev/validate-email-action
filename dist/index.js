/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 365:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 481:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 966:
/***/ ((module) => {

module.exports = eval("require")("@williamharrison/validate-email");


/***/ }),

/***/ 523:
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(365);
const github = __nccwpck_require__(481);

const dns = __nccwpck_require__(523);
const validateEmail = __nccwpck_require__(966);

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
        mxRecords = addresses;
    })

    if(!mxRecords) return core.setFailed({
        "success": false,
        "email": email,
        "test": "mx_exists",
        "message": `No MX records exist for the domain ${email.split("@").pop()}!`
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
    core.setFailed(err.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;