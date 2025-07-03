import React, { useState, useEffect } from "react";
import { useTabManagement } from "../utils/tabManagement/hook/useTabManagement";

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

const PhotoGalleryPage: React.FC = () => {
    const { handleTabNavigationWithData } = useTabManagement();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [photosResponse, albumsResponse] = await Promise.all([
                    fetch(
                        "https://jsonplaceholder.typicode.com/photos?_limit=50"
                    ),
                    fetch("https://jsonplaceholder.typicode.com/albums"),
                ]);

                const photosData = await photosResponse.json();
                const albumsData = await albumsResponse.json();

                setPhotos(photosData);
                setAlbums(albumsData);
            } catch (err) {
                setError("Failed to fetch photos");
                console.error("Error fetching photos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewPhoto = (photo: Photo) => {
        const album = albums.find((a) => a.id === photo.albumId);
        handleTabNavigationWithData(
            `/photo-details/${photo.id}`,
            {
                type: "PHOTO_DATA",
                photo,
                album,
            },
            "_photo_details"
        )();
    };

    const handleViewAlbum = (album: Album) => {
        const albumPhotos = photos.filter(
            (photo) => photo.albumId === album.id
        );
        handleTabNavigationWithData(
            `/album/${album.id}`,
            {
                type: "ALBUM_DATA",
                album,
                photos: albumPhotos,
            },
            "_album_details"
        )();
    };

    const filteredPhotos = selectedAlbum
        ? photos.filter((photo) => photo.albumId === selectedAlbum)
        : photos;

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
                Loading photo gallery...
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
            <h1 style={{ marginBottom: "20px", color: "#333" }}>
                Photo Gallery
            </h1>

            {/* Albums Filter */}
            <div style={{ marginBottom: "30px" }}>
                <h2 style={{ marginBottom: "15px", color: "#555" }}>Albums</h2>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <button
                        style={{
                            padding: "8px 16px",
                            border:
                                selectedAlbum === null
                                    ? "2px solid #007bff"
                                    : "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor:
                                selectedAlbum === null ? "#007bff" : "#fff",
                            color: selectedAlbum === null ? "#fff" : "#333",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "all 0.2s",
                        }}
                        onClick={() => setSelectedAlbum(null)}
                    >
                        All Photos ({photos.length})
                    </button>
                    {albums.slice(0, 10).map((album) => {
                        const photoCount = photos.filter(
                            (p) => p.albumId === album.id
                        ).length;
                        return (
                            <button
                                key={album.id}
                                style={{
                                    padding: "8px 16px",
                                    border:
                                        selectedAlbum === album.id
                                            ? "2px solid #007bff"
                                            : "1px solid #ddd",
                                    borderRadius: "20px",
                                    backgroundColor:
                                        selectedAlbum === album.id
                                            ? "#007bff"
                                            : "#fff",
                                    color:
                                        selectedAlbum === album.id
                                            ? "#fff"
                                            : "#333",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    transition: "all 0.2s",
                                }}
                                onClick={() => setSelectedAlbum(album.id)}
                                onMouseEnter={(e) => {
                                    if (selectedAlbum !== album.id) {
                                        e.currentTarget.style.backgroundColor =
                                            "#f8f9fa";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedAlbum !== album.id) {
                                        e.currentTarget.style.backgroundColor =
                                            "#fff";
                                    }
                                }}
                            >
                                {album.title} ({photoCount})
                            </button>
                        );
                    })}
                </div>

                {/* Album Cards for Navigation */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "15px",
                        marginBottom: "30px",
                    }}
                >
                    {albums.slice(0, 10).map((album) => {
                        const albumPhotos = photos.filter(
                            (p) => p.albumId === album.id
                        );
                        const coverPhoto = albumPhotos[0];

                        return (
                            <div
                                key={album.id}
                                style={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    textAlign: "center",
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
                                onClick={() => handleViewAlbum(album)}
                            >
                                {coverPhoto && (
                                    <img
                                        src={coverPhoto.thumbnailUrl}
                                        alt={album.title}
                                        style={{
                                            width: "100%",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                            marginBottom: "10px",
                                        }}
                                    />
                                )}
                                <h4
                                    style={{
                                        margin: "0 0 5px 0",
                                        fontSize: "14px",
                                        color: "#333",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {album.title}
                                </h4>
                                <p
                                    style={{
                                        margin: "0",
                                        fontSize: "12px",
                                        color: "#666",
                                    }}
                                >
                                    {albumPhotos.length} photos
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Photos Grid */}
            <div>
                <h2 style={{ marginBottom: "15px", color: "#555" }}>
                    {selectedAlbum
                        ? `Photos from "${
                              albums.find((a) => a.id === selectedAlbum)?.title
                          }"`
                        : "All Photos"}{" "}
                    ({filteredPhotos.length})
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "15px",
                    }}
                >
                    {filteredPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            style={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                overflow: "hidden",
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
                            onClick={() => handleViewPhoto(photo)}
                        >
                            <img
                                src={photo.thumbnailUrl}
                                alt={photo.title}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                            <div style={{ padding: "10px" }}>
                                <h4
                                    style={{
                                        margin: "0",
                                        fontSize: "12px",
                                        color: "#333",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {photo.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PhotoGalleryPage;
