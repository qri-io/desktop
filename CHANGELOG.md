<a name="v0.1.0-rc1"></a>
# v0.1.0-rc1 (2019-09-4)

Welcome to the Qri Desktop release candidate! Qri Desktop is an app for creating and managing datasets and versions. It gives a UI to our qri commandline tool. This is a release candidate, so all features have not been perfected yet. Qri Desktop will make it easy for you to create and version datasets, look back through the history of your datasets to see what has changed, and to double check your changes before you commit them! You can also publish your datasets and add colleagues datasets' that have already been published. 

Qri is an amalgamation of three hefty areas: a version control system, a network to other data users, and a database for your local data. In order to make working with Qri and it's local database easier, we have implimented a way to integrate your normal filesystem to our database. You can have your working directories where you keep your current workspace and data, but still be able to commit/save to your qri database at important times during your workflow. Using Qri, you can load your data from those specific points if you have made a mistake, or you just want to view the data at a different point in time. **The Qri Desktop app gives you the ability to visualize all those different versions and your different datasets from one application.**

Even though this is a release candidate, Qri Desktop is extremely functional and can be used right away to begin versioning and publishing your data! The main feature we are missing (which is why we are considering this a candidate and not an official release as of yet) is the ability to delete dataset versions from inside the Qri Desktop app. This functionality exists in the command line client, which comes bundled with Qri Desktop. [Check out the Qri CLI reference here if you run into this problem.](https://qri.io/docs/reference/cli_commands/#qri_remove)

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
* make dataset list resizable ([6adb9a9](https://github.com/qri-io/desktop/commit/6adb9a9))
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
* **json:** use react-json-view for great good ([842eda2](https://github.com/qri-io/desktop/commit/842eda2))
* **layout:** add dataset view with draggable sidebar, datasets picker, etc ([#9](https://github.com/qri-io/desktop/issues/9)) ([a25881c](https://github.com/qri-io/desktop/commit/a25881c))
* **pagination:** add page "reducer" and adjust interfaces ([caa5c58](https://github.com/qri-io/desktop/commit/caa5c58))
* **publish:** initial support for dataset publication ([6399545](https://github.com/qri-io/desktop/commit/6399545))
* **save:** stub out save UI ([f1d07e4](https://github.com/qri-io/desktop/commit/f1d07e4))
* **SpinnerWithIcon:** add component and use in `Dataset` ([8f62a01](https://github.com/qri-io/desktop/commit/8f62a01))
* make component states more consistent ([1ce47bb](https://github.com/qri-io/desktop/commit/1ce47bb))
* refactor workingDataset and commitDetails state, remove unnecessary API calls ([e633c04](https://github.com/qri-io/desktop/commit/e633c04))
* **initDataset:** add `initDataset` api call and wire to app ([4748a8a](https://github.com/qri-io/desktop/commit/4748a8a))
* **NoDatasets:** page when user does not have any datasets ([dc18222](https://github.com/qri-io/desktop/commit/dc18222))
* **save:** move dummy form to component ([993633f](https://github.com/qri-io/desktop/commit/993633f))
* **save:** set up POST api call ([f608981](https://github.com/qri-io/desktop/commit/f608981))
* **SelectInput:** add `SelectInput` component for form select! ([72af951](https://github.com/qri-io/desktop/commit/72af951))
* **toast:** remove unnecessary state ([7020e68](https://github.com/qri-io/desktop/commit/7020e68))
* style disabled components as subdued ([b9872e7](https://github.com/qri-io/desktop/commit/b9872e7))
* visually show add/remove status ([5c9c3b2](https://github.com/qri-io/desktop/commit/5c9c3b2))
* wip handle save with mutations reducer ([59522d4](https://github.com/qri-io/desktop/commit/59522d4))



