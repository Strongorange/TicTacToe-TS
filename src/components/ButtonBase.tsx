import { ButtonHTMLAttributes } from "react";

type Variant =
  | "default"
  | "start"
  | "savedGame"
  | "goHome"
  | "restartGame"
  | "saveGame";
type Size = "sm" | "md" | "lg" | "xl";

/**
 * ButtonBase 컴포넌트 Props, HTMLButton 의 Props 를 상속받음
 * @type variant {string} - 버튼의 종류를 결정
 * @type size {string} - 크기를 결정
 * @type fullWidth {boolean} 버튼이 100% width 를 가질지 결정
 */
interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  size: Size;
  fullWidth: boolean;
}

export type ButtonBasePropsOptional = Partial<ButtonBaseProps>;

const variantClasses = {
  default: "bg-black hover:bg-opacity-75",
  start: "bg-green-600 hover:bg-opacity-75",
  savedGame: "bg-black hover:bg-opacity-75",
  goHome: "bg-blue-700 hover:bg-opacity-75",
  restartGame: "bg-gray-700 hover:bg-opacity-75",
  saveGame: "bg-black hover:bg-opacity-75",
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
