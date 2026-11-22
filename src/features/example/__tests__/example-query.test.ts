import { describe, expect, it, vi } from "vitest";

import type { ApiClient } from "@/shared/lib/api/create-client";

import { exampleQueryOptions } from "../queries/example-query";

describe("exampleQueryOptions", () => {
  it("uses a stable key and the injected API client", async () => {
    const request = vi.fn().mockResolvedValue([{ id: "1" }]);
    const options = exampleQueryOptions({ request } as unknown as ApiClient);

    expect(options.queryKey).toEqual(["example-items"]);
    await expect(options.queryFn?.({} as never)).resolves.toMatchObject([
      { id: "1" },
    ]);
    expect(request).toHaveBeenCalledWith(
      "api/v1/example-items",
      expect.any(Object),
    );
  });
});
