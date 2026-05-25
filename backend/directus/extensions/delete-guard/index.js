import { createError } from "@directus/errors";

const DeleteBlockedError = createError(
  "DELETE_BLOCKED",
  ({ message }) => message,
  409,
);

async function findRelated(database, table, column, ids, limit = 10) {
  if (!ids.length) {
    return { count: 0, ids: [] };
  }

  const rows = await database(table).whereIn(column, ids).select("id").limit(limit);
  const countRows = await database(table).whereIn(column, ids).count({ total: "*" });

  return {
    count: Number(countRows[0]?.total ?? 0),
    ids: rows.map((row) => row.id),
  };
}

function formatBlockers(entityLabel, blockers) {
  const active = blockers.filter((item) => item.count > 0);
  if (active.length === 0) {
    return null;
  }

  const detail = active
    .map((item) => {
      const sample = item.ids.length ? ` ids=${item.ids.join(",")}` : "";
      return `${item.table}.${item.column}: ${item.count}${sample}`;
    })
    .join(" | ");

  return `${entityLabel} delete blocked by related records: ${detail}. Remove or detach these records first.`;
}

async function assertNoBlockers(database, entityLabel, ids, blockers) {
  const resolved = await Promise.all(
    blockers.map(async (blocker) => ({
      ...blocker,
      ...(await findRelated(database, blocker.table, blocker.column, ids)),
    })),
  );

  const message = formatBlockers(entityLabel, resolved);
  if (message) {
    throw new DeleteBlockedError({ message });
  }
}

export default ({ filter }, { database }) => {
  filter("customers.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "Customer", ids, [
      { table: "refunds", column: "customer" },
      { table: "policies", column: "customer" },
      { table: "orders", column: "customer" },
      { table: "quotes", column: "customer" },
      { table: "vehicles", column: "customer" },
      { table: "drivers", column: "customer" },
    ]);

    return keys;
  });

  filter("vehicles.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "Vehicle", ids, [
      { table: "policies", column: "vehicle" },
      { table: "orders", column: "vehicle" },
      { table: "quotes", column: "vehicle" },
    ]);

    return keys;
  });

  filter("drivers.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "Driver", ids, [
      { table: "policies", column: "driver" },
      { table: "orders", column: "driver" },
      { table: "quotes", column: "driver" },
    ]);

    return keys;
  });

  filter("quotes.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "Quote", ids, [
      { table: "orders", column: "quote" },
    ]);

    return keys;
  });

  filter("orders.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "Order", ids, [
      { table: "refunds", column: "order" },
      { table: "payments", column: "order" },
      { table: "policies", column: "order" },
      { table: "admin_reviews", column: "order" },
    ]);

    return keys;
  });

  filter("payments.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "Payment", ids, [
      { table: "refunds", column: "payment" },
    ]);

    return keys;
  });

  filter("policies.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "Policy", ids, [
      { table: "refunds", column: "policy" },
      { table: "admin_reviews", column: "policy" },
    ]);

    return keys;
  });

  filter("directus_files.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "File", ids, [
      { table: "policies", column: "pdf_file" },
    ]);

    return keys;
  });
};
