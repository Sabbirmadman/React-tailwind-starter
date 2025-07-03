import React, { useState } from "react";
import { Card, List, Button, Badge } from "antd";
import {
    EyeOutlined,
    CloseOutlined,
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useTabManagement } from "../hooks/useTabManagement";

const TrackedTabsModal: React.FC = () => {
    const { trackedTabs, getTabDisplayName } = useTabManagement();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const tabEntries = Object.entries(trackedTabs);

    if (!isVisible) {
        return null;
    }

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
            <Card
                size="small"
                title={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <EyeOutlined />
                            Tracked Windows
                            <Badge count={tabEntries.length} size="small" />
                        </span>
                        <div>
                            <Button
                                type="text"
                                size="small"
                                icon={
                                    isExpanded ? (
                                        <MinusOutlined />
                                    ) : (
                                        <PlusOutlined />
                                    )
                                }
                                onClick={() => setIsExpanded(!isExpanded)}
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={() => setIsVisible(false)}
                            />
                        </div>
                    </div>
                }
                style={{
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    borderRadius: 8,
                }}
            >
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
                            <List
                                size="small"
                                dataSource={tabEntries}
                                renderItem={([tabKey, tabInfo]) => (
                                    <List.Item style={{ padding: "4px 0" }}>
                                        <div style={{ width: "100%" }}>
                                            <div
                                                style={{
                                                    fontWeight: 500,
                                                    fontSize: 12,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
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
                                                        display: "inline-block",
                                                    }}
                                                />
                                                {getTabDisplayName(tabKey)}
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
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                )}
                {!isExpanded && tabEntries.length > 0 && (
                    <div style={{ fontSize: 12, color: "#666" }}>
                        {tabEntries.length} window(s) being tracked
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TrackedTabsModal;
