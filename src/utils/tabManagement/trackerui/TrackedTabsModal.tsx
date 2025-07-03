import React, { useState } from "react";
import { useTabManagement } from "../hook/useTabManagement";

const TrackedTabsModal: React.FC = () => {
    const { trackedTabs, getTabDisplayName, removeTrackedWindow } =
        useTabManagement();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
        null
    );

    const tabEntries = Object.entries(trackedTabs);

    const handleRemoveWindow = (tabKey: string) => {
        removeTrackedWindow(tabKey);
        setShowDeleteConfirm(null);
    };

    if (!isVisible) {
        return null;
    }

    // Icon components using SVG
    const EyeIcon = () => (
        <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
        </svg>
    );

    const CloseIcon = () => (
        <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
        </svg>
    );

    const MinusIcon = () => (
        <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
        </svg>
    );

    const PlusIcon = () => (
        <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
            <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
        </svg>
    );

    const DeleteIcon = () => (
        <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
        </svg>
    );

    return (
        <div
            style={{
                position: "fixed",
                bottom: 20,
                left: 20,
                zIndex: 1000,
                maxWidth: 300,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    overflow: "hidden",
                }}
            >
                {/* Card Header */}
                <div
                    style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        backgroundColor: "#fafafa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        <EyeIcon />
                        Tracked Windows
                        <span
                            style={{
                                backgroundColor: "#f5f5f5",
                                color: "#666",
                                padding: "0 6px",
                                borderRadius: 10,
                                fontSize: 12,
                                minWidth: 20,
                                textAlign: "center",
                                border: "1px solid #d9d9d9",
                            }}
                        >
                            {tabEntries.length}
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#666",
                                transition: "background-color 0.2s",
                            }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#f5f5f5";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "transparent";
                            }}
                        >
                            {isExpanded ? <MinusIcon /> : <PlusIcon />}
                        </button>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#666",
                                transition: "background-color 0.2s",
                            }}
                            onClick={() => setIsVisible(false)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#f5f5f5";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "transparent";
                            }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: 16 }}>
                    {isExpanded && (
                        <div style={{ maxHeight: 200, overflow: "auto" }}>
                            {tabEntries.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "#999",
                                        padding: 16,
                                    }}
                                >
                                    No windows tracked
                                </div>
                            ) : (
                                <div>
                                    {tabEntries.map(([tabKey, tabInfo]) => (
                                        <div
                                            key={tabKey}
                                            style={{
                                                padding: "8px 0",
                                                borderBottom:
                                                    "1px solid #f0f0f0",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <div
                                                style={{ flex: 1, minWidth: 0 }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: 500,
                                                        fontSize: 12,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 4,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                tabInfo.type ===
                                                                "internal"
                                                                    ? "#52c41a"
                                                                    : "#1890ff",
                                                            display:
                                                                "inline-block",
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {getTabDisplayName(
                                                            tabKey
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 10,
                                                        color: "#666",
                                                        marginLeft: 12,
                                                    }}
                                                >
                                                    {tabInfo.type === "internal"
                                                        ? "Current Window"
                                                        : "External Window"}{" "}
                                                    • Opened:{" "}
                                                    {new Date(
                                                        tabInfo.timestamp
                                                    ).toLocaleTimeString()}
                                                </div>
                                            </div>
                                            {tabInfo.type === "external" && (
                                                <div
                                                    style={{
                                                        marginLeft: 8,
                                                        flexShrink: 0,
                                                        position: "relative",
                                                    }}
                                                >
                                                    <button
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            padding: "2px",
                                                            borderRadius: 4,
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            color: "#ff4d4f",
                                                            width: 20,
                                                            height: 20,
                                                            transition:
                                                                "background-color 0.2s",
                                                        }}
                                                        onClick={() => {
                                                            if (
                                                                showDeleteConfirm ===
                                                                tabKey
                                                            ) {
                                                                setShowDeleteConfirm(
                                                                    null
                                                                );
                                                            } else {
                                                                setShowDeleteConfirm(
                                                                    tabKey
                                                                );
                                                            }
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor =
                                                                "#fff2f0";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor =
                                                                "transparent";
                                                        }}
                                                        title="Remove tracked window"
                                                    >
                                                        <DeleteIcon />
                                                    </button>

                                                    {/* Delete Confirmation Popup */}
                                                    {showDeleteConfirm ===
                                                        tabKey && (
                                                        <div
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: -80,
                                                                right: 0,
                                                                backgroundColor:
                                                                    "#fff",
                                                                border: "1px solid #d9d9d9",
                                                                borderRadius: 6,
                                                                padding: 12,
                                                                boxShadow:
                                                                    "0 2px 8px rgba(0, 0, 0, 0.15)",
                                                                zIndex: 1001,
                                                                minWidth: 200,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    marginBottom: 8,
                                                                    fontSize: 12,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Remove window
                                                            </div>
                                                            <div
                                                                style={{
                                                                    marginBottom: 12,
                                                                    fontSize: 11,
                                                                    color: "#666",
                                                                }}
                                                            >
                                                                Are you sure you
                                                                want to remove
                                                                this tracked
                                                                window?
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    gap: 8,
                                                                    justifyContent:
                                                                        "flex-end",
                                                                }}
                                                            >
                                                                <button
                                                                    style={{
                                                                        padding:
                                                                            "4px 8px",
                                                                        fontSize: 11,
                                                                        border: "1px solid #d9d9d9",
                                                                        borderRadius: 4,
                                                                        backgroundColor:
                                                                            "#fff",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                        setShowDeleteConfirm(
                                                                            null
                                                                        )
                                                                    }
                                                                >
                                                                    No
                                                                </button>
                                                                <button
                                                                    style={{
                                                                        padding:
                                                                            "4px 8px",
                                                                        fontSize: 11,
                                                                        border: "1px solid #ff4d4f",
                                                                        borderRadius: 4,
                                                                        backgroundColor:
                                                                            "#ff4d4f",
                                                                        color: "#fff",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleRemoveWindow(
                                                                            tabKey
                                                                        )
                                                                    }
                                                                >
                                                                    Yes
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {!isExpanded && tabEntries.length > 0 && (
                        <div style={{ fontSize: 12, color: "#666" }}>
                            {tabEntries.length} window(s) being tracked
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackedTabsModal;
