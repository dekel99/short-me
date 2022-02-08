function updateCache(url){
    url.visits++
    url.cacheTime = new Date()
    console.log('Redirected from cache')
}

function addToCache(uniqueURL, cachedUrls, clientURL){
    cachedUrls[uniqueURL] = {
        clientURL,
        visits: 1,
        cacheTime: new Date()
    }
    console.log('New item added to cache')
}

async function removeOldestCache(cachedUrls, Url){
    try {
        let oldestVisit, oldestKey
        for(let key in cachedUrls) {
            if(!oldestVisit || cachedUrls[key].cacheTime < oldestVisit.cacheTime) {
                oldestVisit = cachedUrls[key]
                oldestKey = key
            }
        }
        await Url.updateOne({uniqueURL: oldestKey}, {$inc: {visits: cachedUrls[oldestKey].visits}})
        delete cachedUrls[oldestKey]
        console.log('Oldest cache item removed')
    } catch(err) {
        console.error(err.message)
    }
}

async function storeCacheAfterX(Url, cachedUrls, uniqueURL, visitsToStore){
    try{
        if(!cachedUrls[uniqueURL]) return

        if(cachedUrls[uniqueURL].visits > visitsToStore) {
            await Url.updateOne({uniqueURL}, {$inc: {visits: cachedUrls[uniqueURL].visits}})
            cachedUrls[uniqueURL].visits = 0
            console.log('DB updated & visits reset');
        }
    } catch(err) {
        console.error('Error while store cache', err.message)
    }
}

module.exports = {
    updateCache,
    addToCache,
    removeOldestCache,
    storeCacheAfterX
}