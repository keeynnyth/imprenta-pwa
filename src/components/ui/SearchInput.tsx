
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-3
        shadow-sm
        transition
        focus:border-orange-500
        focus:ring-2
        focus:ring-orange-200
        focus:outline-none
      "
    />
  );
}