import { TabNavigationOptions } from "./types";
import { TabStorage } from "./storage";
import { WindowManagement } from "./windowManager";

/**
 * Navigation utilities for tab management
 */
export class TabNavigation {
    private windowManager: WindowManagement;

    constructor(windowManager: WindowManagement) {
        this.windowManager = windowManager;
    }

    /**
     * Generate tab key from path
     */
    generateTabKey(path: string, pageType?: string): string {
        return pageType || path.replace(/\//g, "_").replace(/\?.*/, "");
    }

    /**
     * Handle basic tab navigation
     */
    handleNavigation(options: TabNavigationOptions): void {
        const { path, data, pageType, forceReload = false } = options;

        console.log(`🚀 Navigation requested:`, {
            path,
            pageType,
            forceReload,
            hasData: !!data,
        });

        const fullUrl = `${window.location.origin}${path}`;
        const tabKey = this.generateTabKey(path, pageType);

        console.log(`🔑 Generated tab key: ${tabKey} for URL: ${fullUrl}`);

        // Store data if provided
        if (data) {
            TabStorage.storeTabData(tabKey, data);
        }

        // Clean up duplicates if pageType is specified
        if (pageType) {
            this.cleanupDuplicatesByPageType(pageType, tabKey);
        }

        // Try to find and focus existing window
        if (this.tryFocusExistingWindow(fullUrl, tabKey, forceReload)) {
            console.log(`✅ Successfully handled existing tab for ${tabKey}`);
            return;
        }

        // Open new window
        console.log(`🆕 Opening new tab for ${tabKey}`);
        this.openNewWindow(fullUrl, tabKey, pageType);
    }

    /**
     * Try to focus existing window
     */
    private tryFocusExistingWindow(
        fullUrl: string,
        tabKey: string,
        forceReload: boolean
    ): boolean {
        const storedTabs = TabStorage.getStoredTabs();

        console.log(`🔍 Looking for existing tab with key: ${tabKey}`);
        console.log(`📊 Current stored tabs:`, storedTabs);

        // First, look for exact tab key match (most efficient)
        if (storedTabs[tabKey] && storedTabs[tabKey].type === "external") {
            console.log(
                `✅ Found stored tab for ${tabKey}:`,
                storedTabs[tabKey]
            );

            const existingWindow = this.windowManager.getWindow(tabKey);
            console.log(
                `🪟 Window reference for ${tabKey}:`,
                existingWindow ? "exists" : "null"
            );

            if (this.windowManager.isWindowValid(existingWindow)) {
                console.log(`✅ Window is valid for ${tabKey}`);

                try {
                    const currentUrl = existingWindow!.location.href;
                    const isSameUrl = this.windowManager.isSamePage(
                        currentUrl,
                        fullUrl
                    );

                    console.log(`🔗 URL comparison for ${tabKey}:`, {
                        currentUrl,
                        targetUrl: fullUrl,
                        isSameUrl,
                        forceReload,
                    });

                    if (isSameUrl && !forceReload) {
                        // Same URL and no force reload: just focus
                        existingWindow!.focus();
                        console.log(
                            `👀 Focused existing tab for ${tabKey} without reload`
                        );
                        return true;
                    } else if (isSameUrl && forceReload) {
                        // Same URL but force reload requested
                        existingWindow!.location.reload();
                        existingWindow!.focus();
                        console.log(
                            `🔄 Focused and reloaded existing tab for ${tabKey}`
                        );
                        return true;
                    } else {
                        // Different URL: navigate to new URL
                        existingWindow!.location.href = fullUrl;
                        existingWindow!.focus();
                        console.log(
                            `🧭 Navigated existing tab to new URL for ${tabKey}`
                        );
                        return true;
                    }
                } catch (crossOriginError) {
                    console.log(
                        `🚫 Cross-origin error for ${tabKey}:`,
                        crossOriginError
                    );
                    // Cross-origin: can't check URL, use forceReload flag
                    if (forceReload) {
                        try {
                            existingWindow!.location.reload();
                        } catch {
                            // If reload fails, try navigation
                            existingWindow!.location.href = fullUrl;
                        }
                    }
                    existingWindow!.focus();
                    console.log(
                        `👀 Focused existing cross-origin tab for ${tabKey}`
                    );
                    return true;
                }
            } else {
                console.log(`❌ Window is not valid for ${tabKey}`);
            }

            // Try to recover window by name if direct reference failed
            const existingTab = storedTabs[tabKey];
            if (existingTab.windowName) {
                console.log(
                    `🔍 Trying to recover window by name: ${existingTab.windowName}`
                );

                const foundWindow = this.windowManager.findAndFocusWindowByName(
                    existingTab.windowName,
                    fullUrl,
                    forceReload
                );

                if (foundWindow) {
                    this.windowManager.setWindow(tabKey, foundWindow);
                    this.windowManager.setupWindowCloseMonitoring(
                        tabKey,
                        foundWindow
                    );
                    console.log(`✅ Recovered window by name for ${tabKey}`);
                    return true;
                } else {
                    console.log(
                        `❌ Could not recover window by name for ${tabKey}`
                    );
                }
            }
        } else {
            console.log(`❌ No stored tab found for ${tabKey} or wrong type`);
        }

        // Fallback: Check for existing tabs with the same URL but different keys
        console.log(`🔍 Looking for tabs with same URL but different keys...`);
        const existingEntries = Object.entries(storedTabs).filter(
            ([key, tab]) =>
                key !== tabKey && tab.url === fullUrl && tab.type === "external"
        );

        console.log(
            `📋 Found ${existingEntries.length} tabs with same URL:`,
            existingEntries
        );

        for (const [existingKey, existingTab] of existingEntries) {
            const existingWindow = this.windowManager.getWindow(existingKey);

            // Try direct window reference first
            if (this.windowManager.isWindowValid(existingWindow)) {
                if (!forceReload) {
                    // Just focus existing window
                    existingWindow!.focus();
                    console.log(
                        `👀 Focused existing tab with different key ${existingKey} for ${tabKey}`
                    );
                } else {
                    // Force reload requested
                    existingWindow!.location.reload();
                    existingWindow!.focus();
                    console.log(
                        `🔄 Focused and reloaded existing tab with different key ${existingKey} for ${tabKey}`
                    );
                }
                return true;
            }

            // Try to find window by name
            if (existingTab.windowName) {
                const foundWindow = this.windowManager.findAndFocusWindowByName(
                    existingTab.windowName,
                    fullUrl,
                    forceReload
                );

                if (foundWindow) {
                    this.windowManager.setWindow(existingKey, foundWindow);
                    this.windowManager.setupWindowCloseMonitoring(
                        existingKey,
                        foundWindow
                    );
                    console.log(
                        `✅ Found and focused window by name for ${tabKey}`
                    );
                    return true;
                }
            }

            // Clean up invalid entry
            this.windowManager.cleanupWindow(existingKey);
        }

        console.log(
            `❌ No existing tab found for ${tabKey}, will open new tab`
        );
        return false;
    }

    /**
     * Open new window
     */
    private openNewWindow(
        fullUrl: string,
        tabKey: string,
        pageType?: string
    ): void {
        const windowName = `app_tab_${tabKey}`;
        const newTab = window.open(fullUrl, windowName);

        if (newTab) {
            this.windowManager.setWindow(tabKey, newTab);

            TabStorage.updateStoredTabs(tabKey, "add", {
                url: fullUrl,
                type: "external",
                windowName,
                pageType,
            });

            newTab.focus();
            console.log(`Opened new tab for ${tabKey}`);

            // Setup close monitoring
            this.windowManager.setupWindowCloseMonitoring(tabKey, newTab);
        }
    }

    /**
     * Clean up duplicate windows by page type
     */
    private cleanupDuplicatesByPageType(
        pageType: string,
        currentTabKey: string
    ): void {
        const storedTabs = TabStorage.getStoredTabs();

        const duplicateKeys = Object.keys(storedTabs).filter((key) => {
            const tab = storedTabs[key];
            return (
                key !== currentTabKey &&
                tab.type === "external" &&
                (tab.pageType === pageType || key === currentTabKey)
            );
        });

        duplicateKeys.forEach((dupKey) => {
            this.windowManager.cleanupWindow(dupKey);
        });
    }

    /**
     * Create navigation handler function
     */
    createNavigationHandler(
        path: string,
        forceReload: boolean = false
    ): (e: React.MouseEvent) => void {
        return (e: React.MouseEvent) => {
            e.preventDefault();
            this.handleNavigation({ path, forceReload });
        };
    }

    /**
     * Create navigation handler with data
     */
    createNavigationHandlerWithData(
        path: string,
        data?: unknown,
        pageType?: string,
        forceReload: boolean = false
    ): (e?: React.MouseEvent) => void {
        return (e?: React.MouseEvent) => {
            if (e) e.preventDefault();
            this.handleNavigation({ path, data, pageType, forceReload });
        };
    }

    /**
     * Navigate programmatically
     */
    navigateTo(options: TabNavigationOptions): void {
        this.handleNavigation(options);
    }
}
