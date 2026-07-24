import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MenuLateral from "../components/layout/MenuLateral";

import DashboardPage from "../pages/Dashboard/DashboardPage";

import ProductsPage from "../pages/Products/ProductsPage";
import NewProductPage from "../pages/Products/NewProductPage";

import RatesPage from "../pages/Rates/RatesPage";

import SettingsPage from "../pages/Settings/SettingsPage";

import QuotesPage from "../pages/Quotes/QuotesPage";
import QuotesHistoryPage from "../pages/Quotes/QuotesHistoryPage";


import ClientsPage from "../pages/clientes/ClientsPage";
import QuoteDetailPage from "../pages/Quotes/QuoteDetailPage";


import NewClientPage from "../pages/clientes/NewClientPage";

import WorkOrdersPage from "../pages/WorkOrders/WorkOrdersPage";

import WorkOrderDetailPage from "../pages/WorkOrders/WorkOrderDetailPage";

import LoginPage from "../pages/Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import IncomeFormPage from "../pages/Administration/IncomeFormPage";

import IncomesPage from "../pages/Administration/IncomesPage";


function AppRouter() {

  return (
    <BrowserRouter>
      <div className="flex h-screen">

        <MenuLateral />

        <main className="flex-1 overflow-auto bg-slate-100 p-8">

          <Routes>

            <Route
  path="/login"
  element={<LoginPage />}
/>

           <Route
  path="/"
  element={<Navigate to="/login" replace />}
/>

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/ingresos"
  element={
    <ProtectedRoute>
      <IncomesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/ingresos/nuevo"
  element={
    <ProtectedRoute>
      <IncomeFormPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/ingresos/:id"
  element={
    <ProtectedRoute>
      <IncomeFormPage />
    </ProtectedRoute>
  }
/>

            {/* PRODUCTOS */}

            <Route
              path="/productos"
              element={<ProductsPage />}
            />

            <Route
              path="/productos/nuevo"
              element={<NewProductPage />}
            />

            <Route
              path="/productos/:id"
              element={<NewProductPage />}
            />

            {/* COTIZACIONES */}

            {/* CLIENTES */}

<Route
  path="/clientes"
  element={<ClientsPage />}
/>

<Route
  path="/clientes/nuevo"
  element={<NewClientPage />}
/>

<Route
  path="/clientes/:id"
  element={<NewClientPage />}
/>

            <Route
              path="/cotizaciones"
              element={<QuotesHistoryPage />}
            />

            <Route
              path="/cotizaciones/nueva"
              element={<QuotesPage />}
            />
            <Route
             path="/cotizaciones/nueva"
            element={<QuotesPage />}
            />
<Route
  path="/cotizaciones/:id"
  element={<QuoteDetailPage />}
/>
{/* ÓRDENES DE TRABAJO */}

<Route
  path="/ordenes-trabajo"
  element={<WorkOrdersPage />}
/>
<Route
  path="/ordenes-trabajo/:id"
  element={<WorkOrderDetailPage />}
/>
            {/* CLIENTES */}

            <Route
              path="/clientes"
              element={<ClientsPage />}
            />

            {/* TASAS */}

            <Route
              path="/tasas"
              element={<RatesPage />}
            />

            {/* CONFIGURACIÓN */}

            <Route
              path="/configuracion"
              element={<SettingsPage />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default AppRouter;