import { AdminMode } from "@/components/admin/AdminMode";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Fiber Guys",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminMode />
      <div className="fixed inset-0 z-[99999] bg-[#0a0a0a] text-white overflow-y-auto">
        {children}
      </div>
    </>
  );
}
