import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

// Dynamic import for code splitting
const AdminDashboard = React.lazy(() => import("../admin/components/AdminDashboard"));

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});
