import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/Reactbits/ProfileCard/ProfileCard";
import DatasetCard from "../components/DatasetCard";
import UploadForm from "../components/UploadForm";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [error, setError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const navigate = useNavigate();

  // Use Vite env var (falls back to localhost:3000)
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    // fetchDatasets ab defensive hai: backend chahe `[...]` de ya `{ data: [...] }`, dono handle karega
    const fetchDatasets = async (userId) => {
      try {
        setLoadingDatasets(true);
        setError("");
        const res = await fetch(
          `${API_BASE}/api/datasets?userId=${encodeURIComponent(userId)}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );
        if (!res.ok) {
          // try to extract message for better error logs
          let errMsg = "Failed to fetch datasets";
          try {
            const errJson = await res.json();
            if (errJson && errJson.message) errMsg = errJson.message;
          } catch (e) {
            /* ignore parse error */
          }
          throw new Error(errMsg);
        }

        const json = await res.json();
        // Normalize response shape:
        const datasetsArr = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];
        if (!cancelled) setDatasets(datasetsArr);
      } catch (err) {
        if (err.name === "AbortError") return; // fetch was aborted
        console.error("fetchDatasets error:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load datasets");
          setDatasets([]);
        }
      } finally {
        if (!cancelled) setLoadingDatasets(false);
      }
    };

    // checkAuthAndLoad ab bhi defensive: backend chahe `{ data: user }` de ya `user` object, dono handle karega
    const checkAuthAndLoad = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) {
          // Unauthorized or other error -> redirect to login
          throw new Error("Unauthorized");
        }

        const json = await res.json();
        const userObj = json && json.data ? json.data : json;
        if (cancelled) return;
        setUser(userObj);

        const userId = userObj && (userObj._id || userObj.id);
        if (userId) await fetchDatasets(userId);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.warn("Redirecting to login:", err?.message || err);
        navigate("/login");
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    };

    checkAuthAndLoad();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [navigate, API_BASE]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        let errMsg = "Logout failed";
        try {
          const errJson = await res.json();
          if (errJson && errJson.message) errMsg = errJson.message;
        } catch (e) {}
        throw new Error(errMsg);
      }
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err?.message || err);
      alert("Error logging out: " + (err?.message || err));
    }
  }, [navigate, API_BASE]);

  // Navigation handlers
  const openDataset = useCallback(
    (id) => {
      if (!id) return;
      navigate(`/datasets/${id}`);
    },
    [navigate]
  );

  // Delete dataset (with confirmation + instant UI update). IDs normalized with String(...)
  const handleDelete = useCallback(
    async (id) => {
      if (!id) return;
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this dataset? This cannot be undone."
      );
      if (!confirmDelete) return;

      try {
        const res = await fetch(`${API_BASE}/api/datasets/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result?.message || "Delete failed");

        // Filter using string conversion to avoid object vs string mismatch
        setDatasets((prev) =>
          prev.filter((d) => String(d._id || d.id || "") !== String(id))
        );
        alert("✅ Dataset deleted successfully!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("❌ Failed to delete dataset: " + (err?.message || err));
      }
    },
    [API_BASE]
  );

  // Upload modal trigger
  const handleUpload = useCallback(() => setShowUploadForm(true), []);

  // --- UI loading states ---
  if (loadingUser)
    return <p className="text-center mt-20 text-gray-500">Loading user...</p>;

  if (!user)
    return <p className="text-center mt-20 text-gray-500">No user found.</p>;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Member";
  const handleFromEmail = user.email ? user.email.split("@")[0] : "user";
  const avatarUrl = user.avatarUrl || "/default-avatar.png";

  // ✅ UI Layout
  return (
    <div className="min-h-screen w-full relative">
      {/* Background panel */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Navbar */}
      <div className="relative z-30 px-6 py-6">
        <Navbar />
      </div>

      {/* Main layout */}
      <div className="relative z-30 flex gap-8 px-10 pb-20">
        {/* Left column - Profile + Logout */}
        <div className="w-[420px] flex flex-col justify-center items-center">
          <div className="mt-10 mb-10 w-full flex justify-center">
            <ProfileCard
              name={user.name}
              title={`Member since ${joinedDate}`}
              handle={handleFromEmail}
              status={user.email}
              contactText="Contact Me"
              avatarUrl={avatarUrl}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() =>
                (window.location.href = `mailto:${user.email}`)
              }
            />
          </div>

          <div className="w-full flex justify-center mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-3 rounded-full hover:bg-red-700 px-10 transition-all duration-300 ease-in-out transform hover:scale-105"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Right column - Datasets */}
        <div className="flex-1">
          {/* Upload Button */}
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={handleUpload}
              className="relative overflow-hidden px-6 py-3 text-sm font-semibold text-white bg-black rounded-full
               transition-all duration-500 hover:scale-105 active:scale-95 group"
              aria-haspopup="dialog"
            >
              <span className="relative z-10">Upload New Dataset</span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-900 opacity-0
                 group-hover:opacity-100 blur-md transition-all duration-700"
              />
              <span
                className="absolute inset-0 border border-zinc-100 rounded-full group-hover:border-transparent
                 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-500"
              />
            </button>
          </div>

          {/* Dataset grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {loadingDatasets ? (
              <div className="text-white col-span-full text-center py-8">
                Loading datasets...
              </div>
            ) : datasets.length === 0 ? (
              <div className="text-white col-span-full text-center py-8">
                No datasets yet. Upload one to see it here.
              </div>
            ) : (
              datasets.map((d, index) => (
                // Put key on DatasetCard directly. Use index as last-resort fallback.
                <DatasetCard
                  key={d._id || d.id || index}
                  dataset={d}
                  onView={openDataset}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-100 text-red-700 p-3 rounded text-center max-w-xl">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {showUploadForm && (
        <UploadForm
          onClose={() => setShowUploadForm(false)}
          onUpload={(newDataset) =>
            setDatasets((prev) => {
              // Defensive: ensure newDataset is an object and not duplicate
              if (!newDataset || typeof newDataset !== "object") return prev;
              const id = newDataset._id || newDataset.id;
              // prevent duplicates: if id exists in prev, replace it; else prepend
              if (id) {
                const exists = prev.some(
                  (p) => String(p._id || p.id) === String(id)
                );
                if (exists) {
                  return prev.map((p) =>
                    String(p._id || p.id) === String(id) ? newDataset : p
                  );
                }
                return [newDataset, ...prev];
              }
              // fallback: just prepend
              return [newDataset, ...prev];
            })
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
