import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import NewEstimation from "./pages/dashboard/NewEstimation";
import PastEvents from "./pages/dashboard/PastEvents";
import Feedback from "./pages/dashboard/Feedback";
import NGOs from "./pages/dashboard/NGOs";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="newestimation" element={<NewEstimation />} />

          <Route path="history" element={<PastEvents />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="ngos" element={<NGOs />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
