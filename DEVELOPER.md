# Developing Qri

- [Development Setup](#setup)
- [Coding Rules](#rules)
- [Commit Message Guidelines](#commits)
- [Connecting to the Qri backend](#backend)
- [Running Storybook](#storybook)
- [Advanced: Managing Different Qri Repos](#repo)

## <a name="setup"></a> Development Setup

This document describes how to set up your development environment to build and test Qri, and
explains the basic mechanics of using `git` and `yarn`.

### Installing Dependencies

Before you can build Qri Desktop, you must install and configure the following dependencies on your
machine:

- [Git](http://git-scm.com/): The [Github Guide to
  Installing Git][git-setup] is a good source of information.

- [Node.js v12.9.X (LTS)](http://nodejs.org):

  - If you don't have node installed, we recommend using [homebrew][homebrew] to manage your package of node.

  ```shell
  # Install Homebrew by running this script and following the prompts (pulled straight from the homebrew homepage)
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

  # install node
  brew install node
  ```

- [Yarn](https://yarnpkg.com): We use Yarn to install our dependencies
  (rather than using npm). See the detailed [installation instructions][yarn-install].

- [Qri backend](#backend): The core functionality for working with Qri.

### Forking Qri on Github

To contribute code to Qri, you must have a GitHub account so you can push code to your own
fork of Qri and open Pull Requests in the [GitHub Repository][github].

First, [create a Github account](https://github.com/signup/free).
Afterwards, go ahead and
[fork the Qri desktop repository](https://github.com/qri-io/desktop/fork) ([Learn more about forking](http://help.github.com/forking)).

### Building Qri

To build Qri, you clone the source code repository and use Yarn to run the electron app:

```shell
# Clone your Github repository:
git clone https://github.com/qri-io/desktop.git

# Go to the Qri directory:
cd desktop

# Add the main Qri repository as an upstream remote to your repository:
git remote add upstream "https://github.com/qri-io/desktop.git"

# Install dependencies:
yarn

# open a new window to your terminal, and connect the qri backend to the network:
$ qri connect

# Run Qri in the developer environment:
yarn dev

# Use eslint to lint the files:
yarn lint

# Create a packaged version of Qri:
yarn build && yarn start
```

The `yarn dev` command will launch a development version of the Qri electron app.

To get access to Chrome Developer Tools, use the keyboard shortcut Command-Shift-C.

## Release process:

This will only work if you are internal to Qri and have the correct keys

1. change the frontend and backend version numbers in:
   `/package.json`
   `/app/package.json`
   `version.js`
2. run `make update-changelog` to update the changelog
3. write release notes
4. build the correct version of the qri backend binary
5. ensure it is executable (chmod +x qri)
6. move the executable binary to the `/backend` directory
7. run `yarn dist`
8. ensure the Qri Desktop app running correctly and has all the correct version numbers
9. submit a pr, once approved merge
10. run `yarn dist --publish always` to create a release
11. Because notarizing the mac.zip file is broken in electron-builder right now (as per https://snippets.cacher.io/snippet/354a3eb7b0dcbe711383 & https://github.com/electron-userland/electron-builder/issues/4299):

- compress the app file that exists in `/release/mac`
- rename it to match the current mac.zip file in the `/release` directory
- replace the old zip file with the new one
- run `./node_modules/app-builder-bin/mac/app-builder blockmap -i release/FILENAME.zip -o release/throwaway.zip`
  - app-builder is modifying the contents of the zip, which is messing up the notarization. The -o flag indicates an output file that app-builder can futz with without ruining the integrity of the original app
- take the updated file into from size, sha512 and blockMapSize
- update the `/release/latest-mac.yml` with that info
- replace `FILENAME.zip` to the release page

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- We use [eslint](style) coding style, please use standard to lint any changes before committing:

```shell
# Use eslint to lint files
yarn lint
```

The output will point you to which files/lines need to be changed in order to meet the standardJS formatting.

## <a name="commits"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the Qri change log**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header
of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit
being reverted.
A commit with this format is automatically created by the [`git revert`][git-revert] command.

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope

The scope could be anything specifying place of the commit change. For example **NEED TO MAKE DECISION ABOUT THIS** , etc...

You can use `*` when the change affects more than a single scope.

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
[reference GitHub issues that this commit closes][closing-issues].

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

[closing-issues]: https://help.github.com/articles/closing-issues-via-commit-messages/
[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
[git-revert]: https://git-scm.com/docs/git-revert
[git-setup]: https://help.github.com/articles/set-up-git
[github]: https://github.com/qri-io/desktop
[style]: https://eslint.org/
[homebrew]: https://brew.sh/
[yarn-install]: https://yarnpkg.com/en/docs/install

###### This documentation has been adapted from the [Data Together](https://github.com/datatogether/datatogether), [Hyper](https://github.com/zeit/hyper), and [AngularJS](https://github.com/angular/angularJS) documentation.

## <a name="backend"></a>Connecting to the Qri backend

This Qri Desktop application is a Graphical User Interface (GUI) client of our [Qri backend](https://github.com/qri-io/qri). The backend provides an API that this Desktop app utilizes to give our users all the great features Qri has to offer like creating datasets, viewing dataset commit history and pushing datasets to [Qri cloud](https://qri.cloud/)!

As such, developing on this Qri Desktop project relies on a connection to the Qri backend. To install the Qri backend on your machine, follow the instructions of your choice [here](https://qri.io/docs/reference/installing-qri-cli) and ensure that wherever the qri binary was installed has been [added to your PATH](https://qri.io/docs/reference/installing-qri-cli#configuring-your-path). This will allow you to type `qri` command line commands (e.g. `qri connect`) at your terminal.

When this Qri Desktop app is running, it will look for the Qri backend in a few places in this order:

1. Is there a qri node already running on your machine? This would happen if you've run `qri connect` in a different terminal window. If so, Qri Desktop will use this existing node.
2. Is there a qri binary already installed on your PATH? If yes, use that binary to spin up a qri node.
3. Is there qri binary internal to this Desktop app (at `'/desktop/backend/qri'`)? If so, use that. This Desktop app comes packaged with qri binary when a user [downloads](https://qri.io/download) the app and will look here as a last resort. For most Desktop users this is the only version of the Qri backend they may have. If you as a developer have forked this project and not downloaded the app, you will not have this internal binary and need to download it separately.

## <a name="storybook"></a>Running Storybook

When developing new components for Qri Desktop, our team first builds them in [Storybook](https://storybook.js.org/docs/basics/introduction/). Storybook is a tool which allows us to build and showcase components in an isolated environment from our app.

To run Storybook to view our component library, simply run the `yarn storybook` command in your terminal and you will be re-directed to your browser to view the stories. If you would only like to build the Storybook assets but not launch Storybook to open in-browser, you can run the `yarn build-storybook` command.

When rendering Storybook stories which rely on fetched information from our [`qri` backend](https://github.com/qri-io/qri), you'll need to whitelist the Storybook domain to comply with our CORS policy. To do this, follow these steps:

1. Set 'http://localhost:6006' as an entry under `allowedorigins` in the `config.yaml` file of your local qri repo. (Note: your local qri repo is _not_ a refence to [`qri` backend](https://github.com/qri-io/qri) code. It is rather where your qri configuration, peer information, datasets, and other metadata are stored at your `QRI_PATH`.) You can make this change by either using the `qri` command line and running `qri config set` or by directly editing the `config.yaml` located at your `QRI_PATH`.
2. Ensure the `qri` backend is running to receive your request by running `qri connect` in your terminal.

## <a name="repo"></a>Advanced: Managing Different Qri Repos

_Note_: the knowledge and management of different local qri repos is only relevant for developers who choose to develop features against different versions of the [Qri backend](https://github.com/qri-io/qri). The vast majority of development against Qri Desktop will not involve the configuration mentioned in this section and can be ignored unless needed.

As Qri Desktop developers, we will be running the most [recently released version](https://github.com/qri-io/qri/releases) of the Qri backend as a dependency of the Desktop application in the vast majority of cases. This is the default version that we [installed](https://qri.io/docs/reference/installing-qri-cli) on our machines and referenced on our PATH. 

In some cases however, we will be working on a feature which relies on a different version of the Qri backend (perhaps a version in development with a new API which is soon to be released). In such cases, we need to separately install that Qri backend binary and point to the correct "qri repo" to successfully run the new backend version.

As a refresher, when the Qri backend is downloaded onto your machine, two important things happen:
  1. `qri` executable binary is downloaded, which you then add to your PATH so you can access the `qri` command (e.g. `qri connect`, `qri list`, etc)
  2. A qri repo is established by default at `'~/.qri'` (Mac OS). This is a storage location where Qri stores its local information (e.g. configuration, peer information, IPFS data, Logbooks, etc)

To avoid confusion, it's best to leave the above two items (path to qri binary and default qri repo) as untouched defaults. When we want to run Desktop against a different Qri backend, create new locations for the qri binary and qri repo that we point to only when we'd like to use them. 

### How to keep a different local version of Qri backend

  1. Clone the [version of Qri backend](https://github.com/qri-io/qri/tags) that you'd like locally to a destination of your choice (e.g. `'~/qri-dev'`). Then `cd` into the `qri` folder and build this from source by running `go build`. Running `go build` creates a version of qri binary in the same directory in which you ran the command, meaning this binary will be separate from the default one on your PATH and will only be referenced when you directly call it. We just need to make sure we make this binary executable before running it. Do this by running `chmod +x qri` and then you'll be able run it (`./qri`).
  2. Before running your local `qri` executable, we also need to let Qri know that we will be referencing a different qri repo than the default. Qri under the hood references an env variable called `QRI_PATH` which points to the default qri repo location (`'~/.qri'`). When running on a different Qri backend than your default, you want to configure a different qri repo location. Do this by setting the `QRI_PATH` to your new desired location (e.g. `export QRI_PATH=~/qri-dev/qri_v{new-version-here}/qri`). NOTE: this qri repo path is not the same as the path where you've just cloned the `qri` source code.
  3. Now that `QRI_PATH` is pointed to a new location, `cd` into the folder where your local `qri` binary resides (`'~/qri-dev/qri'` in our example) and use your new local `qri` executable to set up a new qri instance which is associated with this Qri backend version (`./qri setup`). For more info on setting up a Qri instance, see [here](https://qri.io/docs/getting-started/qri-cli-quickstart#setup-your-qri-instance).
  4. Finally, let's get a qri node running to serve our Desktop API requests! Do this by running `./qri connect`
  5. Now we have a local qri node running on this new Qri backend. To run Desktop against this node, simply start up Desktop in a different terminal window (`yarn dev`). If for some reason you'd like to switch back to using the default version of Qri backend installed on your PATH, kill the currently running node, re-set `QRI_PATH` to its default (`export QRI_PATH=~/.qri`) and start running Desktop again. Per the steps listed in [backend](#backend), the Desktop app will run the default qri binary that it finds on your PATH.




