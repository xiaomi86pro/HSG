"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Role = "student" | "teacher" | "admin";

const ROLE_TO_PATH: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
        error,
      } = await supabaseBrowser.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      const role = user.app_metadata?.role as Role | undefined;

      if (!role || !(role in ROLE_TO_PATH)) {
        router.replace("/login");
        return;
      }

      if (role !== "teacher") {
        router.replace(ROLE_TO_PATH[role]);
        return;
      }

      setLoading(false);
    };

    void checkRole();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p>Đang kiểm tra quyền teacher...</p>
      </main>
    );
  }

  return <>{children}</>;
}