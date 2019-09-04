# gearing up for a release (or release candidate):
# run make update-changelog
# add notes to changelog
# update version numbers in: 
#    - package.json
#    - version.js
#    - app/package.json
#    - app/main.development.js
# commit should read: `chore(release): version X.X.X`

update-changelog:
	conventional-changelog -p angular -i CHANGELOG.md -s