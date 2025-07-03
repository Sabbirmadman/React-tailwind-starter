# Multi-Window Management System

A comprehensive window management system for React applications that provides intelligent window opening, focusing, context-aware navigation, and real-time cross-window communication.

## Features

### ✨ Core Features

-   **Smart Window Management**: Opens new windows for menu items and reuses existing ones
-   **Context-Aware Detail Views**: Each detail item gets its own unique window
-   **Real-time Communication**: Changes sync instantly across all related windows
-   **Window Limit Enforcement**: Maximum 8 tracked windows with automatic cleanup
-   **Persistent Tracking**: Uses secure cookies to track windows across sessions
-   **Popup Blocker Handling**: Direct user-action triggered window.open() calls
-   **Edge Case Handling**: Robust handling of closed/refreshed windows

### 🔧 Technical Features

-   **TypeScript Support**: Fully typed interfaces and components
-   **React Hooks**: Easy-to-use hooks for window management and communication
-   **Message Validation**: Origin checking and handshake protocols
-   **Automatic Cleanup**: Detects and removes closed window references
-   **Error Handling**: Graceful handling of communication failures
-   **Cross-Origin Safety**: Same-origin enforcement for security

## Quick Start

### 1. Use the Navigation Menu

```tsx
import { NavigationMenu } from "./components/NavigationMenu";

function App() {
    return (
        <div>
            <NavigationMenu />
            {/* Your app content */}
        </div>
    );
}
```

### 2. Window Management Hook

```tsx
import { useWindowManager } from "./hooks/useWindowManager";

function MyComponent() {
    const { openMenuWindow, openDetailWindow, windows } = useWindowManager();

    const handleOpenUsers = () => {
        openMenuWindow("user-list", "/users");
    };

    const handleOpenUserDetail = (userId: string, userData: any) => {
        openDetailWindow("user-detail", userId, "/user-detail", userData);
    };

    return (
        <div>
            <button onClick={handleOpenUsers}>Open Users</button>
            <p>Currently managing {windows.length} windows</p>
        </div>
    );
}
```

### 3. Window Communication Hook

```tsx
import { useWindowCommunication } from "./hooks/useWindowCommunication";

function ChildWindow() {
    const { windowContext, onMessageReceived, sendToParent } =
        useWindowCommunication();

    useEffect(() => {
        const unsubscribe = onMessageReceived((message) => {
            if (message.type === "data-update") {
                // Handle data updates from parent or other windows
                console.log("Received update:", message.data);
            }
        });

        return unsubscribe;
    }, [onMessageReceived]);

    const handleSendUpdate = () => {
        sendToParent({
            type: "user-updated",
            data: { id: "123", name: "Updated Name" },
        });
    };

    return (
        <div>
            <h1>Window: {windowContext?.windowName}</h1>
            <button onClick={handleSendUpdate}>Send Update</button>
        </div>
    );
}
```

## API Reference

### WindowManager

The core window management class that handles all window operations.

#### Methods

```typescript
// Open a menu window (reuses existing)
openMenuWindow(menuType: string, url?: string): Window | null

// Open a detail window (unique per context:id)
openDetailWindow(detailType: string, id: string, url?: string, data?: any): Window | null

// Send data to a specific window
sendDataToWindow(targetWindow: Window, data: any): boolean

// Broadcast to all windows
broadcastToWindows(data: any, excludeWindow?: Window): void

// Close specific window
closeWindow(windowName: string): void

// Close all windows
closeAllWindows(): void

// Get window by name
getWindow(windowName: string): Window | null

// Get all active windows
getAllWindows(): WindowInfo[]
```

### useWindowManager Hook

React hook that provides window management functionality.

```typescript
interface UseWindowManagerReturn {
    openMenuWindow: (menuType: string, url?: string) => Window | null;
    openDetailWindow: (
        detailType: string,
        id: string,
        url?: string,
        data?: any
    ) => Window | null;
    closeWindow: (windowName: string) => void;
    closeAllWindows: () => void;
    sendDataToWindow: (targetWindow: Window, data: any) => boolean;
    broadcastToWindows: (data: any, excludeWindow?: Window) => void;
    getAllWindows: () => WindowInfo[];
    getWindow: (windowName: string) => Window | null;
    windows: WindowInfo[]; // Real-time array of open windows
}
```

