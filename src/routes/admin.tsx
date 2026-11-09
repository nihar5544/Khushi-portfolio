import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Toaster } from "@/components/ui/sonner";

// Dynamic import for code splitting
const AdminDashboard = React.lazy(() => import("../admin/components/AdminDashboard"));

function AdminRoute() {
  // Sonner renders a live-region only on the client, so mounting it during SSR
  // would trigger a hydration mismatch. Mount it after the first client render.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <>
      <AdminDashboard />
      {/* The public page mounts its own Toaster; the admin route needs one too,
          otherwise login/logout and message action feedback is invisible. */}
      {mounted ? <Toaster /> : null}
    </>
  );
}

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});
