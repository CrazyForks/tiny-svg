import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/(app)/blog")({
  component: BlogLayout,
});

function BlogLayout() {
  return <Outlet />;
}
