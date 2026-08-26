// Reusable styled form input component.
// Used to keep text fields, password fields, number inputs, etc. visually consistent.

function Input({ label, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full rounded-md border border-slate-300
          px-3 py-2 text-slate-900
          outline-none transition
          placeholder:text-slate-400
          focus:border-[#062b4f] focus:ring-2 focus:ring-[#062b4f]/20
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

export default Input;
