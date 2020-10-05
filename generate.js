const fs = require('fs');
const dft = require('dockerfile-template');
const dockerfileTemplate = fs.readFileSync('./Dockerfile.template', 'utf8');
const args = require('minimist')(process.argv.slice(2))._;
const nodeVersions = typeof args[0] === 'string' ? args[0].split(',') : args;

for (const nodeVersion of nodeVersions) {
	const versions = {
		TAG: nodeVersion,
		NPM_VERSION: 'latest',
		CHROME_VERSION: '85.0.4183.121',
		FIREFOX_VERSION: '81.0.1',
		LHCI_VERSION: '0.5.0',
		LH_VERSION: '6.4.1',
		LH_PLUGIN_FIELD_PERFORMANCE_VERSION: '2.2.0',
		LH_PLUGIN_SOCIAL_SHARING_VERSION: '0.0.1',
		SITESPEEDIO_VERSION: '15.2.0',
		WEBDRIVER_MANAGER_VERSION: '12.1.7',
		CYPRESS_VERSION: '5.3.0',
		SELENIUM_STANDALONE_VERSION: '3.141.59',
		CHROMEDRIVER_VERSION: '86.0.4240.22',
		GECKODRIVER_VERSION: '0.27.0',
	};

	const updatedDockerfile = dft.process(dockerfileTemplate, versions);
	const dockerfilePath = `./${nodeVersion}`;

	if (!fs.existsSync(dockerfilePath)) {
		fs.mkdirSync(dockerfilePath);
		fs.writeFileSync(`${dockerfilePath}/Dockerfile`, updatedDockerfile);
	} else {
		fs.writeFileSync(`${dockerfilePath}/Dockerfile`, updatedDockerfile);
	}

	console.log(`Dockerfile for node:${nodeVersion} generated with success.`);
}
