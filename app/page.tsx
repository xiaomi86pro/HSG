"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

type Role = "student" | "teacher" | "admin";

const ROLE_TO_PATH: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }
      const { data, error } = await supabaseClient.rpc("get_my_role");
      const role = data as Role | null;

      if (error || !role || !(role in ROLE_TO_PATH)) {
        router.replace("/login");
        return;
      }

      router.replace(ROLE_TO_PATH[role]);
    };

    void redirectUser();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
    <p>Đang chuyển hướng...</p>
    </main>
  );
}