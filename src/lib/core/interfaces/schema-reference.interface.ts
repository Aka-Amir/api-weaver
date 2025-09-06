import { ObjectSchemaType } from '../../schemas/types/schema.type';

export interface ISchemaReference {
  getReference(ref: string): ObjectSchemaType;
}
