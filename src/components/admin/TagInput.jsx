import { useState, useRef } from "react";
import { X } from "lucide-react";

const TagInput = ({ value = [], onChange, label, placeholder }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <div
        className="flex flex-wrap gap-2 p-3 rounded-xl bg-space-800 border border-border focus-within:border-accent transition min-h-[44px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/20 text-accent text-xs font-medium border border-accent/30"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:text-white transition"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={value.length === 0 ? placeholder || "Type and press Enter..." : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-white text-sm placeholder-gray-500"
        />
      </div>
    </div>
  );
};

export default TagInput;
