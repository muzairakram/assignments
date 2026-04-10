"use client";

import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { PHASES, OPPORTUNITY_TYPES, RAG_STATUSES } from "@/lib/constants";

interface AddOpportunityModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    client: string;
    title: string;
    type: string;
    phase: string;
    value: number;
    lead: string;
    targetDate: string;
    rag: string;
    outcomes: string;
    notes: string;
  }) => void;
}

export function AddOpportunityModal({
  open,
  onClose,
  onSubmit,
}: AddOpportunityModalProps) {
  const [form, setForm] = useState({
    client: "",
    title: "",
    type: "",
    phase: "",
    value: "",
    lead: "",
    targetDate: "",
    rag: "",
    outcomes: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      value: parseFloat(form.value) || 0,
    });
    setForm({
      client: "",
      title: "",
      type: "",
      phase: "",
      value: "",
      lead: "",
      targetDate: "",
      rag: "",
      outcomes: "",
      notes: "",
    });
    onClose();
  };

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Modal open={open} onClose={onClose} title="Add Opportunity">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Client Name
            </label>
            <Input
              value={form.client}
              onChange={(e) => update("client", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Title
            </label>
            <Input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Type
            </label>
            <Select
              options={OPPORTUNITY_TYPES.map((t) => ({ value: t, label: t }))}
              placeholder="Select type"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Phase
            </label>
            <Select
              options={PHASES.map((p) => ({ value: p, label: p }))}
              placeholder="Select phase"
              value={form.phase}
              onChange={(e) => update("phase", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              RAG Status
            </label>
            <Select
              options={RAG_STATUSES.map((r) => ({ value: r, label: r }))}
              placeholder="Select RAG"
              value={form.rag}
              onChange={(e) => update("rag", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Value (USD)
            </label>
            <Input
              type="number"
              value={form.value}
              onChange={(e) => update("value", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              BD Lead
            </label>
            <Input
              value={form.lead}
              onChange={(e) => update("lead", e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
              Target Date
            </label>
            <Input
              type="date"
              value={form.targetDate}
              onChange={(e) => update("targetDate", e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
            Outcomes
          </label>
          <textarea
            value={form.outcomes}
            onChange={(e) => update("outcomes", e.target.value)}
            rows={3}
            className="w-full border border-input-border bg-white px-[10px] py-[7px] text-[13px] text-navy focus:outline-none focus:border-navy"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text block mb-1">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={2}
            className="w-full border border-input-border bg-white px-[10px] py-[7px] text-[13px] text-navy focus:outline-none focus:border-navy"
          />
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            className="bg-navy text-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-navy/90"
          >
            Add to Pipeline
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
