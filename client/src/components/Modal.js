import ReactDOM from "react-dom";
import { useEffect } from "react";

function Modal({ onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 3,
        }}
      ></div>
      <div
        onClick={onClose}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 4,
          width: "100%",
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

export default Modal;
