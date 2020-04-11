import { RouteComponentProps } from "react-router"
import Store, { SelectedComponent } from "./store"
import { selectSelections } from "../selections"

// QriRef models a reference to a user, dataset, or part of a dataset within Qri
// We use "QriRef" instead of "Ref" to disambiguate with the react "ref"
// property.
//
// QriRef are structured expansions of a reference string, breaking elements of
// a reference into fields. For example the following reference string:
//
// foo/bar/at/ipfs/QmFme0d:body
//
// expands to the ref:
//   {
//     location: foo/bar/at/ipfs/QmFme0d:body
//     username: foo
//     name: bar
//     path: /ipfs/QmFme0d
//     selector: body
//   }
//
// refs can also be partially-applied. for example the reference string:
//
//   foo/bar
//
// expands to
//
//   {
//     location: foo/bar
//     username: foo
//     name: bar
//   }
//
// refs are often parsed from URL strings, reference strings take one of two
// general forms:
//
// 1. an alias reference string: [username]/[name]/at[path]:[selector]
// 2. an "identifier reference string: [identifier]/at[path]:[selector]
export interface QriRef {
  // string this ref parsed from
  location: string
  // human-readble name of the owner of this dataset
  username: string
  // user identifier
  profileId?: string
  // dataset name
  name: string
  // commit hash, eg: /ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y...
  path?: string
  // optional: a specific component the user is trying to index into component
  component?: string
  // address into dataset structure
  selector?: string
}

/** TODO (ramfox): in an upcoming refactor we are going to take out the
 * selections reducer and `setWorkingDataset` function in favor of pulling
 * all needed info from the router
 * to bridge this gap, I'm adding this hack that will shape the `location`
 * param to look like what we expect the route to look like
 * `workbench/:peername/:name` for the editor
 * or `workbench/:peername/:name:/at:path` for the history
 * also need to add in the selected component!
 * `workbench/:peername/:name/:component`
 * `workbench/:peername/:name/at/:path/:component`
 * */
export function hackQriRefFromRouteAndSelections (state: Store, p: RouteComponentProps<QriRef>): QriRef {
  const selections = selectSelections(state)
  const qriRef = qriRefFromRoute(p)
  const activeTab = selections.activeTab
  const ref = { ...qriRef }
  if (!qriRef.location) {
    return ref
  }
  if (!qriRef.username) {
    ref.username = selections.peername
    ref.location += '/' + selections.peername
  }
  if (!qriRef.name) {
    ref.name = selections.name
    ref.location += '/' + selections.name
  }
  // when we have the router set correctly, we won't rely on `activeTab` (also
  // because we are gearing up for a visual change where we no longer have
  // a 'status' or 'history' tab), instead, if we are given a specific path
  // we should assume we want to show the dataset at that path. Otherwise, we
  // should show the editor
  if (activeTab === 'history' && selections.commit && selections.commit !== '') {
    ref.path = selections.commit
    ref.location += '/at' + selections.commit
  }
  if (selections.component) {
    ref.location += '/' + selections.component
  }
  return ref
}

// qriRefFromRoute parses route props into a Ref
export function qriRefFromRoute (p: RouteComponentProps<QriRef>): QriRef {
  return {
    location: p.location.pathname,

    username: p.match.params.username,
    name: p.match.params.name,
    path: p.match.params.path ? '/ipfs/' + p.match.params.path : undefined,
    component: p.match.params.component,
    selector: p.match.params.selector
  }
}

// refStringFromQriRef takes a qriRef and turns it into a ref string
export function refStringFromQriRef (qriRef: QriRef): string {
  let route = `${qriRef.username}/${qriRef.name}`
  if (qriRef.path) route += `/at${qriRef.path}`
  return route
}

// selectedComponentFromQriRef takes a qriRef and gets the selected component
// from the location param
export function selectedComponentFromQriRef (qriRef: QriRef): SelectedComponent {
  if (qriRef.location.endsWith('/body')) {
    return 'body'
  }
  if (qriRef.location.endsWith('/transform')) {
    return 'transform'
  }
  if (qriRef.location.endsWith('/structure')) {
    return 'structure'
  }
  if (qriRef.location.endsWith('/readme')) {
    return 'readme'
  }
  if (qriRef.location.endsWith('/commit')) {
    return 'commit'
  }
  return 'meta'
}
