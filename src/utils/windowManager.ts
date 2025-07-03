export interface WindowInfo {
    name: string;
    window: Window; // This represents a browser tab
    type: "menu" | "detail";
    context?: string;
    userId?: string;
    lastActivity: number;
}

export interface WindowStorageData {
    name: string;
    type: "menu" | "detail";
    context?: string;
    userId?: string;
    lastActivity: number;
}

export interface WindowMessage {
    type: string;
    data?: unknown;
    windowName?: string;
    initialData?: unknown;
    id?: string;
}

class WindowManager {
    private windows: Map<string, WindowInfo> = new Map(); // Tracking browser tabs
    private readonly cookieKey = "tab_tracker"; // Updated cookie key
    private readonly cleanupInterval = 5000; // 5 seconds
    private cleanupTimer?: NodeJS.Timeout;

    constructor() {
        this.loadWindowsFromCookie();
        this.startCleanupTimer();
        this.setupMessageListener();
    }

    private setupMessageListener() {
        window.addEventListener("message", (event) => {
            if (event.origin !== window.location.origin) return;

            const { type, windowName } = event.data;

            if (type === "window-ready") {
                this.handleWindowReady(windowName);
            } else if (type === "window-closed") {
                this.removeWindow(windowName);
            }
        });

        // Listen for beforeunload to clean up current tab from tracking
        window.addEventListener("beforeunload", () => {
            this.cleanupCurrentWindow();
        });
    }

    private handleWindowReady(windowName: string) {
        const windowInfo = this.windows.get(windowName);
        if (windowInfo) {
            windowInfo.lastActivity = Date.now();
            this.saveWindowsToCookie();
        }
    }

    private cleanupCurrentWindow() {
        // Remove current tab from cookie tracking when it's about to close
        const currentWindowName = this.getCurrentWindowName();
        if (currentWindowName) {
            this.removeWindowFromCookie(currentWindowName);
        }
    }

    private getCurrentWindowName(): string | null {
        // Try to get tab name from URL params or window.name
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("windowName") || window.name || null;
    }

    private loadWindowsFromCookie() {
        const cookieData = this.getCookie(this.cookieKey);
        if (cookieData) {
            try {
                const windowsData: WindowStorageData[] = JSON.parse(cookieData);
                // We can't restore actual tab references, but we can track what should exist
                windowsData.forEach((data) => {
                    // Only keep recent tabs (last 30 minutes)
                    if (Date.now() - data.lastActivity < 30 * 60 * 1000) {
                        // We'll try to reconnect to these tabs when they become available
                    }
                });
            } catch (error) {
                console.warn("Failed to parse window tracking cookie:", error);
            }
        }
    }

    private saveWindowsToCookie() {
        const windowsData: WindowStorageData[] = Array.from(
            this.windows.values()
        ).map((info) => ({
            name: info.name,
            type: info.type,
            context: info.context,
            userId: info.userId,
            lastActivity: info.lastActivity,
        }));

        this.setCookie(this.cookieKey, JSON.stringify(windowsData), 1); // 1 day expiry
    }

    private removeWindowFromCookie(windowName: string) {
        const cookieData = this.getCookie(this.cookieKey);
        if (cookieData) {
            try {
                const windowsData: WindowStorageData[] = JSON.parse(cookieData);
                const filteredData = windowsData.filter(
                    (w) => w.name !== windowName
                );
                this.setCookie(this.cookieKey, JSON.stringify(filteredData), 1);
            } catch (error) {
                console.warn("Failed to update window tracking cookie:", error);
            }
        }
    }

    private startCleanupTimer() {
        this.cleanupTimer = setInterval(() => {
            this.cleanupClosedWindows();
        }, this.cleanupInterval);
    }

    private cleanupClosedWindows() {
        const toRemove: string[] = [];

        this.windows.forEach((info, name) => {
            if (info.window.closed) {
                toRemove.push(name);
            }
        });

        toRemove.forEach((name) => {
            this.removeWindow(name);
        });
    }

