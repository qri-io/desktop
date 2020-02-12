import { RouteComponentProps } from "react-router"

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
  username?: string
  // user identifier
  profileId?: string
  // dataset name
  name?: string
  // commit hash, eg: /ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y...
  path?: string
  // address into dataset structure
  selector?: string
}

// qriRefFromRoute parses route props into a Ref
export function qriRefFromRoute (p: RouteComponentProps<QriRef>): QriRef {
  return {
    location: p.location.pathname,

    username: p.match.params.username,
    name: p.match.params.name,
    path: p.match.params.path ? '/ipfs/' + p.match.params.path : undefined,
    selector: p.match.params.selector
  }
}

// refStringFromQriRef takes a qriRef and turns it into a ref string
export function refStringFromQriRef (qriRef: QriRef): string {
  let route = `${qriRef.username}/${qriRef.name}`
  if (qriRef.path) route += `/at${qriRef.path}`
  return route
}
