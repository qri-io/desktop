[![Qri](https://img.shields.io/badge/made%20by-qri-magenta.svg?style=flat-square)](https://qri.io) [![License](https://img.shields.io/github/license/qri-io/desktop.svg?style=flat-square)](./LICENSE)

<h1 align="center">Qri Desktop</h1>

<div align="center">
  <img alt="logo" src="https://qri.io/img/blobs/blob_trio.png" width="128">
</div>
<div align="center">
  <p>react, redux & electron webapp</p>
  <strong>Qri Desktop helps you manage your datasets</strong>
</div>

<div align="center">
  <h3>
    <a href="https://qri.io">
      Website
    </a>
    <span> | </span>
    <a href="#running">
      Run in Dev Mode
    </a>
    <span> | </span>
    <a href="#dependencies">
      Dependencies
    </a>
    <span> | </span>
    <a href="https://github.com/qri-io/frontend/CONTRIBUTOR.md">
      Contribute
    </a>
    <span> | </span>
    <a href="https://github.com/qri-io/frontend/issues">
      Issues
    </a>
     <span> | </span>
    <a href="https://qri.io/docs/">
      Docs
    </a>
     <span> | </span>
    <a href="https://qri.io/download/">
      Download
    </a>
  </h3>
</div>

## Welcome

| Question | Answer |
|--------|-------|
| "I want to learn about Qri" | [Read the official documentation](https://qri.io/docs/) |
| "I want to run desktop in a development environment" | [Running Qri Desktop for dev](https://github.com/qri-io/desktop/README.md#running) |
| "I want to download the latest release of Qri Desktop" | [Download release](https://github.com/qri-io/desktop/releases) |
| "I have a question" | [Create an issue](https://github.com/qri-io/desktop/issues) and use the label 'question' |
| "I found a bug" | [Create an issue](https://github.com/qri-io/desktop/issues) and use the label 'bug' |
| "I want to help build the Qri webapp" | [Read the Contributing guides](https://github.com/qri-io/desktop/CONTRIBUTOR.md) |

<a id="running"></a>
# Run Qri Desktop in developer mode

We use yarn to build and manage Qri Desktop.

After you have cloned this repository, install dependencies:

`yarn`

To run, start the qri backend in connected mode:

`qri connect`

Run in development mode (developer features enabled):

`yarn dev`

Run normally (no developer features):

`yarn start`

To build the electron distributable package:

`yarn dist`

<a id="dependencies"></a>
## Main Dependencies

| Dependency | Website | Github |
|------|------|------|
| Qri Backend | https://qri.io/ | https://github.com/qri-io/qri/ |
| React | https://reactjs.org/ | https://github.com/facebook/react/ |
| Redux | https://redux.js.org/ | https://github.com/reduxjs/redux |
| Electron | https://electronjs.org/ | https://github.com/electron/electron |


## LICENSE

[GPL-3.0](https://github.com/qri-io/desktop/blob/master/LICENSE)

## Contribute

We've set up a separate document for our [contributor guidelines](https://github.com/qri-io/desktop/blob/master/CONTRIBUTOR.md)!

## Develop

We've set up a separate document for [developer guidelines](https://github.com/qri-io/desktop/blob/master/DEVELOPER.md)!


###### This documentation has been adapted from the [Data Together](https://github.com/datatogether/datatogether), [Hyper](https://github.com/zeit/hyper), [AngularJS](https://github.com/angular/angularJS), and [Cycle.js](https://github.com/cyclejs/cyclejs) documentation.