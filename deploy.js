const fs = require('fs');
const path = require('path');
const { App } = require("octokit");
const { Octokit } = require('@octokit/rest');
const express = require('express');
const bodyParser = require('body-parser');

async function main() {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // read private key from file
  const privateKey = fs.readFileSync(path.join(__dirname, 'keys', 'checks-demo.2023-06-19.private-key.pem'), 'utf8');

  const gh_app = new App({
    appId: '349438',
    privateKey
  });

  const octokit = await gh_app.getInstallationOctokit('38768661');


  app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  app.post('/', async (req, res) => {

    let checkName = req.body.check_run.name;
 
    res.sendStatus(200);
        
  });

  app.listen(80, () => {
    console.log('App listening on port 80!');
  });
}

main();