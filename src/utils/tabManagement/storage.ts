import Cookies from "js-cookie";
import { StoredTabs, TabInfo } from "./types";

const STORAGE_KEY = "app_opened_tabs";
const DATA_STORAGE_KEY = "app_tab_data";

/**
 * Cookie-based storage utilities for tab management
 */
export class TabStorage {
    /**
     * Get all stored tabs from cookies
     */
    static getStoredTabs(): StoredTabs {
        try {
            const stored = Cookies.get(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    /**
     * Update tab info in cookies
     */
    static updateStoredTabs(
        tabKey: string,
        action: "add" | "remove",
        tabInfo?: Partial<TabInfo>
    ): StoredTabs {
        try {
            const storedTabs = this.getStoredTabs();

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

            // Dispatch custom event for same-origin communication
            window.dispatchEvent(
                new CustomEvent("tabsUpdated", {
                    detail: storedTabs,
                })
            );

            return storedTabs;
        } catch (error) {
            console.warn("Failed to update cookies:", error);
            return {};
        }
    }

    /**
     * Store tab-specific data
     */
    static storeTabData(tabKey: string, data: unknown): void {
        try {
            const existingData: Record<
                string,
                { data: unknown; timestamp: number }
            > =
                (this.getTabData() as Record<
                    string,
                    { data: unknown; timestamp: number }
                >) || {};
            existingData[tabKey] = {
                data,
                timestamp: Date.now(),
            };
            Cookies.set(DATA_STORAGE_KEY, JSON.stringify(existingData), {
                expires: 1,
            });
        } catch (error) {
            console.warn("Failed to store tab data:", error);
        }
    }

    /**
     * Get tab-specific data
     */
    static getTabData(tabKey?: string): unknown {
        try {
            const stored = Cookies.get(DATA_STORAGE_KEY);
            const allData: Record<
                string,
                { data: unknown; timestamp: number }
            > = stored ? JSON.parse(stored) : {};

            if (tabKey) {
                const tabData = allData[tabKey];
                // Clean up old data (older than 1 day)
                if (
                    tabData &&
                    Date.now() - tabData.timestamp > 24 * 60 * 60 * 1000
                ) {
                    delete allData[tabKey];
                    Cookies.set(DATA_STORAGE_KEY, JSON.stringify(allData), {
                        expires: 1,
                    });
                    return null;
                }
                return tabData?.data || null;
            }

            return allData;
        } catch {
            return tabKey ? null : {};
        }
    }

    /**
     * Clean up tab data
     */
    static cleanupTabData(tabKey: string): void {
        try {
            const existingData: Record<
                string,
                { data: unknown; timestamp: number }
            > =
                (this.getTabData() as Record<
                    string,
                    { data: unknown; timestamp: number }
                >) || {};
            delete existingData[tabKey];
            Cookies.set(DATA_STORAGE_KEY, JSON.stringify(existingData), {
                expires: 1,
            });
        } catch (error) {
            console.warn("Failed to cleanup tab data:", error);
        }
    }

    /**
     * Clear all stored tabs and data
     */
    static clearAll(): void {
        try {
            Cookies.remove(STORAGE_KEY);
            Cookies.remove(DATA_STORAGE_KEY);
        } catch (error) {
            console.warn("Failed to clear storage:", error);
        }
    }
}
