import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import {
  IndianRupee,
  PlusCircle,
  Settings,
  History,
  Trash2,
  Edit,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { STANDARD_OPTIONS } from "./StudentsTab";
import html2pdf from "html2pdf.js";
import { AuthContext } from "../context/AuthContext";

const FeesTab = () => {
  const { user } = useContext(AuthContext);
  const [viewMode, setViewMode] = useState("collect");

  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);

  const [filterStd, setFilterStd] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    amountPaid: "",
    paidBy: "",
    paymentMode: "Cash",
  });

  // Fixed Setup Form State
  const [structData, setStructData] = useState({
    std: STANDARD_OPTIONS[9],
    totalFee: "",
  });
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [structRes, payRes, studentRes] = await Promise.all([
        api.get("/fees/structure"),
        api.get("/fees/all-payments"),
        api.get("/students"),
      ]);
      setStructures(structRes.data);
      setPayments(payRes.data);
      setStudents(studentRes.data);
    } catch (err) {
      console.error("Error loading fee data");
    }
  };

  // --- LEDGER CALCULATION (Groups payments by student) ---
  const ledger = students.map((student) => {
    const stdFee = structures.find((s) => s.std === student.std)?.totalFee || 0;
    const studentPayments = payments.filter(
      (p) => p.studentId?._id === student._id,
    );
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    return {
      ...student,
      stdFee,
      totalPaid,
      remaining: stdFee - totalPaid,
      payments: studentPayments,
    };
  });

  // Filtered Ledger for displaying in History/Collect
  const filteredLedger = ledger.filter(
    (s) =>
      (!filterStd || s.std === filterStd) &&
      (!filterBatch || s.batch === filterBatch),
  );

  // Selected Student Details for Collection Validation
  const selectedStudentLedger = ledger.find(
    (s) => s._id === formData.studentId,
  );

  // --- SETUP TAB FIX ---
  const handleSaveStructure = async (e) => {
    e.preventDefault();
    if (!structData.std || !structData.totalFee)
      return alert("Please fill all fields");
    try {
      await api.post("/fees/structure", structData);
      alert(`Master Fee for ${structData.std} updated successfully!`);
      setStructData({ std: STANDARD_OPTIONS[9], totalFee: "" }); // Reset form
      fetchData();
    } catch (err) {
      alert("Failed to save fee structure");
    }
  };

  // --- COLLECT PAYMENT (WITH SMART LIMITS) ---
  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!formData.studentId) return alert("Please select a student.");

    // Prevent overcharging (unless editing, then logic is slightly different)
    if (
      !editingId &&
      selectedStudentLedger &&
      Number(formData.amountPaid) > selectedStudentLedger.remaining
    ) {
      return alert(
        `Cannot accept ₹${formData.amountPaid}. The student only owes ₹${selectedStudentLedger.remaining}.`,
      );
    }

    const confirmMsg = editingId
      ? `Confirm UPDATE of ₹${formData.amountPaid} for ${selectedStudentLedger.name}?`
      : `Confirm NEW payment of ₹${formData.amountPaid} from ${selectedStudentLedger.name}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      if (editingId) {
        await api.put(`/fees/pay/${editingId}`, formData);
        alert("Payment Updated Successfully!");
      } else {
        await api.post("/fees/pay", formData);
        alert("Payment Recorded Successfully!");
      }
      setFormData({
        studentId: "",
        amountPaid: "",
        paidBy: "",
        paymentMode: "Cash",
      });
      setEditingId(null);
      fetchData(); // Reload all data to update ledger
      setViewMode("history");
    } catch (err) {
      alert("Failed to record payment");
    }
  };

  // --- CRUD OPERATIONS ---
  const handleEditClick = (payment) => {
    setEditingId(payment._id);
    setFormData({
      studentId: payment.studentId._id,
      amountPaid: payment.amountPaid,
      paidBy: payment.paidBy,
      paymentMode: payment.paymentMode,
    });
    setViewMode("collect");
  };

  const handleDeletePayment = async (id) => {
    if (
      window.confirm(
        "CRITICAL: Are you sure you want to permanently delete this payment receipt?",
      )
    ) {
      try {
        await api.delete(`/fees/pay/${id}`);
        fetchData(); // Reload to update ledger
        alert("Payment deleted.");
      } catch (err) {
        alert("Error deleting payment.");
      }
    }
  };

  // --- COMPREHENSIVE PDF STATEMENT ---
  const handleDownloadStatement = (studentData) => {
    if (studentData.payments.length === 0)
      return alert("No payments to print!");

    // Generate table rows for history
    const historyRows = studentData.payments
      .map(
        (p) => `
      <tr>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${new Date(p.date).toLocaleDateString("en-US")}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.paymentMode}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.receivedBy}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: bold; color: #15803d;">₹${p.amountPaid.toLocaleString()}</td>
      </tr>
    `,
      )
      .join("");

    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 900; color: #1e3a8a; margin: 0; text-transform: uppercase;">Unique Coaching Class</h1>
          <p style="font-size: 18px; color: #4b5563; margin-top: 5px; font-weight: bold;">OFFICIAL FEE STATEMENT</p>
        </div>
        
        <table style="width: 100%; margin-bottom: 30px;">
          <tr>
            <td><strong>Student Name:</strong> ${studentData.name}</td>
            <td style="text-align: right;"><strong>Date Printed:</strong> ${new Date().toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>Standard / Batch:</strong> ${studentData.std} - ${studentData.batch}</td>
            <td style="text-align: right;"><strong>Phone:</strong> ${studentData.phone || "N/A"}</td>
          </tr>
        </table>

        <h3 style="color: #2563eb; text-transform: uppercase; margin-bottom: 10px; font-size: 14px;">Payment History</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
          <tr style="background: #f9fafb;">
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Date</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Mode</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Received By</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Amount</th>
          </tr>
          ${historyRows}
        </table>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h3 style="color: #2563eb; text-transform: uppercase; margin-top: 0; margin-bottom: 15px; font-size: 14px;">Account Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>Total Yearly Fee:</span> <strong>₹${studentData.stdFee.toLocaleString()}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>Total Amount Paid:</span> <strong style="color: #15803d;">₹${studentData.totalPaid.toLocaleString()}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px dashed #cbd5e1; font-size: 18px; font-weight: bold; color: #b91c1c;"><span>Remaining Balance Due:</span> <span>₹${studentData.remaining.toLocaleString()}</span></div>
        </div>

        <div style="margin-top: 60px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Thank you for your business. This is a system generated statement.</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `${studentData.name.replace(/\s+/g, "_")}_Statement.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // --- ADD THIS TO FeesTab.jsx ---
  const handleMasterExportPayments = () => {
    if (payments.length === 0) return alert("No payments to export.");

    // Sort payments by Student's Standard (1st to 12th)
    const sortedPayments = [...payments].sort((a, b) => {
      const stdA = a.studentId?.std || "";
      const stdB = b.studentId?.std || "";
      return STANDARD_OPTIONS.indexOf(stdA) - STANDARD_OPTIONS.indexOf(stdB);
    });

    let csvContent =
      "Standard,Batch,Student Name,Amount Paid,Payment Mode,Paid By,Received By,Date\n";
    sortedPayments.forEach((p) => {
      const std = p.studentId?.std || "N/A";
      const batch = p.studentId?.batch || "N/A";
      const name = p.studentId?.name || "Unknown";
      const date = new Date(p.date).toLocaleString();
      csvContent += `"${std}","${batch}","${name}","${p.amountPaid}","${p.paymentMode}","${p.paidBy}","${p.receivedBy}","${date}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `Master_Financial_Backup_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMasterDeleteAllPayments = async () => {
    const confirmDelete = window.confirm(
      "END OF YEAR WIPE: Are you sure you want to permanently delete ALL financial payment records? A backup will be downloaded automatically.",
    );
    if (confirmDelete) {
      handleMasterExportPayments(); // Auto Backup first!
      try {
        await api.delete("/fees/all-payments");
        setPayments([]);
        alert("All financial records have been wiped.");
      } catch (err) {
        alert("Failed to wipe payments.");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <IndianRupee className="text-green-600" /> Accounts & Fees
        </h2>
        <div className="flex gap-2 w-full md:w-auto bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("collect")}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-md ${viewMode === "collect" ? "bg-white shadow-sm text-green-700" : "text-gray-500 hover:text-gray-800"}`}
          >
            Collect
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-md ${viewMode === "history" ? "bg-white shadow-sm text-green-700" : "text-gray-500 hover:text-gray-800"}`}
          >
            Ledger
          </button>
          <button
            onClick={() => setViewMode("structure")}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-md ${viewMode === "structure" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Settings size={16} className="inline mr-1" /> Setup
          </button>
          {user?.role === "admin" && viewMode === "history" && (
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={handleMasterExportPayments}
                className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold flex items-center gap-1"
              >
                <Download size={14} /> Export Entire Ledger
              </button>
              <button
                onClick={handleMasterDeleteAllPayments}
                className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold flex items-center gap-1"
              >
                <Trash2 size={14} /> Wipe All Records
              </button>
            </div>
          )}
        </div>
      </div>

      {viewMode === "collect" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleCollectPayment}
            className="bg-green-50/50 border border-green-100 p-6 rounded-xl relative"
          >
            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <PlusCircle size={18} />{" "}
              {editingId ? "Edit Payment" : "New Receipt"}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    studentId: "",
                    amountPaid: "",
                    paidBy: "",
                    paymentMode: "Cash",
                  });
                }}
                className="absolute top-6 right-6 text-sm text-red-600 font-bold"
              >
                Cancel Edit
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Filter Standard
                </label>
                <select
                  value={filterStd}
                  onChange={(e) => setFilterStd(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white text-sm"
                >
                  <option value="">All Standards</option>
                  {STANDARD_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Filter Batch
                </label>
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="w-full p-2 border rounded mt-1 bg-white text-sm"
                >
                  <option value="">All Batches</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Select Student
              </label>
              <select
                required
                disabled={editingId}
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                className="w-full p-2 border rounded mt-1 bg-white font-medium"
              >
                <option value="" disabled>
                  -- Select a Student --
                </option>
                {filteredLedger.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.std})
                  </option>
                ))}
              </select>
            </div>

            {/* SMART BALANCE DISPLAY */}
            {selectedStudentLedger && !editingId && (
              <div className="mb-4 p-3 bg-white border border-green-200 rounded-lg flex justify-between items-center shadow-sm">
                <span className="text-sm font-bold text-gray-600">
                  Total Dues:{" "}
                  <span className="text-gray-900">
                    ₹{selectedStudentLedger.stdFee}
                  </span>
                </span>
                <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded">
                  Remaining: ₹{selectedStudentLedger.remaining}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Amount (₹)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max={
                    !editingId && selectedStudentLedger
                      ? selectedStudentLedger.remaining
                      : undefined
                  }
                  value={formData.amountPaid}
                  onChange={(e) =>
                    setFormData({ ...formData, amountPaid: e.target.value })
                  }
                  className="w-full p-2 border rounded mt-1 font-bold text-green-700"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Mode
                </label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMode: e.target.value })
                  }
                  className="w-full p-2 border rounded mt-1 bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / Online</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Paid By (Name)
              </label>
              <input
                required
                type="text"
                value={formData.paidBy}
                onChange={(e) =>
                  setFormData({ ...formData, paidBy: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={!editingId && selectedStudentLedger?.remaining === 0}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!editingId && selectedStudentLedger?.remaining === 0
                ? "Fee Fully Paid!"
                : editingId
                  ? "Update Receipt"
                  : "Generate Receipt"}
            </button>
          </form>
        </div>
      )}

      {/* --- MODE 2: GROUPED LEDGER --- */}
      {viewMode === "history" && (
        <div>
          <div className="flex gap-4 mb-4">
            <select
              value={filterStd}
              onChange={(e) => setFilterStd(e.target.value)}
              className="p-2 border rounded-lg outline-none bg-gray-50 font-bold"
            >
              <option value="">Filter: All Standards</option>
              {STANDARD_OPTIONS.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="p-2 border rounded-lg outline-none bg-gray-50 font-bold"
            >
              <option value="">Filter: All Batches</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse `min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 text-sm text-gray-600">Student Info</th>
                  <th className="p-4 text-sm text-gray-600 text-center">
                    Total Fee
                  </th>
                  <th className="p-4 text-sm text-gray-600 text-center">
                    Paid
                  </th>
                  <th className="p-4 text-sm text-gray-600 text-center">
                    Remaining
                  </th>
                  <th className="p-4 text-sm text-gray-600 text-center">
                    Statement
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((student) => (
                    <React.Fragment key={student._id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <p className="font-bold text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.std} • {student.batch}
                          </p>
                        </td>
                        <td className="p-4 text-center font-bold text-gray-600">
                          ₹{student.stdFee.toLocaleString()}
                        </td>
                        <td className="p-4 text-center font-bold text-green-600">
                          ₹{student.totalPaid.toLocaleString()}
                        </td>
                        <td className="p-4 text-center font-bold text-red-600">
                          ₹{student.remaining.toLocaleString()}
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                          <button
                            onClick={() => handleDownloadStatement(student)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 text-xs flex items-center gap-1"
                            title="Download Statement"
                          >
                            <Download size={14} /> PDF
                          </button>
                          <button
                            onClick={() =>
                              setExpandedStudentId(
                                expandedStudentId === student._id
                                  ? null
                                  : student._id,
                              )
                            }
                            className="px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            {expandedStudentId === student._id ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </td>
                      </tr>
                      {/* Expandable Row for Editing Individual Receipts */}
                      {expandedStudentId === student._id && (
                        <tr className="bg-gray-50">
                          <td colSpan="5" className="p-4 border-b">
                            <div className="bg-white border rounded-lg p-4">
                              <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">
                                Individual Receipts
                              </h4>
                              {student.payments.length === 0 ? (
                                <p className="text-xs text-gray-500">
                                  No payments yet.
                                </p>
                              ) : (
                                student.payments.map((p) => (
                                  <div
                                    key={p._id}
                                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                                  >
                                    <div className="text-sm">
                                      <span className="font-bold text-gray-800">
                                        {new Date(p.date).toLocaleDateString()}
                                      </span>{" "}
                                      - {p.paymentMode} (By {p.paidBy})
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="font-bold text-green-600">
                                        ₹{p.amountPaid}
                                      </span>
                                      <button
                                        onClick={() => handleEditClick(p)}
                                        className="text-orange-500 hover:text-orange-700"
                                      >
                                        <Edit size={14} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeletePayment(p._id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODE 3: SETUP MASTER FEES --- */}
      {viewMode === "structure" && (
        <div className="max-w-2xl">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
            Set the total expected fee for an entire academic year.
          </div>
          <form
            onSubmit={handleSaveStructure}
            className="flex gap-4 items-end mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200"
          >
            <div className="flex-1">
              <label className="font-bold text-xs text-gray-600 uppercase">
                Standard
              </label>
              <select
                value={structData.std}
                onChange={(e) =>
                  setStructData({ ...structData, std: e.target.value })
                }
                className="w-full p-2 border rounded mt-1 bg-white"
              >
                {STANDARD_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="font-bold text-xs text-gray-600 uppercase">
                Total Yearly Fee (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                value={structData.totalFee}
                onChange={(e) =>
                  setStructData({ ...structData, totalFee: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
                placeholder="e.g. 15000"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white font-bold py-2 px-6 rounded shadow hover:bg-gray-800"
            >
              Save Setup
            </button>
          </form>

          <h3 className="font-bold text-gray-900 mb-4">
            Current Fee Structures
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {structures.map((s) => (
              <div
                key={s._id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm text-center"
              >
                <p className="text-xs font-bold text-gray-500 uppercase">
                  {s.std}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  ₹{s.totalFee.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesTab;
