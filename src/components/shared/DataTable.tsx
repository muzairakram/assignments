"use client";

import { useState } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    className?: string;
    render: (item: T) => React.ReactNode;
  }[];
  renderExpanded?: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  renderExpanded,
  getKey,
  className = "",
}: DataTableProps<T>) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-grey-bg border-t-2 border-navy">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text px-4 py-3 border-b border-grey-border ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const key = getKey(item);
            const isExpanded = expandedId === key;
            return (
              <Fragment key={key}>
                <tr
                  className="border-b border-grey-border hover:bg-grey-bg/50 cursor-pointer transition-colors duration-150"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : key)
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-[13px] ${col.className || ""}`}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
                {isExpanded && renderExpanded && (
                  <tr>
                    <td colSpan={columns.length} className="px-0 py-0">
                      {renderExpanded(item)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { Fragment } from "react";
