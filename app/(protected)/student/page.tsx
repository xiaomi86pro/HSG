"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Profile = {
  id: string;
  name: string;
  level: number;
  exp: number;
};

export default function StudentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabaseBrowser.auth.getSession();

        const user = session?.user;

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabaseBrowser
          .from("profiles")
          .select("id, name, level, exp")
          .eq("id", user.id)
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        setProfile(data);
      } catch (err) {
        setError("Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [router]);

  const handleSaveName = async () => {
    if (!profile) return;
    if (!newName.trim()) return;

    setSaving(true);

    const { error } = await supabaseBrowser
      .from("profiles")
      .update({ name: newName.trim() })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, name: newName.trim() });
      setEditing(false);
    }

    setSaving(false);
  };

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  // =============================
  // ERROR
  // =============================
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  // =============================
  // NO PROFILE
  // =============================
  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Profile not found.</p>
      </main>
    );
  }

  // =============================
  // NORMAL UI
  // =============================
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Trang học sinh</h1>

        <div className="space-y-4">
          <div>
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
      </div>
    </main>
  );
}