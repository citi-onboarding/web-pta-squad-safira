import type { ApiClient } from "@/shared/lib/api/create-client";

import { exampleListSchema } from "../types/example";

export const EXAMPLE_ITEMS_PATH = "api/v1/example-items";

export function getExamples(client: ApiClient) {
  return client.request(EXAMPLE_ITEMS_PATH, { schema: exampleListSchema });
}
