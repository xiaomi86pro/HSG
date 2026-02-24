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