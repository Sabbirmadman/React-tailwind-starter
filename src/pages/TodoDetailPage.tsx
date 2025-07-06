import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAndConsumeTabData, useTabManagement } from "../utils/tabManagement";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
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

// Local interface for this page's tab data
interface TodoDetailTabData {
    type: "TODO_DETAIL_DATA";
    todo: Todo;
    user?: User;
}

const TodoDetailPage: React.FC = () => {
    const { todoId } = useParams<{ todoId: string }>();
    const { handleTabNavigationWithData } = useTabManagement();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // First, try to get data from tab management system
                const tabData = getAndConsumeTabData<TodoDetailTabData>(
                    "current_todo_detail"
                );

                if (tabData?.type === "TODO_DETAIL_DATA") {
                    // Data was passed from another tab
                    setTodo(tabData.todo);
                    setUser(tabData.user || null);
                } else if (todoId) {
                    // No tab data, fetch everything from API
                    const todoResponse = await axios.get(
                        `https://jsonplaceholder.typicode.com/todos/${todoId}`
                    );
                    const todoData = todoResponse.data;

                    setTodo(todoData);

                    // Fetch user data
                    const userResponse = await axios.get(
                        `https://jsonplaceholder.typicode.com/users/${todoData.userId}`
                    );
                    setUser(userResponse.data);
                }
            } catch (err) {
                setError("Failed to fetch todo details");
                console.error("Error fetching todo details:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [todoId]);

    const handleViewUserTodos = (user: User) => {
        handleTabNavigationWithData(
            `/user-todos/${user.id}`,
            {
                type: "USER_TODOS_DATA",
                user,
            },
            "_user_todos"
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
                Loading todo details...
            </div>
        );
    }

    if (error || !todo) {
        return (
            <div
                style={{
                    color: "red",
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                }}
            >
                {error || "Todo not found"}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            {/* Todo Header */}
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
                    📋 {todo.title}
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
                            Todo Info
                        </h4>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            🆔 Todo ID: {todo.id}
                        </p>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            👤 User ID: {todo.userId}
                        </p>
                        <p style={{ margin: "0", color: "#6c757d" }}>
                            Status:{" "}
                            <span
                                style={{
                                    backgroundColor: todo.completed
                                        ? "#28a745"
                                        : "#ffc107",
                                    color: todo.completed ? "white" : "#212529",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                }}
                            >
                                {todo.completed ? "✅ Completed" : "⏳ Pending"}
                            </span>
                        </p>
                    </div>

                    {user && (
                        <div>
                            <h4
                                style={{
                                    margin: "0 0 8px 0",
                                    color: "#495057",
                                }}
                            >
                                Assigned To
                            </h4>
                            <p
                                style={{
                                    margin: "0 0 5px 0",
                                    color: "#6c757d",
                                }}
                            >
                                👤 {user.name}
                            </p>
                            <p
                                style={{
                                    margin: "0 0 5px 0",
                                    color: "#6c757d",
                                }}
                            >
                                📧 {user.email}
                            </p>
                            <p
                                style={{
                                    margin: "0 0 5px 0",
                                    color: "#6c757d",
                                }}
                            >
                                📞 {user.phone}
                            </p>
                            <button
                                onClick={() => handleViewUserTodos(user)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#007bff",
                                    cursor: "pointer",
                                    padding: "0",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                    marginTop: "5px",
                                }}
                            >
                                View all todos by this user →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Todo Content */}
            <div
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "25px",
                    marginBottom: "30px",
                }}
            >
                <h2
                    style={{
                        fontSize: "24px",
                        marginBottom: "20px",
                        color: "#333",
                        textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                        opacity: todo.completed ? 0.7 : 1,
                    }}
                >
                    {todo.title}
                </h2>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: todo.completed
                                ? "#28a745"
                                : "#ffc107",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                        }}
                    >
                        {todo.completed ? "✓" : "!"}
                    </div>
                    <span
                        style={{
                            color: todo.completed ? "#28a745" : "#ffc107",
                            fontWeight: "bold",
                        }}
                    >
                        {todo.completed ? "Task Completed" : "Task Pending"}
                    </span>
                </div>

                <div
                    style={{
                        backgroundColor: todo.completed ? "#d4edda" : "#fff3cd",
                        border: `1px solid ${
                            todo.completed ? "#c3e6cb" : "#ffeaa7"
                        }`,
                        borderRadius: "6px",
                        padding: "15px",
                        color: todo.completed ? "#155724" : "#856404",
                    }}
                >
                    <p style={{ margin: "0", fontSize: "16px" }}>
                        {todo.completed
                            ? "This task has been successfully completed! 🎉"
                            : "This task is currently pending and needs to be completed."}
                    </p>
                </div>
            </div>

            {/* User Company Info */}
            {user && (
                <div
                    style={{
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "30px",
                    }}
                >
                    <h3 style={{ marginBottom: "15px", color: "#333" }}>
                        User Information
                    </h3>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "15px",
                        }}
                    >
                        <div>
                            <h4
                                style={{
                                    margin: "0 0 8px 0",
                                    color: "#495057",
                                }}
                            >
                                Contact Details
                            </h4>
                            <p
                                style={{
                                    margin: "0 0 5px 0",
                                    color: "#6c757d",
                                }}
                            >
                                👤 {user.name}
                            </p>
                            <p
                                style={{
                                    margin: "0 0 5px 0",
                                    color: "#6c757d",
                                }}
                            >
                                📧 {user.email}
                            </p>
                            <p
                                style={{
                                    margin: "0 0 5px 0",
                                    color: "#6c757d",
                                }}
                            >
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
                            <h4
                                style={{
                                    margin: "0 0 8px 0",
                                    color: "#495057",
                                }}
                            >
                                Company
                            </h4>
                            <p style={{ margin: "0", color: "#6c757d" }}>
                                🏢 {user.company.name}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Links */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: "30px",
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                }}
            >
                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    ← Back
                </button>
                {user && (
                    <button
                        onClick={() => handleViewUserTodos(user)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        View User's Todos
                    </button>
                )}
            </div>
        </div>
    );
};

export default TodoDetailPage;
