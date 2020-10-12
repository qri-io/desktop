# [0.5.0](https://github.com/qri-io/desktop/compare/v0.4.5...v0.5.0) (2020-10-12)

Hello and welcome to the new and improved Qri Desktop 0.5.0! We've listened to your feedback and have a new and improved Collection view, a dynamic progress viewer, as well as some new functionality built into the app!

## Collection
The collection view can now do so much more than before! You can quickly filter between datasets that you own and datasets that you have cloned. You can view high level stats on each dataset, such as the last update, the size, the number of versions, and whether the dataset is published to the cloud or checkout out to the filesystem. You can also export or remove any dataset from the collection view by clicking the additional options at the end of the row.

## Pull (or Update/Sync) a dataset
We’ve made it very easy to sync a dataset that you have previously added from the Qri Cloud to the latest version! Just use our new `Pull` action on the Collection page to make sure you are always up to date with the latest data.

## Multi-Select/Batch Actions
We are very excited about the multi select functionality that we've added to the Collection view, and we will probably be expanding it down the line to do even more! From the collection view you can now quickly select multiple datasets and perform batch actions on them, such as removing them or pulling down the latest version from the cloud.

We hope this new batch ability and the remodeled collection page will make it easier and more enjoyable to browse your datasets in Qri!

## Transfers/Progress
We wanted to clean up the story around *transferring* datasets, aka, pushing a dataset to or pulling a dataset down from Qri Cloud. When you push or pull a dataset, Qri can track its progress and update you as it’s working. We've added some progress indicators to the navigation bar that you can expand to see the progress of your transfers! This will also track progress for multiple pushes and pulls so you are aware of all the actions the app is currently taking.

## Updated New Dataset Flow
In prior iterations, we’d try to name your dataset for you based on the file name you selected. But this left most datasets ‘title-less’, since we did nothing to encourage the user to add a title before publishing. And since it’s so important, we wanted to make it easier for you to lead the process. Now, when you add a new dataset, you specify a *title* and we infer the dataset name based on that!

## Dataset Page Layout
We've incorporated a lot of user feedback into our new Dataset page layout. When you open up a dataset, the sidebar now contains a 'History Track' - a visual indicator of all the versions of this dataset. Clicking a stop on the track will bring you to that version of the dataset. If you are looking at a dataset that you yourself created, then you will also see (as the most recent version) a 'working dataset' stop. This is where you can craft the **next** version of your dataset!

## Expanded Export options
Previously, we offered no flexibility when it came to exporting a dataset, you just chose a location and we added the exported zip file there. We've added an export modal that allows you to be more specific about what you want to export from that dataset version!

## Fixes
We made a large number of bug fixes based directly on your feedback (you can view them below under 'Bug Fixes'). Thank you! Please keep it coming :)


### Bug Fixes

