# docker-e2e

## Description

Docker container based on [cimg-node](https://github.com/CircleCI-Public/cimg-node) with pre-installed Chrome and Firefox with following e2e-related tools included:

* [lighthouse with plugins](https://www.npmjs.com/package/lighthouse)
* [@lhci/cli](https://www.npmjs.com/package/@lhci/cli)
* [sitespeed.io](https://www.npmjs.com/package/sitespeed.io)
* [webdriver-manager](https://www.npmjs.com/package/webdriver-manager)
* [cypress](https://www.npmjs.com/package/cypress)
* [selenium standalone](https://www.selenium.dev/downloads/)
* [chromedriver](https://chromedriver.chromium.org/downloads)
* [gecko](https://github.com/mozilla/geckodriver/releases)

## Generating dockerfiles

Is as simple as running:

`npm run generate <node_version>`:

* single dockerfile: `npm run generate 12.18`
* multiple dockerfiles: `npm run generate 10.22,12.18,14.13`
