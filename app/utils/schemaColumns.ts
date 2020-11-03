import { JSONSchema7 } from "json-schema"
import { Schema, ColumnProperties } from "../models/dataset"

export function schemaColumns (schema: Schema): ColumnProperties[] {
  if (schema && schema.items && isJSONSchema7(schema.items) && schema.items.items && Array.isArray(schema.items.items)) {
    return schema.items.items as ColumnProperties[]
  }
  return []
}

function isJSONSchema7 (x: any): x is JSONSchema7 {
  return (x as JSONSchema7).type !== undefined
}
