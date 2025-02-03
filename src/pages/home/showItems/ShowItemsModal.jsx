import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../../helpers/apiConfig";
import { transactionsSchema } from "../../../validations/transactions";
import endpointsServer from "../../../helpers/endpointsServer";
import LandingCore from "../../../context/landingCore/LandingCore";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";

function TransactionModal({ isOpen, setIsOpen, modalRef, dataId }) {
  const [values, setValues] = useState({
    user_id: "",
    pet_id: "",
    seller_id: "",
    status: "",
  });
  const [petId, setPetId] = useState({});

  const transactionStatus = useRef(null);

  const { token, toastPromise, toastMessage, isMe } = LandingCore();

  useEffect(() => {
    if (dataId) {
      apiConfig
        .get(`${endpointsServer.petID}/${dataId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          const response = res.data.data;

          setPetId(response);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [dataId, token]);

  // const handleChange = useCallback((e) => {
  //   const { name, value } = e.target;
  //   setValues((prev) => ({ ...prev, [name]: value }));
  // }, []);

  // const handleSubmit = useCallback(
  //   async (e) => {
  //     e.preventDefault();

  //     try {
  //       await transactionsSchema.validate(
  //         { user_id: isMe.user_id, status: "pending", ...values },
  //         { abortEarly: false }
  //       );

  //       const promise = apiConfig.post(
  //         endpointsServer.transactionCreate,
  //         { user_id: isMe.user_id, status: "pending", ...values },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       toastPromise(
  //         promise,
  //         {
  //           pending: "Transaction data on progress, please wait..!",
  //           success: "Transaction has been successfully created!",
  //           error: "Failed to transaction data!",
  //         },
  //         {
  //           autoClose: 2500,
  //           position: "top-center",
  //         }
  //       );

  //       promise.then((res) => {
  //         transactionStatus.current = res.data.success;
  //       });
  //     } catch (error) {
  //       console.error("Error saat mengirim data:", error);

  //       if (error.inner) {
  //         error.inner.forEach((err) => {
  //           toastMessage("error", err.message, { position: "top-center" });
  //         });
  //       } else {
  //         toastMessage("error", "Failed to create data!", {
  //           position: "top-center",
  //         });
  //       }
  //     }
  //   },
  //   [values, token]
  // );

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
        <form className="modal-form transaction">
          <div className="transaction-preview">
            <img
              className="image"
              src={`https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/pets/${petId.image}`}
              alt={petId.image}
            />
            <span className="price">{FormatCurrencyIDR(petId.price)}</span>
            <span className="name">{petId.pet}</span>
            <span className="location">{petId.location}</span>
          </div>
          <div className="transaction-button">
            <button type="submit">Buy</button>
            <button>Cancel</button>
          </div>
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
