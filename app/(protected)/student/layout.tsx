export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    void checkLogin();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p>Đang kiểm tra đăng nhập...</p>
      </main>
    );
  }

  return <>{children}</>;
}
app/(protected)/student/layout.tsx
app/(protected)/student/layout.tsx
+53
-0

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

type Role = "student" | "teacher" | "admin";

const ROLE_TO_PATH: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const { data, error } = await supabaseClient.rpc("get_my_role");
      const role = data as Role | null;

      if (error || !role || !(role in ROLE_TO_PATH)) {
        router.replace("/login");
        return;
      }

      if (role !== "student") {
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
        <p>Đang kiểm tra quyền student...</p>
      </main>
    );
  }

  return <>{children}</>;
}