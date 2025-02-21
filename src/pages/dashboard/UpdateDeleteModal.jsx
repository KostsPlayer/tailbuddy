import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import statusTransaction from "../../data/statusTransaction.json";

function UpdateDeleteModal({
  type = "update",
  isOpen,
  setIsOpen,
  modalRef,
  refreshData,
  dataId = null,
}) {
  const [values, setValues] = useState({ status: "", type: "" });
  const [openListStatus, setOpenListStatus] = useState(false);

  const listStatusRef = useRef(null);
  const updateStatus = useRef(false);
  const deleteStatus = useRef(false);

  const { token, toastPromise, toastMessage } = DashboardCore();

  useEffect(() => {
    if (type === "update" && dataId) {
      setValues({
        status: dataId.status,
        type: dataId.type,
      });
    }
  }, [dataId, type]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (listStatusRef.current && !listStatusRef.current.contains(e.target)) {
        setOpenListStatus(false);
      }
    };

    if (openListStatus) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listStatusRef, openListStatus]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (type === "update") {
        try {
          const promise = apiConfig.put(
            `${endpointsServer.transactions}/${dataId.transaction_id}`,
            { status: values.status, type: values.type },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          toastPromise(
            promise,
            {
              pending:
                "Updating status transaction on progress, please wait..!",
              success: "Data has been successfully update status transaction!",
              error: "Failed to create update status transaction!",
            },
            {
              autoClose: 2500,
              position: "top-center",
            },
            () => {
              if (updateStatus.current === true) {
                refreshData();
              }
            }
          );

          // console.log(promise);

          promise.then((res) => {
            updateStatus.current = res.data.success;
          });
        } catch (error) {
          console.error("Error saat mengirim data:", error);
          toastMessage("error", "Failed to update status transaction!", {
            position: "top-center",
          });
        }
      } else {
        try {
          const deletePromise = apiConfig.delete(
            `${endpointsServer.transactions}/${dataId.transaction_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          toastPromise(
            deletePromise,
            {
              pending: "Deleting transaction on progress, please wait..!",
              success: "Data has been successfully deleted transaction!",
              error: "Failed to delete transaction!",
            },
            {
              autoClose: 2500,
              position: "top-center",
            },
            () => {
              if (deleteStatus.current === true) {
                refreshData();
              }
            }
          );

          deletePromise.then((res) => {
            deleteStatus.current = res.data.success;
          });
        } catch (error) {
          console.error("Error saat mengirim data:", error);
          toastMessage("error", "Failed to delete status transaction!", {
            position: "top-center",
          });
        }
      }
    },
    [values, token, refreshData, dataId, type, deleteStatus, updateStatus]
  );

  return (
    <>
      {type === "update" ? (
        <Modal
          titleModal="Update Status"
          otherTitleModal="Transaction"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalRef={modalRef}
        >
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <div className="label">
                Status Transaction <span>(Required)</span>
              </div>
              <div
                className="select-default"
                onClick={() => setOpenListStatus(true)}
              >
                <div className="text">
                  {values.status === ""
                    ? "Select Pet Parent"
                    : statusTransaction
                        .filter((item) => item.name === values.status)
                        .map((data) => data.name)}
                </div>
                <span
                  className={`material-symbols-outlined ${
                    openListStatus ? "default-closed" : ""
                  }`}
                >
                  south_east
                </span>
              </div>
              {openListStatus && (
                <div className="select-list no-more" ref={listStatusRef}>
                  {statusTransaction
                    .filter((item) => item.name !== values.status)
                    .map((data) => {
                      return (
                        <div
                          className="select-list-item"
                          key={data.name}
                          onClick={() => {
                            setValues((prev) => ({
                              ...prev,
                              status: data.name,
                            }));
                            setOpenListStatus(false);
                          }}
                        >
                          <div className="name">{data.name}</div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <button type="submit">Submit</button>
          </form>
        </Modal>
      ) : (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalRef={modalRef}
          type="confirm"
          titleModal={"Are you sure you want to delete this?"}
          descModal={
            "Your content will be permanently deleted. This can't be undone."
          }
        >
          <div className="confirm-dashboard-action">
            <div className="cancel" onClick={() => setIsOpen(false)}>
              cancel
            </div>
            <div className="confirm" onClick={handleSubmit}>
              delete
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

UpdateDeleteModal.propTypes = {
  type: PropTypes.string,
  modalRef: PropTypes.object,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default UpdateDeleteModal;
