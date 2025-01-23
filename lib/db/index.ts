import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import type { SQL } from "drizzle-orm";
import { sql, getTableColumns } from "drizzle-orm";

export const Order = {
  ASC: "asc",
  DESC: "desc",
} as const;
export type Order = (typeof Order)[keyof typeof Order];

export const defaultOrder = Order.DESC;

export const orderItems = Object.values(Order).map((value) => {
  return {
    label: getOrderName(value),
    value,
  };
});

export function stringToOrder(str: string): Order | undefined {
  switch (str) {
    case "asc":
      return Order.ASC;
    case "desc":
      return Order.DESC;
    default:
      return undefined;
  }
}

export function getOrderName(order: Order) {
  switch (order) {
    case Order.ASC:
      return "ASC";
    case Order.DESC:
      return "DESC";
  }
}

export function conflictUpdateAllExcept<
  T extends SQLiteTable,
  E extends (keyof T["$inferInsert"])[],
>(table: T, except?: E) {
  const columns = getTableColumns(table);
  const updateColumns = except
    ? Object.entries(columns).filter(
        ([col]) => !except.includes(col as keyof typeof table.$inferInsert),
      )
    : Object.entries(columns);

  return updateColumns.reduce((acc, [colName, table]) => {
    const column = { [colName]: sql.raw(`excluded."${table.name}"`) };
    return Object.assign(acc, column);
  }, {}) as Omit<Record<keyof typeof table.$inferInsert, SQL>, E[number]>;
}
