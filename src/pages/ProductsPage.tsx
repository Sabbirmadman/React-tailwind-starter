import React from "react";

const ProductsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Products
                </h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 mb-4">
                        This is the Products page. It uses normal navigation
                        (same tab).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Product 1</h3>
                            <p className="text-gray-600">
                                Sample product description
                            </p>
                            <div className="mt-2">
                                <span className="text-green-600 font-bold">
                                    $99.99
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Product 2</h3>
                            <p className="text-gray-600">
                                Sample product description
                            </p>
                            <div className="mt-2">
                                <span className="text-green-600 font-bold">
                                    $149.99
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Product 3</h3>
                            <p className="text-gray-600">
                                Sample product description
                            </p>
                            <div className="mt-2">
                                <span className="text-green-600 font-bold">
                                    $79.99
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
