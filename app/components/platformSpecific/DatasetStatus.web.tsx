// This file is needed for webpack to build DatasetStatus for in-browser rendering without loading
// the electron dependency, but in practice we do not expect the "open in finder" icon to ever be
// used on Web so this function should never be called.
export const onClickOpenInFinder = () => {}
