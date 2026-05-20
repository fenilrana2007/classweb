import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  BookOpen,
  Edit,
  Trash2,
  Link as LinkIcon,
  UploadCloud,
  Loader,
} from "lucide-react";
import { STANDARD_OPTIONS } from "./StudentsTab";

const ClassLogTab = () => {
  const [logs, setLogs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // New States for Upload Logic
  const [attachMode, setAttachMode] = useState("none"); // 'none', 'upload', 'link'
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    std: STANDARD_OPTIONS[9],
    batch: "Morning",
    subject: "",
    topicTaught: "",
    homework: "",
    attachmentLink: "",
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/teacher/class-logs");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- CLOUDINARY UPLOAD FUNCTION ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Check File Size (Limit to 10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10485760) {
      alert(
        "This file is too large (over 10MB). Please upload it to Google Drive and use the 'Paste Link' option instead.",
      );
      e.target.value = ""; // Reset input
      return;
    }

    setIsUploading(true);

    // 2. Prepare data for Cloudinary
    const data = new FormData();
    data.append("file", file);

    // ⚠️ IMPORTANT: Replace these with your actual Cloudinary details!
    // data.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
    // data.append("cloud_name", process.env.CLOUDINARY_CLOUD_NAME);

    // try {
    //   // ⚠️ IMPORTANT: Replace 'YOUR_CLOUD_NAME' in this URL too!
    //   const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    //     method: "POST",
    //     body: data
    //   });
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: data,
        },
      );

      // ADD THIS CHECK: If the response is not 200 OK, throw an error!
      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const uploadedFile = await res.json();

      setFormData({ ...formData, attachmentLink: uploadedFile.secure_url });
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(
        "Upload failed. Please check your Cloudinary credentials and internet connection.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/teacher/class-logs/${editingId}`, formData);
        setLogs(logs.map((log) => (log._id === editingId ? res.data : log)));
      } else {
        const res = await api.post("/teacher/class-logs", formData);
        setLogs([res.data, ...logs]);
      }
      resetForm();
    } catch (err) {
      alert("Failed to save log.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this log?")) {
      await api.delete(`/teacher/class-logs/${id}`);
      setLogs(logs.filter((l) => l._id !== id));
    }
  };

  const handleEdit = (log) => {
    setEditingId(log._id);
    setFormData({
      date: new Date(log.date).toISOString().split("T")[0],
      std: log.std,
      batch: log.batch,
      subject: log.subject,
      topicTaught: log.topicTaught,
      homework: log.homework,
      attachmentLink: log.attachmentLink,
    });
    if (log.attachmentLink) setAttachMode("link"); // Default to link view if editing a log with an attachment
  };

  const resetForm = () => {
    setEditingId(null);
    setAttachMode("none");
    setFormData({
      date: new Date().toISOString().split("T")[0],
      std: STANDARD_OPTIONS[9],
      batch: "Morning",
      subject: "",
      topicTaught: "",
      homework: "",
      attachmentLink: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="text-purple-600" /> Daily Class Logs & Homework
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-purple-50 p-4 md:p-6 rounded-xl border border-purple-100 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-2 border rounded mt-1 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Standard
            </label>
            <select
              required
              value={formData.std}
              onChange={(e) =>
                setFormData({ ...formData, std: e.target.value })
              }
              className="w-full p-2 border rounded mt-1 text-sm bg-white"
            >
              {STANDARD_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Batch
            </label>
            {/* Update your batch dropdown to look like this */}
            <select
              required
              value={formData.batch}
              onChange={(e) =>
                setFormData({ ...formData, batch: e.target.value })
              }
              className="w-full p-2 border rounded mt-1 text-sm bg-white"
            >
              <option value="Morning">Morning Batch</option>
              <option value="Evening">Evening Batch</option>
              <option value="All Batches">
                All Batches (Morning + Evening)
              </option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-600 uppercase">
            Subject
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Mathematics"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full p-2 border rounded mt-1 text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-600 uppercase">
            Topic Taught Today
          </label>
          <textarea
            required
            rows="2"
            value={formData.topicTaught}
            onChange={(e) =>
              setFormData({ ...formData, topicTaught: e.target.value })
            }
            className="w-full p-2 border rounded mt-1 text-sm resize-y"
          />
        </div>
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-600 uppercase">
            Homework Assigned
          </label>
          <textarea
            rows="2"
            value={formData.homework}
            onChange={(e) =>
              setFormData({ ...formData, homework: e.target.value })
            }
            className="w-full p-2 border rounded mt-1 text-sm resize-y"
            placeholder="Leave blank if none..."
          />
        </div>

        {/* --- SMART ATTACHMENT SECTION --- */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
          <label className="text-xs font-bold text-gray-600 uppercase mb-3 block">
            Study Material / Attachment
          </label>

          {/* Toggle Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setAttachMode("none");
                setFormData({ ...formData, attachmentLink: "" });
              }}
              className={`px-4 py-2 rounded text-sm font-bold border ${attachMode === "none" ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
            >
              No Attachment
            </button>
            <button
              type="button"
              onClick={() => setAttachMode("upload")}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold border ${attachMode === "upload" ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
            >
              <UploadCloud size={16} /> Upload File (&lt; 10MB)
            </button>
            <button
              type="button"
              onClick={() => setAttachMode("link")}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold border ${attachMode === "link" ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
            >
              <LinkIcon size={16} /> Paste Link (Drive/Heavy Files)
            </button>
          </div>

          {/* Conditional Inputs */}
          {attachMode === "upload" && (
            <div className="animate-fade-in">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="w-full p-2 border rounded text-sm mb-2"
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-purple-600 font-bold flex items-center gap-2">
                  <Loader size={14} className="animate-spin" /> Uploading to
                  secure server...
                </p>
              )}
              {!isUploading && formData.attachmentLink && (
                <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                  ✓ File ready to be saved.
                </p>
              )}
            </div>
          )}

          {attachMode === "link" && (
            <div className="animate-fade-in">
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={formData.attachmentLink}
                onChange={(e) =>
                  setFormData({ ...formData, attachmentLink: e.target.value })
                }
                className="w-full p-2 border rounded text-sm outline-none focus:border-purple-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Paste a Google Drive or external link for large
                videos/documents.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full md:w-auto bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingId ? "Update Log" : "Save Log"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full md:w-auto bg-gray-300 px-4 py-2 rounded font-bold text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* --- DISPLAY LOGS --- */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 italic p-8 bg-gray-50 rounded border border-dashed">
            No class logs recorded yet.
          </p>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-3 mb-3 gap-2">
                <span className="font-bold text-purple-800 text-sm md:text-base">
                  {new Date(log.date).toLocaleDateString()} - {log.subject}{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    ({log.std} - {log.batch})
                  </span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(log)}
                    className="p-1.5 text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-800">
                <strong className="text-gray-900">Taught:</strong>{" "}
                {log.topicTaught}
              </p>
              <p className="text-sm text-gray-800 mt-2">
                <strong className="text-gray-900">Homework:</strong>{" "}
                {log.homework || (
                  <span className="text-gray-500 italic">None assigned</span>
                )}
              </p>

              {log.attachmentLink && (
                <div className="mt-4 pt-4 border-t border-purple-50">
                  <a
                    href={
                      log.attachmentLink.startsWith("http")
                        ? log.attachmentLink
                        : `https://${log.attachmentLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-100 transition-colors shadow-sm w-full md:w-auto"
                  >
                    <LinkIcon size={16} />
                    Open Attached Material
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassLogTab;
