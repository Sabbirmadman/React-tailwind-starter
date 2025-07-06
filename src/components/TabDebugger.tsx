import React from "react";
import { useTabManagement } from "../utils/tabManagement";

const TabDebugger: React.FC = () => {
    const { trackedTabs, handleTabNavigation } = useTabManagement();

    const testNoReload = () => {
        console.log("🔍 Testing no reload navigation to /users");
        console.log("📊 Current tracked tabs:", trackedTabs);
        handleTabNavigation("/users")({} as React.MouseEvent);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 20,
                right: 20,
                background: "white",
                padding: 20,
                border: "1px solid #ccc",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 1001,
            }}
        >
            <h3>Tab Debug Panel</h3>

            <div style={{ marginBottom: 10 }}>
                <strong>
                    Tracked Tabs ({Object.keys(trackedTabs).length}):
                </strong>
                {Object.entries(trackedTabs).map(([key, tab]) => (
                    <div key={key} style={{ fontSize: 12, marginLeft: 10 }}>
                        • {key}: {tab.url} ({tab.type})
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                <button onClick={testNoReload} style={{ padding: 8 }}>
                    🚫 Test Users (No Reload)
                </button>
            </div>

            <div style={{ fontSize: 11, marginTop: 10, color: "#666" }}>
                Check browser console for detailed logs
            </div>
        </div>
    );
};

export default TabDebugger;
