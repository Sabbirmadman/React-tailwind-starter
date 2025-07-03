import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    getAndConsumeTabData,
    useTabManagement,
} from "../utils/tabManagement/hook/useTabManagement";

interface Photo {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
    albumId: number;
}

interface Album {
    id: number;
    title: string;
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

const PhotoDetailPage: React.FC = () => {
    const { photoId } = useParams<{ photoId: string }>();
    const { handleTabNavigationWithData } = useTabManagement();
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [album, setAlbum] = useState<Album | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // First, try to get data from tab management system
                const tabData = getAndConsumeTabData("current_photo_detail");

                if (tabData?.type === "PHOTO_DETAIL_DATA") {
                    // Data was passed from another tab
                    setPhoto(tabData.photo);
                    setAlbum(tabData.album);
                    setUser(tabData.user);
                } else if (photoId) {
                    // No tab data, fetch everything from API
                    const photoResponse = await axios.get(
                        `https://jsonplaceholder.typicode.com/photos/${photoId}`
                    );
                    const photoData = photoResponse.data;

                    setPhoto(photoData);

                    // Fetch album data
                    const albumResponse = await axios.get(
                        `https://jsonplaceholder.typicode.com/albums/${photoData.albumId}`
                    );
                    const albumData = albumResponse.data;
                    setAlbum(albumData);

                    // Fetch user data
                    const userResponse = await axios.get(
                        `https://jsonplaceholder.typicode.com/users/${albumData.userId}`
                    );
                    setUser(userResponse.data);
                }
            } catch (err) {
                setError("Failed to fetch photo details");
                console.error("Error fetching photo details:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [photoId]);

    const handleViewAlbum = (album: Album) => {
        handleTabNavigationWithData(
            `/album/${album.id}`,
            {
                type: "ALBUM_DETAIL_DATA",
                album,
                user,
            },
            "_album_detail"
        )();
    };

    const handleViewUserAlbums = (user: User) => {
        handleTabNavigationWithData(
            `/photos`,
            {
                type: "USER_ALBUMS_DATA",
                user,
            },
            "_photo_gallery"
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
                Loading photo details...
            </div>
        );
    }

    if (error || !photo) {
        return (
            <div
                style={{
                    color: "red",
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                }}
            >
                {error || "Photo not found"}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
            {/* Photo Header */}
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
                    📸 {photo.title}
                </h1>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "15px",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                            Photo Info
                        </h4>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            🆔 Photo ID: {photo.id}
                        </p>
                        <p style={{ margin: "0", color: "#6c757d" }}>
                            📁 Album ID: {photo.albumId}
                        </p>
                    </div>

                    {album && (
                        <div>
                            <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                                Album
                            </h4>
                            <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                                📂 {album.title}
                            </p>
                            <button
                                onClick={() => handleViewAlbum(album)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#007bff",
                                    cursor: "pointer",
                                    padding: "0",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                }}
                            >
                                View album →
                            </button>
                        </div>
                    )}

                    {user && (
                        <div>
                            <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                                Photographer
                            </h4>
                            <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                                👤 {user.name}
                            </p>
                            <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                                📧 {user.email}
                            </p>
                            <button
                                onClick={() => handleViewUserAlbums(user)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#007bff",
                                    cursor: "pointer",
                                    padding: "0",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                }}
                            >
                                View all albums by this user →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo Display */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                }}
            >
                <img
                    src={photo.url}
                    alt={photo.title}
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                />
            </div>

            {/* Thumbnail */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                }}
            >
                <h3 style={{ marginBottom: "15px", color: "#333" }}>
                    Thumbnail Version
                </h3>
                <img
                    src={photo.thumbnailUrl}
                    alt={`${photo.title} (thumbnail)`}
                    style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                    }}
                />
            </div>

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
                {album && (
                    <button
                        onClick={() => handleViewAlbum(album)}
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
                        ← Back to Album
                    </button>
                )}
                {user && (
                    <button
                        onClick={() => handleViewUserAlbums(user)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        View User's Albums
                    </button>
                )}
            </div>
        </div>
    );
};

export default PhotoDetailPage; 