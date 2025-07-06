/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TabInfo {
    timestamp: number;
    url: string;
    type: "external" | "internal";
    windowName?: string;
    data?: any;
    pageType?: string;
}

export interface StoredTabs {
    [key: string]: TabInfo;
}

export interface WindowManager {
    [key: string]: Window | null;
}

export interface IntervalManager {
    [key: string]: NodeJS.Timeout;
}

export interface TabNavigationOptions {
    path: string;
    data?: any;
    pageType?: string;
    forceReload?: boolean;
}

export interface TabDisplayMap {
    [key: string]: string;
}

export interface TabDataEntry {
    data: unknown;
    timestamp: number;
}

export interface TabDataStorage {
    [key: string]: TabDataEntry;
}

// Generic tab data wrapper
export interface GenericTabData<T = unknown> {
    type: string;
    [key: string]: T | string;
}
