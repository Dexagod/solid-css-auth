# Solid client credentials token authentication

This is a javascript + CLI library to use the Client Credentials tokens for the Solid pods hosted on the Community Solid Server.

## Installation

```bash
git clone https://github.com/Dexagod/solid-css-auth.git
cd solid-css-auth
npm install
```

## Usage

### Javascript interface

**Creating the client credentials token**

```js
const {
  createAuthenticationTokenCSS,
  makeAuthenticatedFetch,
} = require("./install/location");

// Create the Client Credentials Token
const credentials = await createAuthenticationTokenCSS({
  name: "my-application-token-name", // note: This is not so important. Only used for token management on your pod server.
  webid: "https://my.pod>.com/profile/card#me",
  email: "my@email.org",
  password: "my-password",
});

// Write output to a file location (if required)
const text = JSON.stringify(credentials, null, 2);
fs.writeFileSync("my-credentials-file.txt", text);
```

**Creating an authenticated fetch function**

```js
// If the token is stored in a file, load them in
const fs = require("fs");
let fileContents = fs.readFileSync(options.file);
let credentials = JSON.parse(fileContents);

// Create the authenticated fetch
const authFetch = await makeAuthenticatedFetch(credentials);

// Now you can fetch private resources on your pod.
const res = await authFetch("https://my.pod.com/private/resource.txt");
console.log(await res.text());
```

### CLI interface

**Creating the client credentials token**

```bash
./bin/auth.js create-token
```

options (If no options are provided, an interactive prompt is shown).

```
Options:
  -w, --webid <string>     WebID to create a client-credentials token for.
  -e, --email <string>     User email
  -p, --password <string>  User password
  -o, --out <string>       Output file
  -h, --help               display help for command
```

**Creating an authenticated fetch function**

```bash
./bin/auth.js fetch https://my.pod.org/private/resource.ttl
```

options

```bash
Options:
  -f, --file <string>  File containing the client credentials
  -h, --help           display help for command
```
