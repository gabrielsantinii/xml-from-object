import { FromObjectHeader } from "./from-object-header";
import { FromObjectSchema } from "./from-object-schema";

export type FromObjectParams = {
  schema: FromObjectSchema;
  header?: FromObjectHeader;
};
