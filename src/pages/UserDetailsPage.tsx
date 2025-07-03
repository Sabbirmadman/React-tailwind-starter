import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getAndConsumeTabData } from "../utils/tabManagement/hook/useTabManagement";
import UserForm from "../components/UserForm";

export interface User {
    id?: string;
    name: string;
    email: string;
    phone: string;
    department: string;
}

const UserDetailsPage: React.FC = () => {
    const { userId } = useParams();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect runs once when component mounts and when URL params change
        const userIdFromUrl = userId || searchParams.get("userId");
        const mode = searchParams.get("mode");

        // Try to get data from cookies first - use the same key as in UserListPage
        const tabData = getAndConsumeTabData("_user_details");

        if (tabData?.type === "USER_DATA") {
            // Data found in cookies
            setUser(tabData.user);
        } else if (mode === "add") {
            // New user mode
            setUser({
                name: "",
                email: "",
                phone: "",
                department: "",
            });
        } else if (userIdFromUrl) {
            // Edit mode but no data in cookies
            setUser({
                id: userIdFromUrl,
                name: "",
                email: "",
                phone: "",
                department: "",
            });
        } else {
            // Default empty form
            setUser({
                name: "",
                email: "",
                phone: "",
                department: "",
            });
        }

        setIsLoading(false);
    }, [userId, searchParams.toString()]); // Use toString() to avoid object reference issues

    if (isLoading) {
        return (
            <div style={{ padding: 24, textAlign: "center" }}>
                <p>Loading user details...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <h2>
                {user?.id && user?.name
                    ? `Edit User: ${user.name}`
                    : user?.id
                    ? `Edit User (ID: ${user.id})`
                    : "Add New User"}
            </h2>
            <UserForm user={user} />
        </div>
    );
};

export default UserDetailsPage;
