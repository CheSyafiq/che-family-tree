# Project Standards: Flexible Vue 3 Admin Panel

You are an expert Vue 3 and Tailwind CSS developer. Follow these development standards for every code generation request in this project to ensure scalability and reusability.

## 1. Change Management & Logging
* **Activity Log**: Every time a logic change, feature addition, or bug fix is implemented, you must update the `CHANGELOG.md` file.
* **Format**: `[DATE] - [ACTION] - [SHORT DESCRIPTION]`.

## 2. Folder Structure & Component Architecture
Maintain strict separation of concerns to ensure the project remains "future-proof". The directory structure must follow this layout:

/src
  /assets
    /css (main.css with @apply)
  /components
    /ui (Atomic elements: Buttons, Inputs, Modals)
    /layout (Structural components: Navbar.vue, Sidebar.vue)
    /features (Complex business logic components)
  /layouts
    /AdminLayout.vue (Main wrapper)
  /composables (Reusable logic and state management)
  /views (Page components)

## 3. Reusable Templates (Custom Components)
When building the following, use *Props* and *Slots* to ensure they work across different projects:

### A. Date Template (Custom Date Formatter)
* Use `Intl.DateTimeFormat` or `date-fns`.
* Props must allow for format switching (e.g., 'DD-MM-YYYY', 'Relative Time', or 'Full Date').

### B. Custom Carousel
* Implementation: Pure Vue `ref` logic or a lightweight headless library.
* Must support `<slot>` for content flexibility (images, cards, or text).
* Include navigation controls (prev/next) and pagination indicators (dots).

## 4. Responsive Design Strategy
* **Mobile-First**: Styles must be written for mobile first, then scaled up.
* **Breakpoints**: Consistent use of Tailwind prefixes: `sm:`, `md:`, `lg:`, `xl:`.
* **Admin Behavior**: The Sidebar must be toggleable (collapsed/drawer mode) on mobile devices using a hamburger menu.

## 5. CSS Organization & Cleanliness
* **Tailwind Utility First**: Favor utility classes over custom `<style>` blocks.
* **Consistency**: Use the `@apply` directive in a global CSS file only for highly repetitive patterns.
* **Theming**: Reference the `primary`, `secondary`, and `accent` colors defined in `tailwind.config.js` to allow for easy rebranding.

## 6. Coding Requirements (Options API)
* **Syntax**: Use standard <script> block with **export default**.
* **Style**: Use **Options API** structure (data, methods, computed, props, mounted, etc.).
* **No setup()**: Do not use the `setup()` function or `<script setup>`.
* **Icons**: Use **Iconify** (@iconify/vue) as the universal icon library.
* **Self-Documenting**: Add brief JSDoc comments for Props and Emits.

## 7. Routing Standards (Vue Router)
* **Location**: All routes must be defined in `src/router/index.js`.
* **Lazy Loading**: Use dynamic imports for page components to optimize performance (e.g., `component: () => import('../views/Dashboard.vue')`).
* **Naming Convention**: Always use the `name` property for routes (PascalCase).
* **Navigation Guards**: Use meta fields for protected routes (e.g., `meta: { requiresAuth: true }`).
* **Nested Routes**: Admin pages should be nested under the `AdminLayout.vue` to maintain a consistent UI.

## 8. Communication Style
* **Clarification**: If an instruction is ambiguous, do not guess. Always ask for clarification.
* **Proactive Suggestions**: Suggest "future-proof" improvements when possible.

## 9. Chart & Data Visualization
* **Variety**: Provide multiple chart types (Bar, Line, Area, Pie/Donut).
* **Flexible Input**: Chart components must accept data objects via props for easy binding with API responses.
* **Library**: Use a flexible library like Chart.js or ApexCharts.

## 10. API Layer
* **Location**: All API calls must be organized in the src/api/ folder.
* **Modular**: Separate files for different services (e.g., userService.js).
* **Interceptors**: Use Axios interceptors for handling tokens and global errors.

## 11. Pagination Template
* **Functionality**: Must support dynamic "Items Per Page", "Current Page", and "Total Items".
* **Sync with API**: The component must emit events (like `page-changed`) so the parent component can re-fetch data from the API.
* **UI/UX**: Include "Next", "Previous", and specific page number buttons. Must be responsive (hide some page numbers on mobile).

