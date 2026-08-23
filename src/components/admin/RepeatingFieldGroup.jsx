import { Plus, Trash2 } from "lucide-react";

const RepeatingFieldGroup = ({
  value = [],
  onChange,
  label,
  fields, // [{ name: "role", label: "Role", type: "text" }, { name: "name", label: "Name", type: "text" }]
  addLabel = "Add Row",
  emptyRow = {},
}) => {
  const addRow = () => {
    const newRow = {};
    fields.forEach((f) => (newRow[f.name] = ""));
    onChange([...value, { ...emptyRow, ...newRow }]);
  };

  const removeRow = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateRow = (index, fieldName, fieldValue) => {
    const updated = value.map((row, i) =>
      i === index ? { ...row, [fieldName]: fieldValue } : row
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {value.map((row, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 rounded-xl bg-space-800/50 border border-[#2a2a2a]"
        >
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-[11px] text-gray-500 mb-1">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={row[field.name] || ""}
                    onChange={(e) =>
                      updateRow(index, field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-space-800 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition"
                  >
                    <option value="">Select...</option>
                    {(field.options || []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    value={row[field.name] || ""}
                    onChange={(e) =>
                      updateRow(index, field.name, e.target.value)
                    }
                    placeholder={field.placeholder || field.label}
                    className="w-full px-3 py-2 rounded-lg bg-space-800 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition placeholder-gray-500"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => removeRow(index)}
            className="mt-6 p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-space-700 text-gray-300 text-sm font-medium hover:bg-space-600 transition border border-[#2a2a2a]"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
};

export default RepeatingFieldGroup;
