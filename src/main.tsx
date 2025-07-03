import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Import demo utilities for development
import "./utils/demo.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>

    // </React.StrictMode>
);
