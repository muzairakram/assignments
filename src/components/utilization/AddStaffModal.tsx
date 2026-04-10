"use client";

import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { STAFF_STATUSES } from "@/lib/constants";

interface AddStaffModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    role: string;
    email: string;
    mesaBillable: number;
    globalBillable: number;
    internal: number;
    bench: number;
    status: string;
    reportingMonth: string;
  }) => void;
  reportingMonth: string;
}

export function AddStaffModal({
  open,
  onClose,
  onSubmit,
  reportingMonth,
}: AddStaffModalProps) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    mesaBillable: "",
    globalBillable: "",
    internal: "",
    bench: "",
    status: "Active",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mesa = parseFloat(form.mesaBillable) || 0;
    const global = parseFloat(form.globalBillable) || 0;
    const internal = parseFloat(form.internal) || 0;
    const bench = parseFloat(form.bench) || 0;
    const total = mesa + global + internal + bench;

    if (Math.abs(total - 100) > 0.01) {
      setError(`Allocations must sum to 100%. Current total: ${total}%`);
      return;
    }

    setError("");
    onSubmit({
      name: form.name,
      role: form.role,
      email: form.email,
      mesaBillable: mesa,
      globalBillable: global,
      internal,
      bench,
      status: form.status,
      reportingMonth,
    });
    setForm({
      name: "",
      role: "",
      email: "",
      mesaBillable: "",
      globalBillable: "",
      internal: "",
      bench: "",
      status: "Active",
    });
    onClose();
  };

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Modal open={open} onClose={onClose} title="Add Staff Member">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Name
            </label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Role
            </label>
            <Input
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Email
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Status
            </label>
            <Select
              options={STAFF_STATUSES.map((s) => ({ value: s, label: s }))}
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
          Allocation (must sum to 100%)
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] text-grey-text block mb-1">MESA %</label>
            <Input
              type="number"
              value={form.mesaBillable}
              onChange={(e) => update("mesaBillable", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] text-grey-text block mb-1">Global %</label>
            <Input
              type="number"
              value={form.globalBillable}
              onChange={(e) => update("globalBillable", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] text-grey-text block mb-1">Internal %</label>
            <Input
              type="number"
              value={form.internal}
              onChange={(e) => update("internal", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] text-grey-text block mb-1">Bench %</label>
            <Input
              type="number"
              value={form.bench}
              onChange={(e) => update("bench", e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        {error && (
          <div className="text-[12px] text-red font-bold">{error}</div>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            className="bg-navy text-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-navy/90"
          >
            Add Staff Member
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-grey-text hover:text-navy px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] border border-grey-border"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