* **body:** relax stipulations for fetching next page ([e7cafc7](https://github.com/qri-io/desktop/commit/e7cafc7))
* **Collection:** selected table state ([8a3a7f4](https://github.com/qri-io/desktop/commit/8a3a7f4))
* **commit:** add back tooltips & add button margins ([d5f2948](https://github.com/qri-io/desktop/commit/d5f2948))
* **commit:** Don't push cursor to end of text input elements ([84affa9](https://github.com/qri-io/desktop/commit/84affa9))
* **Dataset:** prompt about uncommited changes ([9aeb645](https://github.com/qri-io/desktop/commit/9aeb645))
* **dataset-menu:** ensure dataset menu shows when looking at a dataset ([433f3a7](https://github.com/qri-io/desktop/commit/433f3a7))
* **DatasetLayout:** bug that was overriding the qriRef ([548196c](https://github.com/qri-io/desktop/commit/548196c))
* **DatasetList:** ensure overlay menu can be seen for last item ([60766cb](https://github.com/qri-io/desktop/commit/60766cb)), closes [#654](https://github.com/qri-io/desktop/issues/654)
* **DatasetList:** wip fix of Collection selected table state ([8be1281](https://github.com/qri-io/desktop/commit/8be1281))
* external readme links ([f486197](https://github.com/qri-io/desktop/commit/f486197))
* remove fixed height on input descriptions ([5751660](https://github.com/qri-io/desktop/commit/5751660))
* **dataset:** add back publish & show files buttons ([5220f18](https://github.com/qri-io/desktop/commit/5220f18))
* **DynamicEditField:** sanitize paste content into editable div ([e8dc430](https://github.com/qri-io/desktop/commit/e8dc430))
* **formValidation:** add `-` as allowed character in a dataset name ([0a660fb](https://github.com/qri-io/desktop/commit/0a660fb))
* **mutations:** allow user to discard changes of a working dataset component ([cae9e64](https://github.com/qri-io/desktop/commit/cae9e64))
* **pull:** adjust flow after a dataset is pulled ([f188dc1](https://github.com/qri-io/desktop/commit/f188dc1))
* **Remove:** adjust to remove modal expectations ([12e94b6](https://github.com/qri-io/desktop/commit/12e94b6))
* numerous tweaks & tuning ([214bc4d](https://github.com/qri-io/desktop/commit/214bc4d))
* **datasetReducer, workingDatasetReducer:** include peername and name from request ([2b35d8b](https://github.com/qri-io/desktop/commit/2b35d8b))
* **NavTopbar:** use 'NavTopbar' as component name ([f94f2b4](https://github.com/qri-io/desktop/commit/f94f2b4))
* **PublishButton:** ensure tooltip loads ([deee663](https://github.com/qri-io/desktop/commit/deee663))
* **PublishButton:** fix "Copy Cloud Link" ([336e843](https://github.com/qri-io/desktop/commit/336e843))
* **sidebar:** network history sidebar overflows correctly ([bc20f4a](https://github.com/qri-io/desktop/commit/bc20f4a))
* **UncommitedChangesPrompt:** fix too-eager reset ([d2045b0](https://github.com/qri-io/desktop/commit/d2045b0))
* **VersionInfoItem:** if there is no commit time, display '--' ([a820934](https://github.com/qri-io/desktop/commit/a820934))
* **websocket:** use lower-case names on websocket UI ([49e8858](https://github.com/qri-io/desktop/commit/49e8858))
* **workbenchRoutes:** recent qriRefs adjusted correctly ([831bd11](https://github.com/qri-io/desktop/commit/831bd11))


### Features

* **`HeadLogListItem`:** add history track to sidebar ([375668b](https://github.com/qri-io/desktop/commit/375668b))
* **Bit:** initialize empty Bit workspace ([5e7caea](https://github.com/qri-io/desktop/commit/5e7caea))
* **bulkActionExecuting:** add param to state tree if a bulk action is executing ([bb36b49](https://github.com/qri-io/desktop/commit/bb36b49))
* **collection:** add tooltips, list-picker counts ([fb81d4f](https://github.com/qri-io/desktop/commit/fb81d4f))
* **collection:** overhaul collection view, support multi-select ([b040af3](https://github.com/qri-io/desktop/commit/b040af3))
* **collection:** style collection home view ([6dd77eb](https://github.com/qri-io/desktop/commit/6dd77eb))
* **Collection:** add bulk dataset remove action ([0db21a4](https://github.com/qri-io/desktop/commit/0db21a4))
* **Collection:** add bulk remove for datasets except single dataset ([aaa153e](https://github.com/qri-io/desktop/commit/aaa153e))
* **collection home:** support bulk pulling ([2722ecc](https://github.com/qri-io/desktop/commit/2722ecc))
* **Collection Home:** add export collection row option ([dd66399](https://github.com/qri-io/desktop/commit/dd66399))
* **CollectionHome:** add "pull" to row hamburger menu ([1d7ac10](https://github.com/qri-io/desktop/commit/1d7ac10))
* **DatasetLayout:** add a Rename and Remove button to the dataset layout ([18042aa](https://github.com/qri-io/desktop/commit/18042aa))
* **export:** wire up export modal with csv & zip options ([879dd69](https://github.com/qri-io/desktop/commit/879dd69))
* **NewDataset:** attach body file to new dataset ([8cea4d2](https://github.com/qri-io/desktop/commit/8cea4d2))
* **RenameDataset:** add modal to rename dataset ([ec7aa3c](https://github.com/qri-io/desktop/commit/ec7aa3c))
* **Transfers:** persist transfers after completion ([ddf79cc](https://github.com/qri-io/desktop/commit/ddf79cc))
* add hamburger menu to collection rows ([f449189](https://github.com/qri-io/desktop/commit/f449189))
* export modal and css improvements ([5e96ecd](https://github.com/qri-io/desktop/commit/5e96ecd))
* improve commit tooltips ([49daa7d](https://github.com/qri-io/desktop/commit/49daa7d))
* new dataset modal ([8decc8f](https://github.com/qri-io/desktop/commit/8decc8f))
* responsive collection table ([fe8f9cf](https://github.com/qri-io/desktop/commit/fe8f9cf))
* **Remove dataset:** add warning for when a user removes their own dataset ([0232823](https://github.com/qri-io/desktop/commit/0232823))
* **transfers:** add transfers indicator ([c4a875b](https://github.com/qri-io/desktop/commit/c4a875b))
* **transfers:** track transfer events ([5e6b745](https://github.com/qri-io/desktop/commit/5e6b745))
* **TristateCheckboxInput:** add checkbox that supports true/false/other ([22b7a13](https://github.com/qri-io/desktop/commit/22b7a13))



## [0.4.5](https://github.com/qri-io/desktop/compare/v0.4.4...v0.4.5) (2020-09-11)

This is another quick release to match the latest qri backend! Two small adjustsments: 

1) a small API refactor to match the new qri backend
2) a fix to a bug that was preventing clicking on the `status` tab, if your dataset history was longer than the lenght of the sidebar

### Bug Fixes

* long dataset history overlaps status button ([af8af55](https://github.com/qri-io/desktop/commit/af8af55))



## [0.4.4](https://github.com/qri-io/desktop/compare/v0.4.3...v0.4.4) (2020-08-10)

Quick release to upgrade to the latest qri backend! Fixed a bug some users were experiencing when downloading Qri Desktop for the first time.

Be sure to check out the latest [qri backend release](https://github.com/qri-io/qri/releases/tag/v0.9.11) to see the other fixes we inherit.

## [0.4.3](https://github.com/qri-io/desktop/compare/v0.4.2...v0.4.3) (2020-07-28)

Our latest release for desktop has improved stability, added support for backend migrations, upgraded api calls to match the latest qri backend release, and reduced the codebase without losing functionality!

### refactor to match the new 0.9.10 qri api
Changes made to match the latest qri api:
- use `/get?format=zip` instead of  `/export`
- use `/pull` instead of `/add`
- use `/push` instead of `/publish`
- use `/remove?remote=registry` to unpublish a dataset
- rely on log data to determine if the dataset is published, not on the dataset itself

### dev/codebase improvements:
We've got storybook back up and running! This involved refactoring certain components to ensure that they can still function as expected inside and outside of the electron framework (so they can be potentially be used in other webapps).

We've solidified terminology in the codebase: anything prefixed with `Working` indicates that has to do with editing a dataset. We've also removed the `History` prefix from components dealing with historical dataset versions.

We've gone through an entire component/container overhaul:
  * We've removed every container file. 
  * All connecting of components to react redux and the router happens in the same file that the component is defined. 
  * The "component" version of this file is exported and has the suffix "Component". 
  * The "containerized" version of this component is the default export.
  * The custom connect functions are `connectComponentToProps` and `connectComponentToPropsWithRouter`. 
  * They take the same parameters and have the same expectations as the redux `connect` function.

### readme markdown
Make sure you take a look at the improved styling in our readme markdown editor!

### New backend launch process

We've got a revamped backend launch process that coordinates version verifications, migrations, and communication to the user.

We check and inform the user if the backend version they are using in incompatible. We check and inform the user if the backend needs an update. We initiate the update and inform the user if there were any migration errors. And if everything goes well, we launch the backend!

New Components:
- IncompatibleBackend
- MigratingBackend
- MigrationFailed

Be sure to check out the latest [qri backend release](https://github.com/qri-io/qri/releases/tag/v0.9.10) to see the other fixes we inherit.

### Bug Fixes

* **Storybook:** get all Storybook stories to render ([47621a3](https://github.com/qri-io/desktop/commit/47621a3))
* **Storybook:** re-enable Storybook to build ([a177512](https://github.com/qri-io/desktop/commit/a177512))
* set correct link to github org on welcome screen ([ba13ef7](https://github.com/qri-io/desktop/commit/ba13ef7))


### Features

* **migration:** adjust `BackendProcess`, `main.dev.js` & `App.ts` so we can coordinate migrations! ([#571](https://github.com/qri-io/desktop/issues/571)) ([41cf068](https://github.com/qri-io/desktop/commit/41cf068))
* **migration components:** add migration components to conditionally render on app-launch ([866a9e4](https://github.com/qri-io/desktop/commit/866a9e4))
* **readme:** improve markdown css ([2956882](https://github.com/qri-io/desktop/commit/2956882))



## [0.4.2](https://github.com/qri-io/desktop/compare/v0.4.1...v0.4.2) (2020-04-20)

The Qri Desktop 0.4.2 patch fixes a major export bug! It also fixes two minor bugs surrounding fetching datasets for display in the Workbench.

Be sure to check out the latest [qri backend release](https://github.com/qri-io/qri/releases/tag/v0.9.8) to see the other fixes we inherit.

### Bug Fixes

* **workbench:** adjust action to fall through and load history dataset if path is provided ([a16367b](https://github.com/qri-io/desktop/commit/a16367b))
* **workbench:** if we are given a path, fall through and allow the commit to be fetched ([73277ec](https://github.com/qri-io/desktop/commit/73277ec))



## [0.4.1](https://github.com/qri-io/desktop/compare/v0.4.0...v0.4.1) (2020-04-07)

This release is all about minor bug fixes, clean up, stabilization, and updating the desktop app to work with the latest qri release!

Be sure to check out the latest [qri backend release](https://github.com/qri-io/qri/releases/tag/v0.9.7) to see the lovely fixes we inherit.

## Export
In a combined effort from the backend and desktop, we've fixed the export bug! Right-clicking the version you want to export, and clicking 'export this version', opens the save dialog, prefilled with a default zipname.

## API changes
This desktop update adjusts our requests to meet the expectations of the latest qri backend's API

## Reloading
Because of those wonderful backend api changes, we were able to fix a long-standing bug where re-loading on the `workbench` page broke the app. Now you can reload to your heart's content

## Websockets
Combining websockets and the backend status request changes, we are able to more intelligently re-fetch fsi linked datasets as you make changes to them using a text editor and the qri desktop app.

## Editing
Cleaned up a whole lotta bugs surrounding ui flickering in meta and structure editing. Also, all meta and structure fields are now tested in our visual end to end tests.

### Bug Fixes

* **export:** send correct path for export ([726e0eb](https://github.com/qri-io/desktop/commit/726e0eb))
* **fetchWorkingDatasetDetails:** don't fetch status unless dataset is linked ([04625de](https://github.com/qri-io/desktop/commit/04625de))
* **mappingFunc:** account for different expected history response behavior ([32f757a](https://github.com/qri-io/desktop/commit/32f757a))
* **MultiStructuredInput:** fix bug that caused component flickering ([5e52a7f](https://github.com/qri-io/desktop/commit/5e52a7f))
* **selectStatusFromMutations:** corrently pull or create a status ([028f40b](https://github.com/qri-io/desktop/commit/028f40b))
* **websockets:** use websocket responses more intelligently ([2e6aad2](https://github.com/qri-io/desktop/commit/2e6aad2))
* **workbench:** when fsi true, don't prompt the user about unsaved changes ([ba958b2](https://github.com/qri-io/desktop/commit/ba958b2))


### Features

* **selections:** adding workbench selections and actions ([d32d201](https://github.com/qri-io/desktop/commit/d32d201))



# [0.4.0](https://github.com/qri-io/desktop/compare/v0.3.5...v0.4.0) (2020-03-05)

Release notes 0.4.0

Welcome to the Qri Desktop App version 0.4.0!

This version is one of our biggest to date. We've got a whole slew of new features for you to explore & a number of bugs have been squashed. With this release you can now browse, search, and clone datasets, all within the app. We’ve brought dataset editing in-app, and we’re premiering our first visual diffing tool with the compare section.


## Network Explorer

The first big feature we’re showing off is our new Network page. Browse the Qri network in app! Preview featured and recently published datasets without having to download the full dataset. Find a dataset you want to view in its entirety? **Clone** the dataset! That will download it from the network to your computer.

This also means that when you publish, other users will be able to see your work directly in-app. More people will see your work!

## Dataset Search

And what browsing experience would be complete without **search**? We put a navigation bar at the top of the app so you can search the Qri network or your own local Qri repo for datasets, no matter where you are in the app.

There is also a back and forward button in the nav bar so you can walk back through your browsing history.

## In-App Editing

You can now edit your dataset in app without having to checkout your files to the file system! This streamlines and simplifies iteration for those who don't need the feature of linking your dataset to a folder on your computer.

You can edit the Readme, Meta, and Structure component in the Status tab of the Workbench. To make changes to the Body, edit the file using an appropriate app (text editors, Numbers, Excel, etc.), save (as .csv), and **drag and drop** the new version of the body file onto the Body component. When you make your commit, your new version will contain that updated body!

## Diff CSV’s with the Compare View

The next phase of features for Qri involve heavy use of structured data diffing, and we’re starting with an experiment. Use the compare view to generate a diff of any two csv files. This feature is very much a work-in-progress. If you have any feedback while you use the compare view, please let us know by filing an issue!

In the future we plan to expand to other file formats, dataset comparison, and up the size limit. We plan to make diff display one of the central things Qri does, and once we’re sure we have a stable, accurate compare view, we’ll start adding it more and more places throughout the app.


### Bug Fixes

* **App:** properly remove listeners on app unmount ([c7a1fbe](https://github.com/qri-io/desktop/commit/c7a1fbe))
* **body:** minor ui bugs ([3568826](https://github.com/qri-io/desktop/commit/3568826))
* **Body:** fix param names in `BodyJson` call ([e26f744](https://github.com/qri-io/desktop/commit/e26f744))
* **compare:** reject dataset larger then 10MB, add 'reset' button ([f54c34c](https://github.com/qri-io/desktop/commit/f54c34c))
* **DatasetItem:** themeList not correctly converted to array ([751cfee](https://github.com/qri-io/desktop/commit/751cfee)), closes [#462](https://github.com/qri-io/desktop/issues/462)
* **HistoryListItem:** add `allowDisable` flag to finetune interactions ([8723251](https://github.com/qri-io/desktop/commit/8723251))
* **HistoryListItem, e2e tests:** fix logic bug in HistoryListItem ([80a109f](https://github.com/qri-io/desktop/commit/80a109f))
* **Icon, MetadataEditor:** add commit icon, fix meta tooltips ([9b07102](https://github.com/qri-io/desktop/commit/9b07102))
* **json:** use `BodyJson` component in `BodySegment` ([4bb9a09](https://github.com/qri-io/desktop/commit/4bb9a09))
* **Navbar:** indicates which page you are on when you click it ([ca10b6a](https://github.com/qri-io/desktop/commit/ca10b6a))
* **network:** previews of datasets with JSON bodies now load ([57e7862](https://github.com/qri-io/desktop/commit/57e7862))
* **Network:** do not show 'clone' button when dataset is in user's collection ([f13ff3b](https://github.com/qri-io/desktop/commit/f13ff3b))
* **Preview:** show `PreviewNotFound` when we don't have access to the version ([ce42883](https://github.com/qri-io/desktop/commit/ce42883))
* **save:** fix `saveWorkingDatasetAndFetch` to properly throw error ([1a1981f](https://github.com/qri-io/desktop/commit/1a1981f))
* **Schema:** bug where i deleted `schemaItem.row` too soon ([d7f5dce](https://github.com/qri-io/desktop/commit/d7f5dce))
* **Schema, Button, NetworkSidebar:** various styling/minor fixes ([84f1423](https://github.com/qri-io/desktop/commit/84f1423))
* **StatsChart:** fix scrolling bug ([d695d91](https://github.com/qri-io/desktop/commit/d695d91))
* **workbench:** don't mutate state tree ([aee3a50](https://github.com/qri-io/desktop/commit/aee3a50))
* **workbench:** history transform views need to work as well ([02fe214](https://github.com/qri-io/desktop/commit/02fe214))
* **workbench:** viewing trasnform component shouldn't crash ([804d7e1](https://github.com/qri-io/desktop/commit/804d7e1))
* **Workbench:** discard `bodyPath` correctly ([44c3e5d](https://github.com/qri-io/desktop/commit/44c3e5d))
* **Workbench:** if a dataset is not in your namespace, you can't edit it ([6a7193c](https://github.com/qri-io/desktop/commit/6a7193c))
* **workbench history:** prevent page overflow in history view ([33ece81](https://github.com/qri-io/desktop/commit/33ece81))


### Features

* **clone:** add clone dataset option to `Network` ([be10959](https://github.com/qri-io/desktop/commit/be10959))
* **compare:** compare two csv files with compare section ([510b822](https://github.com/qri-io/desktop/commit/510b822))
* **compare:** style & wire up compare section ([08675b7](https://github.com/qri-io/desktop/commit/08675b7))
* **dmg:** add dmg volumn icon ([48fa111](https://github.com/qri-io/desktop/commit/48fa111))
* **ErrorHandler:** handle react errors, crash reports ([22480ea](https://github.com/qri-io/desktop/commit/22480ea))
* **history:** add network route with path ([9a0bcfa](https://github.com/qri-io/desktop/commit/9a0bcfa))
* **history:** show hash in CommitDetailsHeader ([5fe7760](https://github.com/qri-io/desktop/commit/5fe7760))
* **logs:** fetch logs on history preview, fix search ([f899a8c](https://github.com/qri-io/desktop/commit/f899a8c))
* **network:** add network home feed page with ephemeral fetching ([8e93ae1](https://github.com/qri-io/desktop/commit/8e93ae1))
* **QriRef:** define QriRef, use it in NetworkContainer, Network ([5312921](https://github.com/qri-io/desktop/commit/5312921))
* **search:** add search modal and search to navbar ([d6ba5da](https://github.com/qri-io/desktop/commit/d6ba5da))
* **websockets:** remove polling and add middleware for websockets ([41c0682](https://github.com/qri-io/desktop/commit/41c0682))
* **workbench:** drag-and-drop body updates ([5de9843](https://github.com/qri-io/desktop/commit/5de9843))
* **Workbench:** edit in the app without checking out ([ee3de61](https://github.com/qri-io/desktop/commit/ee3de61))



## [0.3.5](https://github.com/qri-io/desktop/compare/v0.3.4...v0.3.5) (2020-02-03)

Patch release to upgrade electron & electron-builder, re-enabling auto update on the app.

## [0.3.4](https://github.com/qri-io/desktop/compare/v0.3.3...v0.3.4) (2020-02-03)

This patch release fixes two visual bugs (packaged fonts and adjustments to the menus), restores the 'unpublish' option to the dataset page, and adds a number of reusable components that we will begin to surface as we release new features.

### Bug Fixes

* **Dataset:** add `Hamburger` to dataset actions ([c4d0c6a](https://github.com/qri-io/desktop/commit/c4d0c6a))
* **fonts:** add Rubik font to font-face in scss ([e628d57](https://github.com/qri-io/desktop/commit/e628d57))


### Features

* **Dataset Item Compoent:** add basic item component for datasets ([6fb5240](https://github.com/qri-io/desktop/commit/6fb5240))
* **Hamburger, Action Button, Titlebar:** add to stories ([ae58313](https://github.com/qri-io/desktop/commit/ae58313))
* **modal/Search:** work on search modal component ([7917f7c](https://github.com/qri-io/desktop/commit/7917f7c))
* **navbar:** initial 0.4.0 page navabar and supporting components ([5bcfdb3](https://github.com/qri-io/desktop/commit/5bcfdb3))
* **Network:** add network section behind __BUILD__ flag ([16dace1](https://github.com/qri-io/desktop/commit/16dace1))
* **NetworkHome:** added initial NetworkHome component ([1996e3f](https://github.com/qri-io/desktop/commit/1996e3f))
* **Overview:** component that gives basic meta and structure info at top of preview page ([26fde61](https://github.com/qri-io/desktop/commit/26fde61))
* **switch:** add light/dark, small/large versions of Switch ([36e7140](https://github.com/qri-io/desktop/commit/36e7140))
* **Tag:** tag component, `category`/`keyword` options ([d61efab](https://github.com/qri-io/desktop/commit/d61efab))
* **TitleBar:** ActionButton, ActionButtonBar, used to make responsive title bar ([4ac5f51](https://github.com/qri-io/desktop/commit/4ac5f51))



## [0.3.3](https://github.com/qri-io/desktop/compare/v0.3.2...v0.3.3) (2020-01-24)

Quick patch release to address some bugs when viewing the body!

### Bug Fixes

* **body:** refine props to Body components, fix fetching status ([#405](https://github.com/qri-io/desktop/issues/405)) ([c07797b](https://github.com/qri-io/desktop/commit/c07797b))


## [0.3.2](https://github.com/qri-io/desktop/compare/v0.3.1...v0.3.2) (2020-01-22)

This release brings a two new features and some fixes that address bugs that occured while navigating through the app.

## Schema Editor
You can now edit a schema straight from the app! You can change the title, type, and description of your columns by using our new Schema Editor. Validation is also included in this Schema Editor, but future refinements will be made to get it to be more functional.

## Bug logging
If you are having a problem with the app and you want to file an issue, you can now get a copy of your app's debug log by navigating to `help` -> `Export debug log`. This will give the developers more insight into what may have gone wrong.

## Routing and Fetching
There were a whole slew of bugs that arose when we switched the way we route the app. This release fixes those bugs and brings back a smooth user experience. Also, additional tests have been added so that we will catch any routing bugs quicker during future changes


### Bug Fixes

* hashHistory & add/adjust id's for e2e tests ([f568db6](https://github.com/qri-io/desktop/commit/f568db6))
* **commit, MetadataEditor:** fix meta editing and the flow after you commit ([#394](https://github.com/qri-io/desktop/issues/394)) ([120192b](https://github.com/qri-io/desktop/commit/120192b))
* **log export:** replace showSaveDialog with showSaveDialogSync ([a6414e3](https://github.com/qri-io/desktop/commit/a6414e3))


### Features

* **icon:** `Icon` component ([67fba53](https://github.com/qri-io/desktop/commit/67fba53))
* **LineDiff:** initial line diff component & storybook story ([8d4825c](https://github.com/qri-io/desktop/commit/8d4825c))
* **log:** Set the --log-all flag when starting our own backend ([#401](https://github.com/qri-io/desktop/issues/401)) ([9c53a43](https://github.com/qri-io/desktop/commit/9c53a43))
* **logging:** Log to a file, menu item to export it ([a436b81](https://github.com/qri-io/desktop/commit/a436b81))
* **main process logging:** add logging for main process ([71a7c2e](https://github.com/qri-io/desktop/commit/71a7c2e))
* **Schema:** create a schema editor ([#392](https://github.com/qri-io/desktop/issues/392)) ([4d9b4f1](https://github.com/qri-io/desktop/commit/4d9b4f1))
* **tableDiff:** initial tableDiff component and story ([5f21579](https://github.com/qri-io/desktop/commit/5f21579))
* **TypePicker:** create TypePicker and other needed components ([#390](https://github.com/qri-io/desktop/issues/390)) ([a9b1c61](https://github.com/qri-io/desktop/commit/a9b1c61))



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