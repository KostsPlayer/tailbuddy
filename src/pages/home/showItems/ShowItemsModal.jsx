import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../../helpers/apiConfig";
import { transactionsSchema } from "../../../validations/transactions";
import endpointsServer from "../../../helpers/endpointsServer";
import LandingCore from "../../../context/landingCore/LandingCore";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";

function TransactionModal({ isOpen, setIsOpen, modalRef, dataId, type }) {
  const [petId, setPetId] = useState({});
  const [productId, setProductId] = useState({});
  const transactionStatus = useRef(null);

  const { token, toastPromise, toastMessage, isMe } = LandingCore();

  useEffect(() => {
    if (type === "pets" && dataId) {
      apiConfig
        .get(`${endpointsServer.petId}/${dataId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const response = res.data.data;

          setPetId(response);
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (type === "products" && dataId) {
      apiConfig
        .get(`${endpointsServer.productId}`, {
          params: {
            id: dataId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const response = res.data.data;

          setProductId(response);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [type, dataId, token]);

  // const handleChange = useCallback((e) => {
  //   const { name, value } = e.target;
  //   setValues((prev) => ({ ...prev, [name]: value }));
  // }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (type === "pets") {
        try {
          await transactionsSchema.validate(
            {
              user_id: isMe.users_id,
              status: "pending",
              type: "pets",
            },
            { abortEarly: false }
          );

          const promise = apiConfig.post(
            endpointsServer.transactionCreate,
            {
              user_id: isMe.users_id,
              status: "pending",
              type: "pets",
            },
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
            },
            () => {
              if (transactionStatus.current === true) {
                setIsOpen(false);
              }
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
      }
    },
    [token, petId, isMe]
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
          <div className="transaction-preview">
            <img
              className="image"
              src={`https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/${type}/${
                type === "pets"
                  ? petId.image
                  : type === "products"
                  ? productId.image
                  : ""
              }`}
              alt={
                type === "pets"
                  ? petId.name
                  : type === "products"
                  ? productId.name
                  : ""
              }
            />
            <span className="price">
              {type === "pets"
                ? FormatCurrencyIDR(petId.price)
                : type === "products"
                ? FormatCurrencyIDR(productId.price)
                : "0.00"}
            </span>
            <span className="name">
              {type === "pets"
                ? petId.pet
                : type === "products"
                ? productId.name
                : "No Name"}
            </span>
            {type === "pets" ? (
              <span className="location">{petId.location}</span>
            ) : null}
          </div>
          <div className="transaction-button">
            <button type="submit">Buy</button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
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
  type: PropTypes.string,
};

export default TransactionModal;
