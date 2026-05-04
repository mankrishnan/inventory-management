<template>
  <div class="app" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- Fixed sidebar -->
    <aside class="sidebar" :class="{ collapsed: collapsed }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#3b82f6"/>
            <rect x="6" y="6" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="15" y="6" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="6" y="15" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="15" y="15" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <div class="brand-text" v-show="!collapsed">
          <span class="brand-name">{{ t('nav.companyName') }}</span>
          <span class="brand-sub">{{ t('nav.subtitle') }}</span>
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar" :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline :points="collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"></polyline>
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <span class="nav-section-label" v-show="!collapsed">Main Menu</span>
        <router-link to="/" :class="{ active: $route.path === '/' }" data-tooltip="Overview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          <span v-show="!collapsed">{{ t('nav.overview') }}</span>
        </router-link>
        <router-link to="/inventory" :class="{ active: $route.path === '/inventory' }" data-tooltip="Inventory">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7L12 3 4 7m16 0v10l-8 4m-8-4V7m8 10V7"/></svg>
          <span v-show="!collapsed">{{ t('nav.inventory') }}</span>
        </router-link>
        <router-link to="/orders" :class="{ active: $route.path === '/orders' }" data-tooltip="Orders">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>
          <span v-show="!collapsed">{{ t('nav.orders') }}</span>
        </router-link>
        <router-link to="/restocking" :class="{ active: $route.path === '/restocking' }" data-tooltip="Restocking">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          <span v-show="!collapsed">Restocking</span>
        </router-link>
        <router-link to="/spending" :class="{ active: $route.path === '/spending' }" data-tooltip="Finance">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          <span v-show="!collapsed">{{ t('nav.finance') }}</span>
        </router-link>
        <router-link to="/demand" :class="{ active: $route.path === '/demand' }" data-tooltip="Demand Forecast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span v-show="!collapsed">{{ t('nav.demandForecast') }}</span>
        </router-link>
        <router-link to="/reports" :class="{ active: $route.path === '/reports' }" data-tooltip="Reports">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          <span v-show="!collapsed">Reports</span>
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <LanguageSwitcher v-show="!collapsed" />
        <div class="sidebar-user" @click="showProfileDetails = true">
          <div class="user-avatar">MK</div>
          <div class="user-info" v-show="!collapsed">
            <span class="user-name">Manoj Krishnan</span>
            <span class="user-role">Inventory Manager</span>
          </div>
          <button class="tasks-btn" v-show="!collapsed" @click.stop="showTasks = true" title="Tasks">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div class="main-area">
      <FilterBar />
      <main class="main-content">
        <router-view />
      </main>
    </div>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />
    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])
    const collapsed = ref(false)

    const toggleSidebar = () => { collapsed.value = !collapsed.value }

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(() => {
      loadTasks()
      if (window.innerWidth < 1024) collapsed.value = true
    })

    return {
      t,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask,
      collapsed,
      toggleSidebar
    }
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  min-height: 100vh;
}

/* ── Sidebar ─────────────────────────────── */
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #0f172a;
  position: fixed;
  left: 0; top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow: visible;
  transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1),
              min-width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  width: 64px;
  min-width: 64px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 20px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  position: relative;
  overflow: hidden;
}

.brand-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.brand-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.01em;
  line-height: 1.2;
  white-space: nowrap;
}
.brand-sub {
  font-size: 0.7rem;
  color: #475569;
  margin-top: 1px;
  white-space: nowrap;
}

/* Toggle button */
.sidebar-toggle {
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #64748b;
  padding: 4px 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: auto;
  flex-shrink: 0;
  transition: all 0.15s;
}
.sidebar-toggle:hover { border-color: rgba(255,255,255,0.2); color: #94a3b8; }

/* When collapsed: center brand area and show toggle inline with logo */
.sidebar.collapsed .sidebar-brand {
  justify-content: center;
  padding: 18px 0;
  gap: 0;
  overflow: visible;
}
.sidebar.collapsed .sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  padding: 0;
  justify-content: center;
  z-index: 201;
}
.sidebar.collapsed .sidebar-toggle:hover {
  background: #334155;
  border-color: #475569;
  color: #94a3b8;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  padding: 16px 0 8px;
}

.nav-section-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #334155;
  padding: 0 20px 8px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  margin: 1px 10px;
  border-radius: 7px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.863rem;
  font-weight: 500;
  transition: all 0.15s ease;
  border-left: 3px solid transparent;
  position: relative;
  white-space: nowrap;
}

.sidebar-nav a:hover {
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
}

.sidebar-nav a.active {
  background: rgba(59,130,246,0.13);
  color: #93c5fd;
  border-left-color: #3b82f6;
  font-weight: 600;
}

.sidebar-nav a svg { flex-shrink: 0; opacity: 0.85; }
.sidebar-nav a.active svg { opacity: 1; }

