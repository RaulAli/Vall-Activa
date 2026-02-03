import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./features/ui/Layout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AthleteDashboard from "./pages/AthleteDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";

import RoutesListPage from "./pages/RoutesListPage";
import RouteDetailPage from "./pages/RouteDetailPage";
import CreateRoutePage from "./pages/CreateRoutePage";

import BusinessesListPage from "./pages/BusinessesListPage";
import BusinessDetailPage from "./pages/BusinessDetailPage";
import BusinessCreatePage from "./pages/BusinessCreatePage";
import BusinessEditPage from "./pages/BusinessEditPage";

import OffersListPage from "./pages/OffersListPage";
import OfferDetailPage from "./pages/OfferDetailPage";
import OfferCreatePage from "./pages/OfferCreatePage";
import OfferEditPage from "./pages/OfferEditPage";
import ManageOffersPage from "./pages/ManageOffersPage";

import AthleteLoginPage from "./pages/AthleteLoginPage";
import AthleteRegisterPage from "./pages/AthleteRegisterPage";
import BusinessLoginPage from "./pages/BusinessLoginPage";
import BusinessRegisterPage from "./pages/BusinessRegisterPage";
import MissionsPage from "./pages/MissionsPage";
import MyCouponsPage from "./pages/MyCouponsPage";
import AthleteProfilePage from "./pages/AthleteProfilePage";

import RequireRole from "./features/auth/components/RequireRole";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />

        {/* Auth (Public but usually redirected if logged in) */}
        <Route path="/athlete/login" element={<AthleteLoginPage />} />
        <Route path="/athlete/register" element={<AthleteRegisterPage />} />
        <Route path="/business/login" element={<BusinessLoginPage />} />
        <Route path="/business/register" element={<BusinessRegisterPage />} />

        {/* Athlete specific routes */}
        <Route
          path="/athlete/dashboard"
          element={
            <RequireRole allow={["ATHLETE", "ATHLETE_VIP"]}>
              <AthleteDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/athlete/missions"
          element={
            <RequireRole allow={["ATHLETE", "ATHLETE_VIP"]}>
              <MissionsPage />
            </RequireRole>
          }
        />
        <Route
          path="/athlete/coupons"
          element={
            <RequireRole allow={["ATHLETE", "ATHLETE_VIP"]}>
              <MyCouponsPage />
            </RequireRole>
          }
        />
        <Route
          path="/athlete/profile"
          element={
            <RequireRole allow={["ATHLETE", "ATHLETE_VIP"]}>
              <AthleteProfilePage />
            </RequireRole>
          }
        />
        <Route path="/routes/new" element={<CreateRoutePage />} />
        <Route path="/routes/:id" element={<RouteDetailPage />} />
        {/* Legacy access but logically managed from dashboard */}
        <Route path="/routes" element={<Navigate to="/athlete/dashboard" replace />} />

        {/* Business specific routes */}
        <Route
          path="/business/dashboard"
          element={
            <RequireRole allow={["BUSINESS"]}>
              <BusinessDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/business/offers"
          element={
            <RequireRole allow={["BUSINESS"]}>
              <ManageOffersPage />
            </RequireRole>
          }
        />
        {/* Management routes */}
        <Route
          path="/businesses"
          element={
            <RequireRole allow={["ADMIN"]}>
              <BusinessesListPage />
            </RequireRole>
          }
        />
        <Route path="/businesses/new" element={<BusinessCreatePage />} />
        <Route path="/businesses/:id" element={<BusinessDetailPage />} />
        <Route path="/businesses/:id/edit" element={<BusinessEditPage />} />
        <Route
          path="/offers"
          element={
            <RequireRole allow={["ADMIN"]}>
              <OffersListPage />
            </RequireRole>
          }
        />
        <Route path="/offers/new" element={<OfferCreatePage />} />
        <Route path="/offers/:id" element={<OfferDetailPage />} />
        <Route path="/offers/:id/edit" element={<OfferEditPage />} />

        {/* Admin Section */}
        <Route
          path="/admin"
          element={
            <RequireRole allow={["ADMIN"]}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
                <p>Aquí puedes gestionar todos los usuarios, negocios y ofertas del sistema.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => window.location.href = '/businesses'} className="p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 border border-slate-100 transition-all text-left">
                    <p className="font-bold">Gestionar Negocios</p>
                    <p className="text-sm text-slate-500">Aprobar o rechazar nuevos perfiles.</p>
                  </button>
                  <button onClick={() => window.location.href = '/offers'} className="p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 border border-slate-100 transition-all text-left">
                    <p className="font-bold">Gestionar Ofertas</p>
                    <p className="text-sm text-slate-500">Moderación de contenido promocional.</p>
                  </button>
                </div>
              </div>
            </RequireRole>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<div className="p-20 text-center"><h1 className="text-9xl font-black text-slate-100">404</h1><p className="text-slate-500">Página no encontrada</p></div>} />
      </Routes>
    </Layout>
  );
}
