import React, { useEffect, useState } from "react";
import { useWindowCommunication } from "../hooks/useWindowCommunication";
import { useWindowManager } from "../hooks/useWindowManager";

interface User {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive";
}

const sampleUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "active" },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        status: "active",
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        status: "inactive",
    },
    {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        status: "active",
    },
    {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie@example.com",
        status: "active",
    },
];

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(sampleUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { windowContext, onMessageReceived } = useWindowCommunication();
    const { openDetailWindow } = useWindowManager();

    useEffect(() => {
        // Listen for data updates from parent or other windows
        const unsubscribe = onMessageReceived((message) => {
            if (message.type === "user-updated" && message.data) {
                const userData = message.data as User;
                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === userData.id
                            ? { ...user, ...userData }
                            : user
                    )
                );
            } else if (message.type === "user-added" && message.data) {
                setUsers((prev) => [...prev, message.data as User]);
            }
        });

        return unsubscribe;
    }, [onMessageReceived]);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        // Open user detail window - use fixed tab name so all users share the same tab
        openDetailWindow("user-detail", "shared", "/user-detail", user);
    };

    const handleStatusToggle = (userId: string) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          status:
                              user.status === "active" ? "inactive" : "active",
                      }
                    : user
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Management
                        </h1>
                        {windowContext && (
                            <div className="text-sm text-gray-500">
                                Window: {windowContext.windowName}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <li key={user.id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div
                                                className="flex-1 min-w-0"
                                                onClick={() =>
                                                    handleUserClick(user)
                                                }
                                            >
                                                <p className="text-sm font-medium text-indigo-600 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {user.status}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusToggle(
                                                            user.id
                                                        );
                                                    }}
                                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Toggle Status
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {selectedUser && (
                        <div className="mt-6 bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Selected User
                                </h3>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {selectedUser.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Email
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {selectedUser.email}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Status
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {selectedUser.status}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
