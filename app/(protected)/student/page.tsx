"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

type Profile = {
  id: string;
  name: string;
  role: "student" | "teacher" | "admin";
  level: number;
  exp: number;
};

export default function StudentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        router.replace("/");
        return;
      }

      if (data.role !== "student") {
        router.replace("/");
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    void init();
  }, [router]);

  const handleSaveName = async () => {
    if (!profile) return;

    if (!newName.trim()) return;

    setSaving(true);

    const { error } = await supabaseClient
      .from("profiles")
      .update({ name: newName.trim() })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, name: newName.trim() });
      setEditing(false);
    }

    setSaving(false);
  };
  
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Trang học sinh</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Email:</span>{" "}
            <span className="text-slate-600">{profile.name}</span>
          </div>

          <div className="mt-4">
            <span className="font-semibold">Tên hiển thị:</span>

            {!editing ? (
              <div className="flex items-center gap-3 mt-2">
                <span>{profile.name}</span>

                <button
                  onClick={() => {
                    setEditing(true);
                    setNewName(profile.name);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Chỉnh sửa
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border rounded px-3 py-1"
                />

                <button
                  onClick={handleSaveName}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="text-red-500 text-sm"
                >
                  Huỷ
                </button>
              </div>
            )}
          </div>

          <div>
            <span className="font-semibold">Level:</span> {profile.level}
          </div>

          <div>
            <span className="font-semibold">EXP:</span> {profile.exp}
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Quay về trang chính
        </button>
      </div>
    </main>
  );
}