import type { z, ZodTypeDef } from "zod";

import { readFromLS } from "./primitive";

export function readWithSchema<T, Def extends ZodTypeDef>(
  key: string,
  schema: z.ZodType<T, Def>,
): T | null {
  const data = readFromLS(key);
  if (data) {
    try {
      return schema.parse(JSON.parse(data));
    } catch {
      return null;
    }
  } else {
    return null;
  }
}
