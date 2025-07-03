/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useLocation } from "react-router-dom";
import {
    TabManager,
    createTabManager,
    TabStorage,
    WindowManagement,
    TabNavigation,
    TabDisplay,
    StoredTabs,
    TabInfo,
} from "..";

export const useTabManagement = () => {
    const location = useLocation();
    const [trackedTabs, setTrackedTabs] = React.useState<StoredTabs>({});

    // Create instances of our utilities
    const windowManager = React.useMemo(() => new WindowManagement(), []);
    const tabNavigation = React.useMemo(
        () => new TabNavigation(windowManager),
        [windowManager]
    );
    const tabDisplay = React.useMemo(() => new TabDisplay(), []);
    const tabManager = React.useMemo(() => createTabManager(), []);

    // Function to refresh tracked tabs
    const refreshTrackedTabs = React.useCallback(() => {
        const stored = TabStorage.getStoredTabs();
        setTrackedTabs(stored);
    }, []);

    // Handle tab navigation (simple version)
    const handleTabNavigation = React.useCallback(
        (path: string) => (e: React.MouseEvent) => {
            e.preventDefault();
            tabNavigation.handleNavigation({
                path,
            });
            refreshTrackedTabs();
        },
        [tabNavigation, refreshTrackedTabs]
    );

    // Handle tab navigation with data
    const handleTabNavigationWithData = React.useCallback(
        (path: string, data?: any, pageType?: string) =>
            (e?: React.MouseEvent) => {
                if (e) e.preventDefault();

                tabNavigation.handleNavigation({
                    path,
                    data,
                    pageType,
                });
                refreshTrackedTabs();
            },
        [tabNavigation, refreshTrackedTabs]
    );

    // Remove tracked window
    const removeTrackedWindow = React.useCallback(
        (tabKey: string) => {
            tabManager.removeTrackedWindow(tabKey);
            refreshTrackedTabs();
        },
        [tabManager, refreshTrackedTabs]
    );

    // Get tab display name
    const getTabDisplayName = React.useCallback(
        (tabKey: string): string => {
            return tabDisplay.getTabDisplayName(tabKey);
        },
        [tabDisplay]
    );

    // Track current page navigation
    React.useEffect(() => {
        const currentPath = location.pathname;

        // Determine tab key and page type
        let tabKey: string;
        let pageType: string | undefined;

        if (currentPath.includes("/user-details")) {
            tabKey = "current_user_details";
            pageType = "_user_details";
        } else {
            tabKey = `current${currentPath.replace(/\//g, "_")}`;
        }

        // Update stored tabs to track current page
        TabStorage.updateStoredTabs(tabKey, "add", {
            url: `${window.location.origin}${currentPath}`,
            type: "internal",
            pageType: pageType,
        });

        refreshTrackedTabs();

        return () => {
            // Cleanup when navigating away
            setTimeout(() => {
                if (location.pathname !== currentPath) {
                    TabStorage.updateStoredTabs(tabKey, "remove");
                    refreshTrackedTabs();
                }
            }, 100);
        };
    }, [location.pathname, refreshTrackedTabs]);

    // Initialize and setup event listeners
    React.useEffect(() => {
        refreshTrackedTabs();

        const handleTabsUpdated = () => {
            refreshTrackedTabs();
        };

        window.addEventListener("tabsUpdated", handleTabsUpdated);

        return () => {
            window.removeEventListener("tabsUpdated", handleTabsUpdated);
        };
    }, [refreshTrackedTabs]);

    return {
        handleTabNavigation,
        handleTabNavigationWithData,
        getStoredTabs: () => TabStorage.getStoredTabs(),
        updateStoredTabs: (
            tabKey: string,
            action: "add" | "remove",
            tabInfo?: Partial<TabInfo>
        ) => {
            TabStorage.updateStoredTabs(tabKey, action, tabInfo);
            refreshTrackedTabs();
        },
        trackedTabs,
        removeTrackedWindow,
        getTabDisplayName,
    };
};

// Export utility functions for direct use
export const getAndConsumeTabData = (tabKey: string): any => {
    const data = TabStorage.getTabData(tabKey);
    TabStorage.cleanupTabData(tabKey);
    return data;
};

export const storeTabData = (tabKey: string, data: any): void => {
    TabStorage.storeTabData(tabKey, data);
};

export default useTabManagement;
