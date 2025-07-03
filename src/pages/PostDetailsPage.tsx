import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAndConsumeTabData } from "../utils/tabManagement/hook/useTabManagement";

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

interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}

const PostDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // First, try to get data from tab management system
                const tabData = getAndConsumeTabData("current_post_details");

                if (tabData?.type === "POST_DATA") {
                    // Data was passed from another tab
                    setPost(tabData.post);
                    setAuthor(tabData.author);

                    // Fetch comments for this post
                    const commentsResponse = await fetch(
                        `https://jsonplaceholder.typicode.com/posts/${tabData.post.id}/comments`
                    );
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData);
                } else if (id) {
                    // No tab data, fetch everything from API
                    const [postResponse, commentsResponse] = await Promise.all([
                        fetch(
                            `https://jsonplaceholder.typicode.com/posts/${id}`
                        ),
                        fetch(
                            `https://jsonplaceholder.typicode.com/posts/${id}/comments`
                        ),
                    ]);

                    const postData = await postResponse.json();
                    const commentsData = await commentsResponse.json();

                    setPost(postData);
                    setComments(commentsData);

                    // Fetch author info
                    const userResponse = await fetch(
                        `https://jsonplaceholder.typicode.com/users/${postData.userId}`
                    );
                    const userData = await userResponse.json();
                    setAuthor(userData);
                }
            } catch (err) {
                setError("Failed to fetch post details");
                console.error("Error fetching post details:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [id]);

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
                Loading post details...
            </div>
        );
    }

    if (error || !post) {
        return (
            <div
                style={{
                    color: "red",
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                }}
            >
                {error || "Post not found"}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            {/* Post Header */}
            <div style={{ marginBottom: "30px" }}>
                <h1
                    style={{
                        fontSize: "28px",
                        marginBottom: "15px",
                        color: "#333",
                        lineHeight: "1.3",
                    }}
                >
                    {post.title}
                </h1>

                {author && (
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                            border: "1px solid #e9ecef",
                        }}
                    >
                        <h3 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Author: {author.name}
                        </h3>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            Email: {author.email}
                        </p>
                        {author.website && (
                            <p style={{ margin: "0", color: "#6c757d" }}>
                                Website:
                                <a
                                    href={`http://${author.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        marginLeft: "5px",
                                        color: "#007bff",
                                    }}
                                >
                                    {author.website}
                                </a>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div style={{ marginBottom: "40px" }}>
                <div
                    style={{
                        fontSize: "16px",
                        lineHeight: "1.6",
                        color: "#333",
                        backgroundColor: "#fff",
                        padding: "25px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                    }}
                >
                    {post.body.split("\n").map((paragraph, index) => (
                        <p key={index} style={{ marginBottom: "15px" }}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            {/* Comments Section */}
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
                    Comments ({comments.length})
                </h2>

                {comments.length === 0 ? (
                    <p style={{ color: "#666", fontStyle: "italic" }}>
                        No comments yet.
                    </p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                style={{
                                    padding: "20px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                    border: "1px solid #e9ecef",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <h4
                                        style={{
                                            margin: "0",
                                            color: "#495057",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {comment.name}
                                    </h4>
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "#6c757d",
                                            backgroundColor: "#e9ecef",
                                            padding: "2px 8px",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        {comment.email}
                                    </span>
                                </div>
                                <p
                                    style={{
                                        margin: "0",
                                        color: "#333",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {comment.body}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetailsPage;