### useWindowCommunication Hook

React hook for cross-window communication.

```typescript
interface UseWindowCommunicationReturn {
    windowContext: WindowContext | null;
    sendToParent: (data: WindowMessage) => void;
    onMessageReceived: (callback: (data: WindowMessage) => void) => () => void;
    signalReady: () => void;
    updateContent: (data: unknown) => void;
}

interface WindowContext {
    windowName: string;
    type: "menu" | "detail";
    context: string;
    id?: string;
    isChildWindow: boolean;
}
```

## Window Naming Convention

The system uses a structured naming convention:

-   **Menu Windows**: `menu:{context}` (e.g., `menu:user-list`)
-   **Detail Windows**: `{context}:{id}` (e.g., `user-detail:123`)

## Message Types

Standard message types for cross-window communication:

```typescript
// Window lifecycle
"window-ready"; // Child window signals it's ready
"window-closed"; // Window is closing
"handshake"; // Parent initiates communication

// Data flow
"initial-data"; // Initial data sent to new window
"data-update"; // Real-time data updates
"content-update"; // Content-specific updates

// Application-specific
"user-updated"; // User data changed
"user-added"; // New user added
```

## Components

### NavigationMenu

Pre-built navigation component with window management integration.

```typescript
interface MenuItem {
    id: string;
    label: string;
    type: "menu" | "detail";
    context: string;
    url?: string;
}

interface NavigationMenuProps {
    menuItems?: MenuItem[];
    className?: string;
}
```

### WindowStatus

Real-time display of open windows with management controls.

```tsx
<WindowStatus /> // Shows in bottom-right corner
```

## Development Tools

Access developer tools in the browser console:

```javascript
// Run demo scenarios
window.windowDemo.runFullDemo();
window.windowDemo.stressTest();
window.windowDemo.broadcastTestMessage();

// Get window statistics
window.windowDemo.getWindowStats();

// Direct window manager access
window.windowManager.getAllWindows();
window.windowManager.closeAllWindows();
```

## Best Practices

### 1. Window Opening

-   Always trigger `window.open()` directly from user actions
-   Use descriptive context names for window identification
-   Provide fallback URLs for each window type

### 2. Data Synchronization

-   Send minimal data in initial window opening
-   Use real-time updates for data changes
-   Handle message failures gracefully

### 3. Resource Management

-   Clean up message listeners in useEffect cleanup
-   Monitor window count to avoid excessive resource usage
-   Handle window.closed states properly

### 4. User Experience

-   Provide visual indicators for open windows
-   Focus existing windows instead of creating duplicates
-   Show window status to users

## Error Handling

The system includes comprehensive error handling:

-   **Popup Blockers**: Falls back gracefully when windows can't be opened
-   **Cross-Origin**: Validates message origins for security
-   **Closed Windows**: Automatic detection and cleanup
-   **Communication Failures**: Retries and error logging
-   **Resource Limits**: Enforces maximum window count

## Security Considerations

-   All cross-window messages validate origin
-   Same-origin policy enforced for window access
-   Handshake protocol prevents unauthorized communication
-   Cookie data is limited to window tracking only

## Browser Compatibility

-   Modern browsers with window.postMessage support
-   Popup blocking detection and handling
-   Cross-platform window management
-   Responsive window sizing and positioning

## Performance

-   Efficient window reference tracking
-   Minimal cookie storage footprint
-   Optimized message passing
-   Automatic cleanup prevents memory leaks

## Troubleshooting

### Common Issues

1. **Windows not opening**: Check popup blocker settings
2. **Messages not received**: Verify same-origin policy
3. **Window count exceeded**: Close unused windows or increase limit
4. **Stale references**: Window cleanup runs automatically every 5 seconds

### Debug Tools

Use browser console for debugging:

```javascript
// Check window status
console.table(window.windowManager.getAllWindows());

// Monitor cookie data
document.cookie.split(";").filter((c) => c.includes("window_tracker"));

// Test message sending
window.windowManager.broadcastToWindows({ type: "test", data: "hello" });
```

This window management system provides a robust foundation for multi-window applications with real-time communication and intelligent resource management.
