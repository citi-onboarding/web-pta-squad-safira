import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card, CardContent, CardHeader, CardTitle } from "../card";

describe("Card", () => {
  it("groups a title and its content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Limite disponível</CardTitle>
        </CardHeader>
        <CardContent>R$ 213.000,00</CardContent>
      </Card>,
    );

    expect(screen.getByText("Limite disponível")).toBeVisible();
    expect(screen.getByText("R$ 213.000,00")).toBeVisible();
  });
});
