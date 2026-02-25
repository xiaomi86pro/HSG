"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Role = "student" | "teacher" | "admin";

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabaseBrowser.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const user = session.user;

        if (!user) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const { data: roleData, error: roleError } =
          await supabaseBrowser.rpc("get_my_role");

        if (isMounted) {
          setUser(user);
          if (!roleError && roleData) {
            setRole(roleData as Role);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Init error:", err);
        if (isMounted) setLoading(false);
      }
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  // =============================
  // CHƯA LOGIN
  // =============================
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Exam System</h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="border px-6 py-2 rounded"
          >
            Đăng ký
          </button>
        </div>
      </main>
    );
  }

  if (!role) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Đang tải dữ liệu người dùng...</p>
      </main>
    );
  }

  // =============================
  // ĐÃ LOGIN
  // =============================
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="grid grid-cols-12 gap-6 h-[85vh]">
        
        {/* LEFT - LEADERBOARD */}
        <div className="col-span-3 bg-white rounded-xl shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-center">
            🏆 Leaderboard
          </h2>

          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Chưa có dữ liệu
          </div>
        </div>

        {/* CENTER - MAIN */}
        <div className="col-span-6 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-6">
            Khu vực chính
          </h2>

          <div className="w-full max-w-md bg-yellow-100 border border-yellow-300 rounded-lg p-6 text-center">
            <p className="mb-4 font-medium">
              Bạn có bài thi chưa hoàn thành
            </p>

            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded">
              Làm tiếp
            </button>
          </div>
        </div>

        {/* RIGHT - USER PANEL */}
        <div className="col-span-3 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          
          <div className="w-24 h-24 rounded-full bg-slate-300 mb-4" />

          <h3 className="text-lg font-semibold">
            {user.email}
          </h3>

          <p className="text-sm text-slate-500 mb-6">
            {role ? `Role: ${role}` : "Đang tải role..."}
          </p>

          <div className="w-full flex flex-col gap-3">
            
            <button
              onClick={() => router.push(`/${role}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Thông tin
            </button>

            <button
              onClick={() => router.push(`/${role}/history`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
            >
              Lịch sử làm bài
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-4"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}