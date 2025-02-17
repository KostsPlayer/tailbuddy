import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import useLoadable from "./hooks/useLoadable";
import SearchProvider from "./context/search/SearchProvider";
import DashboardCoreProvider from "./context/dashboardCore/DashboardCoreProvider";
import LandingCoreProvider from "./context/landingCore/LandingCoreProvider";
import { Error404, Error401, Error403 } from "./pages/Error/Error";

const Loader = useLoadable(
  lazy(() => import("./components/loader/LoaderProgress"))
);
const Home = useLoadable(lazy(() => import("./pages/home/Home")));
const Dashboard = useLoadable(
  lazy(() => import("./pages/dashboard/Dashboard"))
);
const BusinessMan = useLoadable(
  lazy(() => import("./pages/businessMan/BusinessMan"))
);
const BusinessCategoryMan = useLoadable(
  lazy(() => import("./pages/businessCategoryMan/BusinessCategoryMan"))
);
const PetsCategoryMan = useLoadable(
  lazy(() => import("./pages/petsCategoryMan/PetsCategoryMan"))
);
const UsersMan = useLoadable(lazy(() => import("./pages/usersMan/UsersMan")));
const PetsMan = useLoadable(lazy(() => import("./pages/petsMan/PetsMan")));
const ProductsMan = useLoadable(
  lazy(() => import("./pages/productsMan/ProductsMan"))
);
const GroomingServicesMan = useLoadable(
  lazy(() => import("./pages/groomingServicesMan/GroomingServicesMan"))
);
const PhotographyServicesMan = useLoadable(
  lazy(() => import("./pages/photographyServicesMan/PhotographyServicesMan"))
);
const Auth = useLoadable(lazy(() => import("./pages/auth/Auth")));
const ChooseRole = useLoadable(
  lazy(() => import("./pages/chooseRole/ChooseRole"))
);

import "./main.css";

const DashboardCore = () => {
  return (
    <DashboardCoreProvider>
      <Outlet />
    </DashboardCoreProvider>
  );
};

const LandingCore = () => {
  return (
    <LandingCoreProvider>
      <Outlet />
    </LandingCoreProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          <Route path="/loader" element={<Loader />} />
          <Route element={<LandingCore />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<Error404 />} />
          <Route path="/403" element={<Error403 />} />
          <Route path="/401" element={<Error401 />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth signup />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route element={<DashboardCore />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users-management" element={<UsersMan />} />
            <Route path="/pets" element={<PetsMan />} />
            <Route path="/pet-categories" element={<PetsCategoryMan />} />
            <Route path="/products" element={<ProductsMan />} />
            <Route path="/business" element={<BusinessMan />} />
            <Route
              path="/business-category"
              element={<BusinessCategoryMan />}
            />
            <Route
              path="/grooming-services"
              element={<GroomingServicesMan />}
            />
            <Route
              path="/photography-services"
              element={<PhotographyServicesMan />}
            />
          </Route>
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  </StrictMode>
);
