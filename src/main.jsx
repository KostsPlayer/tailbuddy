import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import BusinessMan from "./pages/businessMan/BusinessMan";
import BusinessCategoryMan from "./pages/businessCategoryMan/BusinessCategoryMan";
import UsersMan from "./pages/usersMan/UsersMan";
import PetsMan from "./pages/petsMan/PetsMan";
import ProductsMan from "./pages/productsMan/ProductsMan";
import { Login, Signup } from "./pages/auth/Auth";
import { Error404, Error401, Error403 } from "./pages/Error/Error";
import "./main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="/401" element={<Error401 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users-management" element={<UsersMan />} />
        <Route path="/pets" element={<PetsMan />} />
        <Route path="/products" element={<ProductsMan />} />
        <Route path="/business" element={<BusinessMan />} />
        <Route path="/business-category" element={<BusinessCategoryMan />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
