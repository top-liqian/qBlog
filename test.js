const crypto = require('crypto')
 
const params = {
    // 即 appId
    "userCode": "f552e1ca934740ce",
    "secret": "H0XVQJHLHQHQ6MMKX0UV8C7NB8GVBPQ4",
    "timestamp": Date.now()
}
 
function getMD5(str) {
    const md5 = crypto.createHash('md5').update(str, 'utf8').digest('hex');
    console.log(`${str} to md5: ${md5}`)
 
    return md5;
}
 
const tsign = getMD5(params.timestamp.toString())
const sign1 = getMD5(params.userCode + tsign)
const sign2 = getMD5(params.userCode + params.secret + tsign)
 
console.log(JSON.stringify({
    ...params,
    sign1,
    sign2
}))