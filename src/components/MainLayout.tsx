import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useTabManagement } from "../hooks/useTabManagement";
import TrackedTabsModal from "./TrackedTabsModal";

const { Header, Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { handleTabNavigation } = useTabManagement();

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
                    <Menu.SubMenu key="products" title="Products">
                        <Menu.Item key="productlist-newtab">
                            <a
                                href="/products"
                                onClick={handleTabNavigation("/products")}
                            >
                                Product List
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
