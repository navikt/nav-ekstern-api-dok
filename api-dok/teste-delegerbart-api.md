# Delegable API - Testing guide

## Table of Contents
1. [Finding Test Users](#finding-test-users)
2. [Delegating API Access in Altinn](#delegating-api-access-in-altinn)
3. [Set Up Integration in Maskinporten](#set-up-integration-in-maskinporten)
3. [Fetching a Maskinporten Token using Postman](#fetching-a-maskinporten-token-using-postman)
4. [Testing the Integration](#testing-the-integration)

---

## Finding Test Users
You will need to find two test users from Test-Norge. 
* The first user is acting as the *supplier* (LPS - Lønns- og personalsystem)
* The second user is acting as the *customer* ("end-user"-company that will use the LPS system)

The following tools can be used to find test users:

### TestID
The easiest way to find a random test user.
1. Navigate to [Altinn Test Environment](https://tt02.altinn.no) and click **Logg inn**.
2. Click **TestID på nivå høyt**.
3. Click **Hent tilfeldig daglig leder**.
4. Take note of the organization number (*Organisasjonsnummer*) and social security number (*Personidentifikator*).
5. You can click **Hent tilfeldig daglig leder** one more time to get the second test user.

### Tenor testdatasøk
If you need more fine-grained control over the test users.
1. Navigate to [Tenor testdatasøk](https://testdata.skatteetaten.no/web/testnorge/soek/freg).
2. You must log in with your personal user, e.g. **BankID**.
3. Find test-users of your choice.
4. Take note of the organization number and social security number.

---

## Delegating API Access in Altinn
This section describes how the customer/"end user" can delegate API-access to a supplier, for instance LPS (Lønns- og personalsystem).

### Step 1: Log into Altinn
1. Navigate to the [Altinn Test Environment](https://tt02.altinn.no).
2. Click **Logg inn**.
3. Click **TestID på nivå høyt**.
4. Use your customer/"end user" company test user's social security number.
5. Click **Autentiser**.

### Step 2: Navigate to Delegable API
1. Select the company you wish to delegate access to NAV's API. This should be the customer/"end user" company
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
    - Set up a new integration and note the integration ID, scope and keys for later use.

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
