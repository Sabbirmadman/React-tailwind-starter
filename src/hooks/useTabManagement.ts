/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

interface TabInfo {
    timestamp: number;
    url: string;
    type: "external" | "internal";
    windowName?: string;
    data?: any;
}

interface StoredTabs {
    [key: string]: TabInfo;
}

// Static functions outside the hook to prevent re-creation
const DATA_KEY = "app_tab_data";

const getAndConsumeTabData = (tabKey: string): any => {
    try {
        const dataKey = `${DATA_KEY}_${tabKey}`;
        const stored = Cookies.get(dataKey);
        if (stored) {
            Cookies.remove(dataKey);
            return JSON.parse(stored);
        }
        return null;
    } catch {
        return null;
    }
};

const storeTabData = (tabKey: string, data: any): void => {
    try {
        const dataKey = `${DATA_KEY}_${tabKey}`;
        Cookies.set(dataKey, JSON.stringify(data), {
            expires: 5 / (24 * 60),
        });
    } catch (error) {
        console.warn("Failed to store tab data:", error);
    }
};

export const useTabManagement = () => {
    const openedTabs = React.useRef<{ [key: string]: Window | null }>({});
    const closeCheckIntervals = React.useRef<{ [key: string]: NodeJS.Timeout }>(
        {}
    );
    const STORAGE_KEY = "app_opened_tabs";
    const [trackedTabs, setTrackedTabs] = React.useState<StoredTabs>({});
    const location = useLocation();

    // Function to get tab info from cookies
    const getStoredTabs = (): StoredTabs => {
        try {
            const stored = Cookies.get(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    };

    // Function to update tab info in cookies
    const updateStoredTabs = (
        tabKey: string,
        action: "add" | "remove",
        tabInfo?: Partial<TabInfo>
    ) => {
        try {
            const storedTabs = getStoredTabs();

            if (action === "add" && tabInfo) {
                // Check for duplicate entries and remove them first
                const duplicateKeys = Object.keys(storedTabs).filter((key) => {
                    const existingTab = storedTabs[key];
                    return (
                        existingTab.url ===
                        (tabInfo.url ||
                            `${window.location.origin}${tabKey.replace(
                                /_/g,
                                "/"
                            )}`)
                    );
                });

                // Remove duplicate entries (keep the newest one)
                duplicateKeys.forEach((duplicateKey) => {
                    if (duplicateKey !== tabKey) {
                        console.log(
                            `Removing duplicate entry: ${duplicateKey}`
                        );
                        delete storedTabs[duplicateKey];

                        // Clean up window references and intervals for duplicates
                        if (openedTabs.current[duplicateKey]) {
                            delete openedTabs.current[duplicateKey];
                        }
                        if (closeCheckIntervals.current[duplicateKey]) {
                            clearInterval(
                                closeCheckIntervals.current[duplicateKey]
                            );
                            delete closeCheckIntervals.current[duplicateKey];
                        }
                    }
                });

                // Add the new entry
                storedTabs[tabKey] = {
                    timestamp: Date.now(),
                    url:
                        tabInfo.url ||
                        `${window.location.origin}${tabKey.replace(/_/g, "/")}`,
                    type: tabInfo.type || "external",
                    windowName: tabInfo.windowName,
                    ...tabInfo,
                };
            } else {
                delete storedTabs[tabKey];
            }

            Cookies.set(STORAGE_KEY, JSON.stringify(storedTabs), {
                expires: 1,
            });
            setTrackedTabs(storedTabs);

            // Dispatch custom event for same-origin communication
            window.dispatchEvent(
                new CustomEvent("tabsUpdated", {
                    detail: storedTabs,
                })
            );
        } catch (error) {
            console.warn("Failed to update cookies:", error);
        }
    };

    // Function to setup window close monitoring
    const setupWindowCloseMonitoring = (tabKey: string, windowRef: Window) => {
        // Clear any existing interval
        if (closeCheckIntervals.current[tabKey]) {
            clearInterval(closeCheckIntervals.current[tabKey]);
        }

        // Setup new monitoring
        closeCheckIntervals.current[tabKey] = setInterval(() => {
            if (windowRef.closed) {
                console.log(`Window closed for ${tabKey}, cleaning up`);
                clearInterval(closeCheckIntervals.current[tabKey]);
                delete closeCheckIntervals.current[tabKey];
                delete openedTabs.current[tabKey];
                updateStoredTabs(tabKey, "remove");
            }
        }, 1000);
    };

    // Function to handle smart tab navigation with cookies
    const handleTabNavigation = (path: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const fullUrl = `${window.location.origin}${path}`;
        const tabKey = path.replace(/\//g, "_");

        // Check cookies for existing tabs first
        const storedTabs = getStoredTabs();

        // Check for any existing tabs with the same URL (not just same key)
        const existingEntries = Object.entries(storedTabs).filter(
            ([key, tab]) => tab.url === fullUrl && tab.type === "external"
        );

        // If we have existing entries, try to focus the first valid one
        for (const [existingKey, existingTab] of existingEntries) {
            const existingWindow = openedTabs.current[existingKey];

            // First, try to use direct window reference if available
            if (existingWindow && !existingWindow.closed) {
                try {
                    existingWindow.focus();
                    console.log(
                        `Focused existing tab for ${path} (key: ${existingKey})`
                    );
                    return;
                } catch (error) {
                    console.log(`Could not focus window directly: ${error}`);
                    // Window reference is stale, remove it
                    delete openedTabs.current[existingKey];
                }
            }

            // Try to find window by name, but be more careful about not causing reloads
            if (existingTab.windowName) {
                try {
                    // Only try to access the window if we don't have a direct reference
                    // This helps avoid unnecessary window.open calls that might reload
                    let foundWindow: Window | null = null;

                    // Check if window exists without opening it
                    try {
                        foundWindow = window.open("", existingTab.windowName);

                        // If we get a window that's not blank and not closed, it's valid
                        if (
                            foundWindow &&
                            !foundWindow.closed &&
                            foundWindow.location.href !== "about:blank"
                        ) {
                            // Check if it's actually the right page to avoid cross-origin issues
                            try {
                                if (foundWindow.location.href === fullUrl) {
                                    foundWindow.focus();
                                    openedTabs.current[existingKey] =
                                        foundWindow;
                                    setupWindowCloseMonitoring(
                                        existingKey,
                                        foundWindow
                                    );
                                    console.log(
                                        `Focused existing tab from storage for ${path}`
                                    );
                                    return;
                                }
                            } catch (crossOriginError) {
                                // If we can't access location due to cross-origin, assume it's valid
                                // since it has the right window name
                                foundWindow.focus();
                                openedTabs.current[existingKey] = foundWindow;
                                setupWindowCloseMonitoring(
                                    existingKey,
                                    foundWindow
                                );
                                console.log(
                                    `Focused existing tab from storage for ${path} (cross-origin)`
                                );
                                return;
                            }
                        }

                        // If we got here, the window is not valid, close it if possible
                        if (
                            foundWindow &&
                            foundWindow.location.href === "about:blank"
                        ) {
                            foundWindow.close();
                        }
                    } catch (windowError) {
                        console.log(
                            `Window access failed for ${existingKey}:`,
                            windowError
                        );
                    }
                } catch (error) {
                    console.log(
                        `Could not access window for ${existingKey}, will clean up`
                    );
                }
            }
        }

        // Clean up any invalid entries before opening new tab
        existingEntries.forEach(([existingKey]) => {
            updateStoredTabs(existingKey, "remove");
        });

        // Open new tab and store reference
        const newTab = window.open(fullUrl, `app_tab_${tabKey}`);
        if (newTab) {
            openedTabs.current[tabKey] = newTab;
            updateStoredTabs(tabKey, "add", {
                url: fullUrl,
                type: "external",
                windowName: `app_tab_${tabKey}`,
            });
            newTab.focus();
            console.log(`Opened new tab for ${path}`);

            // Setup close monitoring
            setupWindowCloseMonitoring(tabKey, newTab);
        }
    };

    // Improved function to handle tab navigation with data passing
    const handleTabNavigationWithData =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (path: string, data?: any) => (e?: React.MouseEvent) => {
            if (e) e.preventDefault();

            const fullUrl = `${window.location.origin}${path}`;
            const finalTabKey = path.includes("/user-details")
                ? "_user-details"
                : path.replace(/\//g, "_").replace(/\?.*/, ""); // Remove query params from key

            // Store data in cookies if provided
            if (data) {
                storeTabData(finalTabKey, data);
            }

            const storedTabs = getStoredTabs();
            const existingEntries = Object.entries(storedTabs).filter(
                ([key, tab]) => {
                    if (path.includes("/user-details")) {
                        return (
                            tab.url.split("?")[0].includes("/user-details") &&
                            tab.type === "external"
                        );
                    }
                    return (
                        tab.url.split("?")[0] === fullUrl.split("?")[0] &&
                        tab.type === "external"
                    );
                }
            );

            // Try to focus existing tab
            for (const [existingKey, existingTab] of existingEntries) {
                const existingWindow = openedTabs.current[existingKey];

                if (existingWindow && !existingWindow.closed) {
                    try {
                        // Force focus and bring to front
                        existingWindow.focus();
                        existingWindow.blur();
                        existingWindow.focus();

                        // Navigate if needed
                        if (path.includes("/user-details")) {
                            existingWindow.location.href = fullUrl;
                        }

                        console.log(`Focused existing tab for ${path}`);
                        return;
                    } catch (error) {
                        delete openedTabs.current[existingKey];
                    }
                }
            }

            // Clean up invalid entries
            existingEntries.forEach(([existingKey]) => {
                updateStoredTabs(existingKey, "remove");
            });

            // Open new tab
            const newTab = window.open(fullUrl, `app_tab_${finalTabKey}`);
            if (newTab) {
                openedTabs.current[finalTabKey] = newTab;
                updateStoredTabs(finalTabKey, "add", {
                    url: fullUrl,
                    type: "external",
                    windowName: `app_tab_${finalTabKey}`,
                });
                newTab.focus();
                setupWindowCloseMonitoring(finalTabKey, newTab);
            }
        };

    // Track current page navigation
    React.useEffect(() => {
        const currentPath = location.pathname;
        const tabKey = `current${currentPath.replace(/\//g, "_")}`;

        updateStoredTabs(tabKey, "add", {
            url: `${window.location.origin}${currentPath}`,
            type: "internal",
        });

        // Cleanup function to remove current page tracking when component unmounts
        return () => {
            // Only remove if we're actually navigating away, not just re-rendering
            setTimeout(() => {
                if (location.pathname !== currentPath) {
                    updateStoredTabs(tabKey, "remove");
                }
            }, 100);
        };
    }, [location.pathname]);

    // Initialize tracked tabs and listen for changes
    React.useEffect(() => {
        setTrackedTabs(getStoredTabs());

        const handleTabsUpdated = (e: CustomEvent) => {
            setTrackedTabs(e.detail);
        };

        // Check for closed windows on mount
        const storedTabs = getStoredTabs();
        Object.entries(storedTabs).forEach(([tabKey, tabInfo]) => {
            if (tabInfo.type === "external" && tabInfo.windowName) {
                try {
                    const existingWindow = window.open("", tabInfo.windowName);
                    if (
                        existingWindow &&
                        !existingWindow.closed &&
                        existingWindow.location.href !== "about:blank"
                    ) {
                        openedTabs.current[tabKey] = existingWindow;
                        setupWindowCloseMonitoring(tabKey, existingWindow);
                    } else {
                        updateStoredTabs(tabKey, "remove");
                    }
                } catch (error) {
                    updateStoredTabs(tabKey, "remove");
                }
            }
        });

        window.addEventListener(
            "tabsUpdated",
            handleTabsUpdated as EventListener
        );

        // Cleanup intervals on unmount
        return () => {
            window.removeEventListener(
                "tabsUpdated",
                handleTabsUpdated as EventListener
            );
            Object.values(closeCheckIntervals.current).forEach((interval) =>
                clearInterval(interval)
            );
        };
    }, []);

    return {
        handleTabNavigation,
        handleTabNavigationWithData,
        getStoredTabs,
        updateStoredTabs,
        trackedTabs,
        getTabDisplayName: (tabKey: string): string => {
            const pathMap: { [key: string]: string } = {
                _users: "Users List",
                _products: "Products List",
                _about: "About Page",
                current_: "Home Page",
            };
            return (
                pathMap[tabKey] || tabKey.replace(/_/g, "/").replace(/^\//, "")
            );
        },
    };
};

// Export static functions for direct use
export { getAndConsumeTabData, storeTabData };
export default useTabManagement;