    openMenuWindow(menuType: string, url: string = "/"): Window | null {
        const windowName = `menu:${menuType}`;

        // Check if tab already exists
        const existingWindow = this.windows.get(windowName);
        if (existingWindow && !existingWindow.window.closed) {
            existingWindow.window.focus();
            existingWindow.lastActivity = Date.now();
            this.saveWindowsToCookie();
            return existingWindow.window;
        }

        // Create new tab (no features = opens as tab instead of window)
        const windowUrl = `${url}?windowName=${encodeURIComponent(
            windowName
        )}&type=menu&context=${encodeURIComponent(menuType)}`;

        const newTab = window.open(windowUrl, windowName);

        if (newTab) {
            const windowInfo: WindowInfo = {
                name: windowName,
                window: newTab,
                type: "menu",
                context: menuType,
                lastActivity: Date.now(),
            };

            this.windows.set(windowName, windowInfo);
            this.saveWindowsToCookie();

            // Setup communication once tab loads
            this.setupWindowCommunication(newTab, windowName);

            return newTab;
        }

        return null;
    }

    openDetailWindow(
        detailType: string,
        id: string,
        url: string = "/",
        data?: unknown
    ): Window | null {
        const windowName = `${detailType}:${id}`;

        // Check if tab already exists
        const existingWindow = this.windows.get(windowName);
        if (existingWindow && !existingWindow.window.closed) {
            console.log(
                "Focusing existing tab:",
                windowName,
                "with data:",
                data
            );
            existingWindow.window.focus();
            existingWindow.lastActivity = Date.now();

            // Send updated data to existing tab
            if (data) {
                console.log("Sending data-update to existing tab:", data);
                this.sendDataToWindow(existingWindow.window, {
                    type: "data-update",
                    data: data,
                    id: id,
                });
            }

            this.saveWindowsToCookie();
            return existingWindow.window;
        }

        // Create new tab (no features = opens as tab instead of window)
        const windowUrl = `${url}?windowName=${encodeURIComponent(
            windowName
        )}&type=detail&context=${encodeURIComponent(
            detailType
        )}&id=${encodeURIComponent(id)}`;

        const newTab = window.open(windowUrl, windowName);

        if (newTab) {
            const windowInfo: WindowInfo = {
                name: windowName,
                window: newTab,
                type: "detail",
                context: detailType,
                userId: id,
                lastActivity: Date.now(),
            };

            this.windows.set(windowName, windowInfo);
            this.saveWindowsToCookie();

            // Setup communication once tab loads
            this.setupWindowCommunication(newTab, windowName, data);

            return newTab;
        }

        return null;
    }

    private setupWindowCommunication(
        targetWindow: Window,
        windowName: string,
        initialData?: unknown
    ) {
        // Wait for tab to load and signal ready
        const checkReady = () => {
            if (targetWindow.closed) return;

            try {
                // Send handshake
                targetWindow.postMessage(
                    {
                        type: "handshake",
                        windowName: windowName,
                        initialData: initialData,
                    },
                    window.location.origin
                );

                // Keep checking if tab is ready
                setTimeout(checkReady, 100);
            } catch (error) {
                // Tab not ready yet, try again
                setTimeout(checkReady, 100);
            }
        };

        checkReady();
    }

    sendDataToWindow(targetWindow: Window, data: WindowMessage) {
        if (targetWindow.closed) return false;

        try {
            targetWindow.postMessage(data, window.location.origin);
            return true;
        } catch (error) {
            console.warn("Failed to send data to tab:", error);
            return false;
        }
    }

    broadcastToWindows(data: WindowMessage, excludeWindow?: Window) {
        this.windows.forEach((info) => {
            if (info.window !== excludeWindow && !info.window.closed) {
                this.sendDataToWindow(info.window, data);
            }
        });
    }

    removeWindow(windowName: string) {
        this.windows.delete(windowName);
        this.removeWindowFromCookie(windowName);
    }

    getWindow(windowName: string): Window | null {
        const windowInfo = this.windows.get(windowName);
        if (windowInfo && !windowInfo.window.closed) {
            return windowInfo.window;
        }
        return null;
    }

    getAllWindows(): WindowInfo[] {
        return Array.from(this.windows.values()).filter(
            (info) => !info.window.closed
        );
    }

    closeWindow(windowName: string) {
        const windowInfo = this.windows.get(windowName);
        if (windowInfo && !windowInfo.window.closed) {
            windowInfo.window.close();
        }
        this.removeWindow(windowName);
    }

    closeAllWindows() {
        this.windows.forEach((info) => {
            if (!info.window.closed) {
                info.window.close();
            }
        });
        this.windows.clear();
        this.setCookie(this.cookieKey, "[]", 1);
    }

    destroy() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        this.closeAllWindows();
    }

    // Cookie utilities
    private setCookie(name: string, value: string, days: number) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    private getCookie(name: string): string | null {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}

// Singleton instance
export const windowManager = new WindowManager();

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
    windowManager.destroy();
});
