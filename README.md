# docker-e2e

## Description

Docker container based on [docker-node](https://github.com/Synthetixio/docker-node) with pre-installed Chrome and Firefox with following e2e-related tools included:

* [lighthouse with plugins](https://www.npmjs.com/package/lighthouse)
* [@lhci/cli](https://www.npmjs.com/package/@lhci/cli)
* [sitespeed.io](https://www.npmjs.com/package/sitespeed.io)
* [webdriver-manager](https://www.npmjs.com/package/webdriver-manager)
* [cypress](https://www.npmjs.com/package/cypress)
* [selenium standalone](https://www.selenium.dev/downloads/)
* [chromedriver](https://chromedriver.chromium.org/downloads)
* [gecko](https://github.com/mozilla/geckodriver/releases)

## Updating versions

Take a look at [config.json](https://github.com/Synthetixio/docker-node/blob/master/config.json) file.

## Generating dockerfiles

Is as simple as running:

1. `cd shared`
2. `npm install`
3. `npm run generate`
