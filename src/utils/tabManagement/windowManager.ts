import { WindowManager, IntervalManager } from "./types";
import { TabStorage } from "./storage";

/**
 * Window management utilities for tab tracking
 */
export class WindowManagement {
    private openedTabs: WindowManager = {};
    private closeCheckIntervals: IntervalManager = {};

    /**
     * Setup window close monitoring
     */
    setupWindowCloseMonitoring(tabKey: string, windowRef: Window): void {
        // Clear any existing interval
        if (this.closeCheckIntervals[tabKey]) {
            clearInterval(this.closeCheckIntervals[tabKey]);
        }

        // Setup new monitoring
        this.closeCheckIntervals[tabKey] = setInterval(() => {
            if (windowRef.closed) {
                console.log(`Window closed for ${tabKey}, cleaning up`);
                this.cleanupWindow(tabKey);
            }
        }, 1000);
    }

    /**
     * Clean up window reference and interval
     */
    cleanupWindow(tabKey: string): void {
        if (this.closeCheckIntervals[tabKey]) {
            clearInterval(this.closeCheckIntervals[tabKey]);
            delete this.closeCheckIntervals[tabKey];
        }

        if (this.openedTabs[tabKey]) {
            delete this.openedTabs[tabKey];
        }

        TabStorage.updateStoredTabs(tabKey, "remove");
        TabStorage.cleanupTabData(tabKey);
    }

    /**
     * Get window reference
     */
    getWindow(tabKey: string): Window | null {
        return this.openedTabs[tabKey] || null;
    }

    /**
     * Set window reference
     */
    setWindow(tabKey: string, window: Window | null): void {
        if (window) {
            this.openedTabs[tabKey] = window;
        } else {
            delete this.openedTabs[tabKey];
        }
    }

    /**
     * Check if window is valid and accessible
     */
    isWindowValid(window: Window | null): boolean {
        try {
            return !!(window && !window.closed);
        } catch {
            return false;
        }
    }

    /**
     * Focus existing window with navigation control
     */
    focusWindow(
        window: Window,
        forceReload: boolean = false,
        expectedUrl?: string
    ): boolean {
        try {
            // If we have an expected URL and it's different from current, navigate
            if (expectedUrl) {
                try {
                    const currentUrl = window.location.href;
                    const isSameUrl = this.isSamePage(currentUrl, expectedUrl);

                    if (!isSameUrl) {
                        // Different URL: navigate to expected URL
                        window.location.href = expectedUrl;
                        window.focus();
                        return true;
                    } else if (forceReload) {
                        // Same URL but force reload requested
                        window.location.reload();
                        window.focus();
                        return true;
                    } else {
                        // Same URL, just focus
                        window.focus();
                        return true;
                    }
                } catch (crossOriginError) {
                    // Cross-origin: can't check URL, just focus or reload based on flag
                    if (forceReload) {
                        try {
                            window.location.reload();
                        } catch {
                            // If reload fails, try navigation if URL provided
                            if (expectedUrl) {
                                window.location.href = expectedUrl;
                            }
                        }
                    }
                    window.focus();
                    return true;
                }
            } else {
                // No expected URL provided, use legacy behavior
                if (forceReload) {
                    window.location.reload();
                }
                window.focus();
                return true;
            }
        } catch (error) {
            console.log(`Could not focus window: ${error}`);
            return false;
        }
    }

    /**
     * Check if two URLs represent the same page
     */
    isSamePage(url1: string, url2: string): boolean {
        try {
            const urlObj1 = new URL(url1);
            const urlObj2 = new URL(url2);
            return (
                urlObj1.origin === urlObj2.origin &&
                urlObj1.pathname === urlObj2.pathname
            );
        } catch {
            return url1 === url2;
        }
    }

    /**
     * Find and focus existing window by name
     */
    findAndFocusWindowByName(
        windowName: string,
        expectedUrl: string,
        forceReload: boolean = false
    ): Window | null {
        try {
            const foundWindow = window.open("", windowName);

            if (
                foundWindow &&
                !foundWindow.closed &&
                foundWindow.location.href !== "about:blank"
            ) {
                try {
                    const currentUrl = foundWindow.location.href;
                    const isSameUrl = this.isSamePage(currentUrl, expectedUrl);

                    if (isSameUrl) {
                        // Same URL: just focus (reload only if forced)
                        if (forceReload) {
                            foundWindow.location.reload();
                        }
                        foundWindow.focus();
                        return foundWindow;
                    } else {
                        // Different URL: navigate to new URL and focus
                        foundWindow.location.href = expectedUrl;
                        foundWindow.focus();
                        return foundWindow;
                    }
                } catch (crossOriginError) {
                    // If we can't access location due to cross-origin, assume it's valid
                    // For cross-origin, we can't check URL but we can try to navigate
                    if (forceReload) {
                        try {
                            foundWindow.location.reload();
                        } catch {
                            // If reload fails, try navigation
                            foundWindow.location.href = expectedUrl;
                        }
                    } else {
                        // Just focus for cross-origin when not forcing reload
                        foundWindow.focus();
                    }
                    return foundWindow;
                }
            }

            // Close invalid window
            if (foundWindow && foundWindow.location.href === "about:blank") {
                foundWindow.close();
            }

            return null;
        } catch (error) {
            console.log(`Window access failed:`, error);
            return null;
        }
    }

    /**
     * Clean up duplicate windows for the same URL
     */
    cleanupDuplicateWindows(currentTabKey: string, targetUrl: string): void {
        const storedTabs = TabStorage.getStoredTabs();

        Object.entries(storedTabs).forEach(([key, tab]) => {
            if (
                key !== currentTabKey &&
                tab.url === targetUrl &&
                tab.type === "external"
            ) {
                this.cleanupWindow(key);
            }
        });
    }

    /**
     * Clean up all windows and intervals
     */
    cleanupAll(): void {
        // Clear all intervals
        Object.values(this.closeCheckIntervals).forEach((interval) => {
            clearInterval(interval);
        });

        // Clear all references
        this.closeCheckIntervals = {};
        this.openedTabs = {};
    }

    /**
     * Get all tracked windows
     */
    getAllWindows(): WindowManager {
        return { ...this.openedTabs };
    }
}
