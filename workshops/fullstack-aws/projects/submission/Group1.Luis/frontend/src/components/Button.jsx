// Reusable styled button component.
// Use this instead of creating different button styles throughout the application.

function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`
        rounded-md bg-[#062b4f] px-4 py-2
        font-medium text-white
        transition-colors hover:bg-[#0a3a68]
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
