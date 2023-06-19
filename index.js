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

  // list all check runs for a specific ref
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/check-runs', {
        owner: 'thomasphorton-github',
        repo: 'branch-protection',
        ref: 'main',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });


  app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  app.post('/', async (req, res) => {

        let checkName = req.body.check_run.name;
        console.log(`checkName: ${checkName}`);

        if (req.body.action === 'created') {

            console.log(req.body);

            console.log('created');
            // console.log(req.body);
            let checkResponse = await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
                owner: req.body.repository.owner.login,
                repo: req.body.repository.name,
                name: 'Demo Check',
                head_sha: req.body.check_run.check_suite.head_sha,
                status: 'in_progress',
                external_id: '42',
                started_at: '2018-05-04T01:14:52Z',
                output: {
                  title: 'check suit demo',
                  summary: 'from demo app',
                  text: 'from demo app'
                },
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            // console.log(checkResponse);

            // let checkId = checkResponse.data.id;
            // console.log(`checkId: ${checkId}`);

            // setTimeout(async () => {
            //     await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', {
            //         owner: req.body.repository.owner.login,
            //         repo: req.body.repository.name,
            //         check_run_id: checkId,
            //         conclusion: 'success'
            //     }, 10000);

            //     console.log(`check success`);
            // });

            // res.sendStatus(200);
        }
        else {
            console.log(`action: ${req.body.action}`)
            res.sendStatus(200);
        }

        
  });

  app.listen(80, () => {
    console.log('App listening on port 80!');
  });
}

main();