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

const AlbumDetailPage: React.FC = () => {
    const { albumId } = useParams<{ albumId: string }>();
    const { handleTabNavigationWithData } = useTabManagement();
    const [album, setAlbum] = useState<Album | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // First, try to get data from tab management system
                const tabData = getAndConsumeTabData("current_album_detail");

                if (tabData?.type === "ALBUM_DETAIL_DATA") {
                    // Data was passed from another tab
                    setAlbum(tabData.album);
                    setPhotos(tabData.photos);
                    setUser(tabData.user);
                } else if (albumId) {
                    // No tab data, fetch everything from API
                    const [albumResponse, photosResponse] = await Promise.all([
                        axios.get(`https://jsonplaceholder.typicode.com/albums/${albumId}`),
                        axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`),
                    ]);

                    const albumData = albumResponse.data;
                    const photosData = photosResponse.data;

                    setAlbum(albumData);
                    setPhotos(photosData);

                    // Fetch user data for the album
                    const userResponse = await axios.get(
                        `https://jsonplaceholder.typicode.com/users/${albumData.userId}`
                    );
                    setUser(userResponse.data);
                }
            } catch (err) {
                setError("Failed to fetch album details");
                console.error("Error fetching album details:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [albumId]);

    const handleViewPhoto = (photo: Photo) => {
        handleTabNavigationWithData(
            `/photo/${photo.id}`,
            {
                type: "PHOTO_DETAIL_DATA",
                photo,
                album,
                user,
            },
            "_photo_detail"
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
                Loading album details...
            </div>
        );
    }

    if (error || !album) {
        return (
            <div
                style={{
                    color: "red",
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                }}
            >
                {error || "Album not found"}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            {/* Album Header */}
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
                    📸 {album.title}
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
                            Album Info
                        </h4>
                        <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                            🆔 Album ID: {album.id}
                        </p>
                        <p style={{ margin: "0", color: "#6c757d" }}>
                            📷 {photos.length} photos
                        </p>
                    </div>

                    {user && (
                        <div>
                            <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                                Created By
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

            {/* Photos Grid */}
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
                    Photos ({photos.length})
                </h2>

                {photos.length === 0 ? (
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
                            No photos found in this album.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                style={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    position: "relative",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                                }}
                                onClick={() => handleViewPhoto(photo)}
                            >
                                {/* Photo Number Badge */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {index + 1}
                                </div>

                                <img
                                    src={photo.thumbnailUrl}
                                    alt={photo.title}
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        marginBottom: "10px",
                                    }}
                                />

                                <h4
                                    style={{
                                        margin: "0",
                                        fontSize: "14px",
                                        color: "#333",
                                        lineHeight: "1.3",
                                        paddingRight: "30px",
                                    }}
                                >
                                    {photo.title}
                                </h4>

                                <div
                                    style={{
                                        marginTop: "10px",
                                        fontSize: "12px",
                                        color: "#007bff",
                                        fontWeight: "500",
                                    }}
                                >
                                    Click to view full size →
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlbumDetailPage; 