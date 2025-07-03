# Tab Management System - Implementation Guide

## Overview

This tab management system allows you to track and manage multiple browser windows/tabs within your React application. It provides functionality to open new tabs, track existing ones, and seamlessly navigate between them.

## Features

-   ✅ Track multiple browser windows/tabs
-   ✅ Store and pass data between tabs
-   ✅ Visual indicator for tracked windows
-   ✅ Remove/close tracked windows
-   ✅ Works with React Router
-   ✅ No external dependencies (pure React + localStorage)

## Quick Start

### 1. Copy Required Files

Copy the following folder structure to your project:

```
src/
├── utils/
│   └── tabManagement/
│       ├── index.ts
│       ├── storage.ts
│       ├── tabManager.ts
│       ├── types.ts
│       ├── navigation.ts
│       ├── display.ts
│       ├── windowManager.ts
│       └── hook/
│           └── useTabManagement.ts
└── components/
    └── TrackedTabsModal.tsx
```

### 2. Install Dependencies

Make sure you have React Router installed:

```bash
npm install react-router-dom
# or
yarn add react-router-dom
```

### 3. Basic Setup

#### Add the TrackedTabsModal to your main layout:

```tsx
// In your main App.tsx or layout component
import TrackedTabsModal from "./components/TrackedTabsModal";

function App() {
    return (
        <Router>
            <div className="app">
                {/* Your existing routes */}
                <Routes>{/* Your routes here */}</Routes>

                {/* Add the TrackedTabsModal */}
                <TrackedTabsModal />
            </div>
        </Router>
    );
}
```

### 4. Using the Hook in Your Components

```tsx
import { useTabManagement } from "../utils/tabManagement/hook/useTabManagement";

const YourComponent: React.FC = () => {
    const { handleTabNavigation, handleTabNavigationWithData } =
        useTabManagement();

    // Simple navigation
    const handleSimpleNavigation = () => {
        handleTabNavigation("/some-page")();
    };

    // Navigation with data
    const handleNavigationWithData = (data: any) => {
        handleTabNavigationWithData(
            "/details-page",
            { type: "SOME_DATA", payload: data },
            "_details_page"
        )();
    };

    return (
        <div>
            <button onClick={handleSimpleNavigation}>Open Simple Page</button>
            <button onClick={() => handleNavigationWithData(someData)}>
                Open Page with Data
            </button>
        </div>
    );
};
```

### 5. Receiving Data in Target Components

```tsx
import { getAndConsumeTabData } from "../utils/tabManagement/hook/useTabManagement";

const DetailsPage: React.FC = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Get data passed from the opening tab
        const tabData = getAndConsumeTabData("current_details_page");
        if (tabData?.type === "SOME_DATA") {
            setData(tabData.payload);
        }
    }, []);

    return (
        <div>
            {data ? (
                <div>Data received: {JSON.stringify(data)}</div>
            ) : (
                <div>No data received</div>
            )}
        </div>
    );
};
```

## Configuration Options

### Custom Tab Display Names

Edit `src/utils/tabManagement/display.ts` to customize how tab names are displayed:

```typescript
export class TabDisplay {
    getTabDisplayName(tabKey: string): string {
        const displayNames: Record<string, string> = {
            current_: "Home",
            current_users: "Users",
            current_products: "Products",
            // Add your custom mappings here
        };

        return displayNames[tabKey] || this.formatTabKey(tabKey);
    }
}
```

### Storage Configuration

The system uses localStorage by default. You can modify `src/utils/tabManagement/storage.ts` to use a different storage mechanism:

```typescript
// Example: Using sessionStorage instead
const STORAGE_KEY = "tracked_tabs";

export class TabStorage {
    static getStoredTabs(): StoredTabs {
        const stored = sessionStorage.getItem(STORAGE_KEY); // Changed from localStorage
        return stored ? JSON.parse(stored) : {};
    }

    // ... rest of the methods
}
```

## Advanced Usage

### Custom Page Types

You can define custom page types for better organization:

```tsx
const handleNavigateToUserDetails = (userId: string) => {
    handleTabNavigationWithData(
        `/user/${userId}`,
        { type: "USER_DETAILS", userId },
        "_user_details" // This groups all user detail pages together
    )();
};
```

### Conditional Tab Opening

```tsx
const handleConditionalNavigation = (
    shouldOpenNewTab: boolean,
    path: string
) => {
    if (shouldOpenNewTab) {
        handleTabNavigation(path)();
    } else {
        // Use regular React Router navigation
        navigate(path);
    }
};
```

## Troubleshooting

### Common Issues

1. **Data not being passed between tabs**

    - Ensure you're using the correct `pageType` parameter
    - Check that the receiving component calls `getAndConsumeTabData` with the right key

2. **Tabs not being tracked**

    - Make sure `TrackedTabsModal` is included in your app
    - Verify that React Router is properly set up

3. **Display names not showing correctly**
    - Update the display name mappings in `display.ts`
    - Check that tab keys are being generated correctly

### Browser Support

-   Chrome: ✅ Full support
-   Firefox: ✅ Full support
-   Safari: ✅ Full support
-   Edge: ✅ Full support

## Performance Considerations

-   The system uses localStorage which has a ~5-10MB limit
-   Tab data is automatically cleaned up when consumed
-   Consider implementing cleanup for old/stale tab data if needed

## Migration Guide

### From Version 1.x to 2.x

-   Remove all `forceReload` parameters from function calls
-   Update import statements if the file structure changed
-   Test tab navigation functionality

## Examples

See the included example pages for implementation patterns:

-   `UserListPage.tsx` - Basic navigation with data passing
-   `ProductListPage.tsx` - API integration example
-   `PostsPage.tsx` - External API with complex data structures
