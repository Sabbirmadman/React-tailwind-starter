import "./App.css";
import AboutPage from "./pages/AboutPage";
import UserListPage from "./pages/UserListPage";
import UserDetailPage from "./pages/UserDetailPage";
import UserListPageCookie from "./pages/UserListPageCookie";
import UserDetailPageCookie from "./pages/UserDetailPageCookie";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import { Routes, Route } from "react-router-dom";
import { NavigationMenu } from "./components/NavigationMenu";
import { WindowStatus } from "./components/WindowStatus";
import { useWindowCommunication } from "./hooks/useWindowCommunication";
import HomePage from "./pages/HomePage";

function App() {
    const { windowContext } = useWindowCommunication();

    return (
        <div className="min-h-screen bg-gray-50">
            <NavigationMenu />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/users" element={<UserListPage />} />
                <Route path="/user-detail" element={<UserDetailPage />} />
                <Route path="/users-cookie" element={<UserListPageCookie />} />
                <Route
                    path="/user-detail-cookie"
                    element={<UserDetailPageCookie />}
                />
                <Route
                    path="/reports"
                    element={
                        <div className="p-8">
                            <h1 className="text-2xl font-bold">Reports Page</h1>
                            <p>Reporting dashboard would go here...</p>
                        </div>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <div className="p-8">
                            <h1 className="text-2xl font-bold">
                                Settings Page
                            </h1>
                            <p>Application settings would go here...</p>
                        </div>
                    }
                />
            </Routes>

            {/* Only show window status in main window */}
            {!windowContext?.isChildWindow && <WindowStatus />}
        </div>
    );
}

export default App;