/* When collapsed: center nav links */
.sidebar.collapsed .sidebar-nav {
  padding: 12px 0;
  overflow-x: visible;
}
.sidebar.collapsed .sidebar-nav a {
  margin: 2px 8px;
  padding: 10px;
  justify-content: center;
  gap: 0;
  border-left: 3px solid transparent;
}
.sidebar.collapsed .sidebar-nav a.active {
  border-left-color: #3b82f6;
}

/* Collapsed nav item tooltips */
.sidebar.collapsed .sidebar-nav a::after {
  content: attr(data-tooltip);
  position: fixed;
  left: 74px;
  top: auto;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  transform: translateY(-50%);
  margin-top: 19px;
}
.sidebar.collapsed .sidebar-nav a:hover::after {
  opacity: 1;
}

/* Footer */
.sidebar-footer {
  padding: 12px 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar.collapsed .sidebar-footer {
  padding: 10px 8px 14px;
  align-items: center;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.sidebar-user:hover { background: rgba(255,255,255,0.05); }

.sidebar.collapsed .sidebar-user {
  padding: 8px;
  justify-content: center;
}

.user-avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: #1e40af;
  color: #93c5fd;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 0.7rem;
  color: #475569;
}

.tasks-btn {
  background: none;
  border: 1px solid #334155;
  border-radius: 5px;
  color: #64748b;
  padding: 4px 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.tasks-btn:hover { border-color: #64748b; color: #94a3b8; }

/* ── Main area ───────────────────────────── */
.main-area {
  margin-left: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.app.sidebar-collapsed .main-area {
  margin-left: 64px;
}

.main-content {
  flex: 1;
  padding: 28px 32px;
  background: #f8fafc;
}

/* Auto-collapse breakpoint */
@media (max-width: 1023px) {
  .sidebar { width: 64px; min-width: 64px; }
  .main-area { margin-left: 64px; }
  .sidebar .brand-text,
  .sidebar .nav-section-label,
  .sidebar .user-info,
  .sidebar .tasks-btn { display: none !important; }
  .sidebar .sidebar-brand {
    justify-content: center;
    padding: 18px 0;
    gap: 0;
    overflow: visible;
  }
  .sidebar .sidebar-toggle {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    padding: 0;
    justify-content: center;
  }
  .sidebar-nav a {
    margin: 2px 8px;
    padding: 10px;
    justify-content: center;
    gap: 0;
    position: relative;
  }
  .sidebar .sidebar-footer { padding: 10px 8px 14px; align-items: center; }
  .sidebar .sidebar-user { padding: 8px; justify-content: center; }
  .sidebar .sidebar-nav a::after {
    content: attr(data-tooltip);
    position: fixed;
    left: 74px;
    background: #1e293b;
    color: #e2e8f0;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 6px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateY(-50%);
    margin-top: 19px;
  }
  .sidebar .sidebar-nav a:hover::after { opacity: 1; }
}

/* ── Keep all existing global styles below ─ */
.page-header { margin-bottom: 1.5rem; }
.page-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}
.page-header p { color: #64748b; font-size: 0.938rem; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}
.stat-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}
.stat-value { font-size: 2.25rem; font-weight: 700; color: #0f172a; letter-spacing: -0.025em; }
.stat-card.warning .stat-value { color: #ea580c; }
.stat-card.success .stat-value { color: #059669; }
.stat-card.danger .stat-value  { color: #dc2626; }
.stat-card.info .stat-value    { color: #2563eb; }

.card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}
.card-title { font-size: 1.125rem; font-weight: 700; color: #0f172a; letter-spacing: -0.025em; }

.table-container { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
th { text-align: left; padding: 0.5rem 0.75rem; font-weight: 600; color: #475569; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
td { padding: 0.5rem 0.75rem; border-top: 1px solid #f1f5f9; color: #334155; font-size: 0.875rem; }
tbody tr { transition: background-color 0.15s ease; }
tbody tr:hover { background: #f8fafc; }

.badge {
  display: inline-block;
  padding: 0.313rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}
.badge.success    { background: #d1fae5; color: #065f46; }
.badge.warning    { background: #fed7aa; color: #92400e; }
.badge.danger     { background: #fecaca; color: #991b1b; }
.badge.info       { background: #dbeafe; color: #1e40af; }
.badge.increasing { background: #d1fae5; color: #065f46; }
.badge.decreasing { background: #fecaca; color: #991b1b; }
.badge.stable     { background: #e0e7ff; color: #3730a3; }
.badge.high       { background: #fecaca; color: #991b1b; }
.badge.medium     { background: #fed7aa; color: #92400e; }
.badge.low        { background: #dbeafe; color: #1e40af; }

.loading { text-align: center; padding: 3rem; color: #64748b; font-size: 0.938rem; }
.error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 1rem; border-radius: 8px; margin: 1rem 0; font-size: 0.938rem; }
</style>
