import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExampleCard } from "../components/example-card";

describe("ExampleCard", () => {
  it("renders the example content", () => {
    render(
      <ExampleCard
        example={{
          id: "example-1",
          name: "Feature-based architecture",
          description: "Compose independent features from the app layer.",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Feature-based architecture" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/independent features/i)).toBeInTheDocument();
  });
});
