#! /usr/bin/env node
const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');

const { createAuthenticationTokenCSS, makeAuthenticatedFetch } = require('../src');

program
  .command('create-token')
  .description('create authentication token (only for WebIDs hosted on a Community Solid Server v4.0.0 and up).')
  .option('-w, --webid <string>', 'WebID to create a client-credentials token for.')
  .option('-e, --email <string>', 'User email')
  .option('-p, --password <string>', 'User password')
  .option('-o, --out <string>', 'Output file')
  .action(async (options) => {
    try {
      let questions = []
      options.name = "Solid-auth"
      
      // Request the options that were not passed as parameters interactively
      if (!options.webid) questions.push({ type: 'input', name: 'webid',  message: 'User WebID'})
      if (!options.email) questions.push({ type: 'input', name: 'email',  message: 'User email'})
      if (!options.password) questions.push({ type: 'password', name: 'password',  message: 'User password'})
      if (!options.out) questions.push({ type: 'input', name: 'out',  message: 'Output file'})
      if (questions.length) {
        let answers = await inquirer.prompt(questions)
        options = { ...options, ...answers }
      }
      const credentials = await createAuthenticationTokenCSS(options || {})
      const text = JSON.stringify(credentials, null, 2);
      fs.writeFileSync(options.out, text)

    } catch (e) { 
      throw new Error(`Could not create authentication token: ${e}`) 
    }
  })

  program
    .command('fetch')
    .description('fetch a resource with using a given client credential (only for WebIDs hosted on a Community Solid Server v4.0.0 and up).')
    .argument('<resource url>', 'resource to be fetched')
    .requiredOption('-f, --file <string>', 'File containing the client credentials')
    .action(async (url, options) => { 

      // Load the credentials token
      let fileContents = fs.readFileSync(options.file);
      let credentials = JSON.parse(fileContents);

      // Create the authenticated fetch and retrieve the resource
      const authFetch = await makeAuthenticatedFetch(credentials)
      const res = await authFetch(url);

      // Write out the resource
      console.log(await res.text())
    })

program.parse(process.argv);

