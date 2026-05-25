class DeleteBlockedError extends Error {
  constructor(reason) {
    super(`Can't process content. ${reason}.`);
    this.name = "DirectusError";
    this.code = "UNPROCESSABLE_CONTENT";
    this.status = 422;
    this.extensions = { reason, code: "UNPROCESSABLE_CONTENT" };
  }
}

const DELETE_MANAGER_MODULE_ID = "delete-manager";
const MODULE_BAR_DEFAULT = [
  { type: "module", id: "content", enabled: true },
  { type: "module", id: "visual", enabled: false },
  { type: "module", id: "users", enabled: true },
  { type: "module", id: "files", enabled: true },
  { type: "module", id: "insights", enabled: true },
  { type: "link", id: "docs", enabled: true, name: "$t:documentation", icon: "help", url: "https://docs.directus.io" },
  { type: "module", id: "settings", enabled: true, locked: true },
];

function buildManagerUrl(collection, id = null) {
  const params = new URLSearchParams({ collection });
  if (id !== null && id !== undefined && id !== "") {
    params.set("id", String(id));
  }

  return `/admin/delete-manager?${params.toString()}`;
}

function parseModuleBar(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : null;
    } catch (_error) {
      return null;
    }
  }

  return null;
}

async function ensureDeleteManagerModuleEnabled(database) {
  const settings = await database("directus_settings").first(["id", "module_bar"]);
  if (!settings) return;

  const configured = parseModuleBar(settings.module_bar);
  const isLegacyDeleteManagerOnly =
    configured?.length === 1 &&
    configured[0]?.type === "module" &&
    configured[0]?.id === DELETE_MANAGER_MODULE_ID;

  const moduleBar = !configured || isLegacyDeleteManagerOnly
    ? MODULE_BAR_DEFAULT.map((item) => ({ ...item }))
    : configured.slice();

  const existingIndex = moduleBar.findIndex(
    (item) => item?.type === "module" && item?.id === DELETE_MANAGER_MODULE_ID,
  );
  const existing = existingIndex >= 0 ? moduleBar[existingIndex] : null;

  if (
    configured &&
    !isLegacyDeleteManagerOnly &&
    existingIndex === moduleBar.length - 1 &&
    existing?.enabled === true
  ) {
    return;
  }

  if (existingIndex >= 0) {
    moduleBar.splice(existingIndex, 1);
  }

  moduleBar.push({
    ...(isLegacyDeleteManagerOnly ? {} : existing),
    type: "module",
    id: DELETE_MANAGER_MODULE_ID,
    enabled: true,
  });

  await database("directus_settings").where({ id: settings.id }).update({ module_bar: JSON.stringify(moduleBar) });
}

function compactValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}

function summarizeRow(table, row) {
  const parts = [`${table}#${row.id}`];

  if (table === "orders") {
    const orderNumber = compactValue(row.order_number);
    const status = compactValue(row.status);
    if (orderNumber) parts.push(`order=${orderNumber}`);
    if (status) parts.push(`status=${status}`);
  } else if (table === "quotes") {
    const quoteNumber = compactValue(row.quote_number);
    const status = compactValue(row.status);
    if (quoteNumber) parts.push(`quote=${quoteNumber}`);
    if (status) parts.push(`status=${status}`);
  } else if (table === "payments") {
    const status = compactValue(row.status);
    const intent = compactValue(row.provider_payment_intent_id);
    const charge = compactValue(row.provider_charge_id);
    if (status) parts.push(`status=${status}`);
    if (intent) parts.push(`intent=${intent}`);
    if (charge) parts.push(`charge=${charge}`);
  } else if (table === "policies") {
    const policyNumber = compactValue(row.policy_number);
    const status = compactValue(row.status);
    if (policyNumber) parts.push(`policy=${policyNumber}`);
    if (status) parts.push(`status=${status}`);
  } else if (table === "admin_reviews") {
    const reviewType = compactValue(row.review_type);
    const status = compactValue(row.status);
    if (reviewType) parts.push(`type=${reviewType}`);
    if (status) parts.push(`status=${status}`);
  } else if (table === "refunds") {
    const status = compactValue(row.status);
    const refundType = compactValue(row.refund_type);
    if (refundType) parts.push(`type=${refundType}`);
    if (status) parts.push(`status=${status}`);
  } else if (table === "customers") {
    const email = compactValue(row.email);
    const fullName = [compactValue(row.first_name), compactValue(row.last_name)].filter(Boolean).join(" ");
    if (email) parts.push(`email=${email}`);
    if (fullName) parts.push(`name=${fullName}`);
  } else if (table === "vehicles") {
    const registrationNumber = compactValue(row.registration_number);
    const model = [compactValue(row.manufacturer), compactValue(row.model)].filter(Boolean).join(" ");
    if (registrationNumber) parts.push(`plate=${registrationNumber}`);
    if (model) parts.push(`model=${model}`);
  } else if (table === "drivers") {
    const licenseNumber = compactValue(row.license_number);
    const fullName = [compactValue(row.first_name), compactValue(row.last_name)].filter(Boolean).join(" ");
    if (licenseNumber) parts.push(`license=${licenseNumber}`);
    if (fullName) parts.push(`name=${fullName}`);
  } else if (table === "directus_files") {
    const filename = compactValue(row.filename_download);
    if (filename) parts.push(`file=${filename}`);
  }

  return parts.join(" ");
}

async function findRelated(database, table, column, ids, fields = [], limit = 10) {
  if (!ids.length) {
    return { count: 0, rows: [] };
  }

  const rows = await database(table).whereIn(column, ids).select(["id", ...fields]).limit(limit);
  const countRows = await database(table).whereIn(column, ids).count({ total: "*" });

  return {
    count: Number(countRows[0]?.total ?? 0),
    rows,
  };
}

