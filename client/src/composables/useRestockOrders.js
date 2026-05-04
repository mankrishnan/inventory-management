import { ref } from 'vue'

// Module-level singleton — shared across all component instances
const submittedOrders = ref([])

export function useRestockOrders() {
  const submitOrder = (order) => {
    submittedOrders.value.unshift(order)
  }

  return { submittedOrders, submitOrder }
}
