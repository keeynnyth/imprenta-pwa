# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.



```


```
imprenta-pwa
├─ .oxlintrc.json
├─ docs
│  ├─ 01-Requisitos.md
│  ├─ 02-Arquitectura.md
│  ├─ 03-BaseDatos.md
│  └─ Decisiones.md
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ src
│  ├─ api
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  ├─ hero.png
│  │  ├─ images
│  │  │  ├─ fachada.jpg
│  │  │  ├─ logo-redondo.png
│  │  │  └─ logo.png
│  │  ├─ react.svg
│  │  └─ vite.svg
│  ├─ components
│  │  ├─ clients
│  │  │  └─ ClientSelector.tsx
│  │  ├─ common
│  │  ├─ forms
│  │  ├─ layout
│  │  │  └─ MenuLateral.tsx
│  │  ├─ quotes
│  │  │  ├─ QuoteItem.tsx
│  │  │  └─ QuotePdf.ts
│  │  └─ ui
│  │     └─ Modal.tsx
│  ├─ config
│  │  └─ supabase.ts
│  ├─ contexts
│  ├─ hooks
│  ├─ index.css
│  ├─ interfaces
│  │  └─ orden-trabajo.interface.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ clientes
│  │  │  ├─ ClientsPage.tsx
│  │  │  └─ NewClientPage.tsx
│  │  ├─ Dashboard
│  │  │  └─ DashboardPage.tsx
│  │  ├─ Login
│  │  ├─ Products
│  │  │  ├─ NewProductPage.tsx
│  │  │  ├─ ProductRow.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  └─ ProductsTable.tsx
│  │  ├─ Quotes
│  │  │  ├─ QuoteDetailPage.tsx
│  │  │  ├─ QuotesHistoryPage.tsx
│  │  │  └─ QuotesPage.tsx
│  │  ├─ Rates
│  │  │  └─ RatesPage.tsx
│  │  ├─ Settings
│  │  │  └─ SettingsPage.tsx
│  │  └─ WorkOrders
│  │     ├─ WorkOrderDetailPage.tsx
│  │     └─ WorkOrdersPage.tsx
│  ├─ routes
│  │  └─ AppRouter.tsx
│  ├─ services
│  │  ├─ clientes.service.ts
│  │  ├─ ordenes-trabajo.service.ts
│  │  ├─ products.service.ts
│  │  ├─ quotes.service.ts
│  │  └─ rates.service.ts
│  ├─ styles
│  ├─ types
│  │  └─ producto.ts
│  └─ utils
├─ supabase
│  ├─ .temp
│  │  ├─ gotrue-version
│  │  ├─ linked-project.json
│  │  ├─ pooler-url
│  │  ├─ postgres-version
│  │  ├─ project-ref
│  │  ├─ rest-version
│  │  ├─ storage-migration
│  │  └─ storage-version
│  ├─ config.toml
│  └─ functions
│     └─ actualizar-tasas
│        ├─ .npmrc
│        ├─ bcv.ts
│        ├─ binance.ts
│        ├─ deno.json
│        └─ index.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```