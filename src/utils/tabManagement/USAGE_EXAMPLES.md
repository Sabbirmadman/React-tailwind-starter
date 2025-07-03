# Tab Navigation with Reload Control - Usage Examples

The tab management system now has precise control over when tabs reload vs just focus. Here's how to use it:

## The Logic

1. **URL Changes**: If you navigate to a different URL in the same tab, it will navigate to the new URL (but won't reload the page unless you specify)
2. **Same URL**: If the URL is the same, it will only reload based on your `forceReload` flag

## Available Methods

### Basic Methods (with forceReload parameter)

```tsx
const {
    handleTabNavigation,
    handleTabNavigationWithData
} = useTabManagement();

// Navigate without reload (default behavior)
<button onClick={handleTabNavigation('/users')}>
    Open Users (no reload if already open)
</button>

// Navigate with force reload
<button onClick={handleTabNavigation('/users', true)}>
    Open Users (always reload)
</button>

// With data, no reload
<button onClick={handleTabNavigationWithData('/user-details', userData)}>
    Open User Details (no reload if same URL)
</button>

// With data, force reload
<button onClick={handleTabNavigationWithData('/user-details', userData, '_user_details', true)}>
    Open User Details (always reload)
</button>
```

### Convenience Methods (clearer intent)

```tsx
const {
    handleTabNavigationNoReload,
    handleTabNavigationWithReload,
    handleTabNavigationWithDataNoReload,
    handleTabNavigationWithDataWithReload
} = useTabManagement();

// Never reload - just focus if same URL, navigate if different URL
<button onClick={handleTabNavigationNoReload('/users')}>
    Open Users (never reload)
</button>

// Always reload
<button onClick={handleTabNavigationWithReload('/users')}>
    Open Users (always reload)
</button>

// With data, never reload
<button onClick={handleTabNavigationWithDataNoReload('/user-details', userData, '_user_details')}>
    Open User Details (never reload)
</button>

// With data, always reload
<button onClick={handleTabNavigationWithDataWithReload('/user-details', userData, '_user_details')}>
    Open User Details (always reload)
</button>
```

## Your Use Case Example

For your scenario where you go from Home → Users → Home → Users, here's what happens:

### With No Reload (Recommended for better UX)

```tsx
// This will focus the existing users tab without reloading
<button onClick={handleTabNavigationNoReload('/users')}>
    Go to Users
</button>

// Or equivalently:
<button onClick={handleTabNavigation('/users', false)}>
    Go to Users
</button>
```

**Behavior:**

1. Home → Users: Opens new Users tab
2. Users → Home: Focuses Home tab
3. Home → Users: Focuses existing Users tab **without reload** ✅

### With Force Reload

```tsx
// This will focus the existing users tab AND reload it
<button onClick={handleTabNavigationWithReload('/users')}>
    Go to Users (Fresh Data)
</button>

// Or equivalently:
<button onClick={handleTabNavigation('/users', true)}>
    Go to Users (Fresh Data)
</button>
```

**Behavior:**

1. Home → Users: Opens new Users tab
2. Users → Home: Focuses Home tab
3. Home → Users: Focuses existing Users tab **with reload** 🔄

## Complete Component Example

```tsx
import React from "react";
import { useTabManagement } from "../utils/tabManagement";

const Navigation: React.FC = () => {
    const {
        handleTabNavigationNoReload,
        handleTabNavigationWithReload,
        handleTabNavigationWithDataNoReload,
        handleTabNavigationWithDataWithReload,
    } = useTabManagement();

    const userData = { id: 123, name: "John Doe" };

    return (
        <nav>
            {/* Quick navigation - no reload for better UX */}
            <button onClick={handleTabNavigationNoReload("/")}>Home</button>
            <button onClick={handleTabNavigationNoReload("/users")}>
                Users
            </button>
            <button onClick={handleTabNavigationNoReload("/products")}>
                Products
            </button>

            {/* Fresh data navigation - with reload */}
            <button onClick={handleTabNavigationWithReload("/users")}>
                Users (Fresh Data)
            </button>

            {/* Data passing without reload */}
            <button
                onClick={handleTabNavigationWithDataNoReload(
                    "/user-details/123",
                    userData,
                    "_user_details"
                )}
            >
                View User Details
            </button>

            {/* Data passing with reload */}
            <button
                onClick={handleTabNavigationWithDataWithReload(
                    "/user-details/123",
                    userData,
                    "_user_details"
                )}
            >
                View User Details (Fresh)
            </button>
        </nav>
    );
};
```

## Best Practices

### When to Use No Reload (Recommended Default)

-   ✅ Quick navigation between sections
-   ✅ Better user experience (faster)
-   ✅ Preserves form state and scroll position
-   ✅ Reduces server load

```tsx
// Use for most navigation
<button onClick={handleTabNavigationNoReload("/users")}>Users</button>
```

### When to Use Force Reload

-   🔄 When you need fresh data
-   🔄 After making changes that affect the target page
-   🔄 For admin actions
-   🔄 When data might be stale

```tsx
// Use when you need fresh data
<button onClick={handleTabNavigationWithReload("/dashboard")}>
    Dashboard (Refresh)
</button>
```

## Migration from Previous Version

If you were using the old version, simply update your imports:

```tsx
// Old way (still works)
const { handleTabNavigation } = useTabManagement();
<button onClick={handleTabNavigation('/users', false)}>No Reload</button>
<button onClick={handleTabNavigation('/users', true)}>With Reload</button>

// New way (clearer intent)
const {
    handleTabNavigationNoReload,
    handleTabNavigationWithReload
} = useTabManagement();
<button onClick={handleTabNavigationNoReload('/users')}>No Reload</button>
<button onClick={handleTabNavigationWithReload('/users')}>With Reload</button>
```

Both approaches work exactly the same way!
