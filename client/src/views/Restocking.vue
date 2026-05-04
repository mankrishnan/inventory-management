<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Planner</h2>
      <p>Allocate your budget to restock high-demand inventory</p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>

      <!-- Budget Section -->
      <div class="card budget-card">
        <div class="card-header">
          <h3 class="card-title">Budget Allocation</h3>
          <span class="budget-display">{{ currencySymbol }}{{ budget.toLocaleString() }}</span>
        </div>
        <div class="budget-slider-wrap">
          <div class="slider-labels">
            <span>{{ currencySymbol }}10,000</span>
            <span>{{ currencySymbol }}500,000</span>
          </div>
          <input
            type="range"
            class="budget-slider"
            min="10000"
            max="500000"
            step="1000"
            v-model.number="budget"
          />
        </div>
        <div class="budget-usage">
          <div class="budget-usage-text">
            Budget used:
            <strong>{{ currencySymbol }}{{ totalSelectedCost.toLocaleString() }}</strong>
            /
            <strong>{{ currencySymbol }}{{ budget.toLocaleString() }}</strong>
          </div>
          <div class="progress-bar-container">
            <div
              class="progress-bar-fill"
              :class="{ overage: budgetUsagePercent > 100 }"
              :style="{ width: Math.min(budgetUsagePercent, 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Success Banner -->
      <div v-if="orderSubmitted" class="success-banner">
        Order submitted! View in Orders tab.
        <button class="dismiss-btn" @click="orderSubmitted = false">Dismiss</button>
      </div>

      <!-- Recommendations Section -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Restock Recommendations ({{ filteredRecommendations.length }} items)</h3>
        </div>
        <div v-if="filteredRecommendations.length === 0" class="empty-state">
          No restock recommendations available.
        </div>
        <div v-else class="table-container">
          <table class="restock-table">
            <thead>
              <tr>
                <th class="col-check"></th>
                <th class="col-name">Item Name</th>
                <th class="col-sku">SKU</th>
                <th class="col-category">Category</th>
                <th class="col-trend">Trend</th>
                <th class="col-stock">Stock (On Hand / Reorder Pt.)</th>
                <th class="col-qty">Restock Qty</th>
                <th class="col-unit">Unit Cost</th>
                <th class="col-total">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredRecommendations"
                :key="item.sku"
                :class="{ 'row-greyed': !item.withinBudget && !item.selected }"
              >
                <td class="col-check">
                  <input
                    type="checkbox"
                    :checked="item.selected"
                    :disabled="!item.withinBudget && !item.selected"
                    @change="toggleItem(item)"
                  />
                </td>
                <td class="col-name">{{ item.name }}</td>
                <td class="col-sku"><code>{{ item.sku }}</code></td>
                <td class="col-category">{{ item.category }}</td>
                <td class="col-trend">
                  <span :class="['badge', item.trend]">{{ item.trend }}</span>
                </td>
                <td class="col-stock">
                  {{ item.quantity_on_hand.toLocaleString() }} / {{ item.reorder_point.toLocaleString() }}
                </td>
                <td class="col-qty">{{ item.restockQty.toLocaleString() }}</td>
                <td class="col-unit">{{ currencySymbol }}{{ item.unit_cost.toLocaleString() }}</td>
                <td class="col-total">
                  <strong>{{ currencySymbol }}{{ item.itemCost.toLocaleString() }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Row -->
        <div class="summary-row">
          <span class="summary-text">
            {{ selectedCount }} item{{ selectedCount !== 1 ? 's' : '' }} selected
            &mdash; Total: <strong>{{ currencySymbol }}{{ totalSelectedCost.toLocaleString() }}</strong>
          </span>
          <button
            class="place-order-btn"
            :disabled="selectedCount === 0"
            @click="placeOrder"
          >
            Place Order
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useI18n } from '../composables/useI18n'
import { useRestockOrders } from '../composables/useRestockOrders'

const LEAD_TIMES = {
  'Circuit Boards': 14,
  'Sensors': 7,
  'Actuators': 10,
  'Controllers': 12,
  'Power Supplies': 5
}

