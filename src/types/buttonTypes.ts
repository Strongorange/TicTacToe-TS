import { ButtonHTMLAttributes } from "react";

type Variant = "default" | "start" | "savedGame";
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
