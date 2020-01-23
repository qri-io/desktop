
## Release process:
This will only work if you are internal to Qri and have the correct keys

1) change the frontend and backend version numbers in:
  `/package.json`
  `/app/package.json`
  `version.js`
2) run `make update-changelog` to update the changelog
3) write release notes
4) build the correct version of the qri backend binary
5) ensure it is executable (chmod +x qri)
6) move the executable binary to the `/backend` directory
7) run `yarn dist`
8) ensure the Qri Desktop app running correctly and has all the correct version numbers
9) submit a pr, once approved merge
10) run `yarn dist --publish always` to create a release
11) Because notarizing the mac.zip file is broken in electron-builder right now (as per https://snippets.cacher.io/snippet/354a3eb7b0dcbe711383  & https://github.com/electron-userland/electron-builder/issues/4299):
  - compress the app file that exists in `/release/mac`
  - rename it to match the current mac.zip file in the `/release` directory
  - replace the old zip file with the new one
  - run `./node_modules/app-builder-bin/mac/app-builder blockmap -i release/FILENAME.zip -o release/throwaway.zip`
    - app-builder is modifying the contents of the zip, which is messing up the notarization. The -o flag indicates an output file that app-builder can futz with without ruining the integrity of the original app
  - take the updated file info from size, sha512 and blockMapSize
  - update the `/release/latest-mac.yml` with that info
  - replace `FILENAME.zip` to the release page
12) change link on website to downloads:
  - in website/src/pages/download.js, line 10
    `const latestVersion = 'VERSION'`
  - create pr, get approval, and merge