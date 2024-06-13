# API - Testing guide

## Table of Contents
1. [Finding Test Users](#finding-test-users)
2. [Set Up Integration in Maskinporten](#set-up-integration-in-maskinporten)
3. [Fetching a Maskinporten Token using Postman](#fetching-a-maskinporten-token-using-postman)
4. [Testing the Integration](#testing-the-integration)

---

## Finding Test Users
You will need to find one test user from Test-Norge. The following tools can be used to find test users:

### TestID
The easiest way to find a random test user.
1. Navigate to [Altinn Test Environment](https://tt02.altinn.no) and click **Logg inn**.
2. Click **TestID på nivå høyt**.
3. Click **Hent tilfeldig daglig leder**.
4. Take note of the social security number (*Personidentifikator*).

### Tenor testdatasøk
If you need more fine-grained control over the test user.
1. Navigate to [Tenor testdatasøk](https://testdata.skatteetaten.no/web/testnorge/soek/freg).
2. You must log in with your personal user, e.g. **BankID**.
3. Find test user of your choice.
4. Take note of the social security number.

---

## Set Up Integration in Maskinporten
1. **Log into Forenklet onboarding:**
    - Navigate to [Maskinporten Onboarding Pilot](https://onboarding.test.maskinporten.no/)
    - Log in using TestID with the test users social security number.
2. **Create Integration:**
    - Select the relevant company and click **Next**
    - Click **Legg til en offentlig tilgang**
    - Search for "nav" and select the correct api
    - Add a description
    - Select integration method **Med nøkkel (Generer for meg)**
    - Set up a new integration and note the integration ID, scope and keys for later use.

---

## Fetching a Maskinporten Token using Postman
1. **Create a New Request:**
    - Method: `POST`
    - URL: `https://test.maskinporten.no/token`
2. **Create a new Environment:**
    - Add a new variable for the `jsrasign` library
        - name: `jsrsasign-js`
        - current value: Copy the [latest jsrsasign library](http://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js) 
    - Add a new variable for your private key
        - name: `privateKey`
        - type: `secret`
        - current value: Your private key that was generated in the *Set Up Integration In Maskinporten* step
        
        ![A screenshot showing how the new environment should look](create-environment.png)
    - Save the environment
    - Select the new environment

        ![A screenshot showing how to selevt the newly created environment](select-environment.png)
3. **Add a Pre-request Script:**
    - Add a new Pre-request script from the `Scripts` tab with the following content
        ```javascript
        var uuid = require("uuid");
        var navigator = {};
        var window = {};
        eval(pm.environment.get("jsrsasign-js"));
        var currentTimestamp = Math.floor(Date.now() / 1000)
        // JWT headers
        var header = {
            "kid": "<REPLACE>",                            // KID - Integrations Key ID
            "alg": "RS256"                                 // Algorithm used to generate keys
        };
        // JWT data
        var data = {
            "aud": "https://test.maskinporten.no/",        // Audience - Maskinporten test
            "iss": "<REPLACE>",                            //Issuer - Integration ID
            "scope": "<REPLACE>",                          // Scope created by Nav
            "iat": currentTimestamp, 
            "exp": (currentTimestamp + 180),
            "jti": uuid.v4(),
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
        ```
    - Replace the following variables:
        - `kid`: Use the Key-id from Forenklet Onboarding
        - `iss`: Use the IntegrasjonsId from Forenklet Onboarding
        - `scope`: Use the scope from Forenklet Onboarding

         ![A screenshot showing which variables from Maskinporten Onboarding should be inserted in the script](insert-vars-in-script.png)  
4. **Body:**
    - In the `Body` tab select `x-www-form-urlencoded`
    - Include the following parameters:
        - `grant_type: urn:ietf:params:oauth:grant-type:jwt-bearer`
        - `assertion: {{jwt_signed}}`

        ![A screenshot of how the body parameters should look](body-parameters.png)
5. **Send Request:**
    - Click **Send** to get a valid Maskinporten access token, which can be used against the NAV API.

---

## Testing the Integration

- Ensure the integration works by using the data from the created integration, private key matching the public key, and the organization number of the represented entity.
- A valid token from Maskinporten should be obtained, which can be used against the NAV API.