function formatManagerHint(collection, ids) {
  if (!collection) {
    return null;
  }

  if (ids.length === 1) {
    return `Delete Manager: ${buildManagerUrl(collection, ids[0])} . Use it to remove dependencies one by one or cascade delete.`;
  }

  return `Delete Manager: ${buildManagerUrl(collection)} . Use it to remove dependencies manually.`;
}

function formatBlockers(entityLabel, collection, ids, blockers) {
  const active = blockers.filter((item) => item.count > 0);
  if (active.length === 0) {
    return null;
  }

  const detail = active
    .map((item) => {
      const sample = item.rows.length
        ? ` [${item.rows.map((row) => summarizeRow(item.table, row)).join("; ")}]`
        : "";
      return `${item.table}.${item.column}: ${item.count}${sample}`;
    })
    .join(" | ");

  const hint = formatManagerHint(collection, ids);
  return hint
    ? `${entityLabel} delete blocked by related records: ${detail}. ${hint}`
    : `${entityLabel} delete blocked by related records: ${detail}. Remove or detach these records first.`;
}

async function assertNoBlockers(database, collection, entityLabel, ids, blockers) {
  const resolved = await Promise.all(
    blockers.map(async (blocker) => ({
      ...blocker,
      ...(await findRelated(database, blocker.table, blocker.column, ids, blocker.fields)),
    })),
  );

  const message = formatBlockers(entityLabel, collection, ids, resolved);
  if (message) {
    throw new DeleteBlockedError(message);
  }
}

function renderDeleteManagerEmbed() {
  return `
<script>
(() => {
  const pattern = /Delete Manager:\\s*(\\/admin\\/delete-manager\\?[^\\s]+)/;

  const enhance = () => {
    document.querySelectorAll('*').forEach((element) => {
      if (element.dataset.deleteManagerEnhanced === 'true') return;
      if (element.children.length > 0) return;

      const text = element.textContent || '';
      const match = text.match(pattern);
      if (!match) return;

      element.dataset.deleteManagerEnhanced = 'true';

      const link = document.createElement('a');
      link.href = match[1];
      link.textContent = 'Open Delete Manager';
      link.dataset.deleteManagerLink = 'true';
      link.style.display = 'inline-flex';
      link.style.alignItems = 'center';
      link.style.marginLeft = '8px';
      link.style.padding = '4px 10px';
      link.style.borderRadius = '999px';
      link.style.background = '#0f766e';
      link.style.color = '#fff';
      link.style.textDecoration = 'none';
      link.style.fontWeight = '600';

      element.appendChild(document.createTextNode(' '));
      element.appendChild(link);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance, { once: true });
  } else {
    enhance();
  }

  new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
})();
</script>`;
}

export default ({ filter, embed }, { database, logger }) => {
  ensureDeleteManagerModuleEnabled(database).catch((error) => {
    logger?.error?.(error, "Failed to append delete-manager to module_bar");
  });

  embed("body", renderDeleteManagerEmbed);

  filter("customers.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "customers", "Customer", ids, [
      { table: "refunds", column: "customer" },
      { table: "policies", column: "customer", fields: ["policy_number", "status"] },
      { table: "orders", column: "customer", fields: ["order_number", "status"] },
      { table: "quotes", column: "customer", fields: ["quote_number", "status"] },
      { table: "vehicles", column: "customer", fields: ["registration_number", "manufacturer", "model"] },
      { table: "drivers", column: "customer", fields: ["license_number", "first_name", "last_name"] },
    ]);

    return keys;
  });

  filter("vehicles.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "vehicles", "Vehicle", ids, [
      { table: "policies", column: "vehicle", fields: ["policy_number", "status"] },
      { table: "orders", column: "vehicle", fields: ["order_number", "status"] },
      { table: "quotes", column: "vehicle", fields: ["quote_number", "status"] },
    ]);

    return keys;
  });

  filter("drivers.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "drivers", "Driver", ids, [
      { table: "policies", column: "driver", fields: ["policy_number", "status"] },
      { table: "orders", column: "driver", fields: ["order_number", "status"] },
      { table: "quotes", column: "driver", fields: ["quote_number", "status"] },
    ]);

    return keys;
  });

  filter("quotes.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "quotes", "Quote", ids, [
      { table: "orders", column: "quote", fields: ["order_number", "status"] },
    ]);

    return keys;
  });

  filter("orders.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "orders", "Order", ids, [
      { table: "refunds", column: "order", fields: ["refund_type", "status"] },
      { table: "payments", column: "order", fields: ["status", "provider_payment_intent_id", "provider_charge_id"] },
      { table: "policies", column: "order", fields: ["policy_number", "status"] },
      { table: "admin_reviews", column: "order", fields: ["review_type", "status"] },
    ]);

    return keys;
  });

  filter("payments.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "payments", "Payment", ids, [
      { table: "refunds", column: "payment", fields: ["refund_type", "status"] },
    ]);

    return keys;
  });

  filter("policies.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "policies", "Policy", ids, [
      { table: "refunds", column: "policy", fields: ["refund_type", "status"] },
      { table: "admin_reviews", column: "policy", fields: ["review_type", "status"] },
    ]);

    return keys;
  });

  filter("directus_files.items.delete", async (keys) => {
    const ids = Array.isArray(keys) ? keys : [keys];

    await assertNoBlockers(database, "directus_files", "File", ids, [
      { table: "policies", column: "pdf_file", fields: ["policy_number", "status"] },
    ]);

    return keys;
  });
};
