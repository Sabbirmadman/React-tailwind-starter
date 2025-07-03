import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    getAndConsumeTabData,
    useTabManagement,
} from "../utils/tabManagement/hook/useTabManagement";

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    website: string;
    phone: string;
    company: {
        name: string;
    };
}

const UserPostsPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { handleTabNavigationWithData } = useTabManagement();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // First, try to get data from tab management system
                const tabData = getAndConsumeTabData("current_user_posts");

                if (tabData?.type === "USER_POSTS_DATA") {
                    // Data was passed from another tab
                    setUser(tabData.user);
                    setPosts(tabData.posts);
                } else if (userId) {
                    // No tab data, fetch everything from API
                    const [userResponse, postsResponse] = await Promise.all([
                        fetch(
                            `https://jsonplaceholder.typicode.com/users/${userId}`
                        ),
                        fetch(
                            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
                        ),
                    ]);

                    const userData = await userResponse.json();
                    const postsData = await postsResponse.json();

                    setUser(userData);
                    setPosts(postsData);
                }
            } catch (err) {
                setError("Failed to fetch user posts");
                console.error("Error fetching user posts:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [userId]);

    const handleViewPost = (post: Post) => {
        handleTabNavigationWithData(
            `/post-details/${post.id}`,
            {
                type: "POST_DATA",
                post,
                author: user,
            },
            "_post_details"
        )();
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "400px",
                    fontSize: "16px",
                }}
            >
                Loading user posts...
            </div>
        );
    }

    if (error || !user) {
        return (
            <div
                style={{
                    color: "red",
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                }}
            >
                {error || "User not found"}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
            {/* User Profile Header */}
            <div
                style={{
                    marginBottom: "30px",
                    padding: "25px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                }}
            >
                <h1
                    style={{
                        fontSize: "28px",
                        marginBottom: "15px",
                        color: "#333",
                    }}
                >
                    {user.name}'s Posts
                </h1>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "15px",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Contact
                        </h4>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            📧 {user.email}
                        </p>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            📞 {user.phone}
                        </p>
                        {user.website && (
                            <p style={{ margin: "0", color: "#6c757d" }}>
                                🌐{" "}
                                <a
                                    href={`http://${user.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#007bff",
                                        textDecoration: "none",
                                    }}
                                >
                                    {user.website}
                                </a>
                            </p>
                        )}
                    </div>

                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Company
                        </h4>
                        <p style={{ margin: "0", color: "#6c757d" }}>
                            🏢 {user.company.name}
                        </p>
                    </div>

                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Statistics
                        </h4>
                        <p style={{ margin: "0", color: "#6c757d" }}>
                            📝 {posts.length} posts published
                        </p>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div>
                <h2
                    style={{
                        fontSize: "24px",
                        marginBottom: "20px",
                        color: "#333",
                        borderBottom: "2px solid #e0e0e0",
                        paddingBottom: "10px",
                    }}
                >
                    All Posts ({posts.length})
                </h2>

                {posts.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#666",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                            border: "1px solid #e9ecef",
                        }}
                    >
                        <p style={{ fontSize: "18px", margin: "0" }}>
                            No posts found for this user.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(350px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {posts.map((post, index) => (
                            <div
                                key={post.id}
                                style={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    position: "relative",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 1px 3px rgba(0,0,0,0.1)";
                                }}
                                onClick={() => handleViewPost(post)}
                            >
                                {/* Post Number Badge */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "15px",
                                        right: "15px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {index + 1}
                                </div>

                                <h3
                                    style={{
                                        margin: "0 0 15px 0",
                                        fontSize: "18px",
                                        color: "#333",
                                        lineHeight: "1.4",
                                        paddingRight: "40px", // Make room for the badge
                                    }}
                                >
                                    {post.title}
                                </h3>

                                <p
                                    style={{
                                        margin: "0",
                                        color: "#666",
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                >
                                    {post.body}
                                </p>

                                {/* Read More Indicator */}
                                <div
                                    style={{
                                        marginTop: "15px",
                                        paddingTop: "15px",
                                        borderTop: "1px solid #f0f0f0",
                                        fontSize: "12px",
                                        color: "#007bff",
                                        fontWeight: "500",
                                    }}
                                >
                                    Click to read full post →
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPostsPage;
