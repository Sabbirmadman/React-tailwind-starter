import React from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useTabManagement } from "../hooks/useTabManagement";
import { User } from "./UserDetailsPage";

const UserListPage: React.FC = () => {
    const { handleTabNavigationWithData } = useTabManagement();

    // Dummy user data
    const dummyUsers: User[] = [
        {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1-555-0123",
            department: "engineering",
        },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1-555-0124",
            department: "marketing",
        },
        {
            id: "3",
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            phone: "+1-555-0125",
            department: "sales",
        },
        {
            id: "4",
            name: "Alice Brown",
            email: "alice.brown@example.com",
            phone: "+1-555-0126",
            department: "hr",
        },
        {
            id: "5",
            name: "Charlie Wilson",
            email: "charlie.wilson@example.com",
            phone: "+1-555-0127",
            department: "finance",
        },
    ];

    const handleAddUser = () => {
        handleTabNavigationWithData(
            "/user-details?mode=add",
            undefined,
            "_user_details",
            false // Don't force reload for new user
        )();
    };

    const handleEditUser = (user: User) => {
        handleTabNavigationWithData(
            `/user-details/${user.id}`,
            {
                type: "USER_DATA",
                user: user,
            },
            "_user_details",
            true // Force reload when editing different user
        )();
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            render: (dept: string) =>
                dept.charAt(0).toUpperCase() + dept.slice(1),
        },
        {
            title: "Actions",
            key: "actions",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditUser(record)}
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <h2>User List</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddUser}
                >
                    Add User
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={dummyUsers}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />
        </div>
    );
};

export default UserListPage;
