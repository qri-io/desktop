// This file is needed for webpack to build ExternalLink for in-browser rendering without loading
// the electron dependency. When ExternalLink is rendered on Web, this function is a noop
// and the href is preferred.
export const onClick = () => undefined
