import "./App.css";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import UserListPage from "./pages/UserListPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import MainLayout from "./components/MainLayout";
import { Routes, Route } from "react-router-dom";
import TodoListPage from "./pages/TodoListPage";
import TodoDetailPage from "./pages/TodoDetailPage";
import UserTodosPage from "./pages/UserTodosPage";
import DocumentationPage from "./pages/DocumentationPage";

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
                <Route path="/todos" element={<TodoListPage />} />
                <Route path="/todo/:todoId" element={<TodoDetailPage />} />
                <Route path="/user-todos/:userId" element={<UserTodosPage />} />
                <Route path="/docs/:docType" element={<DocumentationPage />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
