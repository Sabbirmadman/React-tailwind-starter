import React from "react";

const OrdersPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Orders
                </h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 mb-4">
                        This is the Orders page. It uses normal navigation (same
                        tab).
                    </p>

                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">
                                        Order #1001
                                    </h3>
                                    <p className="text-gray-600">
                                        Customer: John Doe
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-blue-600">
                                        $299.97
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Pending
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-l-4 border-green-500 bg-green-50 p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">
                                        Order #1002
                                    </h3>
                                    <p className="text-gray-600">
                                        Customer: Jane Smith
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-green-600">
                                        $149.99
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Completed
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">
                                        Order #1003
                                    </h3>
                                    <p className="text-gray-600">
                                        Customer: Bob Johnson
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-yellow-600">
                                        $79.99
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Processing
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
