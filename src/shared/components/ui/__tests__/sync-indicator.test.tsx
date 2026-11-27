import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { parseAbsolute } from "@/shared/lib/datetime";

import { SyncIndicator } from "../sync-indicator";

const LAST_SYNC = parseAbsolute("2026-11-19T17:02:00Z");

describe("SyncIndicator", () => {
  it("says when the data was last synchronized with the ERP", () => {
    const { container } = render(
      <SyncIndicator lastSyncedAt={LAST_SYNC} erpAvailable />,
    );

    expect(
      screen.getByText("Sincronizado com o ERP em 19/11/2026 14:02"),
    ).toBeVisible();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("says the ERP is unavailable and which data is shown, with an icon", () => {
    const { container } = render(
      <SyncIndicator lastSyncedAt={LAST_SYNC} erpAvailable={false} />,
    );

    expect(
      screen.getByText("ERP fora do ar · dados de 19/11/2026 14:02"),
    ).toBeVisible();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
