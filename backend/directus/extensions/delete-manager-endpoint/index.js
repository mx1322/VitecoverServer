const ENTITY_LABELS = {
  customers: "Customer",
  vehicles: "Vehicle",
  drivers: "Driver",
  quotes: "Quote",
  orders: "Order",
  payments: "Payment",
  policies: "Policy",
  refunds: "Refund",
  admin_reviews: "Admin Review",
  directus_files: "File",
};

const BLOCKERS = {
  customers: [
    { table: "refunds", column: "customer", fields: ["refund_type", "status"] },
    { table: "policies", column: "customer", fields: ["policy_number", "status"] },
    { table: "orders", column: "customer", fields: ["order_number", "status"] },
    { table: "quotes", column: "customer", fields: ["quote_number", "status"] },
    { table: "vehicles", column: "customer", fields: ["registration_number", "manufacturer", "model"] },
    { table: "drivers", column: "customer", fields: ["license_number", "first_name", "last_name"] },
  ],
  vehicles: [
    { table: "policies", column: "vehicle", fields: ["policy_number", "status"] },
    { table: "orders", column: "vehicle", fields: ["order_number", "status"] },
    { table: "quotes", column: "vehicle", fields: ["quote_number", "status"] },
  ],
  drivers: [
    { table: "policies", column: "driver", fields: ["policy_number", "status"] },
    { table: "orders", column: "driver", fields: ["order_number", "status"] },
    { table: "quotes", column: "driver", fields: ["quote_number", "status"] },
  ],
  quotes: [
    { table: "orders", column: "quote", fields: ["order_number", "status"] },
  ],
  orders: [
    { table: "refunds", column: "order", fields: ["refund_type", "status"] },
    { table: "payments", column: "order", fields: ["status", "provider_payment_intent_id", "provider_charge_id"] },
    { table: "policies", column: "order", fields: ["policy_number", "status"] },
    { table: "admin_reviews", column: "order", fields: ["review_type", "status"] },
  ],
  payments: [
    { table: "refunds", column: "payment", fields: ["refund_type", "status"] },
  ],
  policies: [
    { table: "refunds", column: "policy", fields: ["refund_type", "status"] },
    { table: "admin_reviews", column: "policy", fields: ["review_type", "status"] },
  ],
  refunds: [],
  admin_reviews: [],
  directus_files: [
    { table: "policies", column: "pdf_file", fields: ["policy_number", "status"] },
  ],
};

const SUMMARY_FIELDS = {
  customers: ["email", "first_name", "last_name"],
  vehicles: ["registration_number", "manufacturer", "model"],
  drivers: ["license_number", "first_name", "last_name"],
  quotes: ["quote_number", "status"],
  orders: ["order_number", "status"],
  payments: ["status", "provider_payment_intent_id", "provider_charge_id"],
  policies: ["policy_number", "status"],
  refunds: ["refund_type", "status"],
  admin_reviews: ["review_type", "status"],
  directus_files: ["filename_download"],
};

