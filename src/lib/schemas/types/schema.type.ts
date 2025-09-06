import { EnumType } from './enum.type';

export type ObjectSchemaType = {
  type: 'object';
  properties: Record<string, SchemaType>;
  required: string[];
};

export type ArraySchemaType = {
  type: 'array';
  items: SchemaType;
};

export type EnumSchemaType = { type: string; enum?: EnumType; title?: string };

export type SchemaRefType = { $ref: string };
export type SchemaPropertyType =
  | ObjectSchemaType
  | ArraySchemaType
  | EnumSchemaType;

export type SchemaType = SchemaRefType | SchemaPropertyType;
