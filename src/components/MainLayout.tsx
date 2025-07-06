import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import TrackedTabsModal from "../utils/tabManagement/trackerui/TrackedTabsModal";
import { useTabManagement } from "../utils/tabManagement";

const { Header, Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { handleTabNavigation, handleTabNavigationWithData } =
        useTabManagement();

    const openDocumentation = (docType: string) => {
        const path = `/docs/${docType}`;
        const data = { docType, openedAt: new Date().toISOString() };
        handleTabNavigationWithData(path, data, "_documentation")();
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        color: "#fff",
                        fontWeight: "bold",
                        marginRight: 32,
                    }}
                >
                    Acounter
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectable={false}
                    style={{ flex: 1 }}
                >
                    <Menu.Item key="home">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="about">
                        <Link to="/about">About</Link>
                    </Menu.Item>
                    <Menu.SubMenu key="users" title="Users">
                        <Menu.Item key="userlist-newtab">
                            <a
                                href="/users"
                                onClick={handleTabNavigation("/users")}
                            >
                                User List
                            </a>
                        </Menu.Item>
                    </Menu.SubMenu>

                    <Menu.SubMenu key="todos" title="Todos">
                        <Menu.Item key="todos-newtab">
                            <a
                                href="/todos"
                                onClick={handleTabNavigation("/todos")}
                            >
                                Todo List
                            </a>
                        </Menu.Item>
                    </Menu.SubMenu>

                    <Menu.SubMenu key="docs" title="📚 Docs">
                        <Menu.Item key="quick-setup">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openDocumentation("quick-setup");
                                }}
                            >
                                📋 Quick Setup
                            </a>
                        </Menu.Item>
                        <Menu.Item key="implementation-guide">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openDocumentation("implementation-guide");
                                }}
                            >
                                📖 Implementation Guide
                            </a>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Header>
            <Content style={{ padding: 24 }}>
                {children}
                <TrackedTabsModal />
            </Content>
        </Layout>
    );
};

export default MainLayout;