export default {
  name: 'Restocking',
  setup() {
    const { currentCurrency } = useI18n()
    const { submittedOrders, submitOrder } = useRestockOrders()

    const currencySymbol = computed(() => {
      return currentCurrency.value === 'JPY' ? '¥' : '$'
    })

    const loading = ref(true)
    const error = ref(null)
    const budget = ref(100000)
    const recommendations = ref([])
    const orderSubmitted = ref(false)

    // Build recommendations by merging inventory + demand forecasts
    const loadData = async () => {
      try {
        loading.value = true
        error.value = null

        const [inventoryItems, demandForecasts] = await Promise.all([
          api.getInventory(),
          api.getDemandForecasts()
        ])

        // Build a name -> trend lookup (case-insensitive)
        const trendMap = {}
        for (const forecast of demandForecasts) {
          if (forecast.item_name) {
            trendMap[forecast.item_name.toLowerCase()] = forecast.trend
          }
        }

        // Map inventory items to recommendation objects
        const mapped = inventoryItems
          .map(item => {
            const trend = trendMap[item.name.toLowerCase()] || 'stable'
            if (trend === 'decreasing') return null

            const restockQty = Math.max(item.reorder_point * 2 - item.quantity_on_hand, 50)
            const itemCost = restockQty * item.unit_cost

            return {
              sku: item.sku,
              name: item.name,
              category: item.category,
              trend,
              quantity_on_hand: item.quantity_on_hand,
              reorder_point: item.reorder_point,
              unit_cost: item.unit_cost,
              restockQty,
              itemCost,
              selected: false,
              withinBudget: false
            }
          })
          .filter(Boolean)

        // Sort: increasing first, then stable
        mapped.sort((a, b) => {
          if (a.trend === b.trend) return 0
          if (a.trend === 'increasing') return -1
          return 1
        })

        recommendations.value = mapped
        recalculateBudget()
      } catch (err) {
        error.value = 'Failed to load data: ' + err.message
      } finally {
        loading.value = false
      }
    }

    // Greedy budget allocation — marks withinBudget based on remaining budget
    const recalculateBudget = () => {
      let remaining = budget.value

      // First pass: deduct already-selected items
      for (const item of recommendations.value) {
        if (item.selected) {
          remaining -= item.itemCost
        }
      }

      // Second pass: mark withinBudget for unselected items
      for (const item of recommendations.value) {
        if (!item.selected) {
          item.withinBudget = remaining >= item.itemCost
        } else {
          item.withinBudget = true
        }
      }
    }

    // When budget slider changes, recompute budget allocations but keep user's checkbox choices
    watch(budget, () => {
      recalculateBudget()
    })

    // Initial greedy selection when recommendations load
    const applyInitialSelection = () => {
      let remaining = budget.value
      for (const item of recommendations.value) {
        if (remaining >= item.itemCost) {
          item.selected = true
          remaining -= item.itemCost
          item.withinBudget = true
        } else {
          item.selected = false
          item.withinBudget = false
        }
      }
    }

    const toggleItem = (item) => {
      item.selected = !item.selected
      recalculateBudget()
    }

    const filteredRecommendations = computed(() => recommendations.value)

    const selectedItems = computed(() => recommendations.value.filter(i => i.selected))

    const selectedCount = computed(() => selectedItems.value.length)

    const totalSelectedCost = computed(() =>
      selectedItems.value.reduce((sum, i) => sum + i.itemCost, 0)
    )

    const budgetUsagePercent = computed(() => {
      if (budget.value === 0) return 0
      return (totalSelectedCost.value / budget.value) * 100
    })

    const placeOrder = () => {
      const items = selectedItems.value
      if (items.length === 0) return

      const maxLeadTime = Math.max(...items.map(i => LEAD_TIMES[i.category] ?? 10))
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + maxLeadTime)

      const order = {
        id: `RST-${String(submittedOrders.value.length + 1).padStart(3, '0')}`,
        submittedAt: new Date().toISOString(),
        items: items.map(i => ({
          sku: i.sku,
          name: i.name,
          category: i.category,
          quantity: i.restockQty,
          unitCost: i.unit_cost,
          totalCost: i.itemCost,
          leadTimeDays: LEAD_TIMES[i.category] ?? 10
        })),
        totalCost: totalSelectedCost.value,
        leadTimeDays: maxLeadTime,
        estimatedDelivery: deliveryDate.toISOString()
      }

      submitOrder(order)
      orderSubmitted.value = true

      // Reset selections
      for (const item of recommendations.value) {
        item.selected = false
      }
      recalculateBudget()
    }

    onMounted(async () => {
      await loadData()
      applyInitialSelection()
    })

    return {
      currencySymbol,
      loading,
      error,
      budget,
      filteredRecommendations,
      selectedCount,
      totalSelectedCost,
      budgetUsagePercent,
      orderSubmitted,
      toggleItem,
      placeOrder
    }
  }
}
</script>

<style scoped>
.restocking {
  padding-bottom: 2rem;
}

/* Budget card */
.budget-card .card-header {
  align-items: baseline;
}

.budget-display {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: -0.025em;
}

.budget-slider-wrap {
  margin: 0.75rem 0;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.375rem;
}

.budget-slider {
  width: 100%;
  accent-color: #2563eb;
  cursor: pointer;
  height: 6px;
}

.budget-usage {
  margin-top: 1rem;
}

.budget-usage-text {
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 0.5rem;
}

.progress-bar-container {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-bar-fill.overage {
  background: #dc2626;
}

/* Success banner */
.success-banner {
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  color: #065f46;
  padding: 0.875rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.938rem;
  font-weight: 500;
}

.dismiss-btn {
  background: none;
  border: 1px solid #059669;
  color: #065f46;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.813rem;
  font-weight: 500;
}

.dismiss-btn:hover {
  background: #a7f3d0;
}

/* Table */
.restock-table {
  table-layout: fixed;
  width: 100%;
}

.col-check {
  width: 36px;
}

.col-name {
  width: 220px;
}

.col-sku {
  width: 130px;
}

.col-category {
  width: 130px;
}

.col-trend {
  width: 100px;
}

.col-stock {
  width: 180px;
}

.col-qty {
  width: 100px;
}

.col-unit {
  width: 100px;
}

.col-total {
  width: 110px;
}

.row-greyed {
  opacity: 0.45;
}

.row-greyed td {
  color: #94a3b8;
}

code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.813rem;
  background: #f1f5f9;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

/* Summary row */
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.75rem 0.25rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.5rem;
}

.summary-text {
  font-size: 0.938rem;
  color: #475569;
}

.summary-text strong {
  color: #0f172a;
}

.place-order-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.625rem 1.5rem;
  border-radius: 6px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.place-order-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.place-order-btn:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.938rem;
}
</style>
