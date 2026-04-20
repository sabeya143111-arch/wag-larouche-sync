"use client";

import { useState } from "react";

type SaleOrder = {
  id: number;
  name: string;
  date_order: string;
  customer: string;
  amount_total: number;
};

export default function Home() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SaleOrder[]>([]);
  const [error, setError] = useState("");

  const handlePreview = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both dates");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/sync-sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromDate, toDate }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Request failed");
      }

      const mapped = (json.data || []).map((so: any, index: number) => ({
        id: so.id || index,
        name: so.name,
        date_order: so.date_order,
        customer: Array.isArray(so.partner_id) ? so.partner_id[1] : so.partner_id,
        amount_total: so.amount_total,
      }));

      setData(mapped);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="w-full max-w-5xl p-6 bg-slate-900 rounded-2xl border border-slate-700 shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Odoo SO Sync Designer</h1>
            <p className="text-sm text-slate-400">
              Select date range and fetch Sale Orders from Odoo.
            </p>
          </div>
          <button
            onClick={handlePreview}
            disabled={loading || !fromDate || !toDate}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium px-4 py-2 rounded-lg"
          >
            {loading ? "Loading..." : "Sync SOs"}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-300 mb-1">
              Warehouse (optional)
            </label>
            <select
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              defaultValue=""
            >
              <option value="">All Warehouses</option>
              <option value="jeddah">Jeddah Main</option>
              <option value="riyadh">Riyadh</option>
            </select>
          </div>
        </div>

        {/* Error / info */}
        {error && (
          <div className="mb-3 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400">Total Orders</p>
            <p className="text-xl font-semibold mt-1">{data.length}</p>
          </div>
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400">Total Amount</p>
            <p className="text-xl font-semibold mt-1">
              {data.reduce((sum, so) => sum + so.amount_total, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400">Status</p>
            <p className="text-sm mt-1">
              {loading ? "Fetching from Odoo..." : "Ready"}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mt-2 max-h-80 overflow-auto border border-slate-700 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  SO
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Date
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Customer
                </th>
                <th className="px-3 py-2 text-right border-b border-slate-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-slate-400"
                    colSpan={4}
                  >
                    No data yet. Select dates and click Sync SOs.
                  </td>
                </tr>
              )}

              {data.map((so) => (
                <tr key={so.id} className="hover:bg-slate-800/80">
                  <td className="px-3 py-2 border-b border-slate-800">
                    {so.name}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    {so.date_order}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    {so.customer}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800 text-right">
                    {so.amount_total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
