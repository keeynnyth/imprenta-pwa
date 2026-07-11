
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MenuLateral from "../components/layout/MenuLateral";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProductsPage from "../pages/Products/ProductsPage";
import NewProductPage from "../pages/Products/NewProductPage";
import RatesPage from "../pages/Rates/RatesPage";
import SettingsPage from "../pages/Settings/SettingsPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">

        <MenuLateral />

        <main className="flex-1 overflow-auto bg-slate-100 p-8">

          <Routes>
            <Route path="/" element={<DashboardPage />} />

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

            <Route
              path="/tasas"
              element={<RatesPage />}
            />

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