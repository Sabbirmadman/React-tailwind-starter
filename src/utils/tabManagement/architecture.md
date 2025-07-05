# Tab Management System Architecture

## 🏗️ System Overview

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                           Tab Management System                              │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │

│  │   React Hook    │    │   Tab Manager   │    │   Core Classes  │        │

│  │                 │    │                 │    │                 │        │

│  │ useTabManagement│◄──►│   TabManager    │◄──►│  WindowManager  │        │

│  │                 │    │                 │    │  TabNavigation  │        │

│  │                 │    │                 │    │   TabDisplay    │        │

│  │                 │    │                 │    │   TabStorage    │        │

│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │

│                                                                             │

│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │

│  │   UI Components │    │   Browser APIs  │    │   Persistence   │        │

│  │                 │    │                 │    │                 │        │

│  │ TrackedTabsModal│    │   window.open   │    │   js-cookie     │        │

│  │   Navigation    │    │   window.focus  │    │   localStorage  │        │

│  │                 │    │   window.close  │    │                 │        │

│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🔄 Navigation Flow

```

User Action (Click Button)

         │

         ▼

┌─────────────────────────────────────────────────────────────────────────────┐

│                          Navigation Handler                                  │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  1. handleTabNavigation(path, forceReload)                                  │

│     │                                                                       │

│     ▼                                                                       │

│  2. Generate Tab Key                                                        │

│     │ tabKey = path.replace(/\//g, "_")                                     │

│     │ Example: "/users" → "_users"                                          │

│     ▼                                                                       │

│  3. Check for Existing Tab                                                  │

│     │                                                                       │

│     ├─ EXISTS ────────────────────────────────────────────────────────────┐ │

│     │                                                                     │ │

│     │  ┌─────────────────────────────────────────────────────────────────┐ │ │

│     │  │                   Focus Existing Window                        │ │ │

│     │  │                                                                 │ │ │

│     │  │  • Get window reference                                         │ │ │

│     │  │  • Check if window is valid                                     │ │ │

│     │  │  • Compare URLs (same page?)                                    │ │ │

│     │  │  • Apply forceReload logic                                      │ │ │

│     │  │  • Focus window                                                 │ │ │

│     │  │                                                                 │ │ │

│     │  └─────────────────────────────────────────────────────────────────┘ │ │

│     │                                                                     │ │

│     └─ NOT EXISTS ──────────────────────────────────────────────────────────┘ │

│                                                                             │

│  4. Open New Window                                                         │

│     │                                                                       │

│     ▼                                                                       │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                        Create New Window                                │ │

│  │                                                                         │ │

│  │  • window.open(url, windowName)                                        │ │

│  │  • Store window reference                                              │ │

│  │  • Update cookie storage                                               │ │

│  │  • Setup close monitoring                                              │ │

│  │  • Focus new window                                                    │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🗂️ Data Flow & Storage

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                              Data Storage                                   │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                           Cookie Storage                                │ │

│  │                                                                         │ │

│  │  Key: "app_opened_tabs"                                                 │ │

│  │  Value: {                                                               │ │

│  │    "_users": {                                                          │ │

│  │      timestamp: 1703123456789,                                          │ │

│  │      url: "http://localhost:3000/users",                                │ │

│  │      type: "external",                                                  │ │

│  │      windowName: "app_tab__users"                                       │ │

│  │    },                                                                   │ │

│  │    "_user_details": {                                                   │ │

│  │      timestamp: 1703123456790,                                          │ │

│  │      url: "http://localhost:3000/user-details/123",                     │ │

│  │      type: "external",                                                  │ │

│  │      windowName: "app_tab__user_details",                               │ │

│  │      pageType: "_user_details"                                          │ │

│  │    }                                                                    │ │

│  │  }                                                                      │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                          Tab Data Storage                               │ │

│  │                                                                         │ │

│  │  Key: "app_tab_data"                                                    │ │

│  │  Value: {                                                               │ │

│  │    "_user_details": {                                                   │ │

│  │      data: { userId: 123, name: "John Doe" },                          │ │

│  │      timestamp: 1703123456789                                           │ │

│  │    }                                                                    │ │

│  │  }                                                                      │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🎯 forceReload Logic

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                            Force Reload Logic                               │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  User clicks with forceReload parameter                                     │

│                         │                                                   │

│                         ▼                                                   │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                    Find Existing Window                                 │ │

│  │                                                                         │ │

│  │  ┌─────────────────┐                                                    │ │

│  │  │ Window Found?   │                                                    │ │

│  │  └─────────────────┘                                                    │ │

│  │           │                                                             │ │

│  │           ▼                                                             │ │

│  │  ┌─────────────────┐         ┌─────────────────┐                       │ │

│  │  │ Same URL?       │   NO    │ Different URL   │                       │ │

│  │  │                 │────────►│                 │                       │ │

│  │  │ forceReload?    │         │ → Navigate      │                       │ │

│  │  └─────────────────┘         │ → Focus         │                       │ │

│  │           │                  └─────────────────┘                       │ │

│  │           │ YES                                                         │ │

│  │           ▼                                                             │ │

│  │  ┌─────────────────┐         ┌─────────────────┐                       │ │

│  │  │ forceReload?    │   NO    │ Same URL        │                       │ │

│  │  │                 │────────►│                 │                       │ │

│  │  │                 │         │ → Just Focus    │                       │ │

│  │  └─────────────────┘         └─────────────────┘                       │ │

│  │           │                                                             │ │

│  │           │ YES                                                         │ │

│  │           ▼                                                             │ │

│  │  ┌─────────────────┐                                                    │ │

│  │  │ Same URL        │                                                    │ │

│  │  │                 │                                                    │ │

│  │  │ → Reload & Focus│                                                    │ │

│  │  └─────────────────┘                                                    │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🔧 Class Structure

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                              Core Classes                                   │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                         TabManager                                      │ │

│  │                      (Main Orchestrator)                               │ │

│  │                                                                         │ │

│  │  • navigateTo(options)                                                  │ │

│  │  • createNavigationHandler(path, forceReload)                          │ │

│  │  • createNavigationHandlerWithData(path, data, pageType, forceReload)  │ │

│  │  • getTrackedTabs()                                                     │ │

│  │  • removeTrackedWindow(tabKey)                                          │ │

│  │  • cleanup()                                                            │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                   │                                         │

│                                   ▼                                         │

│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │

│  │ WindowManager   │  │ TabNavigation   │  │   TabDisplay    │  │TabStorage│ │

│  │                 │  │                 │  │                 │  │         │ │

│  │ • openWindow    │  │ • handleNav     │  │ • getDisplayName│  │ • get   │ │

│  │ • focusWindow   │  │ • generateKey   │  │ • formatTime    │  │ • update│ │

│  │ • closeWindow   │  │ • findExisting  │  │ • setDisplayMap │  │ • store │ │

│  │ • cleanup       │  │ • createHandler │  │ • getTabSummary │  │ • clean │ │

│  │ • monitor       │  │ • navigate      │  │                 │  │         │ │

│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🎨 React Integration

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                            React Hook Flow                                  │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  Component Uses Hook                                                        │

│           │                                                                 │

│           ▼                                                                 │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                     useTabManagement()                                  │ │

│  │                                                                         │ │

│  │  ┌─────────────────┐                                                    │ │

│  │  │ State           │                                                    │ │

│  │  │                 │                                                    │ │

│  │  │ • trackedTabs   │                                                    │ │

│  │  │ • tabManager    │                                                    │ │

│  │  │                 │                                                    │ │

│  │  └─────────────────┘                                                    │ │

│  │                                                                         │ │

│  │  ┌─────────────────┐                                                    │ │

│  │  │ Effects         │                                                    │ │

│  │  │                 │                                                    │ │

│  │  │ • Load initial  │                                                    │ │

│  │  │ • Listen events │                                                    │ │

│  │  │ • Track current │                                                    │ │

│  │  │ • Cleanup       │                                                    │ │

│  │  │                 │                                                    │ │

│  │  └─────────────────┘                                                    │ │

│  │                                                                         │ │

│  │  ┌─────────────────┐                                                    │ │

│  │  │ Return Methods  │                                                    │ │

│  │  │                 │                                                    │ │

│  │  │ • navigateTo    │                                                    │ │

│  │  │ • createHandler │                                                    │ │

│  │  │ • removeWindow  │                                                    │ │

│  │  │ • getDisplayName│                                                    │ │

│  │  │                 │                                                    │ │

│  │  └─────────────────┘                                                    │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🌐 Multi-Window Communication

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                        Window Communication                                 │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐ │

│  │    Window A     │         │   Cookie Store  │         │    Window B     │ │

│  │   (Main App)    │         │                 │         │   (New Tab)     │ │

│  │                 │         │                 │         │                 │ │

│  │  User clicks    │         │                 │         │                 │ │

│  │  "Open Users"   │         │                 │         │                 │ │

│  │       │         │         │                 │         │                 │ │

│  │       ▼         │         │                 │         │                 │ │

│  │  1. Update      │────────►│  Cookie Update  │         │                 │ │

│  │     cookies     │         │                 │         │                 │ │

│  │                 │         │                 │         │                 │ │

│  │  2. Open new    │         │                 │         │                 │ │

│  │     window      │────────────────────────────────────►│  Window opens   │ │

│  │                 │         │                 │         │                 │ │

│  │  3. Monitor     │         │                 │         │                 │ │

│  │     window      │◄────────────────────────────────────│  Window active  │ │

│  │                 │         │                 │         │                 │ │

│  │                 │         │                 │         │  User closes    │ │

│  │  4. Cleanup     │◄────────│  Cookie Cleanup │◄────────│  window         │ │

│  │     on close    │         │                 │         │                 │ │

│  │                 │         │                 │         │                 │ │

│  └─────────────────┘         └─────────────────┘         └─────────────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 📊 State Management

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                           State Updates                                     │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  User Action (Navigation)                                                   │

│           │                                                                 │

│           ▼                                                                 │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                      TabStorage.updateStoredTabs()                      │ │

│  │                                                                         │ │

│  │  1. Update Cookie Storage                                               │ │

│  │     └─ Set cookie with new tab data                                     │ │

│  │                                                                         │ │

│  │  2. Dispatch Custom Event                                               │ │

│  │     └─ window.dispatchEvent('tabsUpdated', newData)                     │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                   │                                         │

│                                   ▼                                         │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │                      Event Listeners in All Windows                    │ │

│  │                                                                         │ │

│  │  All windows listen for 'tabsUpdated' event                            │ │

│  │           │                                                             │ │

│  │           ▼                                                             │ │

│  │  ┌─────────────────┐                                                    │ │

│  │  │ Update Local    │                                                    │ │

│  │  │ State           │                                                    │ │

│  │  │                 │                                                    │ │

│  │  │ setTrackedTabs  │                                                    │ │

│  │  │ (newData)       │                                                    │ │

│  │  │                 │                                                    │ │

│  │  └─────────────────┘                                                    │ │

│  │                                                                         │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🔍 Example Usage Flow

```

