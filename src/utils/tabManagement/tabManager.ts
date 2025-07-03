import { WindowManagement } from "./windowManager";
import { TabNavigation } from "./navigation";
import { TabDisplay } from "./display";
import { TabStorage } from "./storage";
import { StoredTabs, TabNavigationOptions, TabDisplayMap } from "./types";

/**
 * Complete tab manager that combines all utilities
 */
export class TabManager {
    public windowManager: WindowManagement;
    public navigation: TabNavigation;
    public display: TabDisplay;

    constructor() {
        this.windowManager = new WindowManagement();
        this.navigation = new TabNavigation(this.windowManager);
        this.display = new TabDisplay();
    }

    /**
     * Get all tracked tabs
     */
    getTrackedTabs(): StoredTabs {
        return TabStorage.getStoredTabs();
    }

    /**
     * Navigate to a path
     */
    navigateTo(options: TabNavigationOptions): void {
        this.navigation.handleNavigation(options);
    }

    /**
     * Create navigation handler
     */
    createNavigationHandler(
        path: string,
        forceReload: boolean = false
    ): (e: React.MouseEvent) => void {
        return this.navigation.createNavigationHandler(path, forceReload);
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
        return this.navigation.createNavigationHandlerWithData(
            path,
            data,
            pageType,
            forceReload
        );
    }

    /**
     * Get display name for tab
     */
    getTabDisplayName(tabKey: string): string {
        return this.display.getTabDisplayName(tabKey);
    }

    /**
     * Set custom display names
     */
    setDisplayNames(displayMap: TabDisplayMap): void {
        this.display.setDisplayNames(displayMap);
    }

    /**
     * Remove tracked window
     */
    removeTrackedWindow(tabKey: string): void {
        this.windowManager.cleanupWindow(tabKey);
    }

    /**
     * Store tab data
     */
    storeTabData(tabKey: string, data: unknown): void {
        TabStorage.storeTabData(tabKey, data);
    }

    /**
     * Get tab data
     */
    getTabData(tabKey: string): unknown {
        return TabStorage.getTabData(tabKey);
    }

    /**
     * Clean up all resources
     */
    cleanup(): void {
        this.windowManager.cleanupAll();
        TabStorage.clearAll();
    }

    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp: number): string {
        return this.display.formatTimestamp(timestamp);
    }

    /**
     * Format relative time
     */
    formatRelativeTime(timestamp: number): string {
        return this.display.formatRelativeTime(timestamp);
    }

    /**
     * Get tab type display
     */
    getTabTypeDisplay(type: "external" | "internal"): string {
        return this.display.getTabTypeDisplay(type);
    }
}

/**
 * Create a new tab manager instance
 */
export function createTabManager(): TabManager {
    return new TabManager();
}
