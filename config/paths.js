'use strict';

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// config after eject: we're in ./config/
module.exports = {
  projectRoot: appDirectory,
  appDir: resolveApp('./app'),
  appBuild: resolveApp('./app/build'),
  appDistDir: resolveApp('./app/dist'),
  appIndexJs: resolveApp('./app/index'),
  appMainJs: resolveApp('./app/main'),
  appMainDevelopmentJs: resolveApp('./app/main.development'),
  appNodeModules: resolveApp('node_modules'),
  // appPublic: resolveApp('public'),
  // appHtml: resolveApp('public/index.html'),
  // appPackageJson: resolveApp('package.json'),
  // appSrc: resolveApp('src'),
  // appTsConfig: resolveApp('tsconfig.json'),
  // appJsConfig: resolveApp('jsconfig.json'),
  // yarnLockFile: resolveApp('yarn.lock'),
  // testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  // proxySetup: resolveApp('src/setupProxy.js'),
};
