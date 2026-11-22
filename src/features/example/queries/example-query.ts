import { queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@/shared/lib/api/create-client";

import { getExamples } from "../api/get-example";

export function exampleQueryOptions(client: ApiClient) {
  return queryOptions({
    queryKey: ["example-items"],
    queryFn: () => getExamples(client),
  });
}
