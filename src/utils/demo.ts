import { windowManager } from "./windowManager";

export interface DemoUser {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive";
}

export const demoUsers: DemoUser[] = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "active" },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        status: "active",
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        status: "inactive",
    },
    {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        status: "active",
    },
    {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie@example.com",
        status: "active",
    },
];

export class WindowDemo {
    static async runFullDemo() {
        // Demo 1: Open multiple menu windows
        console.log("Demo 1: Opening menu windows...");
        windowManager.openMenuWindow("user-list", "/users");

        await this.delay(1000);
        windowManager.openMenuWindow("product-list", "/products");

        await this.delay(1000);
        windowManager.openMenuWindow("orders", "/orders");

        // Demo 2: Open detail windows
        console.log("Demo 2: Opening detail windows...");
        await this.delay(2000);

        demoUsers.slice(0, 3).forEach((user, index) => {
            setTimeout(() => {
                windowManager.openDetailWindow(
                    "user-detail",
                    "shared",
                    "/user-detail",
                    user
                );
            }, index * 1000);
        });

        // Demo 3: Test window reuse
        console.log("Demo 3: Testing window reuse...");
        await this.delay(4000);

        // Try to open the same menu window - should focus existing
        windowManager.openMenuWindow("user-list", "/users");

        await this.delay(1000);

        // Try to open the same detail window - should focus and update
        windowManager.openDetailWindow(
            "user-detail",
            "shared",
            "/user-detail",
            {
                ...demoUsers[0],
                status: "inactive",
            }
        );
    }

    static async stressTest() {
        console.log("Stress test: Opening windows rapidly...");

        // Open menu windows
        const menuTypes = [
            "user-list",
            "product-list",
            "orders",
            "reports",
            "settings",
        ];
        menuTypes.forEach((type, index) => {
            setTimeout(() => {
                windowManager.openMenuWindow(
                    type,
                    `/${type.replace("-list", "s")}`
                );
            }, index * 200);
        });

        // Open detail windows
        await this.delay(1500);
        demoUsers.forEach((user, index) => {
            setTimeout(() => {
                windowManager.openDetailWindow(
                    "user-detail",
                    "shared",
                    "/user-detail",
                    user
                );
            }, index * 300);
        });

        // This should trigger the 8-window limit and close oldest windows
    }

    static broadcastTestMessage() {
        const testData = {
            type: "test-broadcast",
            message: "This is a test broadcast message",
            timestamp: new Date().toISOString(),
            data: { value: Math.random() },
        };

        windowManager.broadcastToWindows(testData);
        console.log("Broadcast sent:", testData);
    }

    static updateUserData(userId: string, updates: Partial<DemoUser>) {
        const updateMessage = {
            type: "user-updated",
            data: { id: userId, ...updates },
        };

        windowManager.broadcastToWindows(updateMessage);
        console.log("User update broadcast:", updateMessage);
    }

    static getWindowStats() {
        const windows = windowManager.getAllWindows();
        const stats = {
            total: windows.length,
            menuWindows: windows.filter((w) => w.type === "menu").length,
            detailWindows: windows.filter((w) => w.type === "detail").length,
            windowsByContext: windows.reduce((acc, w) => {
                acc[w.context || "unknown"] =
                    (acc[w.context || "unknown"] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
        };

        console.table(stats);
        return stats;
    }

    private static delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Make demo functions available globally for testing
declare global {
    interface Window {
        windowDemo: typeof WindowDemo;
        windowManager: typeof windowManager;
    }
}

if (typeof window !== "undefined") {
    window.windowDemo = WindowDemo;
    window.windowManager = windowManager;
}
