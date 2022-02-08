const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const createUniqueUrl = require("./createUniqueUrl")
const { updateCache, addToCache, removeOldestCache, storeCacheAfterX } = require("./cacheHandler")
const validateUrlExists = require("./validateUrl")
require("dotenv").config()

mongoose.connect( process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(console.log("Mongo connected"))

urlSchema = new mongoose.Schema({
    clientURL: {type: String, required: true},
    uniqueURL: {type: String, required: true, unique : true},
    visits: {type: Number, required: true}
})

const Url = new mongoose.model("Url", urlSchema)

const cachedUrls = {}

const app = express()
app.use(cors({credentials: true, origin: true}))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// Stores visits in DB after X requests
app.use("/s/:url", (req, res, next)=> {
    next()
    const uniqueURL = req.params.url
    storeCacheAfterX(Url, cachedUrls, uniqueURL, 2)
})

//----------------------ROUTES---------------------------
app.get("/s/:url", async function(req, res){
    try {
        console.log('request!')
        const uniqueURL = req.params.url

        if (cachedUrls[uniqueURL]) {
            updateCache(cachedUrls[uniqueURL])
            return res.redirect(cachedUrls[uniqueURL].clientURL)
        }

        const foundUrls = await Url.findOne({uniqueURL})
        if(!foundUrls) return res.status(404).send('URL not found') // should redirect to page not found

        addToCache(uniqueURL, cachedUrls, foundUrls.clientURL)

        let objLen = Object.keys(cachedUrls).length
        if(objLen > 3) removeOldestCache(cachedUrls, Url)

        console.log(`Redirected from database to ${foundUrls.clientURL}`)
        return res.redirect(foundUrls.clientURL)
    } catch(err) {
        console.error("error while requested url:", err.message)
    }
})

app.post("/new-url", async function(req, res){
    try{
        let clientURL = req.body.data
        clientURL = await validateUrlExists(clientURL)
    
        if(!clientURL) return res.json({success: false, content: "Please enter valid url"})

        const uniqueURL = await createUniqueUrl(Url)
        
        const testUrl = new Url ({
            clientURL,
            uniqueURL,
            visits: 0,
        }) 
        await testUrl.save()
    
        res.json({success: true, content: `http://localhost:4000/s/${uniqueURL}`})
    } catch(err){
        console.error("Error while posting new url", err.message)
    }
})

// ---------------------APP LISTEN----------------------
let port = process.env.PORT;
if (!port) {
  port = 4000;
}

app.listen(port, function() {
  console.log(`server started running on port: ${port}`);
});
