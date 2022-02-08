const axios = require("axios")

async function validateUrlExists(url){
    console.log("Validating url");
    try {
        new URL(url)
    } catch (err) {
        url = `http://${url}`
    }

    try {
        await axios.get(url)
    } catch (err){
        return false
    }

    console.log("Validated url:", url);
    return url
}

module.exports = validateUrlExists