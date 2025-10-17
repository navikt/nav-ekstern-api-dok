const { createSign, randomUUID } = require("crypto");

// Helper: get environment variable (required by default)
const env = (name, required = true) => {
    const value = bru.getEnvVar(name);
    if (required && !value) throw new Error(`Missing env var '${name}'`);
    return value;
};

const header = { alg: "RS256", kid: env("keyId"), typ: "JWT" };
const now = Math.floor(Date.now() / 1000);
const consumerOrg = env("onBehalfOfOrgnummer", false);
const payload = {
    aud: "https://test.maskinporten.no/",
    iss: env("clientId"),
    scope: env("scope"),
    iat: now,
    exp: now + 180,
    jti: randomUUID(),
    ...(consumerOrg && { consumer_org: consumerOrg })
};

// Sign and set jwt_signed environment variable
const b64url = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");
const input = [header, payload].map(b64url).join(".");
const privateKey  = env("privateKey");
const sig = createSign("RSA-SHA256").update(input).sign({ key: privateKey }, "base64url");
bru.setEnvVar("jwt_signed", `${input}.${sig}`);