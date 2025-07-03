import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { TabManager } from "./tabManager";
import { TabStorage } from "./storage";
import { StoredTabs, TabNavigationOptions, TabDisplayMap } from "./types";

/**
 * Simplified React hook for tab management
 */
export const useTabManagement = () => {
    const [trackedTabs, setTrackedTabs] = useState<StoredTabs>({});
    const location = useLocation();
    const tabManagerRef = useRef<TabManager | null>(null);

    // Initialize tab manager
    if (!tabManagerRef.current) {
        tabManagerRef.current = new TabManager();
    }

    const tabManager = tabManagerRef.current;

    // Load initial tabs from storage
    useEffect(() => {
        const storedTabs = TabStorage.getStoredTabs();
        setTrackedTabs(storedTabs);

        // Listen for tab updates from other windows
        const handleTabsUpdated = (event: CustomEvent) => {
            setTrackedTabs(event.detail);
        };

        window.addEventListener(
            "tabsUpdated",
            handleTabsUpdated as EventListener
        );

        return () => {
            window.removeEventListener(
                "tabsUpdated",
                handleTabsUpdated as EventListener
            );
        };
    }, []);

    // Update current tab info when location changes
    useEffect(() => {
        const currentPath = location.pathname;
        const currentTabKey = currentPath.replace(/\//g, "_") || "_";

        // Update current tab as internal
        TabStorage.updateStoredTabs(currentTabKey, "add", {
            url: `${window.location.origin}${currentPath}`,
            type: "internal",
        });

        // Refresh tracked tabs
        const updatedTabs = TabStorage.getStoredTabs();
        setTrackedTabs(updatedTabs);
    }, [location.pathname]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (tabManagerRef.current) {
                tabManagerRef.current.cleanup();
            }
        };
    }, []);

    /**
     * Navigate to a path
     */
    const navigateTo = (options: TabNavigationOptions) => {
        tabManager.navigateTo(options);
    };

    /**
     * Create navigation handler
     */
    const createNavigationHandler = (
        path: string,
        forceReload: boolean = false
    ) => {
        return tabManager.createNavigationHandler(path, forceReload);
    };

    /**
     * Create navigation handler with data
     */
    const createNavigationHandlerWithData = (
        path: string,
        data?: unknown,
        pageType?: string,
        forceReload: boolean = false
    ) => {
        return tabManager.createNavigationHandlerWithData(
            path,
            data,
            pageType,
            forceReload
        );
    };

    /**
     * Get display name for tab
     */
    const getTabDisplayName = (tabKey: string): string => {
        return tabManager.getTabDisplayName(tabKey);
    };

    /**
     * Set custom display names
     */
    const setDisplayNames = (displayMap: TabDisplayMap): void => {
        tabManager.setDisplayNames(displayMap);
    };

    /**
     * Remove tracked window
     */
    const removeTrackedWindow = (tabKey: string): void => {
        tabManager.removeTrackedWindow(tabKey);
        // Refresh local state
        const updatedTabs = TabStorage.getStoredTabs();
        setTrackedTabs(updatedTabs);
    };

    /**
     * Store tab data
     */
    const storeTabData = (tabKey: string, data: unknown): void => {
        tabManager.storeTabData(tabKey, data);
    };

    /**
     * Get tab data
     */
    const getTabData = (tabKey: string): unknown => {
        return tabManager.getTabData(tabKey);
    };

    /**
     * Refresh tracked tabs from storage
     */
    const refreshTrackedTabs = (): void => {
        const storedTabs = TabStorage.getStoredTabs();
        setTrackedTabs(storedTabs);
    };

    /**
     * Legacy method names for backward compatibility
     */
    const handleTabNavigation = createNavigationHandler;
    const handleTabNavigationWithData = createNavigationHandlerWithData;

    return {
        // State
        trackedTabs,

        // Navigation methods
        navigateTo,
        createNavigationHandler,
        createNavigationHandlerWithData,
        handleTabNavigation, // Legacy
        handleTabNavigationWithData, // Legacy

        // Display methods
        getTabDisplayName,
        setDisplayNames,

        // Data methods
        storeTabData,
        getTabData,

        // Management methods
        removeTrackedWindow,
        refreshTrackedTabs,

        // Utilities
        formatTimestamp: tabManager.formatTimestamp,
        formatRelativeTime: tabManager.formatRelativeTime,
        getTabTypeDisplay: tabManager.getTabTypeDisplay,

        // Direct access to managers (for advanced usage)
        tabManager,
        windowManager: tabManager.windowManager,
        navigationManager: tabManager.navigation,
        displayManager: tabManager.display,
    };
};

export default useTabManagement;