## 12. Sidebar Menu Configuration
* **Location**: All sidebar menu structures must be stored in the `src/configs/` folder (e.g., `src/configs/dashboardSidebar.js`).
* **Multi-Role Support**: The configuration must export an object with keys representing different user roles (e.g., 'admin', 'vendor').
* **Data Structure**:
    * Each menu item must have a `title` and a `route`.
    * For nested menus, use a `sub` array containing sub-menu objects.
    * Include a `namespace` property (e.g., `/products/*`) for parent items to handle active state highlighting for all nested routes.
* **Flexibility**: This configuration should be the single source of truth for the `Sidebar.vue` component to loop through and render dynamically.

**as Example**
export default {
  admin: [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard-icon',
    },
    {
      title: 'Products',
      route: '/products',
      namespace: '/products/*',
      icon: 'products-icon',
      sub: [
        { title: 'All Products', route: '/products/all' },
        { title: 'Add Product', route: '/products/add' },
      ],
    },
    // More menu items...
  ],
  vendor: [
    {
      title: 'My Products',
      route: '/vendor/products',
      icon: 'vendor-products-icon',
    },
    // More menu items...
  ],
}

## 13. Universal Iconography (Iconify - Multi-set)
* **Library**: Use the <Icon /> component from @iconify/vue.
* **Usage**: You can mix icon sets. Use `heroicons:` prefix for Heroicons and `fa6-solid:` or `fa6-regular:` for Font Awesome.
* **Implementation**: Register the Icon component in the export default definition.

## 14. Dark Mode Support & Accessibility
* **Configuration**: Add `darkMode: 'class'` to `tailwind.config.js` to enable Tailwind's class-based dark mode strategy.
* **Implementation**: Use Tailwind's class strategy (toggle 'dark' class on `<html>` element).
* **State Management**: Create a `useDarkMode.js` composable in `src/composables/` that exports:
  * A reactive `darkModeState` object with an `isDark` boolean property
  * A `toggleDarkMode()` function that toggles the state, updates `document.documentElement.classList`, and saves to localStorage
  * An `initDarkMode()` function that reads from localStorage and applies the initial theme
* **Initialization**: Import and call `initDarkMode()` in `src/main.js` before mounting the app to prevent flash of unstyled content.
* **Color Palette**: Use the **slate color palette** for consistent dark mode:
  * **Dark Mode Backgrounds**: `bg-slate-900` (components), `bg-slate-950` (page backgrounds)
  * **Dark Mode Text**: `text-slate-100` (headings), `text-slate-200` (body), `text-slate-400` (muted)
  * **Dark Mode Borders**: `border-slate-800` (cards, dividers), `border-slate-700` (subtle borders)
  * **Light Mode Backgrounds**: `bg-white` (components), `bg-slate-50` (page backgrounds)
  * **Light Mode Text**: `text-slate-900` (headings), `text-slate-600` (body), `text-slate-500` (muted)
  * **Light Mode Borders**: `border-slate-200` (cards, dividers), `border-slate-300` (subtle borders)
* **High Contrast**: Ensure text in dark mode has high contrast against the background. Use `text-slate-100` or `text-slate-200` on `bg-slate-900`, and `text-slate-900` on `bg-white`. Avoid mid-tone grays that reduce readability.
* **Smooth Transitions**: Add `transition-colors` class to elements that change colors between themes for smooth visual transitions.
* **Toggle Component**: Provide a theme switcher in the Navbar using Iconify with sun (`heroicons:sun`) for dark mode and moon (`heroicons:moon`) for light mode icons.
* **Persistence**: Save user preference in localStorage with key `theme` and values `'dark'` or `'light'`.
* **Component Pattern**: In Options API components, import and use the composable:
  ```javascript
  import { darkModeState, toggleDarkMode } from '@/composables/useDarkMode'
  
  export default {
    data() {
      return {
        darkModeState
      }
    },
    computed: {
      isDark() {
        return this.darkModeState.isDark
      }
    },
    methods: {
      toggleDarkMode() {
        toggleDarkMode()
      }
    }
  }
  ```
* **All Components**: Ensure every component with colors includes both light and dark variants (e.g., `bg-white dark:bg-slate-900`, `text-slate-900 dark:text-slate-100`).

