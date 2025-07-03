# Quick Setup Guide for Tab Management System

## 🚀 Easy Integration Steps

### 1. Install Required Dependencies

```bash
npm install react-router-dom
```

### 2. Copy Files to Your Project

Copy these folders from this demo to your project:

-   `src/utils/tabManagement/` (entire folder)
-   `src/components/TrackedTabsModal.tsx`

### 3. Add to Your Main App Component

```tsx
// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrackedTabsModal from "./components/TrackedTabsModal";

function App() {
    return (
        <Router>
            <div className="App">
                {/* Your existing routes */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* Add your other routes */}
                </Routes>

                {/* Add this component - it will show as a floating widget */}
                <TrackedTabsModal />
            </div>
        </Router>
    );
}

export default App;
```

### 4. Use in Any Component

```tsx
import { useTabManagement } from "../utils/tabManagement/hook/useTabManagement";

const MyComponent = () => {
    const { handleTabNavigation, handleTabNavigationWithData } =
        useTabManagement();

    // Simple navigation - opens in new tab if needed
    const openSimplePage = () => {
        handleTabNavigation("/simple-page")();
    };

    // Navigation with data passing
    const openDetailPage = (data) => {
        handleTabNavigationWithData(
            "/detail-page",
            { type: "MY_DATA", payload: data },
            "_detail_page"
        )();
    };

    return (
        <div>
            <button onClick={openSimplePage}>Open Simple Page</button>
            <button onClick={() => openDetailPage(myData)}>
                Open with Data
            </button>
        </div>
    );
};
```

### 5. Receive Data in Target Component

```tsx
import { useEffect, useState } from "react";
import { getAndConsumeTabData } from "../utils/tabManagement/hook/useTabManagement";

const DetailPage = () => {
    const [receivedData, setReceivedData] = useState(null);

    useEffect(() => {
        // Get data passed from opening tab
        const tabData = getAndConsumeTabData("current_detail_page");
        if (tabData?.type === "MY_DATA") {
            setReceivedData(tabData.payload);
        }
    }, []);

    return (
        <div>
            {receivedData ? (
                <div>Received: {JSON.stringify(receivedData)}</div>
            ) : (
                <div>No data received</div>
            )}
        </div>
    );
};
```

## 🎯 Key Features

-   ✅ **Zero External Dependencies** - Only requires React Router
-   ✅ **Data Passing** - Send complex data between tabs
-   ✅ **Visual Tracking** - See all open tabs in a floating widget
-   ✅ **Auto Cleanup** - Data is automatically cleaned up
-   ✅ **Type Safe** - Full TypeScript support
-   ✅ **Lightweight** - Uses only localStorage and browser APIs

## 🛠 Customization

### Change Tab Display Names

Edit `src/utils/tabManagement/display.ts`:

```typescript
getTabDisplayName(tabKey: string): string {
  const displayNames: Record<string, string> = {
    current_: "Home",
    current_users: "User Management",
    current_posts: "Blog Posts",
    // Add your custom names here
  };

  return displayNames[tabKey] || this.formatTabKey(tabKey);
}
```

### Modify Storage Location

Edit `src/utils/tabManagement/storage.ts` to use sessionStorage or custom storage.

### Style the Floating Widget

The TrackedTabsModal component uses inline styles - modify them directly or replace with your CSS framework.

## 📱 Demo Pages Included

This demo includes several example pages showing different use cases:

1. **UserListPage** - Basic CRUD operations
2. **PostsPage** - External API integration (JSONPlaceholder)
3. **PostDetailsPage** - Detail view with data passing
4. **UserPostsPage** - Filtered data views
5. **PhotoGalleryPage** - Media handling with albums

## 🔧 Troubleshooting

**Data not being passed?**

-   Ensure pageType parameters match between sender and receiver
-   Check that getAndConsumeTabData is called in useEffect

**Tabs not being tracked?**

-   Verify TrackedTabsModal is included in your app
-   Check that React Router is properly configured

**Display names not working?**

-   Update the display name mappings in display.ts
-   Ensure tab keys are being generated correctly

## 🎉 That's it!

The system is now ready to use. Check the demo pages for implementation examples.
