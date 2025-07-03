import React, { useState, useEffect } from "react";
import { useTabManagement } from "../utils/tabManagement/hook/useTabManagement";

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
}

const PostsPage: React.FC = () => {
    const { handleTabNavigationWithData } = useTabManagement();
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postsResponse, usersResponse] = await Promise.all([
                    fetch("https://jsonplaceholder.typicode.com/posts"),
                    fetch("https://jsonplaceholder.typicode.com/users"),
                ]);

                const postsData = await postsResponse.json();
                const usersData = await usersResponse.json();

                setPosts(postsData.slice(0, 20)); // Limit to first 20 posts
                setUsers(usersData);
            } catch (err) {
                setError("Failed to fetch data");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewPost = (post: Post) => {
        const author = users.find((user) => user.id === post.userId);
        handleTabNavigationWithData(
            `/post-details/${post.id}`,
            {
                type: "POST_DATA",
                post,
                author,
            },
            "_post_details"
        )();
    };

    const handleViewUserPosts = (user: User) => {
        const userPosts = posts.filter((post) => post.userId === user.id);
        handleTabNavigationWithData(
            `/user-posts/${user.id}`,
            {
                type: "USER_POSTS_DATA",
                user,
                posts: userPosts,
            },
            "_user_posts"
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
                Loading posts...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    color: "red",
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                }}
            >
                {error}
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ marginBottom: "20px", color: "#333" }}>Blog Posts</h1>

            {/* Users Section */}
            <div style={{ marginBottom: "30px" }}>
                <h2 style={{ marginBottom: "15px", color: "#555" }}>Authors</h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "15px",
                        marginBottom: "30px",
                    }}
                >
                    {users.map((user) => (
                        <div
                            key={user.id}
                            style={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                padding: "15px",
                                backgroundColor: "#f9f9f9",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#f0f0f0";
                                e.currentTarget.style.boxShadow =
                                    "0 2px 8px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#f9f9f9";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                            onClick={() => handleViewUserPosts(user)}
                        >
                            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                                {user.name}
                            </h4>
                            <p
                                style={{
                                    margin: "0 0 5px 0",
                                    fontSize: "14px",
                                    color: "#666",
                                }}
                            >
                                {user.email}
                            </p>
                            <p
                                style={{
                                    margin: "0",
                                    fontSize: "12px",
                                    color: "#888",
                                }}
                            >
                                Posts:{" "}
                                {
                                    posts.filter((p) => p.userId === user.id)
                                        .length
                                }
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posts Section */}
            <h2 style={{ marginBottom: "15px", color: "#555" }}>
                Recent Posts
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                }}
            >
                {posts.map((post) => {
                    const author = users.find(
                        (user) => user.id === post.userId
                    );
                    return (
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
                            <h3
                                style={{
                                    margin: "0 0 10px 0",
                                    fontSize: "18px",
                                    color: "#333",
                                    lineHeight: "1.4",
                                }}
                            >
                                {post.title}
                            </h3>
                            <p
                                style={{
                                    margin: "0 0 15px 0",
                                    color: "#666",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {post.body}
                            </p>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#888",
                                    borderTop: "1px solid #f0f0f0",
                                    paddingTop: "10px",
                                }}
                            >
                                By: {author?.name || "Unknown Author"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PostsPage;