## 15. Reusable Chart Components (ApexCharts)
* **Location**: All chart components must be stored in `src/components/ui/` with the prefix "Apex" (e.g., `ApexBarChart.vue`, `ApexAreaChart.vue`).
* **Purpose**: Create reusable, API-ready chart components with built-in dark mode support and flexible data binding.
* **Library**: Use **ApexCharts** (vue3-apexcharts) for all chart visualizations.
* **Automatic Dark Mode**: All chart components must automatically respond to theme changes by importing and using `darkModeState` from `useDarkMode.js` composable.
* **Props-Based Configuration**: Chart components must accept all data and configuration via props for easy API integration:
  * `series` (required) - Chart data array
  * `categories` (optional) - X-axis labels/categories
  * `labels` (optional) - Data point labels
  * `colors` (optional) - Chart color palette with sensible defaults
  * `height` (optional) - Chart height (default: 280 or 320)
  * `yAxisFormatter` (optional) - Function to format Y-axis labels
  * `tooltipFormatter` (optional) - Function to format tooltip values
  * Additional chart-specific props for fine-tuning

* **Theme-Aware Colors**: Charts must dynamically adjust colors based on dark mode state:
  * **Text Colors**: `#94a3b8` (slate-400) for dark mode, `#64748b` (slate-500) for light mode
  * **Grid Colors**: `#334155` (slate-700) for dark mode, `#f1f5f9` (slate-100) for light mode
  * **Value Colors**: `#f1f5f9` (slate-100) for dark mode, `#1e293b` (slate-900) for light mode
  * **Tooltip Theme**: `'dark'` for dark mode, `'light'` for light mode

* **Standard Chart Types**:
  1. **ApexBarChart.vue** - Vertical bar charts for comparing categories
     * Props: series, categories, colors, height, yAxisFormatter, tooltipFormatter, columnWidth
     * Default color: `['#3C50E0']` (primary blue)
     
  2. **ApexAreaChart.vue** - Area/line charts with gradient fill for trends over time
     * Props: series, categories, colors, height, yAxisFormatter, tooltipFormatter, strokeWidth
     * Default color: `['#10B981']` (success green)
     * Features: Smooth curves, gradient fill
     
  3. **ApexRadialChart.vue** - Circular progress/gauge charts for percentage values
     * Props: series, labels, colors, height, hollowSize, valueFormatter
     * Default color: `['#3C50E0']` (primary blue)
     * Features: Percentage display in center
     
  4. **ApexDonutChart.vue** - Donut/pie charts for part-to-whole relationships
     * Props: series, labels, colors, height, donutSize, valueFormatter, totalLabel
     * Default colors: `['#3C50E0', '#10B981', '#F59E0B', '#EF4444']` (blue, green, yellow, red)
     * Features: Center total display, bottom legend

* **Component Structure** (Options API):
  ```javascript
  import { darkModeState } from '../../composables/useDarkMode'
  
  export default {
    name: 'ApexBarChart',
    props: {
      series: {
        type: Array,
        required: true
      },
      // ... other props
    },
    data() {
      return {
        darkModeState
      }
    },
    computed: {
      isDark() {
        return this.darkModeState.isDark
      },
      chartOptions() {
        return {
          // Dynamic options based on this.isDark
          chart: { background: 'transparent' },
          xaxis: {
            labels: {
              style: {
                colors: this.isDark ? '#94a3b8' : '#64748b'
              }
            }
          },
          // ... more theme-aware configurations
        }
      }
    }
  }
  ```

* **Usage Example** (API-Ready Pattern):
  ```vue
  <template>
    <ApexBarChart
      :series="salesData"
      :categories="months"
      :colors="['#3C50E0']"
      :yAxisFormatter="formatCurrency"
      :tooltipFormatter="formatTooltip"
      height="280"
    />
  </template>
  
  <script>
  import ApexBarChart from '@/components/ui/ApexBarChart.vue'
  
  export default {
    components: { ApexBarChart },
    data() {
      return {
        salesData: [],
        months: []
      }
    },
    methods: {
      formatCurrency(value) {
        return '$' + (value / 1000).toFixed(1) + 'K'
      },
      formatTooltip(value) {
        return '$' + value.toLocaleString()
      },
      async fetchChartData() {
        const response = await fetch('/api/sales')
        const data = await response.json()
        this.salesData = [{ name: 'Sales', data: data.values }]
        this.months = data.months
      }
    },
    mounted() {
      this.fetchChartData()
    }
  }
  </script>
  ```

