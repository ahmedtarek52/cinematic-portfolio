import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

const DataTable = ({
  columns, // [{ key, label, sortable?, render? }]
  data = [],
  onRowClick,
  actions, // (row) => JSX
  searchable = true,
  searchKeys = [],
  emptyMessage = "No items found",
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filteredData = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key];
        if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(q));
        return String(val || "").toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-space-800 text-sm text-white placeholder-gray-500 border border-border focus:border-accent focus:outline-none transition"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-space-800/80 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    col.sortable
                      ? "cursor-pointer hover:text-white select-none"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={() => onRowClick?.(row)}
                  className={`bg-space-900 hover:bg-space-800/60 transition ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-300">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500">
        {sortedData.length} of {data.length} items
      </p>
    </div>
  );
};

export default DataTable;