function compactValue(value) {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function summarizeRow(table, row) {
  const parts = [`${table}#${row.id}`];

  if (table === "orders") {
    if (compactValue(row.order_number)) parts.push(`order=${row.order_number}`);
    if (compactValue(row.status)) parts.push(`status=${row.status}`);
  } else if (table === "quotes") {
    if (compactValue(row.quote_number)) parts.push(`quote=${row.quote_number}`);
    if (compactValue(row.status)) parts.push(`status=${row.status}`);
  } else if (table === "payments") {
    if (compactValue(row.status)) parts.push(`status=${row.status}`);
    if (compactValue(row.provider_payment_intent_id)) parts.push(`intent=${row.provider_payment_intent_id}`);
    if (compactValue(row.provider_charge_id)) parts.push(`charge=${row.provider_charge_id}`);
  } else if (table === "policies") {
    if (compactValue(row.policy_number)) parts.push(`policy=${row.policy_number}`);
    if (compactValue(row.status)) parts.push(`status=${row.status}`);
  } else if (table === "admin_reviews") {
    if (compactValue(row.review_type)) parts.push(`type=${row.review_type}`);
    if (compactValue(row.status)) parts.push(`status=${row.status}`);
  } else if (table === "refunds") {
    if (compactValue(row.refund_type)) parts.push(`type=${row.refund_type}`);
    if (compactValue(row.status)) parts.push(`status=${row.status}`);
  } else if (table === "customers") {
    if (compactValue(row.email)) parts.push(`email=${row.email}`);
    const fullName = [compactValue(row.first_name), compactValue(row.last_name)].filter(Boolean).join(" ");
    if (fullName) parts.push(`name=${fullName}`);
  } else if (table === "vehicles") {
    if (compactValue(row.registration_number)) parts.push(`plate=${row.registration_number}`);
    const model = [compactValue(row.manufacturer), compactValue(row.model)].filter(Boolean).join(" ");
    if (model) parts.push(`model=${model}`);
  } else if (table === "drivers") {
    if (compactValue(row.license_number)) parts.push(`license=${row.license_number}`);
    const fullName = [compactValue(row.first_name), compactValue(row.last_name)].filter(Boolean).join(" ");
    if (fullName) parts.push(`name=${fullName}`);
  } else if (table === "directus_files") {
    if (compactValue(row.filename_download)) parts.push(`file=${row.filename_download}`);
  }

  return parts.join(" ");
}

function ensureSupportedCollection(collection) {
  if (!BLOCKERS[collection]) {
    const error = new Error(`Unsupported collection: ${collection}`);
    error.status = 400;
    throw error;
  }
}

function toKey(collection, id) {
  return `${collection}:${String(id)}`;
}

async function readItem(database, collection, id) {
  const fields = SUMMARY_FIELDS[collection] || [];
  const row = await database(collection).where({ id }).first(["id", ...fields]);
  if (!row) {
    const error = new Error(`${collection}#${id} not found`);
    error.status = 404;
    throw error;
  }
  return row;
}

async function listItems(database, collection) {
  ensureSupportedCollection(collection);

  const fields = SUMMARY_FIELDS[collection] || [];
  const rows = await database(collection).select(["id", ...fields]).orderBy("id", "asc");

  return rows.map((row) => ({
    id: row.id,
    summary: summarizeRow(collection, row),
  }));
}

async function readDirectDependents(database, collection, id) {
  const blockers = BLOCKERS[collection] || [];
  const groups = [];

  for (const blocker of blockers) {
    const rows = await database(blocker.table)
      .where(blocker.column, id)
      .select(["id", ...(blocker.fields || [])])
      .orderBy("id", "asc");

    groups.push(
      ...rows.map((row) => ({
        collection: blocker.table,
        id: row.id,
        via: `${blocker.table}.${blocker.column}`,
        summary: summarizeRow(blocker.table, row),
      })),
    );
  }

  return groups;
}

async function buildDeleteTree(database, collection, id, seen = new Set()) {
  ensureSupportedCollection(collection);

  const nodeKey = toKey(collection, id);
  if (seen.has(nodeKey)) {
    return null;
  }

  seen.add(nodeKey);
  const row = await readItem(database, collection, id);
  const children = [];
  const directDependents = await readDirectDependents(database, collection, id);

  for (const dependent of directDependents) {
    const child = await buildDeleteTree(database, dependent.collection, dependent.id, seen);
    if (child) {
      child.via = dependent.via;
      children.push(child);
    }
  }

  return {
    collection,
    id: row.id,
    label: ENTITY_LABELS[collection] || collection,
    summary: summarizeRow(collection, row),
    children,
  };
}

function flattenTree(node, items = [], depth = 0, parent = null) {
  items.push({
    collection: node.collection,
    id: node.id,
    label: node.label,
    summary: node.summary,
    depth,
    parent,
    childCount: node.children.length,
  });

  for (const child of node.children) {
    flattenTree(child, items, depth + 1, {
      collection: node.collection,
      id: node.id,
      summary: node.summary,
      via: child.via || null,
    });
  }

  return items;
}

async function deleteOneWithService(services, getSchema, accountability, collection, id) {
  const schema = await getSchema();

  if (collection === "directus_files") {
    const { FilesService } = services;
    const filesService = new FilesService({
      schema,
      accountability,
    });
    await filesService.deleteOne(id);
    return;
  }

  const { ItemsService } = services;
  const itemsService = new ItemsService(collection, {
    schema,
    accountability,
  });
  await itemsService.deleteOne(id);
}

async function cascadeDeleteTree(tree, services, getSchema, accountability) {
  for (const child of tree.children) {
    await cascadeDeleteTree(child, services, getSchema, accountability);
  }

  await deleteOneWithService(services, getSchema, accountability, tree.collection, tree.id);
}

export default (router, context) => {
  const { database, services, getSchema } = context;

  router.get("/collections", (_req, res) => {
    res.json({
      data: Object.keys(BLOCKERS).map((collection) => ({
        collection,
        label: ENTITY_LABELS[collection] || collection,
      })),
    });
  });

  router.get("/items/:collection", async (req, res, next) => {
    try {
      res.json({
        data: await listItems(database, req.params.collection),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/plan/:collection/:id", async (req, res, next) => {
    try {
      const { collection, id } = req.params;
      const tree = await buildDeleteTree(database, collection, id);
      res.json({
        data: {
          target: {
            collection: tree.collection,
            id: tree.id,
            label: tree.label,
            summary: tree.summary,
          },
          tree,
          actions: flattenTree(tree),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/delete", async (req, res, next) => {
    try {
      const { collection, id, cascade = false } = req.body || {};
      if (!collection || id === undefined || id === null) {
        const error = new Error("collection and id are required");
        error.status = 400;
        throw error;
      }

      const tree = await buildDeleteTree(database, collection, id);
      if (!cascade && tree.children.length > 0) {
        res.status(409).json({
          errors: [
            {
              message: "Delete blocked by related records. Use cascade=true or delete children first.",
              extensions: {
                code: "DELETE_BLOCKED",
                tree,
                actions: flattenTree(tree),
              },
            },
          ],
        });
        return;
      }

      await cascadeDeleteTree(tree, services, getSchema, req.accountability);
      res.json({
        data: {
          deleted: flattenTree(tree),
        },
      });
    } catch (error) {
      next(error);
    }
  });
};
