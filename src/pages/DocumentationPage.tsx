import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { documentationContent } from "../data/documentation";

const DocumentationPage: React.FC = () => {
    const { docType } = useParams<{ docType: string }>();
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            setLoading(true);
            setError(null);
            
            const markdownContent = documentationContent[docType as keyof typeof documentationContent];
            
            if (!markdownContent) {
                throw new Error("Invalid documentation type");
            }

            setContent(markdownContent);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load documentation");
        } finally {
            setLoading(false);
        }
    }, [docType]);

    if (loading) {
        return (
            <div style={{
                padding: "40px",
                textAlign: "center",
                minHeight: "100vh",
                backgroundColor: "#f8f9fa"
            }}>
                <div style={{ fontSize: "24px", color: "#666" }}>📖 Loading documentation...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: "40px",
                textAlign: "center",
                minHeight: "100vh",
                backgroundColor: "#f8f9fa"
            }}>
                <div style={{ fontSize: "24px", color: "#dc3545", marginBottom: "20px" }}>
                    ❌ Error Loading Documentation
                </div>
                <div style={{ color: "#666" }}>{error}</div>
                <div style={{ marginTop: "20px" }}>
                    <button 
                        onClick={() => window.close()}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            padding: "40px",
            maxWidth: "900px",
            margin: "0 auto",
            backgroundColor: "#fff",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.6"
        }}>
            <div style={{
                fontSize: "16px",
                color: "#333"
            }}>
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({node, ...props}) => <h1 style={{fontSize: "2.5em", marginBottom: "0.5em", color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "0.3em"}} {...props} />,
                        h2: ({node, ...props}) => <h2 style={{fontSize: "2em", marginTop: "1.5em", marginBottom: "0.5em", color: "#34495e"}} {...props} />,
                        h3: ({node, ...props}) => <h3 style={{fontSize: "1.5em", marginTop: "1.2em", marginBottom: "0.4em", color: "#2c3e50"}} {...props} />,
                        p: ({node, ...props}) => <p style={{marginBottom: "1em", lineHeight: "1.7"}} {...props} />,
                        code: ({node, inline, ...props}: any) => 
                            inline ? 
                                <code style={{
                                    backgroundColor: "#f8f9fa", 
                                    padding: "2px 6px", 
                                    borderRadius: "4px", 
                                    fontFamily: "monospace",
                                    fontSize: "0.9em",
                                    color: "#e74c3c"
                                }} {...props} /> :
                                <code style={{
                                    backgroundColor: "#f8f9fa", 
                                    padding: "1em", 
                                    borderRadius: "6px", 
                                    fontFamily: "monospace",
                                    fontSize: "0.9em",
                                    display: "block",
                                    overflow: "auto",
                                    border: "1px solid #e9ecef"
                                }} {...props} />,
                        pre: ({node, ...props}) => <pre style={{backgroundColor: "#f8f9fa", padding: "1em", borderRadius: "6px", overflow: "auto", marginBottom: "1em"}} {...props} />,
                        ul: ({node, ...props}) => <ul style={{marginBottom: "1em", paddingLeft: "2em"}} {...props} />,
                        ol: ({node, ...props}) => <ol style={{marginBottom: "1em", paddingLeft: "2em"}} {...props} />,
                        li: ({node, ...props}) => <li style={{marginBottom: "0.3em"}} {...props} />,
                        blockquote: ({node, ...props}) => <blockquote style={{
                            borderLeft: "4px solid #3498db", 
                            paddingLeft: "1em", 
                            marginLeft: "0", 
                            color: "#7f8c8d",
                            fontStyle: "italic"
                        }} {...props} />,
                        table: ({node, ...props}) => <table style={{
                            borderCollapse: "collapse", 
                            width: "100%", 
                            marginBottom: "1em",
                            border: "1px solid #ddd"
                        }} {...props} />,
                        th: ({node, ...props}) => <th style={{
                            border: "1px solid #ddd", 
                            padding: "8px", 
                            backgroundColor: "#f8f9fa",
                            fontWeight: "bold"
                        }} {...props} />,
                        td: ({node, ...props}) => <td style={{
                            border: "1px solid #ddd", 
                            padding: "8px"
                        }} {...props} />,
                        a: ({node, ...props}) => <a style={{color: "#3498db", textDecoration: "none"}} {...props} />,
                        strong: ({node, ...props}) => <strong style={{fontWeight: "bold", color: "#2c3e50"}} {...props} />,
                        em: ({node, ...props}) => <em style={{fontStyle: "italic"}} {...props} />
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
            
            <div style={{
                marginTop: "40px",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #e9ecef"
            }}>
                <button 
                    onClick={() => window.close()}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginRight: "10px",
                        transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                >
                    Close Window
                </button>
                <button 
                    onClick={() => window.print()}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e7e34"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#28a745"}
                >
                    Print
                </button>
            </div>
        </div>
    );
};

export default DocumentationPage; 