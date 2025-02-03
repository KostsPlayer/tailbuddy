import PropTypes from "prop-types";

function Modal({
  type = "form",
  titleModal,
  descModal,
  children,
  onClose = null,
  onOpen = null,
}) {
  if (!onOpen) return null;

  return (
    <>
      <div className="overlay-modal-dashboard" onClick={onClose}>
        {type === "form" ? (
          <div
            className="modal-dashboard"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="modal-dashboard-title">{titleModal}</span>
            <span
              className="material-symbols-outlined modal-dashboard-close"
              onClick={onClose}
            >
              close
            </span>
            {children}
          </div>
        ) : (
          <div
            className="confirm-dashboard"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="confirm-dashboard-title">{titleModal}</span>
            <span className="confirm-dashboard-desc">{descModal}</span>
            {children}
          </div>
        )}
      </div>
    </>
  );
}

Modal.propTypes = {
  type: PropTypes.string,
  titleModal: PropTypes.string,
  descModal: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default Modal;
