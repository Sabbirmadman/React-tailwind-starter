import React, { useEffect, useState } from "react";
import { userStateManager, User } from "../utils/userStateManager";

const UserDetailPageCookie: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<User>>({});

    useEffect(() => {
        // Load initial user from cookie
        const currentUser = userStateManager.getCurrentUser();
        if (currentUser) {
            const completeUser = {
                ...currentUser,
                phone: currentUser.phone || "+1 (555) 123-4567",
                address:
                    currentUser.address || "123 Main St, City, State 12345",
                joinDate: currentUser.joinDate || "2023-01-15",
            };
            setUser(completeUser);
            setEditForm(completeUser);
        }

        // Listen for user changes from other tabs
        const unsubscribe = userStateManager.onUserChange((newUser) => {
            if (newUser) {
                const completeUser = {
                    ...newUser,
                    phone: newUser.phone || "+1 (555) 123-4567",
                    address:
                        newUser.address || "123 Main St, City, State 12345",
                    joinDate: newUser.joinDate || "2023-01-15",
                };
                setUser(completeUser);
                setEditForm(completeUser);
                setIsEditing(false); // Exit edit mode when user changes
            } else {
                setUser(null);
            }
        });

        return unsubscribe;
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(user || {});
    };

    const handleSave = () => {
        if (user && editForm) {
            const updatedUser = { ...user, ...editForm };
            setUser(updatedUser);
            setIsEditing(false);

            // Update the cookie - this will notify other tabs
            userStateManager.setCurrentUser(updatedUser);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(user || {});
    };

    const handleInputChange = (field: keyof User, value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-600">
                        <h2 className="text-xl font-semibold mb-2">
                            No User Selected
                        </h2>
                        <p>
                            Please select a user from the Users page to view
                            details.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Details - {user.name}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                Cookie-based tab sync
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                User Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Personal details and information (synced across
                                tabs).
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {/* Name */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Full name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.name || ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </dd>
                                </div>

                                {/* Email */}
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Email address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editForm.email || ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </dd>
                                </div>

                                {/* Phone */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Phone number
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editForm.phone || ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        ) : (
                                            user.phone
                                        )}
                                    </dd>
                                </div>

                                {/* Status */}
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Status
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {isEditing ? (
                                            <select
                                                value={editForm.status || ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="active">
                                                    Active
                                                </option>
                                                <option value="inactive">
                                                    Inactive
                                                </option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {user.status}
                                            </span>
                                        )}
                                    </dd>
                                </div>

                                {/* Join Date */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Join date
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.joinDate}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPageCookie;
