import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DataTable } from "../data-table";
import type { DataTableColumn } from "../data-table";

type Client = { code: string; name: string; available: string };

const COLUMNS: DataTableColumn<Client>[] = [
  { key: "code", header: "Código", cell: (row) => row.code },
  { key: "name", header: "Razão social", cell: (row) => row.name },
  {
    key: "available",
    header: "Limite disponível",
    align: "end",
    cell: (row) => row.available,
  },
];

const ROWS: Client[] = [
  {
    code: "C0012",
    name: "Indústria Apipucos Ltda",
    available: "R$ 213.000,00",
  },
  {
    code: "C0044",
    name: "Cliente com limite negativo",
    available: "-R$ 500,00",
  },
];

function renderTable() {
  return render(
    <DataTable
      caption="Clientes"
      columns={COLUMNS}
      rows={ROWS}
      getRowKey={(row) => row.code}
    />,
  );
}

describe("DataTable", () => {
  it("names each column in a header row", () => {
    renderTable();

    const table = screen.getByRole("table", { name: "Clientes" });
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((header) => header.textContent),
    ).toEqual(["Código", "Razão social", "Limite disponível"]);
    expect(within(table).getAllByRole("row")).toHaveLength(3);
  });

  it("aligns money to the right", () => {
    renderTable();

    const table = screen.getByRole("table", { name: "Clientes" });
    expect(within(table).getByText("-R$ 500,00").closest("td")).toHaveAttribute(
      "data-align",
      "end",
    );
    expect(within(table).getByText("C0044").closest("td")).toHaveAttribute(
      "data-align",
      "start",
    );
  });

  it("offers every row as a stacked card with the same information for the phone", () => {
    renderTable();

    const cards = within(
      screen.getByRole("list", { name: "Clientes" }),
    ).getAllByRole("listitem");
    expect(cards).toHaveLength(2);
    expect(cards[1]).toHaveTextContent("Código");
    expect(cards[1]).toHaveTextContent("C0044");
    expect(cards[1]).toHaveTextContent("Limite disponível");
    expect(cards[1]).toHaveTextContent("-R$ 500,00");
  });
});
