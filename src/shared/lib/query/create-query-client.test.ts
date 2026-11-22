import { describe, expect, it } from "vitest";

import { createQueryClient } from "./create-query-client";

describe("createQueryClient", () => {
  it("provides stable server-state defaults", () => {
    const options = createQueryClient().getDefaultOptions().queries;

    expect(options).toMatchObject({
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  });
});
