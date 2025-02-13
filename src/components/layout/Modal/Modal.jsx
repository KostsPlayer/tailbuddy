import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";

function Modal({
  type = "form",
  typeFor = null,
  titleModal = null,
  otherTitleModal = null,
  descModal = null,
  children,
  isOpen = false,
  setIsOpen = () => {},
  modalRef = null,
}) {
  const handleClickOutside = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    },
    [modalRef]
  );

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  return (
    <>
      {isOpen ? (
        <div className="overlay-modal">
          {type === "form" ? (
            <div className={`modal`} ref={modalRef}>
              <div className="modal-title">
                {titleModal} <span className="other">{otherTitleModal}</span>
              </div>
              <span
                className="material-symbols-outlined modal-close"
                onClick={() => setIsOpen(false)}
              >
                close
              </span>
              <div className="modal-line"></div>
              {children}
            </div>
          ) : (
            <div className="confirm-dashboard" ref={modalRef}>
              <span className="confirm-dashboard-title">{titleModal}</span>
              <span className="confirm-dashboard-desc">{descModal}</span>
              {children}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}

Modal.propTypes = {
  type: PropTypes.string,
  typeFor: PropTypes.string,
  titleModal: PropTypes.string,
  otherTitleModal: PropTypes.string,
  descModal: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  modalRef: PropTypes.object,
};

export default Modal;
