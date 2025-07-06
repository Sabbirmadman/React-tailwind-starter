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
interface UserTodosTabData {
    type: "USER_TODOS_DATA";
    user: User;
    todos: Todo[];
}

const UserTodosPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { handleTabNavigationWithData } = useTabManagement();
    const [user, setUser] = useState<User | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "completed" | "pending">(
        "all"
    );

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // First, try to get data from tab management system
                const tabData =
                    getAndConsumeTabData<UserTodosTabData>(
                        "current_user_todos"
                    );

                if (tabData?.type === "USER_TODOS_DATA") {
                    // Data was passed from another tab
                    setUser(tabData.user);
                    setTodos(tabData.todos);
                } else if (userId) {
                    // No tab data, fetch everything from API
                    const [userResponse, todosResponse] = await Promise.all([
                        axios.get(
                            `https://jsonplaceholder.typicode.com/users/${userId}`
                        ),
                        axios.get(
                            `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
                        ),
                    ]);

                    const userData = userResponse.data;
                    const todosData = todosResponse.data;

                    setUser(userData);
                    setTodos(todosData);
                }
            } catch (err) {
                setError("Failed to fetch user todos");
                console.error("Error fetching user todos:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [userId]);

    const handleViewTodo = (todo: Todo) => {
        handleTabNavigationWithData(
            `/todo/${todo.id}`,
            {
                type: "TODO_DETAIL_DATA",
                todo,
                user,
            },
            "_todo_detail"
        )();
    };

    const filteredTodos = todos.filter((todo) => {
        return (
            filter === "all" ||
            (filter === "completed" && todo.completed) ||
            (filter === "pending" && !todo.completed)
        );
    });

    const completedCount = todos.filter((todo) => todo.completed).length;
    const pendingCount = todos.filter((todo) => !todo.completed).length;

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
                Loading user todos...
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
                    📋 {user.name}'s Todos
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
                            Todo Statistics
                        </h4>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            ✅ {completedCount} completed
                        </p>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            ⏳ {pendingCount} pending
                        </p>
                        <p style={{ margin: "0", color: "#6c757d" }}>
                            📊 {todos.length} total
                        </p>
                    </div>

                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Filter
                        </h4>
                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(
                                    e.target.value as
                                        | "all"
                                        | "completed"
                                        | "pending"
                                )
                            }
                            style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #ced4da",
                                fontSize: "14px",
                                width: "100%",
                            }}
                        >
                            <option value="all">All Todos</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Todos Section */}
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
                    Todos ({filteredTodos.length})
                </h2>

                {filteredTodos.length === 0 ? (
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
                            No todos found for this user.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(400px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {filteredTodos.map((todo, index) => (
                            <div
                                key={todo.id}
                                style={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    position: "relative",
                                    opacity: todo.completed ? 0.7 : 1,
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
                                onClick={() => handleViewTodo(todo)}
                            >
                                {/* Status Badge */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "15px",
                                        right: "15px",
                                        backgroundColor: todo.completed
                                            ? "#28a745"
                                            : "#ffc107",
                                        color: todo.completed
                                            ? "white"
                                            : "#212529",
                                        borderRadius: "20px",
                                        padding: "4px 12px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {todo.completed ? "✅ Done" : "⏳ Pending"}
                                </div>

                                {/* Todo Number Badge */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "15px",
                                        left: "15px",
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
                                        paddingRight: "80px",
                                        paddingLeft: "40px",
                                        textDecoration: todo.completed
                                            ? "line-through"
                                            : "none",
                                    }}
                                >
                                    {todo.title}
                                </h3>

                                <div
                                    style={{
                                        marginTop: "15px",
                                        paddingTop: "15px",
                                        borderTop: "1px solid #f0f0f0",
                                        fontSize: "14px",
                                        color: "#666",
                                    }}
                                >
                                    <p style={{ margin: "0 0 5px 0" }}>
                                        🆔 Todo ID: {todo.id}
                                    </p>
                                    <p
                                        style={{
                                            margin: "0",
                                            fontSize: "12px",
                                            color: "#007bff",
                                        }}
                                    >
                                        Click to view details →
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Progress Summary */}
            <div style={{ marginTop: "40px" }}>
                <h2
                    style={{
                        fontSize: "24px",
                        marginBottom: "20px",
                        color: "#333",
                        borderBottom: "2px solid #e0e0e0",
                        paddingBottom: "10px",
                    }}
                >
                    Progress Summary
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#d4edda",
                            border: "1px solid #c3e6cb",
                            borderRadius: "8px",
                            padding: "20px",
                            textAlign: "center",
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", color: "#155724" }}>
                            ✅ Completed
                        </h3>
                        <p
                            style={{
                                margin: "0",
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#155724",
                            }}
                        >
                            {completedCount}
                        </p>
                        <p
                            style={{
                                margin: "5px 0 0 0",
                                fontSize: "14px",
                                color: "#155724",
                            }}
                        >
                            {todos.length > 0
                                ? Math.round(
                                      (completedCount / todos.length) * 100
                                  )
                                : 0}
                            % of total
                        </p>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#fff3cd",
                            border: "1px solid #ffeaa7",
                            borderRadius: "8px",
                            padding: "20px",
                            textAlign: "center",
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", color: "#856404" }}>
                            ⏳ Pending
                        </h3>
                        <p
                            style={{
                                margin: "0",
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#856404",
                            }}
                        >
                            {pendingCount}
                        </p>
                        <p
                            style={{
                                margin: "5px 0 0 0",
                                fontSize: "14px",
                                color: "#856404",
                            }}
                        >
                            {todos.length > 0
                                ? Math.round(
                                      (pendingCount / todos.length) * 100
                                  )
                                : 0}
                            % of total
                        </p>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#d1ecf1",
                            border: "1px solid #bee5eb",
                            borderRadius: "8px",
                            padding: "20px",
                            textAlign: "center",
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", color: "#0c5460" }}>
                            📊 Total
                        </h3>
                        <p
                            style={{
                                margin: "0",
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#0c5460",
                            }}
                        >
                            {todos.length}
                        </p>
                        <p
                            style={{
                                margin: "5px 0 0 0",
                                fontSize: "14px",
                                color: "#0c5460",
                            }}
                        >
                            All todos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTodosPage;
