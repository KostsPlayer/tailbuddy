import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../../helpers/apiConfig";
import { transactionsSchema } from "../../../validations/transactions";
import endpointsServer from "../../../helpers/endpointsServer";
import LandingCore from "../../../context/landingCore/LandingCore";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";
import LoaderProgress from "../../../components/loader/LoaderProgress";

function TransactionModal({ isOpen, setIsOpen, modalRef, dataId, type }) {
  const [petId, setPetId] = useState({});
  const [productId, setProductId] = useState({});
  const [transactionLoading, setTransactionLoading] = useState(false);
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

      try {
        setTransactionLoading(true);

        const promiseTransaction = await apiConfig.post(
          `${endpointsServer.transactions}/create`,
          {
            status: "pending",
            type: "pets",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (type === "pets") {
          apiConfig
            .post(
              `${endpointsServer.petSales}/create`,
              {
                transaction_id: promiseTransaction.data.data[0].transactions_id,
                pet_id: dataId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              // console.log(res.data.data);
              toastMessage("success", "Success to create data!");
            });
        }
      } catch (error) {
        console.error("Error saat mengirim data:", error);
        toastMessage("error", "Failed to create data!", {
          position: "top-center",
        });
      } finally {
        setTransactionLoading(false);
        setIsOpen(false);
      }
    },
    [token, dataId, type]
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
          {transactionLoading ? (
            <LoaderProgress
              style={{
                height: "40vh",
              }}
            />
          ) : (
            <>
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
                {type === "products" ? (
                  <>
                    <button>+</button>
                    <input type="text" />

                    <button>-</button>
                  </>
                ) : null}
              </div>
              <div className="transaction-button">
                <button type="submit">Buy</button>
                <button onClick={() => setIsOpen(false)}>Cancel</button>
              </div>
            </>
          )}
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
