import React from "react";
import { useWindowManager } from "../hooks/useWindowManager";
import { useWindowCommunication } from "../hooks/useWindowCommunication";
import { useNavigate } from "react-router-dom";

export interface MenuItem {
    id: string;
    label: string;
    type: "menu" | "detail" | "navigate"; // Added "navigate" type for normal routing
    context: string;
    url?: string;
}

const defaultMenuItems: MenuItem[] = [
    {
        id: "home",
        label: "Home",
        type: "navigate", // Normal navigation
        context: "home",
        url: "/",
    },
    {
        id: "product-list",
        label: "Products",
        type: "navigate", // Normal navigation
        context: "product-list",
        url: "/products",
    },
    {
        id: "orders",
        label: "Orders",
        type: "navigate", // Normal navigation
        context: "orders",
        url: "/orders",
    },
    {
        id: "user-list",
        label: "Users",
        type: "menu", // Tab management
        context: "user-list",
        url: "/users",
    },
    {
        id: "user-list-cookie",
        label: "Users (Cookie)",
        type: "menu", // Tab management with cookie sync
        context: "user-list-cookie",
        url: "/users-cookie",
    },
    {
        id: "reports",
        label: "Reports",
        type: "menu", // Tab management
        context: "reports",
        url: "/reports",
    },
    {
        id: "settings",
        label: "Settings",
        type: "menu", // Tab management
        context: "settings",
        url: "/settings",
    },
];

interface NavigationMenuProps {
    menuItems?: MenuItem[];
    className?: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
    menuItems = defaultMenuItems,
    className = "",
}) => {
    const { openMenuWindow, openDetailWindow, windows } = useWindowManager();
    const { windowContext } = useWindowCommunication();
    const navigate = useNavigate();

    const handleMenuClick = (item: MenuItem) => {
        if (item.type === "navigate") {
            // Normal React Router navigation - stay in same tab
            navigate(item.url || "/");
        } else if (item.type === "menu") {
            // Tab management - open in new tab or focus existing
            openMenuWindow(item.context, item.url);
        } else if (item.type === "detail" && item.id) {
            // Detail tab management
            openDetailWindow(item.context, item.id, item.url);
        }
    };

    const isTabOpen = (item: MenuItem) => {
        // Only check for tab status if it's a tab-managed item
        if (item.type !== "menu" && item.type !== "detail") return false;

        const windowName =
            item.type === "menu"
                ? `menu:${item.context}`
                : `${item.context}:${item.id}`;
        return windows.some((w) => w.name === windowName);
    };

    return (
        <nav className={`bg-white shadow-lg ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-800">
                                Multi-Tab App
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {menuItems.map((item) => {
                                const isOpen = isTabOpen(item);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleMenuClick(item)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                            isOpen
                                                ? "bg-primary text-white shadow-md"
                                                : "text-gray-700 hover:text-primary hover:bg-gray-100"
                                        }`}
                                        title={
                                            item.type === "navigate"
                                                ? `Navigate to ${item.label}`
                                                : isOpen
                                                ? `${item.label} (Tab Open)`
                                                : `Open ${item.label} in new tab`
                                        }
                                    >
                                        {item.label}
                                        {isOpen && (
                                            <span className="ml-2 inline-block w-2 h-2 bg-white rounded-full opacity-75"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab info for debugging */}
                    {windowContext && (
                        <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-2">
                                {windowContext.isChildWindow
                                    ? "Child Tab"
                                    : "Main Tab"}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded">
                                {windowContext.windowName}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
