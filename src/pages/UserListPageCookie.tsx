import React, { useEffect, useState } from "react";
import { useWindowManager } from "../hooks/useWindowManager";
import { userStateManager, User } from "../utils/userStateManager";

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

const UserListPageCookie: React.FC = () => {
    const [users, setUsers] = useState<User[]>(sampleUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { openMenuWindow } = useWindowManager();

    useEffect(() => {
        // Listen for user updates from detail page
        const unsubscribe = userStateManager.onUserChange((updatedUser) => {
            if (updatedUser) {
                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === updatedUser.id
                            ? { ...user, ...updatedUser }
                            : user
                    )
                );
                setSelectedUser(updatedUser);
            }
        });

        return unsubscribe;
    }, []);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);

        // Set user in cookie (this will sync across all tabs)
        userStateManager.setCurrentUser(user);

        // Open user detail tab (will use cookie data)
        openMenuWindow("user-detail", "/user-detail-cookie");
    };

    const handleStatusToggle = (userId: string) => {
        setUsers((prev) => {
            const updatedUsers = prev.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          status: (user.status === "active"
                              ? "inactive"
                              : "active") as "active" | "inactive",
                      }
                    : user
            );

            // If this user is currently selected, update the cookie too
            const updatedUser = updatedUsers.find((u) => u.id === userId);
            if (selectedUser?.id === userId && updatedUser) {
                userStateManager.setCurrentUser(updatedUser);
            }

            return updatedUsers;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Management (Cookie-based)
                        </h1>
                        <div className="text-sm text-gray-500">
                            Click a user to open details in a shared tab
                        </div>
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
                                    <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                                        <div
                                            className="flex items-center cursor-pointer flex-1"
                                            onClick={() =>
                                                handleUserClick(user)
                                            }
                                        >
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-white">
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                        {selectedUser?.id ===
                                                            user.id && (
                                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Currently
                                                                Viewing
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusToggle(
                                                                    user.id
                                                                );
                                                            }}
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                user.status ===
                                                                "active"
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                                            }`}
                                                        >
                                                            {user.status}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Cookie-based Tab Synchronization
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>
                                            Click any user to open/focus the
                                            User Detail tab
                                        </li>
                                        <li>
                                            The same tab shows different users
                                            based on your selection
                                        </li>
                                        <li>
                                            Changes made in the detail tab sync
                                            back to this list
                                        </li>
                                        <li>
                                            Works across multiple browser tabs
                                            using cookies
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserListPageCookie;
