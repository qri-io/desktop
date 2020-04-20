import { StatusInfo } from "../models/store"

export default function hasParseError (statusInfo: StatusInfo): boolean {
  return statusInfo.status === 'parse error'
}
