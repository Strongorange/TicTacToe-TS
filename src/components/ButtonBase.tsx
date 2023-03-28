import { ButtonBasePropsOptional } from "@/types/buttonTypes";

const variantClasses = {
  default: "bg-black hover:bg-opacity-75",
  start: "bg-green-600 hover:bg-opacity-75",
  savedGame: "bg-black hover:bg-opacity-75",
};

const sizeClasses = {
  sm: "py-2 px-3",
  md: "py-4 px-5",
  lg: "py-6 px-7",
  xl: "py-8 px-9",
};

const ButtonBase = ({
  variant = "default",
  size,
  fullWidth,
  children,
  ...props
}: ButtonBasePropsOptional) => {
  const variantClass = variantClasses[variant!];
  const sizeClass = sizeClasses[size!];
  const fullSizeClass = fullWidth ? "w-full" : null;
  return (
    <button
      {...props}
      className={`relative box-border flex min-w-[64px] cursor-pointer select-none items-center justify-center gap-1 text-ellipsis whitespace-nowrap rounded-lg text-white transition-all ${fullSizeClass} ${sizeClass} ${variantClass}`}
    >
      {children}
    </button>
  );
};

export default ButtonBase;
