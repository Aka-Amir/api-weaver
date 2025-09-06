import { SchemaRefType, SchemaType } from '../../schemas/types/schema.type';
import { HttpStatusResponse } from './status.type';

export type ParameterType =
  | {
      in: 'query';
      required: boolean;
      name: string;
      schema: SchemaType;
    }
  | {
      name: string;
      required: boolean;
      in: 'path';
      schema: { type: string };
    };

export type PayloadObjectType = {
  description?: string;
  content: Record<string, { schema: SchemaRefType }>;
};

export type ApiConfig = {
  operationId: string;
  parameters?: ParameterType[];
  requestBody?: PayloadObjectType;
  responses: Partial<Record<HttpStatusResponse, PayloadObjectType>>;
  tags: string[];
};
