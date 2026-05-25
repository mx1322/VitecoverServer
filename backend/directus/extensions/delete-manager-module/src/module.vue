<template>
  <private-view title="Delete Manager">
    <div class="delete-manager">
      <div class="toolbar">
        <label>
          Collection
          <select v-model="collection">
            <option v-for="item in collections" :key="item.collection" :value="item.collection">
              {{ item.label }} ({{ item.collection }})
            </option>
          </select>
        </label>

        <label>
          Item ID
          <select v-model="itemId" :disabled="loading || itemsLoading || !collection">
            <option value="">{{ itemsLoading ? "Loading items..." : "Select an item" }}</option>
            <option v-for="item in items" :key="item.id" :value="String(item.id)">
              {{ item.summary }}
            </option>
          </select>
        </label>

        <button class="primary" :disabled="loading || itemsLoading || !collection || !itemId" @click="loadPlan">
          Load Actions
        </button>
      </div>

      <p v-if="message" class="message">{{ message }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <section v-if="plan" class="panel">
        <div class="panel-header">
          <div>
            <div class="eyebrow">Target</div>
            <div class="target">{{ plan.target.summary }}</div>
          </div>
          <button class="danger" :disabled="loading" @click="deleteBranch(plan.target.collection, plan.target.id, true)">
            Delete All
          </button>
        </div>

        <div class="list">
          <div v-for="action in plan.actions" :key="`${action.collection}:${action.id}`" class="row" :style="{ paddingLeft: `${action.depth * 24 + 16}px` }">
            <div class="summary">
              <div class="summary-line">{{ action.summary }}</div>
              <div v-if="action.parent" class="meta">via {{ action.parent.via }} from {{ action.parent.summary }}</div>
            </div>
            <div class="actions">
              <button :disabled="loading || action.childCount > 0" @click="deleteBranch(action.collection, action.id, false)">
                Delete Item
              </button>
              <button class="danger ghost" :disabled="loading" @click="deleteBranch(action.collection, action.id, true)">
                Delete Branch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </private-view>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useApi } from "@directus/extensions-sdk";

const api = useApi();

const collections = ref([]);
const collection = ref("orders");
const items = ref([]);
const itemId = ref("");
const loading = ref(false);
const itemsLoading = ref(false);
const message = ref("");
const errorMessage = ref("");
const plan = ref(null);

async function loadCollections() {
  const response = await api.get("/delete-manager-endpoint/collections");
  collections.value = response.data.data;
}

async function loadItems(resetSelection = true) {
  if (!collection.value) {
    items.value = [];
    if (resetSelection) itemId.value = "";
    return;
  }

  itemsLoading.value = true;

  try {
    const response = await api.get(`/delete-manager-endpoint/items/${collection.value}`);
    items.value = response.data.data;

    const hasCurrentItem = items.value.some((item) => String(item.id) === String(itemId.value));
    if (resetSelection || !hasCurrentItem) {
      itemId.value = hasCurrentItem ? itemId.value : "";
    }
  } catch (error) {
    items.value = [];
    itemId.value = "";
    errorMessage.value = error?.response?.data?.errors?.[0]?.message || error?.message || "Unable to load items.";
  } finally {
    itemsLoading.value = false;
  }
}

async function loadPlan() {
  loading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    const response = await api.get(`/delete-manager-endpoint/plan/${collection.value}/${encodeURIComponent(itemId.value)}`);
    plan.value = response.data.data;
  } catch (error) {
    plan.value = null;
    errorMessage.value = error?.response?.data?.errors?.[0]?.message || error?.message || "Unable to load actions.";
  } finally {
    loading.value = false;
  }
}

async function deleteBranch(targetCollection, targetId, cascade) {
  loading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    await api.post("/delete-manager-endpoint/delete", {
      collection: targetCollection,
      id: targetId,
      cascade,
    });

    message.value = cascade
      ? `Deleted ${targetCollection}#${targetId} with its dependencies.`
      : `Deleted ${targetCollection}#${targetId}.`;

    if (plan.value && plan.value.target.collection === targetCollection && String(plan.value.target.id) === String(targetId)) {
      plan.value = null;
      itemId.value = "";
      await loadItems(false);
    } else if (plan.value) {
      await loadPlan();
      await loadItems(false);
    }
  } catch (error) {
    errorMessage.value = error?.response?.data?.errors?.[0]?.message || error?.message || "Delete failed.";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const initialCollection = params.get("collection");
  const initialId = params.get("id");

  await loadCollections();

  if (initialCollection) {
    collection.value = initialCollection;
  }

  await loadItems(false);

  if (initialId) {
    itemId.value = initialId;
  }

  if (initialCollection && initialId) {
    await loadPlan();
  }
});

watch(collection, async (nextCollection, previousCollection) => {
  if (nextCollection === previousCollection) return;

  plan.value = null;
  message.value = "";
  errorMessage.value = "";
  await loadItems();
});
</script>

<style scoped>
.delete-manager {
  padding: 24px;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
  font-size: 14px;
}

select,
button {
  font: inherit;
}

select {
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid #c9d4e1;
  border-radius: 10px;
  background: #fff;
}

button {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #c9d4e1;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

button.primary {
  background: #0f766e;
  border-color: #0f766e;
  color: #fff;
}

button.danger {
  background: #b42318;
  border-color: #b42318;
  color: #fff;
}

button.ghost {
  background: #fff;
  color: #b42318;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message,
.error {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
}

.message {
  background: #ecfdf3;
  color: #027a48;
}

.error {
  background: #fef3f2;
  color: #b42318;
}

.panel {
  margin-top: 20px;
  border: 1px solid #d0d5dd;
  border-radius: 16px;
  background: #fff;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eaecf0;
}

.eyebrow {
  font-size: 12px;
  color: #667085;
  text-transform: uppercase;
}

.target {
  font-size: 16px;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 14px;
  padding-bottom: 14px;
  border-top: 1px solid #eaecf0;
}

.row:first-child {
  border-top: 0;
}

.summary {
  min-width: 0;
}

.summary-line {
  font-size: 14px;
  word-break: break-word;
}

.meta {
  margin-top: 4px;
  font-size: 12px;
  color: #667085;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}
</style>
