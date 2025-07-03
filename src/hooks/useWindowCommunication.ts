import { useEffect, useCallback, useState } from "react";

export interface WindowContext {
    windowName: string;
    type: "menu" | "detail";
    context: string;
    id?: string;
    isChildWindow: boolean;
}

export interface WindowMessage {
    type: string;
    data?: unknown;
    windowName?: string;
    initialData?: unknown;
    id?: string;
}

export interface UseWindowCommunicationReturn {
    windowContext: WindowContext | null;
    sendToParent: (data: WindowMessage) => void;
    onMessageReceived: (callback: (data: WindowMessage) => void) => () => void;
    signalReady: () => void;
    updateContent: (data: unknown) => void;
}

export const useWindowCommunication = (): UseWindowCommunicationReturn => {
    const [windowContext, setWindowContext] = useState<WindowContext | null>(
        null
    );
    const [messageHandlers, setMessageHandlers] = useState<
        ((data: WindowMessage) => void)[]
    >([]);

    useEffect(() => {
        // Parse window context from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const windowName = urlParams.get("windowName");
        const type = urlParams.get("type") as "menu" | "detail";
        const context = urlParams.get("context");
        const id = urlParams.get("id");

        if (windowName && type && context) {
            const ctx: WindowContext = {
                windowName,
                type,
                context,
                id: id || undefined,
                isChildWindow: window.opener !== null,
            };
            setWindowContext(ctx);

            // Set window name for identification
            window.name = windowName;
        } else {
            // This is likely the main window
            setWindowContext({
                windowName: "main",
                type: "menu",
                context: "main",
                isChildWindow: false,
            });
        }
    }, []);

    const sendToParent = useCallback((data: WindowMessage) => {
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage(data, window.location.origin);
            } catch (error) {
                console.warn("Failed to send message to parent:", error);
            }
        }
    }, []);

    const signalReady = useCallback(() => {
        if (windowContext?.isChildWindow) {
            sendToParent({
                type: "window-ready",
                windowName: windowContext.windowName,
            });
        }
    }, [windowContext, sendToParent]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            const { type, windowName, initialData } = event.data;

            if (
                type === "handshake" &&
                windowName &&
                windowContext?.windowName === windowName
            ) {
                // Acknowledge handshake and signal ready
                signalReady();

                // Handle initial data if provided
                if (initialData) {
                    messageHandlers.forEach((handler) =>
                        handler({
                            type: "initial-data",
                            data: initialData,
                        })
                    );
                }
            } else if (type === "data-update") {
                // Handle data updates
                messageHandlers.forEach((handler) => handler(event.data));
            } else {
                // Handle other messages
                messageHandlers.forEach((handler) => handler(event.data));
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [windowContext, messageHandlers, signalReady]);

    // Signal window closed when unloading
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (
                windowContext?.isChildWindow &&
                window.opener &&
                !window.opener.closed
            ) {
                try {
                    window.opener.postMessage(
                        {
                            type: "window-closed",
                            windowName: windowContext.windowName,
                        },
                        window.location.origin
                    );
                } catch (error) {
                    console.warn("Failed to signal window closed:", error);
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [windowContext]);

    const onMessageReceived = useCallback(
        (callback: (data: WindowMessage) => void) => {
            setMessageHandlers((prev) => [...prev, callback]);

            // Return cleanup function
            return () => {
                setMessageHandlers((prev) =>
                    prev.filter((handler) => handler !== callback)
                );
            };
        },
        []
    );

    const updateContent = useCallback(
        (data: unknown) => {
            // This can be used to trigger content updates in the current window
            messageHandlers.forEach((handler) =>
                handler({
                    type: "content-update",
                    data: data,
                })
            );
        },
        [messageHandlers]
    );

    return {
        windowContext,
        sendToParent,
        onMessageReceived,
        signalReady,
        updateContent,
    };
};