* **Benefits**:
  * **Reusability**: Use the same chart component across multiple pages
  * **Consistency**: Uniform styling and behavior across all charts
  * **API Integration**: Simply pass API response data via props
  * **Maintainability**: Single source of truth for chart configurations
  * **Dark Mode**: Automatic theme switching without manual configuration
  * **Flexibility**: Customizable via props without modifying component code

## 16. Internationalization (i18n)
* **Location**: All translation files must be stored in `src/locales/` folder.
* **Purpose**: Enable multi-language support for the application with easy language switching.
* **State Management**: Create a `useLanguage.js` composable in `src/composables/` that exports:
  * A reactive `languageState` object with a `currentLang` property (default: 'en')
  * A `toggleLanguage()` function to switch between languages
  * A `setLanguage(lang)` function to set a specific language
  * An `initLanguage()` function that reads from localStorage and applies the initial language
* **Initialization**: Import and call `initLanguage()` in `src/main.js` before mounting the app.
* **Persistence**: Save user language preference in localStorage with key `language` and values like `'en'` (English) or `'ms'` (Malay).

* **Supported Languages**:
  * **English** (`en`) - Default language
  * **Malay** (`ms`) - Bahasa Melayu

* **Translation Files Structure**:
  ```javascript
  // src/locales/en.js
  export default {
    common: {
      search: 'Type to search...',
      save: 'Save',
      cancel: 'Cancel',
      // ... more common translations
    },
    navbar: {
      profile: 'My Profile',
      settings: 'Settings',
      logout: 'Log Out',
      // ... more navbar translations
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: "Welcome back...",
      // ... more dashboard translations
    }
    // ... more sections
  }
  ```

* **Translation Helper** (`src/locales/index.js`):
  * Export `translate(lang, key)` function that takes language code and dot-notation key path
  * Returns translated text or key if translation not found
  * Example: `translate('en', 'dashboard.title')` returns `'Dashboard'`

* **Component Pattern**: In Options API components, import and use the language system:
  ```javascript
  import { languageState } from '@/composables/useLanguage'
  import { translate } from '@/locales'
  
  export default {
    data() {
      return {
        languageState
      }
    },
    methods: {
      t(key) {
        return translate(this.languageState.currentLang, key)
      }
    }
  }
  ```

* **Template Usage**:
  ```vue
  <template>
    <h1>{{ t('dashboard.title') }}</h1>
    <p>{{ t('dashboard.subtitle') }}</p>
    <button :title="t('common.save')">{{ t('common.save') }}</button>
  </template>
  ```

* **Language Switcher in Navbar**:
  * Add language dropdown button with globe icon (`heroicons:language`)
  * Show current language code (EN/MS) on larger screens
  * Dropdown menu lists available languages with checkmark for active language
  * Clicking a language calls `setLanguage(lang)` and saves to localStorage
  * Menu automatically closes after selection

* **Naming Convention**:
  * Translation keys use dot notation: `section.subsection.key`
  * Keys are camelCase: `totalCustomers`, `fromLastMonth`, `recentOrders`
  * Group translations by feature/component: `common`, `navbar`, `dashboard`, `users`, `products`, etc.

* **Best Practices**:
  * Always use translation keys instead of hardcoded text in templates
  * Keep translation keys descriptive and organized by feature
  * Add new translation keys to ALL language files to maintain consistency
  * Use `common` section for shared translations across multiple components
  * Test all features in each supported language to ensure proper display
  * Consider text length differences between languages when designing UI (Malay text may be longer)

* **Adding New Languages**:
  1. Create new language file in `src/locales/` (e.g., `zh.js` for Chinese)
  2. Copy structure from `en.js` and translate all keys
  3. Import and add to translations object in `src/locales/index.js`
  4. Update `setLanguage()` function to include new language code
  5. Add language option to Navbar language switcher dropdown
  6. Update translations in `navbar.english`, `navbar.malay` for new language name

* **Benefits**:
  * **User Experience**: Users can view application in their preferred language
  * **Scalability**: Easy to add new languages by creating new translation files
  * **Maintainability**: Centralized translation management
  * **Consistency**: Single source of truth for all text content
  * **Flexibility**: Language switching without page reload
  * **Persistence**: User language preference saved across sessions