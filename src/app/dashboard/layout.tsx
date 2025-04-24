import AuthCheck from "@/components/auth/auth-check";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </AuthCheck>
  );
}