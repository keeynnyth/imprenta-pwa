import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import ProtectedLayout from "../components/layout/ProtectedLayout";

import LoginPage from "../pages/Login/LoginPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";

import ProductsPage from "../pages/Products/ProductsPage";
import NewProductPage from "../pages/Products/NewProductPage";

import QuotesHistoryPage from "../pages/Quotes/QuotesHistoryPage";
import QuotesPage from "../pages/Quotes/QuotesPage";
import QuoteDetailPage from "../pages/Quotes/QuoteDetailPage";

import ClientsPage from "../pages/clientes/ClientsPage";
import NewClientPage from "../pages/clientes/NewClientPage";

import WorkOrdersPage from "../pages/WorkOrders/WorkOrdersPage";
import WorkOrderDetailPage from "../pages/WorkOrders/WorkOrderDetailPage";

import RatesPage from "../pages/Rates/RatesPage";
import SettingsPage from "../pages/Settings/SettingsPage";

import IncomesPage from "../pages/Administration/IncomesPage";
import IncomeFormPage from "../pages/Administration/IncomeFormPage";

import ExpensesPage from "../pages/Administration/ExpensesPage";
import ExpenseFormPage from "../pages/Administration/ExpenseFormPage";
import UsersPage from "../pages/Administration/UsersPage";
import UserFormPage from "../pages/Administration/UserFormPage";
import AdminRoute from "./AdminRoute";
import FinanceDashboardPage from "../pages/Administration/FinanceDashboardPage";
import FinanceMovementsPage from "../pages/Administration/FinanceMovementsPage";
import FinanceNewMovementPage from "../pages/Administration/FinanceNewMovementPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

       {/* Rutas públicas */}
<Route path="/login" element={<LoginPage />} />
<Route
  path="/reset-password"
  element={<ResetPasswordPage />}
/>
<Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Productos */}
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/nuevo" element={<NewProductPage />} />
          <Route path="/productos/:id" element={<NewProductPage />} />

          {/* Clientes */}
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/clientes/nuevo" element={<NewClientPage />} />
          <Route path="/clientes/:id" element={<NewClientPage />} />

          {/* Cotizaciones */}
          <Route path="/cotizaciones" element={<QuotesHistoryPage />} />
          <Route path="/cotizaciones/nueva" element={<QuotesPage />} />
          <Route path="/cotizaciones/:id" element={<QuoteDetailPage />} />

          {/* Órdenes de trabajo */}
          <Route path="/ordenes-trabajo" element={<WorkOrdersPage />} />
          <Route path="/ordenes-trabajo/:id" element={<WorkOrderDetailPage />} />

          {/* Tasas */}
          <Route path="/tasas" element={<RatesPage />} />

          {/* Configuración */}
          <Route path="/configuracion" element={<SettingsPage />} />
          {/* Finanzas */}
<Route
  path="/finanzas"
  element={
    <AdminRoute>
      <FinanceDashboardPage />
    </AdminRoute>
  }
/>
<Route
  path="/finanzas/movimientos"
  element={
    <AdminRoute>
      <FinanceMovementsPage />
    </AdminRoute>
  }
/>

<Route
  path="/movimientos/nuevo"
  element={
    <AdminRoute>
      <FinanceNewMovementPage />
    </AdminRoute>
  }
/>

          {/* Ingresos */}
         <Route
  path="/ingresos"
  element={
    <AdminRoute>
      <IncomesPage />
    </AdminRoute>
  }
/>

<Route
  path="/ingresos/nuevo"
  element={
    <AdminRoute>
      <IncomeFormPage />
    </AdminRoute>
  }
/>

<Route
  path="/usuarios/:id"
  element={
    <AdminRoute>
      <UserFormPage />
    </AdminRoute>
  }
/>

<Route
  path="/ingresos/:id"
  element={
    <AdminRoute>
      <IncomeFormPage />
    </AdminRoute>
  }
/>

          {/* Egresos */}
         <Route
  path="/egresos"
  element={
    <AdminRoute>
      <ExpensesPage />
    </AdminRoute>
  }
/>

<Route
  path="/egresos/nuevo"
  element={
    <AdminRoute>
      <ExpenseFormPage />
    </AdminRoute>
  }
/>

<Route
  path="/egresos/:id"
  element={
    <AdminRoute>
      <ExpenseFormPage />
    </AdminRoute>
  }
/>
        </Route>

                  {/* Usuarios */}
          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/usuarios/nuevo"
            element={
              <AdminRoute>
                <UserFormPage />
              </AdminRoute>
            }
          />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;