import { useEffect, useCallback, useState } from "react";
import {
    windowManager,
    WindowInfo,
    WindowMessage,
} from "../utils/windowManager";

export interface UseWindowManagerReturn {
    openMenuWindow: (menuType: string, url?: string) => Window | null;
    openDetailWindow: (
        detailType: string,
        id: string,
        url?: string,
        data?: unknown
    ) => Window | null;
    closeWindow: (windowName: string) => void;
    closeAllWindows: () => void;
    sendDataToWindow: (targetWindow: Window, data: WindowMessage) => boolean;
    broadcastToWindows: (data: WindowMessage, excludeWindow?: Window) => void;
    getAllWindows: () => WindowInfo[];
    getWindow: (windowName: string) => Window | null;
    windows: WindowInfo[];
}

export const useWindowManager = (): UseWindowManagerReturn => {
    const [windows, setWindows] = useState<WindowInfo[]>([]);

    // Update windows list periodically
    useEffect(() => {
        const updateWindows = () => {
            setWindows(windowManager.getAllWindows());
        };

        updateWindows();
        const interval = setInterval(updateWindows, 2000);

        return () => clearInterval(interval);
    }, []);

    const openMenuWindow = useCallback(
        (menuType: string, url: string = "/") => {
            const window = windowManager.openMenuWindow(menuType, url);
            setWindows(windowManager.getAllWindows());
            return window;
        },
        []
    );

    const openDetailWindow = useCallback(
        (detailType: string, id: string, url: string = "/", data?: unknown) => {
            const window = windowManager.openDetailWindow(
                detailType,
                id,
                url,
                data
            );
            setWindows(windowManager.getAllWindows());
            return window;
        },
        []
    );

    const closeWindow = useCallback((windowName: string) => {
        windowManager.closeWindow(windowName);
        setWindows(windowManager.getAllWindows());
    }, []);

    const closeAllWindows = useCallback(() => {
        windowManager.closeAllWindows();
        setWindows([]);
    }, []);

    const sendDataToWindow = useCallback(
        (targetWindow: Window, data: WindowMessage) => {
            return windowManager.sendDataToWindow(targetWindow, data);
        },
        []
    );

    const broadcastToWindows = useCallback(
        (data: WindowMessage, excludeWindow?: Window) => {
            windowManager.broadcastToWindows(data, excludeWindow);
        },
        []
    );

    const getAllWindows = useCallback(() => {
        return windowManager.getAllWindows();
    }, []);

    const getWindow = useCallback((windowName: string) => {
        return windowManager.getWindow(windowName);
    }, []);

    return {
        openMenuWindow,
        openDetailWindow,
        closeWindow,
        closeAllWindows,
        sendDataToWindow,
        broadcastToWindows,
        getAllWindows,
        getWindow,
        windows,
    };
};
