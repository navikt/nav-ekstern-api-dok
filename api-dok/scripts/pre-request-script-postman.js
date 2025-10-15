var uuid = require("uuid");
var navigator = {};
var window = {};
eval(pm.environment.get("jsrsasign-js"));
var currentTimestamp = Math.floor(Date.now() / 1000)
var issuer =  pm.environment.get("clientId")
var kid =  pm.environment.get("keyId")
var scope =  pm.environment.get("scope")
var consumerOrg =  pm.environment.get("onBehalfOfOrgnummer")
// JWT headers
var header = {
    "kid": kid,                             // KID - Integrations Key ID
    "alg": "RS256"                          // Algorithm used to generate keys
};
// JWT data
var data = {
    "aud": "https://test.maskinporten.no/", // Audience - Maskinporten test
    "iss": issuer,                          // Issuer - Integration ID
    "scope": scope,                         // Scope created by Nav
    "iat": currentTimestamp,
    "exp": (currentTimestamp + 180),
    "jti": uuid.v4(),
    "consumer_org": consumerOrg,
}

var sHeader = JSON.stringify(header);
console.log("sHeader", sHeader);
var sPayload = JSON.stringify(data);
console.log("sPayload", sPayload);
var privateKey = pm.environment.get("privateKey"); // Get private key from environment

// JWK signed
var sJWT = KJUR.jws.JWS.sign(
    header.alg, sHeader, sPayload, privateKey
);
// Save signed JWK
pm.environment.set('jwt_signed', sJWT);            // Creates new environment variable