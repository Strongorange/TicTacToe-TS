import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalState";
import { useCallback } from "react";

interface OpenModalProps {
  title: string;
  content: JSX.Element | string;
}

/**
 * @description Modal을 사용하기 위한 Hook
 * @returns {object} modalDataState: Modal의 상태를 가지고 있는 객체
 * @returns {function} closeModal: Modal을 닫는 함수
 * @returns {function} openModal: Modal을 열고 데이터를 넣어주는 함수
 */
const useModal = () => {
  const [modalDataState, setModalDataState] = useRecoilState(modalState);

  /**
   * @description Modal을 열고 데이터를 넣어주는 함수
   * @param title Modal의 제목
   * @param content {JSX Element} Modal의 내용 컴포넌트가 들어가며 모달창의 컨텐츠가 됨
   */
  const openModal = useCallback(
    ({ title, content }: OpenModalProps) => {
      setModalDataState((prev) => {
        return {
          ...prev,
          isOpen: true,
          title,
          content,
        };
      });
    },
    [setModalDataState]
  );

  /**
   * @description Modal을 닫는 함수
   * @description modalState의 isOpen을 false로 변경하여 모달창을 닫음
   * @description title과 content는 초기화
   */
  const closeModal = useCallback(() => {
    setModalDataState((prev) => {
      return {
        ...prev,
        isOpen: false,
        title: "",
        content: "",
      };
    });
  }, [setModalDataState]);

  /**
   * @description Modal의 내용을 변경하는 함수, 모달이 열려있는 상태에서 변경 가능
   * @param title {string} Modal의 제목
   * @param content {JSX Element} Modal의 내용 컴포넌트가 들어가며 모달창의 컨텐츠가 됨
   */
  const changeModal = useCallback(
    ({ title, content }: OpenModalProps) => {
      setModalDataState((prev) => {
        return {
          ...prev,
          title,
          content,
        };
      });
    },
    [setModalDataState]
  );

  return { openModal, closeModal, changeModal, modalDataState };
};

export default useModal;
