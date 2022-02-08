const generateUrl = require("./generateUrl")

async function createUniqueUrl(Url, count=0){
    let uniqueURL = generateUrl(8)
    try{
        const uniqueURLfromDB = await Url.findOne({uniqueURL})
        if(uniqueURLfromDB){
            count++
            if(count > 10) throw "Too many tries to generate unique url"
            return createUniqueUrl(Url, count)
        } else {
            console.log("Unique url created:", uniqueURL)
            return uniqueURL
        }
    } catch (err) {
        console.error("database error:", err)
    }
}

module.exports = createUniqueUrl