┌─────────────────────────────────────────────────────────────────────────────┐

│                          Real Usage Example                                 │

├─────────────────────────────────────────────────────────────────────────────┤

│                                                                             │

│  1. User on Home page clicks "Users" button                                │

│     │                                                                       │

│     ▼                                                                       │

│  handleTabNavigation('/users')                                              │

│     │                                                                       │

│     ▼                                                                       │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │ Check: Is there a tab with key "_users"?                               │ │

│  │ Result: NO (first time)                                                │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│     │                                                                       │

│     ▼                                                                       │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │ Open new window:                                                        │ │

│  │ • URL: http://localhost:3000/users                                      │ │

│  │ • Window name: app_tab__users                                           │ │

│  │ • Store in cookies                                                      │ │

│  │ • Setup close monitoring                                                │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

│  2. User navigates back to Home, clicks "Users" again                      │

│     │                                                                       │

│     ▼                                                                       │

│  handleTabNavigation('/users')                                              │

│     │                                                                       │

│     ▼                                                                       │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │ Check: Is there a tab with key "_users"?                               │ │

│  │ Result: YES (found existing window)                                     │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│     │                                                                       │

│     ▼                                                                       │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │ Focus existing window:                                                  │ │

│  │ • Check if window is still valid                                        │ │

│  │ • Compare URLs (same: /users)                                           │ │

