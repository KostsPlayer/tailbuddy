import { useEffect } from "react";
import Modal from "../../components/layout/Modal/Modal";

function DetailTransactionModal({ isOpen, setIsOpen, modalRef, data }) {
  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <Modal
      titleModal={"Transaction"}
      otherTitleModal={"Receipt"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalRef={modalRef}
    >
      <form className="modal-form">

        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}

export default DetailTransactionModal;
