import React, { useState, useEffect } from "react";
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
interface TodoListTabData {
    type: "TODO_LIST_DATA";
    todos: Todo[];
    users: User[];
}

const TodoListPage: React.FC = () => {
    const { handleTabNavigationWithData } = useTabManagement();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "completed" | "pending">(
        "all"
    );
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // First, try to get data from tab management system
                const tabData =
                    getAndConsumeTabData<TodoListTabData>("current_todo_list");

                if (tabData?.type === "TODO_LIST_DATA") {
                    // Data was passed from another tab
                    setTodos(tabData.todos);
                    setUsers(tabData.users);
                } else {
                    // No tab data, fetch everything from API
                    const [todosResponse, usersResponse] = await Promise.all([
                        axios.get("https://jsonplaceholder.typicode.com/todos"),
                        axios.get("https://jsonplaceholder.typicode.com/users"),
                    ]);

                    setTodos(todosResponse.data);
                    setUsers(usersResponse.data);
                }
            } catch (err) {
                setError("Failed to fetch todos");
                console.error("Error fetching todos:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleViewTodo = (todo: Todo) => {
        const user = users.find((u) => u.id === todo.userId);
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

    const handleViewUserTodos = (user: User) => {
        const userTodos = todos.filter((todo) => todo.userId === user.id);
        handleTabNavigationWithData(
            `/user-todos/${user.id}`,
            {
                type: "USER_TODOS_DATA",
                user,
                todos: userTodos,
            },
            "_user_todos"
        )();
    };

    const getUserName = (userId: number) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.name : "Unknown User";
    };

    const filteredTodos = todos.filter((todo) => {
        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && todo.completed) ||
            (filter === "pending" && !todo.completed);

        const matchesSearch = todo.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
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
                Loading todos...
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
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            {/* Header */}
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
                    📋 Todo List
                </h1>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "15px",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Statistics
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

                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Search
                        </h4>
                        <input
                            type="text"
                            placeholder="Search todos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #ced4da",
                                fontSize: "14px",
                                width: "100%",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Todos List */}
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
                            No todos found matching your criteria.
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
                                        👤 {getUserName(todo.userId)}
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

            {/* Users Summary */}
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
                    Users with Todos
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "15px",
                    }}
                >
                    {users.slice(0, 10).map((user) => {
                        const userTodos = todos.filter(
                            (todo) => todo.userId === user.id
                        );
                        const userCompleted = userTodos.filter(
                            (todo) => todo.completed
                        ).length;

                        return (
                            <div
                                key={user.id}
                                style={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
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
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                                onClick={() => handleViewUserTodos(user)}
                            >
                                <h4
                                    style={{
                                        margin: "0 0 8px 0",
                                        color: "#333",
                                    }}
                                >
                                    👤 {user.name}
                                </h4>
                                <p
                                    style={{
                                        margin: "0 0 5px 0",
                                        color: "#666",
                                        fontSize: "14px",
                                    }}
                                >
                                    📧 {user.email}
                                </p>
                                <p
                                    style={{
                                        margin: "0 0 5px 0",
                                        color: "#666",
                                        fontSize: "14px",
                                    }}
                                >
                                    📊 {userTodos.length} todos ({userCompleted}{" "}
                                    completed)
                                </p>
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#007bff",
                                        cursor: "pointer",
                                        padding: "0",
                                        fontSize: "12px",
                                        textDecoration: "underline",
                                        marginTop: "5px",
                                    }}
                                >
                                    View user's todos →
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TodoListPage;
