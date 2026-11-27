import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingState } from "../loading-state";

describe("LoadingState", () => {
  it("announces that the content is loading", () => {
    render(<LoadingState />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando…");
  });

  it("can say what is loading", () => {
    render(<LoadingState label="Carregando clientes…" />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando clientes…",
    );
  });
});
