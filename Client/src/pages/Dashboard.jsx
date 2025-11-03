import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/Reactbits/ProfileCard/ProfileCard";
import DatasetCard from "../components/DatasetCard"; // ensure this exists
import UploadForm from "../components/UploadForm";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [error, setError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data);

        if (data && (data._id || data.id)) {
          await fetchDatasets(data._id || data.id);
        }
      } catch (err) {
        console.warn("Redirecting to login:", err.message);
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    checkAuthAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchDatasets = async (userId) => {
    try {
      setLoadingDatasets(true);
      setError("");
      const res = await fetch(
        `http://localhost:3000/api/datasets?userId=${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch datasets");
      const data = await res.json();
      setDatasets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load datasets");
      setDatasets([]);
    } finally {
      setLoadingDatasets(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  const openDataset = (id) => navigate(`/datasets/${id}`);
  const manageDataset = (id) => navigate(`/datasets/${id}/edit`);

  // instead of navigating to /upload, show the modal form
  const handleUpload = () => setShowUploadForm(true);

  if (loadingUser)
    return <p className="text-center mt-20 text-gray-500">Loading user...</p>;

  if (!user)
    return <p className="text-center mt-20 text-gray-500">No user found.</p>;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Member";
  const handleFromEmail = user.email ? user.email.split("@")[0] : "user";
  const avatarUrl = user.avatarUrl || "/default-avatar.png";

  return (
    <div className="min-h-screen w-full relative">
      {/* Background panel (unchanged) */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Navbar at top */}
      <div className="relative z-30 px-6 py-6">
        <Navbar />
      </div>

      {/* Main layout: left column + right datasets */}
      <div className="relative z-30 flex gap-8 px-10 pb-20">
        {/* Left column */}
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

          {/* Logout button */}
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-3 rounded-full hover:bg-red-700 px-10 transition-all duration-400 ease-in-out hover:px-20"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1">
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={handleUpload}
              className="relative overflow-hidden px-6 py-3 text-sm font-semibold text-white bg-black rounded-full
               transition-all duration-500 hover:scale-105 active:scale-95 group"
            >
              <span className="relative z-10">Upload New Dataset</span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-900 opacity-0
                 group-hover:opacity-100 blur-md transition-all duration-700"
              ></span>
              <span
                className="absolute inset-0 border border-zinc-100 rounded-full group-hover:border-transparent
                 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-500"
              ></span>
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
              datasets.map((d) => (
                <div key={d._id || d.id}>
                  <DatasetCard
                    dataset={d}
                    onView={openDataset}
                    onManage={manageDataset}
                  />
                </div>
              ))
            )}
          </div>

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
            setDatasets((prev) => [newDataset, ...prev])
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
