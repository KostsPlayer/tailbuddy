import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import statusTransaction from "../../data/statusTransaction.json";

function UpdateStatusModal({
  isOpen,
  setIsOpen,
  modalRef,
  refreshData,
  dataId = null,
}) {
  const [values, setValues] = useState({ status: "", type: "" });
  const [openListStatus, setOpenListStatus] = useState(false);

  const listStatusRef = useRef(null);
  const status = useRef(false);

  const { token, toastPromise, toastMessage } = DashboardCore();

  useEffect(() => {
    if (dataId) {
      setValues({
        status: dataId.status,
        type: dataId.type,
      });
    }
  }, [dataId]);

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

      try {
        const promise = apiConfig.put(
          `${endpointsServer.transactions}/${dataId.transactions_id}`,
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
            pending: "Updating status transaction on progress, please wait..!",
            success: "Data has been successfully update status transaction!",
            error: "Failed to create update status transaction!",
          },
          {
            autoClose: 2500,
            position: "top-center",
          },
          () => {
            if (status.current === true) {
              refreshData();
            }
          }
        );

        // console.log(promise);

        promise.then((res) => {
          status.current = res.data.success;
        });
      } catch (error) {
        console.error("Error saat mengirim data:", error);
        toastMessage("error", "Failed to update status transaction!", {
          position: "top-center",
        });
      }
    },
    [values, token, refreshData, dataId]
  );

  return (
    <>
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
    </>
  );
}

UpdateStatusModal.propTypes = {
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default UpdateStatusModal;
