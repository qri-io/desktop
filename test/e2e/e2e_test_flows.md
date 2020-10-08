# e2e test flows

This is a basic rundown of what we expect for the e2e flows as the newer 
features come in.

Some thoughts on the e2e tests:
They have been super helpful in catching bugs & making sure we don't regress in
functionality. However, they are EXTREMELY stateful. Any change you make to a
previous test may effect a test later. Something as simple as removing a button
or changing an id tag, if the id is relied on to find the element, can have
adverse effects on the tests.

The goal for this basic rundown is to give you a quick idea of what might get
effected if you make a change to an e2e test. It would also be great if we could
keep track of relied on ids and expectations here, until we figure out a better
method.

It would also be a good idea to checkout the `/test/utils/e2eTestUtils.ts`
functions. The comments should give you an idea of what its expected that they
do & how to use them. Two things to note. First, each test util function has an 
optional `screenshotLocation` string. If this variable is not undefined AND the 
test errored, a screenshot of the app will be saved to the temp directory. This 
is mostly used to understand what is going wrong in circle ci, as you can watch 
the test from your personal computer, but can't watch it in circle ci. Second,
the `delayTime` variable at the start of the file adjusts the amount of time we
delay when the app is NOT in headless mode. This allows the app to render each 
view & gives us as humans a moment to understand what's going on. You can adjust
this if you feel it is too fast or slow.

At the top of the e2e.spec.ts file, there are two globals I want to point out.
The first is `takeScreenshots`. When true, there are different moments in the 
app where the app will take a screenshot of the current page. This can be used 
to see what's going on (but also was primarily used to generate screenshots of 
the desktop app for use on our qri.io/docs site).

The second is `printConsoleLogs`. When true, any console logs that occur during 
the main or renderer processes will get printed. console logs from the test will
get printed regardless.

## onboarding
The following flows deal with launching the app for the first time, signing out and signing in
### open window
- open the window
- prove the window has loaded:
  - expect the title to be 'Qri Desktop'

### accept the terms of service
- wait for the #welcome-page to load
- click #accept
- make sure we have been send to `#/onboard/signup`

### create a new account
- wait for the #signup-page to load
- set values for the #username, #email, and #password
- click #accept
- make sure we have redirected to the `#/collection` page

### signin and signout
- click the #nav-options button to open the options dropdown
- click the #signout button to signout
- make sure we are sent to the #/onboard/signup page
- navigate to the #signin page
- set values for the #username and #password
- click #accept
- make sure you are sent to the #/collection page

## creating and modifying an FSI dataset
### create a new csv
- make sure you are on the #/collection page
- click the #new-dataset button
- create a temp csv file & mock the save dialog when you click #chooseBodyFile
- click #submit
- make sure we get redirected to the new dataset page
- ensure we are at the correct version (the latest)
- ensure the body, meta and structure were 'added'

### navigate to the collection and back to the dataset
- click the #collection button
- ensure we are at the #collection
- click on the dataset reference (#row-username-name)
- ensure we are at the correct location
- ensure we are the same version

### checkut a dataset
- ensure we are at the correct dataset
- click #checkout
- mock the dialog
- click #chooseCheckoutLocation
- click #submit
- wait for the modal to go away
- check that there is no more #checkout button

### write the body to the filesystem and commit
- navigate to the working version
- check that we are not .clear-to-commit
- adjust the checkedout body file
- check that the status of 'body' is 'modified'
- commit

### fsi editing - create meta & commit
- ensure you are on the correct dataset
- edit meta and commit

### edit structure & commit
- ensure you are on the right dataset
- edit structure and commit

### rename a dataset
- ensure you are on the correct dataset
- click the dataset name
- set an incorrect value as the name
- ensure we get the invalid indication
- set a good name
- click away to submit

### export a CSV version
- click the header export dataset button: #export-button
- mock the electron save dialog to send to `TEST_TMP_DIR/body.csv`
- click #submit
- check that a file at `TEST_TMP_DIR/body.csv` exists

### switch between commits
- ensure you are at the correct dataset
- click on each commit #HEAD-3 #HEAD-2 #HEAD-1 #HEAD-0
- after each, ensure the title is as expected

## non-checked out datasets
The following flows are essentially the same as the above, but with a non-checked out dataset. Currently the only way for us to test updating a body in the app is via drag-and-drop. Since we don't currently have a method for mocking drag and drop in spectron, we skip the part where we modify the body and go straight to modifying the meta
### create a dataset (same as above)
### edit meta and commit (same as above)
### edit structure and commit (same as above)
### switch between commits (same as above, with one less commit)

## json datasets
# ensure we can create a json dataset

## network
This section deals with the network page
### clicking on the network tab brings you to the network home
- click on the network tab
- ensure it has one dataset

### search for a foreign dataset
- click on the search bar
- hit "enter"
- wait for the search modal to appear
- search for the dataset name (you can't search for the username and the dataset name because the username is randomly generated for each run of the test)
- hit "enter"
- ensure the resulting dataset item is the correct dataset
- click it
- since we don't have the username, we have to get weird with how we determine if we are on the correct dataset: ensure we are at the #/network location, and check that the #navbar-breadcrumb contains the registry dataset name

### clone a foreign dataset
- click the clone button
- we should be sent to the dataset page of that dataset
- navigate to the collection page and ensure that dataset is part of the collection

### add another commit & see new commits in network
- ping the registry to create another commit
- navigate to the network tab
- click on the dataset
- see the new commit
- see no 'clone' button

## collection page
### tabs
- check that the MyDatasets tab has 3 datasets
- check that the AllDatasets tab has 4 datasets
- check that dataset 'earthquakes' shows that it is checked out
- check that dataset 'all_week' shows that it is NOT checked out

### filter on the collection page
- navigate to the collection page
- set value to the filter 'earthquakes'
- only 1 dataset should exist on the page

### publish a dataset
- click on the earthquakes dataset
- click on the publish button
- page should show 'show on cloud'
- navigate to the collections page
- it should show as 'published'
- navigate to to the network page
- it should exist on the network page
- navigate to the dataset
- unpublish
- navigate to the collection page
- it should show as unpublished
- navigate to the network page
- it should not show up

### bulk remove actions
#### remove multiple datasets
- create two new datasets for user
- click checkbox for each dataset
- click 'remove' bulk action button
- remove modal should appear
- click 'remove' button on modal
- check that both datasets have been removed

#### remove one dataset
- create one new dataset for user
- click checkbox for the dataset
- click 'remove' bulk action button
- remove modal should appear
- click 'remove' button on modal
- check that dataset has been removed
## remove a dataset
- go to the collection view
- click on a dataset
- click on the #remove button
- wait for the modal to load
- click #submit to remove the dataset
- wait fot the modal to disappear
- expect to be at the collection page
- expect the removed dataset to not be there
