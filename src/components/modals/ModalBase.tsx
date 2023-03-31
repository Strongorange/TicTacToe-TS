import React from "react";
import useModal from "@/hooks/useModal";
import { useEffect } from "react";

const ModalBase = () => {
  const {
    modalDataState: { isOpen, title, content },
    closeModal,
  } = useModal();

  /**
   * @description 모달의 배경을 클릭하면 모달이 닫히도록 함
   */
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    /**
     * @description e.target 은 클릭한 요소를 가리키고 e.currentTarget 은 이벤트가 등록된 요소를 가리킴
     * @description e.target 과 e.currentTarget 이 같다는 것은 클릭한 요소가 이벤트가 등록된 요소와 같다는 것이므로 배경을 클릭한 것이라는 것을 의미
     * @description 배경을 클릭한 경우에만 모달을 닫도록 함
     */
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="h-1/2 w-3/4 overflow-auto rounded-3xl bg-white p-12 md:w-1/2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">{title}</h2>
          <button
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={closeModal}
          >
            X
          </button>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default ModalBase;
