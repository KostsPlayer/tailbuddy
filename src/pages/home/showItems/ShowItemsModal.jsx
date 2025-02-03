import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../../helpers/apiConfig";
import { transactionsSchema } from "../../../validations/transactions";
import endpointsServer from "../../../helpers/endpointsServer";
import LandingCore from "../../../context/landingCore/LandingCore";

function TransactionModal({ isOpen, setIsOpen, modalRef }) {
  const [values, setValues] = useState({
    user_id: "",
    pet_id: "",
    seller_id: "",
    status: "",
  });

  const transactionStatus = useRef(null);

  const { token, toastPromise, toastMessage, isMe } = LandingCore();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        await transactionsSchema.validate(
          { user_id: isMe.user_id, status: "pending", ...values },
          { abortEarly: false }
        );

        const promise = apiConfig.post(
          endpointsServer.transactionCreate,
          { user_id: isMe.user_id, status: "pending", ...values },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toastPromise(
          promise,
          {
            pending: "Transaction data on progress, please wait..!",
            success: "Transaction has been successfully created!",
            error: "Failed to transaction data!",
          },
          {
            autoClose: 2500,
            position: "top-center",
          }
        );

        promise.then((res) => {
          transactionStatus.current = res.data.success;
        });
      } catch (error) {
        console.error("Error saat mengirim data:", error);

        if (error.inner) {
          error.inner.forEach((err) => {
            toastMessage("error", err.message, { position: "top-center" });
          });
        } else {
          toastMessage("error", "Failed to create data!", {
            position: "top-center",
          });
        }
      }
    },
    [values, token]
  );

  return (
    <>
      <Modal
        titleModal={"Detail"}
        otherTitleModal={"Transaction"}
        typeFor="transaction"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalRef={modalRef}
      >
        <form className="modal-form transaction" onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label htmlFor="name">
              Business Category's Name <span>(Required)</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Pet Business Category"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
}

TransactionModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default TransactionModal;
