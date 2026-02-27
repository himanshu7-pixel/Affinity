import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MoodPage } from "./pages/MoodPage";
import { ChatPage } from "./pages/ChatPage";
import { ToolsPage } from "./pages/ToolsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { ContactsPage } from "./pages/ContactsPage";
import { HelpPage } from "./pages/HelpPage";
import { AboutPage } from "./pages/AboutPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { AppLayout } from "./components/layout/AppLayout";

// ── Routes ──────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// ── Protected routes wrapper ──────────────────────────────────────────────
function ProtectedLayout() {
  return (
    <AppLayout requireAuth={true}>
      <Outlet />
    </AppLayout>
  );
}

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const moodRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/mood",
  component: MoodPage,
});

const chatRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/chat",
  component: ChatPage,
});

const toolsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/tools",
  component: ToolsPage,
});

const progressRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/progress",
  component: ProgressPage,
});

const contactsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/contacts",
  component: ContactsPage,
});

const helpRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/help",
  component: HelpPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/about",
  component: AboutPage,
});

const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/admin",
  component: AdminPage,
});

// ── Router ────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    moodRoute,
    chatRoute,
    toolsRoute,
    progressRoute,
    contactsRoute,
    helpRoute,
    aboutRoute,
    adminRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
