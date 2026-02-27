import { create } from "zustand";
import type { Application, Interview, Notification } from "@prisma/client";

type ApplicationWithInterviews = Application & {
    interviews: Interview[];
};

type ViewMode = "table" | "kanban" | "list";

interface AppState {
    // Applications
    applications: ApplicationWithInterviews[];
    setApplications: (_apps: ApplicationWithInterviews[]) => void;
    addApplication: (_app: ApplicationWithInterviews) => void;
    updateApplication: (_id: string, _data: Partial<Application>) => void;
    removeApplication: (_id: string) => void;

    // View mode
    viewMode: ViewMode;
    setViewMode: (_mode: ViewMode) => void;

    // Search
    searchQuery: string;
    setSearchQuery: (_query: string) => void;
    isQuickSearchOpen: boolean;
    setQuickSearchOpen: (_open: boolean) => void;

    // Filters
    statusFilter: string | null;
    setStatusFilter: (_status: string | null) => void;
    platformFilter: string | null;
    setPlatformFilter: (_platform: string | null) => void;
    jobTypeFilter: string | null;
    setJobTypeFilter: (_type: string | null) => void;
    priorityFilter: string | null;
    setPriorityFilter: (_priority: string | null) => void;
    showArchived: boolean;
    setShowArchived: (_show: boolean) => void;
    clearFilters: () => void;

    // Command palette
    isCommandOpen: boolean;
    setCommandOpen: (_open: boolean) => void;

    // Quick add modal
    isQuickAddOpen: boolean;
    setQuickAddOpen: (_open: boolean) => void;

    // Notifications
    notifications: Notification[];
    setNotifications: (_notifs: Notification[]) => void;
    unreadCount: number;
    setUnreadCount: (_count: number) => void;

    // Selected application
    selectedAppId: string | null;
    setSelectedAppId: (_id: string | null) => void;

    // Sidebar
    sidebarOpen: boolean;
    setSidebarOpen: (_open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Applications
    applications: [],
    setApplications: (apps) => set({ applications: apps }),
    addApplication: (app) =>
        set((state) => ({ applications: [app, ...state.applications] })),
    updateApplication: (id, data) =>
        set((state) => ({
            applications: state.applications.map((app) =>
                app.id === id ? { ...app, ...data } : app
            ),
        })),
    removeApplication: (id) =>
        set((state) => ({
            applications: state.applications.filter((app) => app.id !== id),
        })),

    // View mode
    viewMode: "table",
    setViewMode: (mode) => set({ viewMode: mode }),

    // Search
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),
    isQuickSearchOpen: false,
    setQuickSearchOpen: (open) => set({ isQuickSearchOpen: open }),

    // Filters
    statusFilter: null,
    setStatusFilter: (status) => set({ statusFilter: status }),
    platformFilter: null,
    setPlatformFilter: (platform) => set({ platformFilter: platform }),
    jobTypeFilter: null,
    setJobTypeFilter: (type) => set({ jobTypeFilter: type }),
    priorityFilter: null,
    setPriorityFilter: (priority) => set({ priorityFilter: priority }),
    showArchived: false,
    setShowArchived: (show) => set({ showArchived: show }),
    clearFilters: () =>
        set({
            statusFilter: null,
            platformFilter: null,
            jobTypeFilter: null,
            priorityFilter: null,
            searchQuery: "",
        }),

    // Command palette
    isCommandOpen: false,
    setCommandOpen: (open) => set({ isCommandOpen: open }),

    // Quick add modal
    isQuickAddOpen: false,
    setQuickAddOpen: (open) => set({ isQuickAddOpen: open }),

    // Notifications
    notifications: [],
    setNotifications: (notifs) => set({ notifications: notifs }),
    unreadCount: 0,
    setUnreadCount: (count) => set({ unreadCount: count }),

    // Selected application
    selectedAppId: null,
    setSelectedAppId: (id) => set({ selectedAppId: id }),

    // Sidebar
    sidebarOpen: true,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
