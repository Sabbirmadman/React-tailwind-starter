# Tab Management Package

A modular, reusable tab management system for React applications that allows you to track and manage multiple browser tabs/windows with data persistence using cookies.

## Features

-   🔄 Smart tab navigation (focus existing or create new)
-   💾 Cookie-based state persistence
-   📊 Data passing between tabs
-   🎯 Page type grouping (e.g., user details pages)
-   🔍 Window tracking and cleanup
-   🎨 Customizable display names
-   ⚛️ React hook integration
-   🏗️ Modular architecture

## Installation

Copy the entire `tabManagement` folder to your project's utilities directory:

```
src/
  utils/
    tabManagement/
      ├── index.ts          # Main exports
      ├── types.ts          # TypeScript interfaces
      ├── storage.ts        # Cookie storage utilities
      ├── windowManager.ts  # Window management
      ├── navigation.ts     # Navigation logic
      ├── display.ts        # Display utilities
      ├── tabManager.ts     # Main manager class
      ├── useTabManagement.ts # React hook
      └── README.md         # This file
```

## Dependencies

```bash
npm install js-cookie react-router-dom
npm install --save-dev @types/js-cookie
```

## Quick Start

### 1. Basic Hook Usage

```tsx
import { useTabManagement } from "../utils/tabManagement";

function MyComponent() {
    const {
        handleTabNavigation,
        handleTabNavigationWithData,
        trackedTabs,
        removeTrackedWindow,
        getTabDisplayName,
    } = useTabManagement();

    return (
        <div>
            {/* Simple navigation */}
            <button onClick={handleTabNavigation("/users")}>Open Users</button>

            {/* Navigation with data */}
            <button
                onClick={handleTabNavigationWithData(
                    "/user-details",
                    { userId: 123 },
                    "_user_details"
                )}
            >
                Open User Details
            </button>

            {/* Display tracked tabs */}
            {Object.entries(trackedTabs).map(([tabKey, tabInfo]) => (
                <div key={tabKey}>
                    {getTabDisplayName(tabKey)} - {tabInfo.type}
                    <button onClick={() => removeTrackedWindow(tabKey)}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}
```

### 2. Direct Class Usage

```tsx
import {
    TabManager,
    createTabManager,
    TabStorage,
} from "../utils/tabManagement";

// Create manager instance
const tabManager = createTabManager();

// Navigate to a tab
tabManager.navigateTo({
    path: "/products",
    data: { productId: 456 },
    forceReload: false,
});

// Get all tracked tabs
const trackedTabs = tabManager.getTrackedTabs();

// Store/retrieve data
TabStorage.storeTabData("user_123", { name: "John", age: 30 });
const userData = TabStorage.getTabData("user_123");
```

## API Reference

### Hook: `useTabManagement()`

Returns an object with the following methods and properties:

#### Methods

-   **`handleTabNavigation(path, forceReload?)`** - Returns click handler for simple navigation
-   **`handleTabNavigationWithData(path, data?, pageType?, forceReload?)`** - Returns click handler for navigation with data
-   **`removeTrackedWindow(tabKey)`** - Remove and close a tracked window
-   **`getTabDisplayName(tabKey)`** - Get human-readable name for a tab
-   **`getStoredTabs()`** - Get all stored tabs
-   **`updateStoredTabs(tabKey, action, tabInfo?)`** - Update tab storage

#### Properties

-   **`trackedTabs`** - Object containing all currently tracked tabs

### Classes

#### `TabStorage`

Static methods for cookie-based storage:

-   `getStoredTabs()` - Get all stored tabs
-   `updateStoredTabs(tabKey, action, tabInfo)` - Update tab storage
-   `storeTabData(tabKey, data)` - Store data for a tab
-   `getTabData(tabKey)` - Retrieve data for a tab
-   `cleanupTabData(tabKey)` - Remove data for a tab
-   `clearAll()` - Clear all storage

#### `WindowManagement`

Window lifecycle management:

-   `openWindow(url, windowName, features?)` - Open a new window
-   `focusWindow(windowRef)` - Focus an existing window
-   `closeWindow(windowRef)` - Close a window
-   `cleanupWindow(tabKey)` - Clean up window tracking
-   `cleanupAll()` - Clean up all windows

#### `TabNavigation`

Navigation logic:

-   `handleNavigation(options)` - Handle tab navigation
-   `generateTabKey(path, pageType?)` - Generate tab key from path
-   `findExistingTab(tabKey, pageType?)` - Find existing tab

