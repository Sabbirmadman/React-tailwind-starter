import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { User } from "../pages/UserDetailsPage";

const { Option } = Select;

interface UserFormProps {
    user: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
        }
    }, [
        user?.id,
        user?.name,
        user?.email,
        user?.phone,
        user?.department,
        form,
    ]);

    const handleSubmit = async (values: User) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Saving user:", values);
            message.success(
                user?.id
                    ? "User updated successfully!"
                    : "User created successfully!"
            );
        } catch (error) {
            message.error("Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: 600 }}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter user name" }]}
            >
                <Input placeholder="Enter user name" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter valid email" },
                ]}
            >
                <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
                label="Phone"
                name="phone"
                rules={[
                    { required: true, message: "Please enter phone number" },
                ]}
            >
                <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
                label="Department"
                name="department"
                rules={[
                    { required: true, message: "Please select department" },
                ]}
            >
                <Select placeholder="Select department">
                    <Option value="engineering">Engineering</Option>
                    <Option value="marketing">Marketing</Option>
                    <Option value="sales">Sales</Option>
                    <Option value="hr">Human Resources</Option>
                    <Option value="finance">Finance</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="default" htmlType="submit" loading={loading}>
                    {user?.id ? "Update User" : "Create User"}
                </Button>
                <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => window.close()}
                >
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm;
