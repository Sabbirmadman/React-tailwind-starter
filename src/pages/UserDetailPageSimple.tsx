import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface User {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive";
    phone?: string;
    address?: string;
    joinDate?: string;
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

const UserDetailPageSimple: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<User>>({});

    useEffect(() => {
        // Find user by ID from URL params
        if (userId) {
            const foundUser = sampleUsers.find((u) => u.id === userId);
            if (foundUser) {
                const completeUser = {
                    ...foundUser,
                    phone: foundUser.phone || "+1 (555) 123-4567",
                    address:
                        foundUser.address || "123 Main St, City, State 12345",
                    joinDate: foundUser.joinDate || "2023-01-15",
                };
                setUser(completeUser);
                setEditForm(completeUser);
            } else {
                navigate("/users"); // Redirect if user not found
            }
        }
    }, [userId, navigate]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(user || {});
    };

    const handleSave = () => {
        if (user && editForm) {
            const updatedUser = { ...user, ...editForm };
            setUser(updatedUser);
            setIsEditing(false);
            // Here you could update the main users list via context/state management
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
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading user details...
                    </p>
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
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/users")}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ← Back to Users
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">
                                User Details - {user.name}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
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
                                Personal details and information.
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
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPageSimple;
