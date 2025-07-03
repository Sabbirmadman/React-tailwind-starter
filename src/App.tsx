import "./App.css";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import UserListPage from "./pages/UserListPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import MainLayout from "./components/MainLayout";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/users" element={<UserListPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/user-details" element={<UserDetailsPage />} />
                <Route
                    path="/user-details/:userId"
                    element={<UserDetailsPage />}
                />
            </Routes>
        </MainLayout>
    );
}

export default App;
