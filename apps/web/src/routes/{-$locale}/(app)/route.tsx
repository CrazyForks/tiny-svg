import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/header";

export const Route = createFileRoute("/{-$locale}/(app)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid h-svh grid-rows-[auto_1fr] overflow-x-hidden">
      <Header />
      <Outlet />
    </div>
  );
}