│  │ • No forceReload → just focus                                           │ │

│  │ • Bring window to front                                                 │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

│  3. User clicks "Users (Fresh Data)" with forceReload=true                 │

│     │                                                                       │

│     ▼                                                                       │

│  handleTabNavigation('/users', true)                                        │

│     │                                                                       │

│     ▼                                                                       │

│  ┌─────────────────────────────────────────────────────────────────────────┐ │

│  │ Focus existing window:                                                  │ │

│  │ • Check if window is still valid                                        │ │

│  │ • Compare URLs (same: /users)                                           │ │

│  │ • forceReload=true → reload and focus                                   │ │

│  │ • window.location.reload()                                              │ │

│  │ • Bring window to front                                                 │ │

│  └─────────────────────────────────────────────────────────────────────────┘ │

│                                                                             │

└─────────────────────────────────────────────────────────────────────────────┘

```

## 🎯 Key Benefits

1.**🔄 Smart Window Management** - Avoids duplicate tabs for same content

2.**💾 Persistent State** - Survives page refreshes and browser restarts

3.**📊 Data Passing** - Share data between windows efficiently

4.**🎨 Flexible Display** - Customizable tab names and grouping

5.**🔍 Automatic Cleanup** - Cleans up closed windows automatically

6.**⚡ Performance** - Efficient cookie-based storage

7.**🔧 Modular Design** - Easy to extend and customize

## 🛠️ Technical Details

-**Storage**: Uses `js-cookie` for cross-window persistence

-**Communication**: Custom events for real-time updates

-**Monitoring**: Interval-based window close detection

-**Error Handling**: Graceful fallbacks for cross-origin issues

-**TypeScript**: Full type safety throughout

-**React**: Hooks-based integration with lifecycle management
