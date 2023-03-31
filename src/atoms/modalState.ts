import { atom } from "recoil";

/**
 * @description Modal의 상태를 가지고 있는 객체
 * @property {boolean} isOpen Modal이 열려있는지 여부
 * @property {string} title Modal의 제목
 * @property {JSX.Element | string} content Modal의 내용 컴포넌트가 들어가며 모달창의 컨텐츠가 됨
 *
 */
interface ModalStateProps {
  isOpen: boolean;
  title: string;
  content: JSX.Element | string;
}

export const modalState = atom<ModalStateProps>({
  key: "modalState",
  default: {
    isOpen: false,
    title: "",
    content: "",
  },
});
