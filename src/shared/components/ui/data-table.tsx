import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export type DataTableColumn<Row> = {
  key: string;
  header: string;
  // Money and other numbers go to the right.
  align?: "start" | "end";
  cell: (row: Row) => ReactNode;
};

type DataTableProps<Row> = {
  caption: string;
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[];
  getRowKey: (row: Row) => string;
};

// A table on larger screens; stacked cards with the same information on the
// phone, so nothing needs horizontal scrolling.
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
}: DataTableProps<Row>) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(column.align === "end" && "text-right")}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    data-align={column.align ?? "start"}
                    className={cn(
                      column.align === "end" && "text-right tabular-nums",
                    )}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul aria-label={caption} className="flex flex-col gap-2 md:hidden">
        {rows.map((row) => (
          <li
            key={getRowKey(row)}
            className="rounded-tile border bg-surface px-4 py-3"
          >
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {columns.map((column) => (
                <div key={column.key} className="contents">
                  <dt className="text-caption font-semibold text-muted">
                    {column.header}
                  </dt>
                  <dd
                    className={cn(
                      "text-body",
                      column.align === "end" && "text-right tabular-nums",
                    )}
                  >
                    {column.cell(row)}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
