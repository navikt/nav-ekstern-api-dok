# Delegable API - Testing guide

## Table of Contents
1. [Finding Test Users](#finding-test-users)
2. [Delegating API Access in Altinn](#delegating-api-access-in-altinn)
3. [Fetching a Maskinporten Token using Postman](#fetching-a-maskinporten-token-using-postman)
4. [Testing the Integration](#testing-the-integration)

---

## Finding Test Users
You will need to find two test-users. One acting as the customer/"end-user"-company and one as the supplier/organization. The following tools can be used to find test users:

### TestID
- The easiest way to find a random test-user.
- Navigate to https://tt02.altinn.no and click "Logg inn"
- Click "TestID på nivå høyt"
- Click "Hent tilfeldig daglig leder"
- Take note of the organization number and social security number.

### Test-Norge
- If you need more fine-grained control over the test users.
- Navigate to [Test-Norge](https://testdata.skatteetaten.no/web/testnorge/soek/freg).
- Locate test-users of your choice
- Take note of the organization number and social security number.

---

## Delegating API Access in Altinn
This section describes how to delegate API-access from a customer/"end-user"-company to a supplier, for instance LPS (Lønns- og personalsystem).

### Step 1: Log into Altinn
- Navigate to the [Altinn Test Environment](https://tt02.altinn.no).
- Use your consumer test-user social security number.
- Click "Autentiser".

### Step 2: Navigate to Delegable API
1. Select the company you wish to delegate access to NAV's API.
2. Go to your profile.
3. Select "Tilgang til programmeringsgrensesnitt – API".
4. Click on "Gi og fjerne API tilganger".

### Step 3: Delegate API Access
1. Search for the API:
    - Click "Deleger nytt API".
    - Search for the API you wish to delegate access to.
    - Click the "+" to add it.
    - Ensure it is added and click "Next".
2. Find the supplier/organization to delegate to:
    - Search for the supplier's organization number.
    - Add them by clicking the "+".
    - Click "Next" and then "Confirm".
3. The supplier will now be able to access the API on behalf of the company when requesting a token from Maskinporten.

---

## Set Up Integration in Maskinporten
1. **Log into Forenklet onboarding:**
    - Navigate to [Maskinporten Onboarding Pilot](https://onboarding.test.maskinporten.no/)
    - Log in using TestID with the supplier's social security number.
2. **Create Integration:**
    - Click "Legg til en offentlig tilgang"
    - Velg integrasjonsmetode - Med nøkkel (Generer for meg)
    - Create a new integration and note the integration ID, scope and keys for later use.

---

## Fetching a Maskinporten Token using Postman
1. **Create a New POST Request:**
    - URL: `https://test.maskinporten.no/token`
2. **Pre-request Script:**
    - Copy the `jsrsasign` library into the environment from: [jsrsasign latest](http://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js).
    - Create a JWT with valid claims signed with the private key:
      ```javascript
      var rs = require('jsrsasign');
      var oHeader = {alg: 'RS256', typ: 'JWT'};
      var oPayload = {
        iss: 'integration_id',
        scope: 'scope',
        aud: 'https://test.maskinporten.no/',
        exp: KJUR.jws.IntDate.get('now + 1hour'),
        iat: KJUR.jws.IntDate.get('now')
      };
      var sHeader = JSON.stringify(oHeader);
      var sPayload = JSON.stringify(oPayload);
      var privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEv...`;
      var sJWT = KJUR.jws.JWS.sign("RS256", sHeader, sPayload, privateKey);
      postman.setEnvironmentVariable("jwt_signed", sJWT);
      ```
3. **Body:**
    - Type: `x-www-form-urlencoded`
    - Include the following parameters:
        - `grant_type: urn:ietf:params:oauth:grant-type:jwt-bearer`
        - `assertion: {{jwt_signed}}`
4. **Send Request:**
    - Click "Send" to get a valid Maskinporten access token, which can be used against the NAV API.

---

## Testing the Integration

- Ensure the integration works by using the data from the created integration, private key matching the public key, and the organization number of the represented entity.
- A valid token from Maskinporten should be obtained, which can be used against the NAV API.
