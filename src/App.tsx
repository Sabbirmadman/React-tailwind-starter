import "./App.css";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import UserListPage from "./pages/UserListPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserPostsPage from "./pages/UserPostsPage";
import PostsPage from "./pages/PostsPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import PhotoGalleryPage from "./pages/PhotoGalleryPage";
import MainLayout from "./components/MainLayout";
import { Routes, Route } from "react-router-dom";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import PhotoDetailPage from "./pages/PhotoDetailPage";
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
                <Route path="/user-posts/:userId" element={<UserPostsPage />} />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="/post-details/:postId" element={<PostDetailsPage />} />
                <Route path="/photos" element={<PhotoGalleryPage />} />
                <Route path="/album/:albumId" element={<AlbumDetailPage />} />
                <Route path="/photo/:photoId" element={<PhotoDetailPage />} />
                <Route path="/todos" element={<TodoListPage />} />
                <Route path="/todo/:todoId" element={<TodoDetailPage />} />
                <Route path="/user-todos/:userId" element={<UserTodosPage />} />
                <Route path="/docs/:docType" element={<DocumentationPage />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
