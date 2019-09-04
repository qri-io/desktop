# Developing Qri

* [Development Setup](#setup)
* [Coding Rules](#rules)
* [Commit Message Guidelines](#commits)
* [Writing Documentation](#documentation)

## <a name="setup"> Development Setup

This document describes how to set up your development environment to build and test Qri, and
explains the basic mechanics of using `git` and `yarn`.

### Installing Dependencies

Before you can build Qri, you must install and configure the following dependencies on your
machine:

* [Git](http://git-scm.com/): The [Github Guide to
  Installing Git][git-setup] is a good source of information.

* [Node.js v8.6.X (LTS)](http://nodejs.org): 
    * If you don't have node installed, we recommend using [homebrew][homebrew] to manage your package of node.

    ```shell
    # Install Homebrew by running this script and following the prompts (pulled straight from the homebrew homepage)
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    # install node
    brew install node 
    ```

* [Yarn](https://yarnpkg.com): We use Yarn to install our dependencies
  (rather than using npm). See the detailed [installation instructions][yarn-install].

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



## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* We use [eslint](style) coding style, please use standard to lint any changes before committing:

```shell
# Use eslint to lint files
yarn lint
```

The output will point you to which files/lines need to be changed in order to meet the standardJS formatting.

## <a name="commits"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the Qri change log**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
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
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header
of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit
being reverted.
A commit with this format is automatically created by the [`git revert`][git-revert] command.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example **NEED TO MAKE DECISION ABOUT THIS** , etc...

You can use `*` when the change affects more than a single scope.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

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
[yarn-install]: https://yarnpkg.com/en/docs/install


###### This documentation has been adapted from the [Data Together](https://github.com/datatogether/datatogether), [Hyper](https://github.com/zeit/hyper), and [AngularJS](https://github.com/angular/angularJS) documentation.