#### `TabDisplay`

Display utilities:

-   `getTabDisplayName(tabKey)` - Get display name
-   `setDisplayNames(displayMap)` - Set custom display names
-   `formatTimestamp(timestamp)` - Format timestamp
-   `formatRelativeTime(timestamp)` - Format relative time

#### `TabManager`

Main manager combining all utilities:

-   `navigateTo(options)` - Navigate to a tab
-   `getTrackedTabs()` - Get all tracked tabs
-   `removeTrackedWindow(tabKey)` - Remove tracked window
-   `cleanup()` - Clean up all resources

### Utility Functions

```tsx
import { getAndConsumeTabData, storeTabData } from "../utils/tabManagement";

// Store data before navigation
storeTabData("user_details", { userId: 123, name: "John" });

// Retrieve and consume data in target page
const userData = getAndConsumeTabData("user_details"); // Data is removed after retrieval
```

## Advanced Usage

### Page Type Grouping

Use `pageType` to group similar pages (useful for detail pages):

```tsx
// All user detail pages will be grouped under '_user_details'
handleTabNavigationWithData(
    "/user-details/123",
    { userId: 123 },
    "_user_details" // pageType
);
```

### Custom Display Names

```tsx
import { TabDisplay } from "../utils/tabManagement";

const display = new TabDisplay();
display.setDisplayNames({
    _custom_page: "My Custom Page",
    _user_details: "User Profile",
});
```

### Force Reload

```tsx
// Force reload existing tab
handleTabNavigation("/users", true); // forceReload = true
```

## Configuration

### Storage Keys

Default cookie keys (can be modified in `storage.ts`):

-   `STORAGE_KEY`: "app_opened_tabs"
-   `DATA_STORAGE_KEY`: "app_tab_data"

### Cookie Expiration

-   Tab storage: 1 day
-   Data storage: 5 minutes

## Browser Compatibility

-   Modern browsers with Cookie support
-   Cross-origin restrictions apply for window access
-   Popup blockers may prevent window opening

## Best Practices

1. **Use pageType for similar pages**: Group detail pages with the same pageType
2. **Clean up data**: Use `getAndConsumeTabData` to automatically clean up after use
3. **Handle popup blockers**: Always check if `window.open()` returns null
4. **Minimize data storage**: Only store essential data due to cookie size limits
5. **Test cross-origin scenarios**: Ensure graceful handling of cross-origin restrictions

## Examples

### Complete Tab Modal Component

```tsx
import React from "react";
import { useTabManagement } from "../utils/tabManagement";

const TrackedTabsModal: React.FC = () => {
    const { trackedTabs, getTabDisplayName, removeTrackedWindow } =
        useTabManagement();

    return (
        <div className="tab-modal">
            <h3>Tracked Windows ({Object.keys(trackedTabs).length})</h3>
            {Object.entries(trackedTabs).map(([tabKey, tabInfo]) => (
                <div key={tabKey} className="tab-item">
                    <span>{getTabDisplayName(tabKey)}</span>
                    <span>{tabInfo.type}</span>
                    <button onClick={() => removeTrackedWindow(tabKey)}>
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};
```

### Navigation with User Data

```tsx
const UserList: React.FC = () => {
    const { handleTabNavigationWithData } = useTabManagement();

    const openUserDetails = (user: User) => {
        handleTabNavigationWithData(
            `/user-details/${user.id}`,
            user,
            "_user_details"
        )();
    };

    return (
        <div>
            {users.map((user) => (
                <button key={user.id} onClick={() => openUserDetails(user)}>
                    View {user.name}
                </button>
            ))}
        </div>
    );
};
```

### Consuming Data in Target Page

```tsx
const UserDetailsPage: React.FC = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Try to get data from tab management
        const userData = getAndConsumeTabData("_user_details");
        if (userData) {
            setUser(userData);
        } else {
            // Fallback: fetch from API using URL params
            fetchUserFromAPI();
        }
    }, []);

    return <div>{user ? user.name : "Loading..."}</div>;
};
```

## Migration from Single Hook

If you're migrating from a large single hook:

1. Replace hook imports: `import { useTabManagement } from '../utils/tabManagement'`
2. The API remains the same, so existing component code should work unchanged
3. You can now also use individual classes for more granular control
4. Add the package folder to your project and install dependencies

## License

This package is designed to be copied and customized for your specific needs.
