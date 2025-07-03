import React from "react";
import { useWindowManager } from "../hooks/useWindowManager";

export const WindowStatus: React.FC = () => {
    const { windows, closeWindow, closeAllWindows } = useWindowManager();

    if (windows.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">
                    Open Tabs ({windows.length}/8)
                </h3>
                <button
                    onClick={closeAllWindows}
                    className="text-xs text-red-600 hover:text-red-800"
                >
                    Close All
                </button>
            </div>

            <div className="space-y-2">
                {windows.map((window) => (
                    <div
                        key={window.name}
                        className="flex items-center justify-between text-xs"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                                {window.context}
                                {window.userId && ` (${window.userId})`}
                            </div>
                            <div className="text-gray-500 truncate">
                                {window.name}
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                            <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                    window.type === "menu"
                                        ? "bg-blue-400"
                                        : "bg-green-400"
                                }`}
                            ></span>
                            <button
                                onClick={() => closeWindow(window.name)}
                                className="text-gray-400 hover:text-red-600"
                                title="Close tab"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                    Menu tabs
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 ml-3"></span>
                    Detail tabs
                </div>
            </div>
        </div>
    );
};
