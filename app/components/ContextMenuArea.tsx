/**
 * Context menus only make sense in context of the electron app right now
 * as all the actions that one can take are dependent on the dataset being
 * either in your namespace and/or should be actions that happen only if
 * you are working locally
 */
export { ContextMenuArea, MenuItems } from './platformSpecific/ContextMenuArea.TARGET_PLATFORM'
