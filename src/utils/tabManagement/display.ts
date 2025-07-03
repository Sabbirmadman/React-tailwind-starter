import { TabDisplayMap } from "./types";

/**
 * Display utilities for tab management
 */
export class TabDisplay {
    private displayMap: TabDisplayMap = {
        _: "Home",
        _about: "About",
        _products: "Products",
        _product_details: "Product Details",
        _users: "Users",
        _user_details: "User Details",
        _settings: "Settings",
        _profile: "Profile",
        _dashboard: "Dashboard",
        _login: "Login",
        _signup: "Sign Up",
        _contact: "Contact",
        _help: "Help",
        _terms: "Terms of Service",
        _privacy: "Privacy Policy",
    };

    /**
     * Get display name for a tab key
     */
    getTabDisplayName(tabKey: string): string {
        // Check if we have a custom display name
        if (this.displayMap[tabKey]) {
            return this.displayMap[tabKey];
        }

        // Convert underscore-separated key to readable format
        return tabKey
            .replace(/^_/, "") // Remove leading underscore
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
    }

    /**
     * Set custom display name for a tab key
     */
    setDisplayName(tabKey: string, displayName: string): void {
        this.displayMap[tabKey] = displayName;
    }

    /**
     * Set multiple display names at once
     */
    setDisplayNames(displayMap: TabDisplayMap): void {
        this.displayMap = { ...this.displayMap, ...displayMap };
    }

    /**
     * Get all display mappings
     */
    getAllDisplayNames(): TabDisplayMap {
        return { ...this.displayMap };
    }

    /**
     * Remove display name mapping
     */
    removeDisplayName(tabKey: string): void {
        delete this.displayMap[tabKey];
    }

    /**
     * Clear all custom display names
     */
    clearDisplayNames(): void {
        this.displayMap = {};
    }

    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp: number): string {
        return new Date(timestamp).toLocaleTimeString();
    }

    /**
     * Format date for display
     */
    formatDate(timestamp: number): string {
        return new Date(timestamp).toLocaleDateString();
    }

    /**
     * Format relative time (e.g., "2 minutes ago")
     */
    formatRelativeTime(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days === 1 ? "" : "s"} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours === 1 ? "" : "s"} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
        } else {
            return "Just now";
        }
    }

    /**
     * Get tab type display text
     */
    getTabTypeDisplay(type: "external" | "internal"): string {
        return type === "internal" ? "Current Window" : "External Window";
    }

    /**
     * Generate tab summary for display
     */
    getTabSummary(
        tabKey: string,
        timestamp: number,
        type: "external" | "internal"
    ): string {
        const displayName = this.getTabDisplayName(tabKey);
        const typeDisplay = this.getTabTypeDisplay(type);
        const timeDisplay = this.formatTimestamp(timestamp);

        return `${displayName} • ${typeDisplay} • Opened: ${timeDisplay}`;
    }
}
