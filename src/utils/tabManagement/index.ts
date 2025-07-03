// Export all types
export * from "./types";

// Export all utility classes
export { TabStorage } from "./storage";
export { WindowManagement } from "./windowManager";
export { TabNavigation } from "./navigation";
export { TabDisplay } from "./display";

// Export the main hook
export { useTabManagement } from "./useTabManagement";

// Export the tab manager
export { TabManager, createTabManager } from "./tabManager";
