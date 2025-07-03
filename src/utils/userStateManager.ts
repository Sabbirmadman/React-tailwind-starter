// Cookie-based user state management
export interface User {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive";
    phone?: string;
    address?: string;
    joinDate?: string;
}

class UserStateManager {
    private readonly COOKIE_KEY = "current_user_detail";
    private readonly EXPIRY_HOURS = 24;

    // Set current user in cookie
    setCurrentUser(user: User): void {
        const userData = {
            ...user,
            timestamp: Date.now(),
        };
        this.setCookie(
            this.COOKIE_KEY,
            JSON.stringify(userData),
            this.EXPIRY_HOURS
        );

        // Broadcast change to all tabs
        this.broadcastUserChange(user);
    }

    // Get current user from cookie
    getCurrentUser(): User | null {
        const cookieData = this.getCookie(this.COOKIE_KEY);
        if (!cookieData) return null;

        try {
            const userData = JSON.parse(cookieData);
            // Check if data is not too old (optional)
            if (
                Date.now() - userData.timestamp >
                this.EXPIRY_HOURS * 60 * 60 * 1000
            ) {
                this.clearCurrentUser();
                return null;
            }
            return userData;
        } catch (error) {
            console.warn("Failed to parse user cookie:", error);
            return null;
        }
    }

    // Clear current user
    clearCurrentUser(): void {
        this.deleteCookie(this.COOKIE_KEY);
        this.broadcastUserChange(null);
    }

    // Listen for user changes across tabs
    onUserChange(callback: (user: User | null) => void): () => void {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === this.COOKIE_KEY) {
                const user = this.getCurrentUser();
                callback(user);
            }
        };

        const handleUserChangeEvent = (event: CustomEvent) => {
            callback(event.detail);
        };

        // Listen to both storage events and custom events
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener(
            "userChange",
            handleUserChangeEvent as EventListener
        );

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener(
                "userChange",
                handleUserChangeEvent as EventListener
            );
        };
    }

    // Broadcast user change to all tabs in the same origin
    private broadcastUserChange(user: User | null): void {
        // Use localStorage to trigger storage event across tabs
        const changeId = Date.now().toString();
        localStorage.setItem("user_change_trigger", changeId);
        localStorage.removeItem("user_change_trigger");

        // Also dispatch custom event for current tab
        window.dispatchEvent(new CustomEvent("userChange", { detail: user }));
    }

    // Cookie utilities
    private setCookie(name: string, value: string, hours: number): void {
        const date = new Date();
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
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

    private deleteCookie(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

// Export singleton instance
export const userStateManager = new UserStateManager();
