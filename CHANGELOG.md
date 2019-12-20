## [0.3.1](https://github.com/qri-io/desktop/compare/v0.3.0...v0.3.1) (2019-12-20)

We've got a patch release! This patch release cleans up some bugs around fetching, event listeners, dataset naming, and general app flow!

### Bug Fixes

* **App:** fix fetching issues ([4354ba2](https://github.com/qri-io/desktop/commit/4354ba2))
* **App, Dataset:** event listener leak ([d5a464d](https://github.com/qri-io/desktop/commit/d5a464d))
* **Commit:** redirect to the commit after saving a version ([53f1774](https://github.com/qri-io/desktop/commit/53f1774))
* **remove:** if you successfully remove a dataset, clear the selection ([37b2b4d](https://github.com/qri-io/desktop/commit/37b2b4d))
* **transform:** transforms are json objects ([3bfb88b](https://github.com/qri-io/desktop/commit/3bfb88b))
* **validateDatasetName:** adjust regex to be inline with backend ([972a96c](https://github.com/qri-io/desktop/commit/972a96c))



# [0.3.0](https://github.com/qri-io/desktop/compare/v0.2.1...v0.3.0) (2019-12-12)

Welcome to Qri Desktop 0.3.0! We've made a huge overhaul on our UI and UX design in this release as well as streamlined some key flows in the app.

## Redesign
We've changed the layout of our app to switch between two main views: the Collections view and the Dataset view. On the Collections page, you can view a list of all your datasets, get important key details about them, and use drag and drop functionality to create a new dataset from an existing file easily. The Dataset page is where you can view and edit a specific dataset. The 'Status' pane reflects the status of the dataset as it exists now, highlighting changes you have made since your last commit and allowing you to make edits to the structure, metadata, and readme portions of your dataset. The 'History' pane allows you to explore previous versions of your dataset, so you can see what has changed over time.

We've also adjusted the commit message view. We want to encourage you to write detailed messages that describe the work that went into creating the latest version of the dataset and what has changed. To help that, we've moved the commit message to its own page to give you the room to write down all the helpful information that's in your head.

## Import
One important flow that has been redesigned and streamlined is the import flow. It's incredibly easy to add a dataset to Qri: all you need to do is drag and drop the main file over the app and Qri Desktop will add the file to Qri and create an initial commit, giving you a starting point as you work on your dataset. We now have a progress bar that estimates the time needed to add your dataset. Once it has been imported, if you want to edit the dataset and make further changes or improvements, you can do so on the 'Status' pane. Just 'Checkout' the dataset to a folder on your computer and you can make edits in the Qri Desktop app, or in any other program. As long as those files remain in that folder, Qri can pick up those changes for you and display them in the Qri Desktop app.

## Rename
We wanted to make changing your dataset's name as easy as possible. Once you import a dataset using the drag and drop functionality, Qri will guess the dataset name based on the file name. You can easily re-name it when you are on the Dataset page by clicking on the name!

### Bug Fixes

* **bodyValue:** account for null or undefined previous body values ([f9a93e0](https://github.com/qri-io/desktop/commit/f9a93e0))
* **readme:** add readme to commitDetails reducer ([38e545d](https://github.com/qri-io/desktop/commit/38e545d))
* **StatsChart:** fix rename bugs ([ccadc62](https://github.com/qri-io/desktop/commit/ccadc62))


### Features

* add dataset rename ([a505582](https://github.com/qri-io/desktop/commit/a505582))
* add dataset rename ([6f993f4](https://github.com/qri-io/desktop/commit/6f993f4))
* add streamlined import flow ([2de9a51](https://github.com/qri-io/desktop/commit/2de9a51))
* **commit:** add commit tab and page to display commit message in history view ([8ad25a0](https://github.com/qri-io/desktop/commit/8ad25a0))
* **transform:** initial support for transform display ([7797cad](https://github.com/qri-io/desktop/commit/7797cad))



## [0.2.1](https://github.com/qri-io/desktop/compare/v0.2.0...v0.2.1) (2019-11-18)

This release cycle we focused on two features (Readmes and Stats), various bug fixes, and bringing storybook into desktop for development:

## Readmes 
Now you can create Readme markdown files with Qri Desktop! Qri Desktop will also automatically pick up a `readme.md` file that exists in the dataset folder, if you have connected the dataset to a folder. It will also pick up any changes to that file. You can also preview the rendered and formatted readme before saving your changes to the dataset.

## Stats
Qri can now automatically generate useful stats based on your dataset. If you're dataset is tabular, you can view these stats by clicking on a column header. Different column header types generate different stats, eg, numeric column types will generate averages and medians, string column types will generate a max length and min length, etc. These stats give you an overview of what is happening inside your dataset and can be used to spot check your data!

### Bug Fixes

* **BodyTable:** if we've fetchedAll, do not fetch another page ([2f5a954](https://github.com/qri-io/desktop/commit/2f5a954))
* **bodyValue:** account for null or undefined previous body values ([afef2ed](https://github.com/qri-io/desktop/commit/afef2ed))
* **ComponentList:** right-click to discard change from `ComponentList` works again ([d6dfef7](https://github.com/qri-io/desktop/commit/d6dfef7))
* **DetailsBar:** fix transition ([97beb8b](https://github.com/qri-io/desktop/commit/97beb8b))
* **readme:** fixes to get correct html from render response ([c28d49b](https://github.com/qri-io/desktop/commit/c28d49b))
* **StatsChart:** fix rename bugs ([a7b05e2](https://github.com/qri-io/desktop/commit/a7b05e2))


### Features

* style selected column header when stats are displayed ([439cff5](https://github.com/qri-io/desktop/commit/439cff5))
* **App:** drag and drop adds file to `CreateModal` ([a90e92b](https://github.com/qri-io/desktop/commit/a90e92b))
* **Boolean Stat Chart:** add boolean stat, move Stat component out of directory ([cb3d5a7](https://github.com/qri-io/desktop/commit/cb3d5a7))
* **detailsBar:** let's add a details bar on the dataset body page ([d346ed3](https://github.com/qri-io/desktop/commit/d346ed3))
* **DetailsBar:** add stats component to details bar ([6149a11](https://github.com/qri-io/desktop/commit/6149a11))
* **drag-and-drop:** drag and drop a data file to create a dataset ([1f121fe](https://github.com/qri-io/desktop/commit/1f121fe))
* **fetchStats, fetchCommitStats:** add api call to get stats! ([aae9e29](https://github.com/qri-io/desktop/commit/aae9e29))
* **ReadmeHistory:** create component that shows versioned `Readme`s ([0dd5619](https://github.com/qri-io/desktop/commit/0dd5619))
* **stat:** add numeric stat, quick stats component ([ee26539](https://github.com/qri-io/desktop/commit/ee26539))
* **storybook,Stat:** initial string Stat component with story ([2f9443d](https://github.com/qri-io/desktop/commit/2f9443d))
* **transform:** initial support for transform display ([08464af](https://github.com/qri-io/desktop/commit/08464af))



# [0.2.0](https://github.com/qri-io/desktop/compare/v0.1.0...v0.2.0) (2019-11-06)

Hello friends! This is our first major change to the Qri Desktop since release!

This release comes packaged with the latest version of Qri (check out more about that in the [Qri v0.9.1 release docs](https://github.com/qri-io/qri/releases/tag/v0.9.1)).

We've fixed some major bugs that our lovely betas have requested ([learn how to become an official beta here](https://qri.io/beta/)) and we've made improvements based on how we've seen the app get used.

## Adding Structure to Schema
We've moved the schema component into structure. This change lets you configure how formats like CSV are interpreted from within Qri Desktop!

If you were having trouble with header rows showing up in Body before, you'll see new options in the structure component that let you fix the issue. We've also renamed the file where this is stored from schema.json to structure.json, and moved schema inside the structure.json file.

## 🏎 Faster Data Views!
We've updated our csv and json viewers to be snappier and better formatted! This should make working with large datasets much easier.


You can now export your dataset (and get the underlying data and files) at any version by right-clicking the version, in the `History` and clicking `Export Version`

The app is now notarized for macOS 10.15.1

Thanks!

### Bug Fixes

* **App:** wait for apiConnection to come back true before bootstrapping the app ([e915bd7](https://github.com/qri-io/desktop/commit/e915bd7))
* **body:** add default column names when no schema ([3e77c8b](https://github.com/qri-io/desktop/commit/3e77c8b))
* **bodyValue:** adjust `bodyValue` func for case where we reset pagination ([7c91386](https://github.com/qri-io/desktop/commit/7c91386))
* **css:** fix transition div styling ([6d83263](https://github.com/qri-io/desktop/commit/6d83263))
* **DatasetSidebar:** history tab tooltip ([a73e18f](https://github.com/qri-io/desktop/commit/a73e18f))


### Features

* two-way table pagination, json preview ([f368def](https://github.com/qri-io/desktop/commit/f368def))
* **export:** export a specific version of a dataset ([51544e1](https://github.com/qri-io/desktop/commit/51544e1))
* **Export Modal:** `ExportVersion` modal component ([f38cad7](https://github.com/qri-io/desktop/commit/f38cad7))
* **FormatConfig:** add `FormatConfigFSI` and `FormatConfigHistory` ([d633a9e](https://github.com/qri-io/desktop/commit/d633a9e))
* **Structure:** wrap `Schema` in `Structure` ([cafe455](https://github.com/qri-io/desktop/commit/cafe455))



# [0.1.0](https://github.com/qri-io/desktop/compare/v0.1.0-rc1...v0.1.0) (2019-09-26)


### Bug Fixes

* add error handling to publish modal ([dee68b9](https://github.com/qri-io/desktop/commit/dee68b9))
* restore first commit nudge ([1e90e15](https://github.com/qri-io/desktop/commit/1e90e15))
* use mousedown instead of click for modal events ([176d58c](https://github.com/qri-io/desktop/commit/176d58c))
* **api:** fail type should also carry request info ([7db15a6](https://github.com/qri-io/desktop/commit/7db15a6))
* **api:** fetchWorkingDatasetDetails ([7fe5f24](https://github.com/qri-io/desktop/commit/7fe5f24))
* **api actions:** chainSuccess functions need `type: 'SUCCESS'` actions to work ([7d1ea6c](https://github.com/qri-io/desktop/commit/7d1ea6c))
* **api error:** catch failed to fetch errors and let the user know ([57011a4](https://github.com/qri-io/desktop/commit/57011a4))
* **api error:** catch failed to fetch errors and let the user know ([4d849a9](https://github.com/qri-io/desktop/commit/4d849a9))
* **api, dataset:** fix small bugs and linting errors ([3c1164f](https://github.com/qri-io/desktop/commit/3c1164f))
* **app:** do not render components, until we have loaded the session ([94e9096](https://github.com/qri-io/desktop/commit/94e9096))
* **app:** only fetch myDatasets if we are authorized ([de17586](https://github.com/qri-io/desktop/commit/de17586))
* **backend:** wait until quit to close backend ([4b330da](https://github.com/qri-io/desktop/commit/4b330da))
* **body:** add req params to api success actions, ignore double-body requests ([b33a3b6](https://github.com/qri-io/desktop/commit/b33a3b6))
* **body:** return correct body if body is an object ([e7c3b88](https://github.com/qri-io/desktop/commit/e7c3b88))
* **body:** return correct body if body is an object ([45b4262](https://github.com/qri-io/desktop/commit/45b4262))
* **component status:** add indication that there is a parsing error ([5560d50](https://github.com/qri-io/desktop/commit/5560d50))
* **ComponentList:** `Open in Finder` command finder opens properly ([0ab00e0](https://github.com/qri-io/desktop/commit/0ab00e0))
* **dataset-sidebar:** visual bug ([7313384](https://github.com/qri-io/desktop/commit/7313384))
* **datasetDirPath:** rename datasetPath to datasetDirPath and fix reducer bug ([fbb1dc7](https://github.com/qri-io/desktop/commit/fbb1dc7))
* **DatasetList:** `esc` closes dataset list ([fbd68c7](https://github.com/qri-io/desktop/commit/fbd68c7))
* **DatasetList:** fix filter ([f412031](https://github.com/qri-io/desktop/commit/f412031))
* **delete:** when we remove a dataset, clean up state tree ([6ad75c3](https://github.com/qri-io/desktop/commit/6ad75c3))
* **HeaderColumnButtonDropdown:** when user clicks away, close menu ([6fe1ed3](https://github.com/qri-io/desktop/commit/6fe1ed3))
* **myDatasets:** don't discard the pageInfo! ([8f25720](https://github.com/qri-io/desktop/commit/8f25720))
* **pagination:** bailEarly, invalidatePagination work now ([ee925d4](https://github.com/qri-io/desktop/commit/ee925d4))
* **prod:** Use bundle.css instead of main.bundle.css ([772626e](https://github.com/qri-io/desktop/commit/772626e))
* **save:** after save, fetch dataset history ([5213559](https://github.com/qri-io/desktop/commit/5213559))
* **SaveForm, mutations:** title and message get sent on save ([7049aff](https://github.com/qri-io/desktop/commit/7049aff))
* **selection:** when we signin/signup, clear the selection ([99dd7bb](https://github.com/qri-io/desktop/commit/99dd7bb))
* **store:** fix mapError bug and add type for`ApiResponseAction` ([c7831ba](https://github.com/qri-io/desktop/commit/c7831ba))
* **UnlinkedDataset:** fix bug that erroneously shows Unlinked Dataset component ([88c70d2](https://github.com/qri-io/desktop/commit/88c70d2))
* **windows:** Fix some things for Windows and production build ([2e64ba7](https://github.com/qri-io/desktop/commit/2e64ba7))
* **workingDataset:** guard reducer is `dataset` is empty ([45bffde](https://github.com/qri-io/desktop/commit/45bffde))
* **workingDataset reducer:** don't write over body ([2ec2a58](https://github.com/qri-io/desktop/commit/2ec2a58))
* **workingDatasetReducer:** if 422 error, don't clear dataset state ([4a95f5b](https://github.com/qri-io/desktop/commit/4a95f5b))
* add dataset name validation to CreateDataset modal ([e91bdb7](https://github.com/qri-io/desktop/commit/e91bdb7))
* add production html to package.json files ([b80332e](https://github.com/qri-io/desktop/commit/b80332e))
* close the dataset list when a new dataset is loaded ([3f24a82](https://github.com/qri-io/desktop/commit/3f24a82))
* commit highlighting ([2712284](https://github.com/qri-io/desktop/commit/2712284))
* don't intercept actual quit ([7dc18d8](https://github.com/qri-io/desktop/commit/7dc18d8))
* handle windows paths ([67dc31a](https://github.com/qri-io/desktop/commit/67dc31a))
* store activeTab in localstorage on switching datasets ([2d51255](https://github.com/qri-io/desktop/commit/2d51255))


### Features

* 2d schema layout ([d4e4182](https://github.com/qri-io/desktop/commit/d4e4182))
* 2d schema layout ([a4bdfd7](https://github.com/qri-io/desktop/commit/a4bdfd7))
* add a call to action for new datasets ([c9e8b03](https://github.com/qri-io/desktop/commit/c9e8b03))
* add beta flag ([661525b](https://github.com/qri-io/desktop/commit/661525b))
* add publish and unpublish modals ([2e38240](https://github.com/qri-io/desktop/commit/2e38240))
* add remove dataset modal ([bdab991](https://github.com/qri-io/desktop/commit/bdab991))
* add toast on create ([0fc9957](https://github.com/qri-io/desktop/commit/0fc9957))
* create dataset style, tooltips, text ([80e0518](https://github.com/qri-io/desktop/commit/80e0518))
* dataset list content, layout, and style improvements ([9083d64](https://github.com/qri-io/desktop/commit/9083d64))
* improve add/create language, icons, style ([10cc573](https://github.com/qri-io/desktop/commit/10cc573))
* init dataset ui ([704a2da](https://github.com/qri-io/desktop/commit/704a2da))
* make auto-generated datasetname valid, better errors ([839b432](https://github.com/qri-io/desktop/commit/839b432))
* persist dataset path ([9019fbb](https://github.com/qri-io/desktop/commit/9019fbb))
* show human-friendly timestamp in commit detail header, add icon ([6b46090](https://github.com/qri-io/desktop/commit/6b46090))
* tooltip for disabled publish button ([2e7c03e](https://github.com/qri-io/desktop/commit/2e7c03e))
* **add-fsi:** add modal improvements ([9b7dedb](https://github.com/qri-io/desktop/commit/9b7dedb))
* **add-fsi:** add toast on dataset add ([5a48127](https://github.com/qri-io/desktop/commit/5a48127))
* **add-fsi:** wire up api, fix state bugs ([c0ffa9d](https://github.com/qri-io/desktop/commit/c0ffa9d))
* meta-editor ([922fa27](https://github.com/qri-io/desktop/commit/922fa27))
* **app menu:** add link to discord, rename Show Dataset List ([611717f](https://github.com/qri-io/desktop/commit/611717f))
* **backend:** log backend output to tmp/io.qri.desktop/qri.log ([06e8583](https://github.com/qri-io/desktop/commit/06e8583))
* refactor scss build ([0be49ef](https://github.com/qri-io/desktop/commit/0be49ef))
* validate commit form ([36f2342](https://github.com/qri-io/desktop/commit/36f2342))
* windows os menus ([2a62ce0](https://github.com/qri-io/desktop/commit/2a62ce0))
* wire up remove ([622ab64](https://github.com/qri-io/desktop/commit/622ab64))
* **NoDatasetSelected:** simple page for when no dataset is selected ([a878e54](https://github.com/qri-io/desktop/commit/a878e54))



<a name="v0.1.0-rc1"></a>
# v0.1.0-rc1 (2019-09-4)

Welcome to the Qri Desktop release candidate! Qri Desktop is an app for creating and managing datasets and versions (meant to replace the Qri Frontend app). It gives a UI to our qri commandline tool. This is a release candidate, so all features have not been perfected yet. Qri Desktop will make it easy for you to create and version datasets, look back through the history of your datasets to see what has changed, and to double check your changes before you commit them! You can also publish your datasets and add colleagues datasets' that have already been published. 

Qri is an amalgamation of three hefty areas: a version control system, a network to other data users, and a database for your local data. In order to make working with Qri and it's local database easier, we have implimented a way to integrate your normal filesystem to our database. You can have your working directories where you keep your current workspace and data, but still be able to commit/save to your qri database at important times during your workflow. Using Qri, you can load your data from those specific points if you have made a mistake, or you just want to view the data at a different point in time. **The Qri Desktop app gives you the ability to visualize all those different versions and your different datasets from one application.**

Even though this is a release candidate, Qri Desktop is extremely functional and can be used right away to begin versioning and publishing your data! The main feature we are missing (which is why we are considering this a candidate and not an official release as of yet) is the ability to delete dataset versions from inside the Qri Desktop app. This functionality exists in the command line client, which comes bundled with Qri Desktop. [Check out the Qri CLI reference here if you run into this problem.](https://qri.io/docs/reference/cli_commands/#qri_remove)

We are also currently cleaning up our `add` functionality. If you are trying to add from the network, you will most likely encounter bugs. This will be cleaned up by the next release.

On our immediate roadmap:
- the ability to delete versions of a dataset
- basic metadata editing within the app
- adjustments to onboarding, specifically how a user goes from zero to one dataset
- tuning the file system integration for easier/more expected use

### Bug Fixes

* **signin/signup:** get session info from response to signin/signup ([991b381](https://github.com/qri-io/desktop/commit/991b381))
* **windows:** Fix Windows crashes at startup. Improve installer. ([3cbfd54](https://github.com/qri-io/desktop/commit/3cbfd54))
* dataset list item overflow ([ba56a59](https://github.com/qri-io/desktop/commit/ba56a59))
* dataset list overlay covers all ([7790a88](https://github.com/qri-io/desktop/commit/7790a88))
* disable publish button if no history ([f4a673e](https://github.com/qri-io/desktop/commit/f4a673e))
* header dropdown css ([617ad59](https://github.com/qri-io/desktop/commit/617ad59))
* make handsontable read-only ([9c558ad](https://github.com/qri-io/desktop/commit/9c558ad))
* **AddDataset:** remove `onSubmit` func that was firing when we didn't want it ([5166d69](https://github.com/qri-io/desktop/commit/5166d69))
* **addToUrl:** fix logic behind segments and slashes in url ([1c2076c](https://github.com/qri-io/desktop/commit/1c2076c))
* **api:** fix api bugs from merge ([28dbfd3](https://github.com/qri-io/desktop/commit/28dbfd3))
* **backend:** fixes bug that doesn't launch qri if there is no QRI_PATH ([e4c5d35](https://github.com/qri-io/desktop/commit/e4c5d35))
* **body, meta, schema:** guard against no data ([912b36d](https://github.com/qri-io/desktop/commit/912b36d))
* **ChoosePeername:** catch when peername prop changes ([f839ac5](https://github.com/qri-io/desktop/commit/f839ac5))
* **cloud link:** show in cloud should use QRI_CLOUD_URL ([c72a75b](https://github.com/qri-io/desktop/commit/c72a75b))
* **CreateDataset:** fix bug in api that wasn't adding params ([43c2c82](https://github.com/qri-io/desktop/commit/43c2c82))
* **Dataset, CommitDetails:** make sure we have a component before attempting to show it ([3802243](https://github.com/qri-io/desktop/commit/3802243))
* **Dataset, DatasetSidebar:** only show status or history if it makes sense ([cc666a6](https://github.com/qri-io/desktop/commit/cc666a6))
* **dist:** Command to build distributables ([6d3542d](https://github.com/qri-io/desktop/commit/6d3542d))
* **fetchMyDatasets:** if datasets list is empty, don't try to set a selection ([918d2bf](https://github.com/qri-io/desktop/commit/918d2bf))
* **fetchWorkingHistory:** use `page` to determine if this call is for a new history ([9ea3311](https://github.com/qri-io/desktop/commit/9ea3311))
* **Modal:** don't allow user to dismiss modal when waiting for async request ([6f56293](https://github.com/qri-io/desktop/commit/6f56293))
* **Onboard:** fix CSSTransition bug ([ea1b836](https://github.com/qri-io/desktop/commit/ea1b836))
* **StatusDots:** restore status dots that were lost in rebase ([08c33d5](https://github.com/qri-io/desktop/commit/08c33d5))
* **toggleButtonDisabled:** use `useEffect` to mitigate disabled button errors ([a86bd48](https://github.com/qri-io/desktop/commit/a86bd48))
* **Welcome:** change github repo link from `frontend` to `desktop` ([c6a9f8c](https://github.com/qri-io/desktop/commit/c6a9f8c)), closes [#41](https://github.com/qri-io/desktop/issues/41)
* **windows:** On windows, look for qri binary ending in .exe ([cb8afad](https://github.com/qri-io/desktop/commit/cb8afad))
* **workingDataset:** when we request a new working dataset, clear out the old one ([508b084](https://github.com/qri-io/desktop/commit/508b084))
* set default working dataset if none selected ([9c0983d](https://github.com/qri-io/desktop/commit/9c0983d))
* workingDataset gets fsi state ([aaa0daa](https://github.com/qri-io/desktop/commit/aaa0daa))


### Features

* show window on refocusing app ([899b103](https://github.com/qri-io/desktop/commit/899b103))
* **profile photo:** use a default profile photo if no photo is returned ([e9bbc12](https://github.com/qri-io/desktop/commit/e9bbc12))
* add Command-R shortcut ([062f337](https://github.com/qri-io/desktop/commit/062f337))
* **auto update:** use electron-updater for auto updates ([26e9bed](https://github.com/qri-io/desktop/commit/26e9bed))
* add component content header with status ([a7c1878](https://github.com/qri-io/desktop/commit/a7c1878))
* add ComponentList component, ensure correct status behavior ([288d05e](https://github.com/qri-io/desktop/commit/288d05e))
* add dataset from dataset list, add JSON display ([c3f1721](https://github.com/qri-io/desktop/commit/c3f1721))
* add first-pass model for state tree ([#20](https://github.com/qri-io/desktop/issues/20)) ([660b639](https://github.com/qri-io/desktop/commit/660b639))
* add historic component status to commit detail view ([a89980c](https://github.com/qri-io/desktop/commit/a89980c))
* add historic status, show historic schema and meta ([2aa60ca](https://github.com/qri-io/desktop/commit/2aa60ca))
* add metadata table layout ([ee56ee5](https://github.com/qri-io/desktop/commit/ee56ee5))
* add router-based onboarding flow, user menu ([cfcad2d](https://github.com/qri-io/desktop/commit/cfcad2d))
* add router-based onboarding flow, user menu ([f891790](https://github.com/qri-io/desktop/commit/f891790))
* add signin page and debounced text input ([b022d1b](https://github.com/qri-io/desktop/commit/b022d1b))
* add Signup page ([2ae0a95](https://github.com/qri-io/desktop/commit/2ae0a95))
* add toast component ([15497bd](https://github.com/qri-io/desktop/commit/15497bd))
* add toasts, handle save loading state ([d84cfc8](https://github.com/qri-io/desktop/commit/d84cfc8))
* always show status tab ([9ae00fd](https://github.com/qri-io/desktop/commit/9ae00fd))
* build out save state, handle commit ([fdb84b9](https://github.com/qri-io/desktop/commit/fdb84b9))
* combine /list and /fsilinks to derive linked status ([ba395ea](https://github.com/qri-io/desktop/commit/ba395ea))
* component restore with context menu ([4b5e013](https://github.com/qri-io/desktop/commit/4b5e013))
* discord header button ([de8d608](https://github.com/qri-io/desktop/commit/de8d608))
* electron menus for MacOS ([77e2983](https://github.com/qri-io/desktop/commit/77e2983))
* implement body pagination ([530988b](https://github.com/qri-io/desktop/commit/530988b))
* implement tooltips in dataset component ([b93b39c](https://github.com/qri-io/desktop/commit/b93b39c))
* implement tooltips in dataset component ([16781fb](https://github.com/qri-io/desktop/commit/16781fb))
* link to filesystem (checkout) ([db3ae89](https://github.com/qri-io/desktop/commit/db3ae89))
* make component states more consistent ([1ce47bb](https://github.com/qri-io/desktop/commit/1ce47bb))
* make dataset list resizable ([6adb9a9](https://github.com/qri-io/desktop/commit/6adb9a9))
* refactor workingDataset and commitDetails state, remove unnecessary API calls ([e633c04](https://github.com/qri-io/desktop/commit/e633c04))
* update components on mtime diff ([2a6c0d6](https://github.com/qri-io/desktop/commit/2a6c0d6))
* **`/form/ButtonInput`:** button that should be used along side inputs ([c1f5d56](https://github.com/qri-io/desktop/commit/c1f5d56))
* **api:** add commit detail component and layout ([#25](https://github.com/qri-io/desktop/issues/25)) ([441cee0](https://github.com/qri-io/desktop/commit/441cee0))
* **api:** add state, reducers, actions, and api calls ([#23](https://github.com/qri-io/desktop/issues/23)) ([a64d213](https://github.com/qri-io/desktop/commit/a64d213))
* **api:** initial pass at API middleware ([eb9c0fe](https://github.com/qri-io/desktop/commit/eb9c0fe))
* **AppError:** show `AppError` component when the backend doesn't respond ([c23e602](https://github.com/qri-io/desktop/commit/c23e602))
* **backend:** Run backend qri at startup, if present in backend/ ([153f9b2](https://github.com/qri-io/desktop/commit/153f9b2))
* **Button:** add Button component ([7513b57](https://github.com/qri-io/desktop/commit/7513b57))
* **dataset-view:** add dataset-list component ([92766cc](https://github.com/qri-io/desktop/commit/92766cc))
* **dataset-view:** add logo to dataset view ([5eefdcb](https://github.com/qri-io/desktop/commit/5eefdcb))
* **dataset-view:** layout commit list items ([a610efd](https://github.com/qri-io/desktop/commit/a610efd))
* **dataset-view:** layout commit list items ([#10](https://github.com/qri-io/desktop/issues/10)) ([c5c6313](https://github.com/qri-io/desktop/commit/c5c6313))
* **DatasetSidebar:** `handleHistoryScroll` to see if we should load next page of history ([8030e91](https://github.com/qri-io/desktop/commit/8030e91))
* **Error, Header:** created Error, Buttons, and Header components to be used in the Modal ([e4c6405](https://github.com/qri-io/desktop/commit/e4c6405))
* **fetchWorkingDataset:** add action & reducer skeleton for fetching a working dataset ([9f55e15](https://github.com/qri-io/desktop/commit/9f55e15))
* **initDataset:** add `initDataset` api call and wire to app ([4748a8a](https://github.com/qri-io/desktop/commit/4748a8a))
* **json:** use react-json-view for great good ([842eda2](https://github.com/qri-io/desktop/commit/842eda2))
* **layout:** add dataset view with draggable sidebar, datasets picker, etc ([#9](https://github.com/qri-io/desktop/issues/9)) ([a25881c](https://github.com/qri-io/desktop/commit/a25881c))
* **NoDatasets:** page when user does not have any datasets ([dc18222](https://github.com/qri-io/desktop/commit/dc18222))
* **pagination:** add page "reducer" and adjust interfaces ([caa5c58](https://github.com/qri-io/desktop/commit/caa5c58))
* **publish:** initial support for dataset publication ([6399545](https://github.com/qri-io/desktop/commit/6399545))
* **save:** move dummy form to component ([993633f](https://github.com/qri-io/desktop/commit/993633f))
* **save:** set up POST api call ([f608981](https://github.com/qri-io/desktop/commit/f608981))
* **save:** stub out save UI ([f1d07e4](https://github.com/qri-io/desktop/commit/f1d07e4))
* **SelectInput:** add `SelectInput` component for form select! ([72af951](https://github.com/qri-io/desktop/commit/72af951))
* **SpinnerWithIcon:** add component and use in `Dataset` ([8f62a01](https://github.com/qri-io/desktop/commit/8f62a01))
* **toast:** remove unnecessary state ([7020e68](https://github.com/qri-io/desktop/commit/7020e68))
* style disabled components as subdued ([b9872e7](https://github.com/qri-io/desktop/commit/b9872e7))
* visually show add/remove status ([5c9c3b2](https://github.com/qri-io/desktop/commit/5c9c3b2))
* wip handle save with mutations reducer ([59522d4](https://github.com/qri-io/desktop/commit/59522d4))