async function countRelated(database, table, column, ids) {
  const rows = await database(table).whereIn(column, ids).count({ total: "*" });
  return Number(rows[0]?.total ?? 0);
}

export default ({ filter }, { database }) => {
  filter("orders.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];
    const reviewCount = await countRelated(database, "admin_reviews", "order", ids);

    if (reviewCount > 0) {
      throw new Error(
        "This order cannot be deleted yet. Delete related admin reviews first.",
      );
    }

    return keys;
  });

  filter("customers.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    const [orderCount, quoteCount, vehicleCount, driverCount] = await Promise.all([
      countRelated(database, "orders", "customer", ids),
      countRelated(database, "quotes", "customer", ids),
      countRelated(database, "vehicles", "customer", ids),
      countRelated(database, "drivers", "customer", ids),
    ]);

    if (orderCount || quoteCount || vehicleCount || driverCount) {
      throw new Error(
        "This customer cannot be deleted yet. Delete related orders, quotes, vehicles, and drivers first.",
      );
    }

    return keys;
  });

  filter("vehicles.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];
    const [orderCount, quoteCount] = await Promise.all([
      countRelated(database, "orders", "vehicle", ids),
      countRelated(database, "quotes", "vehicle", ids),
    ]);

    if (orderCount || quoteCount) {
      throw new Error(
        "This vehicle cannot be deleted yet. Delete related orders and quotes first.",
      );
    }

    return keys;
  });

  filter("drivers.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];
    const [orderCount, quoteCount] = await Promise.all([
      countRelated(database, "orders", "driver", ids),
      countRelated(database, "quotes", "driver", ids),
    ]);

    if (orderCount || quoteCount) {
      throw new Error(
        "This driver cannot be deleted yet. Delete related orders and quotes first.",
      );
    }

    return keys;
  });
};
