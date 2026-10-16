export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-5">

      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-[#176b4d]"
      />

    </div>
  );
}
