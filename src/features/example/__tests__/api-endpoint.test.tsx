import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { ApiEndpoint } from "../components/api-endpoint";

it("reads public environment values from a Client Component", () => {
  render(<ApiEndpoint />);

  expect(screen.getByText("http://localhost:3001")).toBeInTheDocument();
});
