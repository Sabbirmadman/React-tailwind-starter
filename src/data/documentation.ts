// Documentation content imported from markdown files
export const documentationContent = {
    "quick-setup": `# Quick Setup Guide

## Overview

This guide will help you quickly set up the Tab Management System in your React application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React application

## Installation

1. **Copy the tabManagement folder** to your project's utilities directory:

\`\`\`
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
      └── README.md         # Documentation
\`\`\`

2. **Install dependencies**:

\`\`\`bash
npm install js-cookie react-router-dom
npm install --save-dev @types/js-cookie
\`\`\`

## Basic Usage

1. **Import the hook** in your component:

\`\`\`tsx
import { useTabManagement } from "../utils/tabManagement";
\`\`\`

2. **Use the hook** in your component:

\`\`\`tsx
function MyComponent() {
    const { handleTabNavigation } = useTabManagement();

    return (
        <button onClick={handleTabNavigation("/users")}>
            Open Users
        </button>
    );
}
\`\`\`

## Next Steps

- Read the full [Implementation Guide](./implementation-guide) for advanced features
- Check out the [Usage Examples](../utils/tabManagement/USAGE_EXAMPLES.md) for detailed examples
- Explore the [API Reference](../utils/tabManagement/README.md#api-reference) for complete documentation

## Support

If you encounter any issues, please check the troubleshooting section in the Implementation Guide.`,

    "implementation-guide": `# Implementation Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Advanced Features](#advanced-features)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Tab Management System is built with a modular architecture consisting of several key components:

### Core Modules

- **TabManager**: Main orchestrator class
- **TabStorage**: Cookie-based persistence layer
- **WindowManagement**: Browser window lifecycle management
- **TabNavigation**: Navigation logic and URL handling
- **TabDisplay**: Display utilities and formatting

### Data Flow

1. User clicks navigation link
2. TabManager checks for existing tabs
3. Either focuses existing tab or creates new one
4. Data is passed via cookies if needed
5. Tab tracking is updated

## Core Components

### TabManager Class

The main manager class that coordinates all tab operations:

\`\`\`tsx
import { TabManager } from "../utils/tabManagement";

const tabManager = new TabManager();

// Navigate to a new tab
tabManager.navigateTo({
    path: "/users",
    data: { userId: 123 },
    forceReload: false
});
\`\`\`

### useTabManagement Hook

React hook for easy integration:

\`\`\`tsx
import { useTabManagement } from "../utils/tabManagement";

function MyComponent() {
    const {
        handleTabNavigation,
        trackedTabs,
        removeTrackedWindow
    } = useTabManagement();

    return (
        <div>
            <button onClick={handleTabNavigation("/users")}>
                Open Users
            </button>
            
            {Object.entries(trackedTabs).map(([key, tab]) => (
                <div key={key}>
                    {tab.path} - {tab.type}
                    <button onClick={() => removeTrackedWindow(key)}>
                        Close
                    </button>
                </div>
            ))}
        </div>
    );
}
\`\`\`

## Advanced Features

### Data Passing Between Tabs

Pass data when opening new tabs:

\`\`\`tsx
const { handleTabNavigationWithData } = useTabManagement();

const openUserDetails = (user) => {
    handleTabNavigationWithData(
        \`/user-details/\${user.id}\`,
        user,
        "_user_details"
    )();
};
\`\`\`

### Page Type Grouping

Group similar pages for better management:

\`\`\`tsx
// All user detail pages will be grouped
handleTabNavigationWithData(
    "/user-details/123",
    userData,
    "_user_details" // pageType
);
\`\`\`

### Custom Display Names

Set custom names for tracked tabs:

\`\`\`tsx
import { TabDisplay } from "../utils/tabManagement";

const display = new TabDisplay();
display.setDisplayNames({
    _user_details: "User Profile",
    _product_details: "Product Info"
});
\`\`\`

## Best Practices

### 1. Use Page Types for Similar Pages

Group detail pages with the same pageType to prevent multiple tabs for the same type of content.

### 2. Clean Up Data After Use

Use \`getAndConsumeTabData\` to automatically clean up data after retrieval:

\`\`\`tsx
import { getAndConsumeTabData } from "../utils/tabManagement";

// In your target page
const userData = getAndConsumeTabData("_user_details");
if (userData) {
    setUser(userData);
}
\`\`\`

### 3. Handle Popup Blockers

Always check if window.open() returns null:

\`\`\`tsx
const newWindow = window.open(url, name, features);
if (!newWindow) {
    // Handle popup blocker
    alert("Please allow popups for this site");
}
\`\`\`

### 4. Minimize Data Storage

Only store essential data due to cookie size limits (typically 4KB per cookie).

## Troubleshooting

### Common Issues

1. **Tabs not tracking properly**
   - Check if cookies are enabled
   - Verify storage keys are not conflicting
   - Ensure proper cleanup on window close

2. **Data not passing between tabs**
   - Verify data is being stored before navigation
   - Check if data is being retrieved in target page
   - Ensure pageType is consistent

3. **Windows not opening**
   - Check popup blocker settings
   - Verify window.open() is not being blocked
   - Test with different browsers

### Debug Mode

Enable debug logging:

\`\`\`tsx
import { TabManager } from "../utils/tabManagement";

const tabManager = new TabManager();
tabManager.enableDebugMode(); // Add this line for debugging
\`\`\`

### Performance Considerations

- Limit the number of tracked tabs (recommended: < 10)
- Clean up old data regularly
- Use pageType grouping to reduce tab count
- Monitor cookie usage in browser dev tools

## Migration Guide

### From Single Hook

If migrating from a large single hook:

1. Replace imports: \`import { useTabManagement } from '../utils/tabManagement'\`
2. API remains the same for existing components
3. Add individual classes for more granular control
4. Update any custom storage logic to use TabStorage

### From Other Tab Management Libraries

1. Replace navigation calls with handleTabNavigation
2. Update data passing to use handleTabNavigationWithData
3. Replace tab tracking with trackedTabs from hook
4. Update cleanup logic to use removeTrackedWindow

## API Reference

For complete API documentation, see the [README.md](../utils/tabManagement/README.md) file in the tabManagement package.

## Examples

See [USAGE_EXAMPLES.md](../utils/tabManagement/USAGE_EXAMPLES.md) for detailed usage examples and patterns.`
}; 