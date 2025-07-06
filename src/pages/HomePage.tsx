import React from "react";
import { useTabManagement } from "../utils/tabManagement";

const HomePage: React.FC = () => {
    const { handleTabNavigation, handleTabNavigationWithData } =
        useTabManagement();

    // Function to open documentation using tab management
    const openDocumentation = (docType: string) => {
        const path = `/docs/${docType}`;
        const data = { docType, openedAt: new Date().toISOString() };
        handleTabNavigationWithData(path, data, "_documentation")();
    };

    const demoPages = [
        {
            title: "User Management",
            description: "CRUD operations with user data and form handling",
            path: "/users",
            icon: "👥",
            category: "Core Features",
        },
        {
            title: "Blog Posts",
            description: "External API integration with JSONPlaceholder API",
            path: "/posts",
            icon: "📝",
            category: "API Integration",
        },
        {
            title: "Photo Gallery",
            description: "Media handling with albums and image displays",
            path: "/photos",
            icon: "📸",
            category: "Media",
        },
        {
            title: "Product Catalog",
            description: "Product listing with detail views",
            path: "/products",
            icon: "🛍️",
            category: "E-commerce",
        },
    ];

    const features = [
        "🔗 Cross-tab data passing",
        "👁️ Visual tab tracking",
        "🗑️ Easy tab management",
        "💾 Persistent storage",
        "🚀 Zero dependencies",
        "⚡ Lightweight & fast",
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
                padding: "20px",
            }}
        >
            {/* Hero Section */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "40px",
                    padding: "40px 20px",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h1
                    style={{
                        fontSize: "42px",
                        marginBottom: "15px",
                        color: "#333",
                        fontWeight: "bold",
                    }}
                >
                    🚀 Tab Management System
                </h1>
                <p
                    style={{
                        fontSize: "18px",
                        color: "#666",
                        maxWidth: "600px",
                        margin: "0 auto 30px auto",
                        lineHeight: "1.6",
                    }}
                >
                    A powerful React system for managing multiple browser tabs
                    with data passing, visual tracking, and seamless navigation.
                    Perfect for complex applications that need multi-window
                    workflows.
                </p>

                {/* Features Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "15px",
                        marginTop: "30px",
                        maxWidth: "800px",
                        margin: "30px auto 0 auto",
                    }}
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#495057",
                                border: "1px solid #e9ecef",
                            }}
                        >
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            {/* Demo Pages Section */}
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h2
                    style={{
                        fontSize: "32px",
                        marginBottom: "30px",
                        color: "#333",
                        textAlign: "center",
                    }}
                >
                    🎯 Demo Pages
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "25px",
                        marginBottom: "40px",
                    }}
                >
                    {demoPages.map((page, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                padding: "25px",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                border: "1px solid #e9ecef",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-5px)";
                                e.currentTarget.style.boxShadow =
                                    "0 8px 25px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 2px 10px rgba(0,0,0,0.1)";
                            }}
                            onClick={handleTabNavigation(page.path)}
                        >
                            <div
                                style={{
                                    fontSize: "40px",
                                    marginBottom: "15px",
                                    textAlign: "center",
                                }}
                            >
                                {page.icon}
                            </div>

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#007bff",
                                    fontWeight: "500",
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {page.category}
                            </div>

                            <h3
                                style={{
                                    fontSize: "20px",
                                    marginBottom: "10px",
                                    color: "#333",
                                    fontWeight: "600",
                                }}
                            >
                                {page.title}
                            </h3>

                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    lineHeight: "1.5",
                                    margin: "0 0 15px 0",
                                }}
                            >
                                {page.description}
                            </p>

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#007bff",
                                    fontWeight: "500",
                                    textAlign: "center",
                                    padding: "8px 0",
                                    borderTop: "1px solid #f0f0f0",
                                }}
                            >
                                Click to open in new tab →
                            </div>
                        </div>
                    ))}
                </div>

                {/* Implementation Guide Section */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "30px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        textAlign: "center",
                        border: "1px solid #e9ecef",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "24px",
                            marginBottom: "15px",
                            color: "#333",
                        }}
                    >
                        📚 Implementation Guide
                    </h2>
                    <p
                        style={{
                            fontSize: "16px",
                            color: "#666",
                            marginBottom: "20px",
                            lineHeight: "1.6",
                        }}
                    >
                        Ready to integrate this system into your project? Check
                        out our comprehensive guides:
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            onClick={() => openDocumentation("quick-setup")}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                border: "none",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#0056b3";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#007bff";
                            }}
                        >
                            📋 QUICK_SETUP.md
                        </button>
                        <button
                            onClick={() =>
                                openDocumentation("implementation-guide")
                            }
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                border: "none",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#1e7e34";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#28a745";
                            }}
                        >
                            📖 IMPLEMENTATION_GUIDE.md
                        </button>
                    </div>
                </div>

                {/* How to Use Section */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "30px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        marginTop: "25px",
                        border: "1px solid #e9ecef",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "24px",
                            marginBottom: "20px",
                            color: "#333",
                            textAlign: "center",
                        }}
                    >
                        🎮 How to Test the Demo
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    fontSize: "30px",
                                    marginBottom: "10px",
                                }}
                            >
                                1️⃣
                            </div>
                            <h4 style={{ color: "#333", marginBottom: "8px" }}>
                                Click Demo Pages
                            </h4>
                            <p style={{ fontSize: "14px", color: "#666" }}>
                                Click any demo page above to open it in a new
                                browser tab
                            </p>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    fontSize: "30px",
                                    marginBottom: "10px",
                                }}
                            >
                                2️⃣
                            </div>
                            <h4 style={{ color: "#333", marginBottom: "8px" }}>
                                Watch the Tracker
                            </h4>
                            <p style={{ fontSize: "14px", color: "#666" }}>
                                See the floating tracker widget in the
                                bottom-left corner
                            </p>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    fontSize: "30px",
                                    marginBottom: "10px",
                                }}
                            >
                                3️⃣
                            </div>
                            <h4 style={{ color: "#333", marginBottom: "8px" }}>
                                Test Data Passing
                            </h4>
                            <p style={{ fontSize: "14px", color: "#666" }}>
                                Click items in lists to see data passed between
                                tabs
                            </p>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    fontSize: "30px",
                                    marginBottom: "10px",
                                }}
                            >
                                4️⃣
                            </div>
                            <h4 style={{ color: "#333", marginBottom: "8px" }}>
                                Manage Tabs
                            </h4>
                            <p style={{ fontSize: "14px", color: "#666" }}>
                                Use the tracker to switch between or close tabs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
