import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../helpers/apiConfig";
import { businessServicesSchema } from "../../validations/BusinessServices";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";

function GroomingServicesManModal({
  type = "create",
  isOpen,
  setIsOpen,
  refreshData,
  dataId = null,
}) {
  const [values, setValues] = useState({ name: "", price: 0 });

  const groomingModal = useRef(null);
  const createStatus = useRef(false);
  const updateStatus = useRef(false);
  const deleteStatus = useRef(false);

  const { token, toastPromise, toastMessage } = DashboardCore();

  useEffect(() => {
    if (type === "create") {
      setValues({ name: "", price: 0 });
    } else {
      if (dataId) {
        apiConfig
          .get(`${endpointsServer.groomingServices}/${dataId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setValues({ name: res.data.data.name, price: res.data.data.price });
          })
          .catch((err) => {
            console.log("Error:", err);
          });
      }
    }
  }, [type, dataId, token]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (type === "create") {
        try {
          await businessServicesSchema.validate(
            { name: values.name, price: values.price },
            { abortEarly: false }
          );

          const promise = apiConfig.post(
            `${endpointsServer.groomingServices}/create`,
            { name: values.name, price: values.price },
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
                "Creating grooming services data on progress, please wait..!",
              success: "Data has been successfully created!",
              error: "Failed to create data!",
            },
            {
              autoClose: 2500,
              position: "top-center",
            },
            () => {
              if (createStatus.current === true) {
                refreshData();
              }
            }
          );

          promise.then((res) => {
            createStatus.current = res.data.success;
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
      } else {
        try {
          await businessServicesSchema.validate(
            { name: values.name, price: values.price },
            { abortEarly: false }
          );

          const promise = apiConfig.put(
            `${endpointsServer.groomingServices}/update/${dataId}`,
            { name: values.name, price: values.price },
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
                "Updating grooming services data on progress, please wait..!",
              success: "Data has been successfully updated!",
              error: "Failed to update data!",
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

          promise.then((res) => {
            updateStatus.current = res.data.success;
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
    [values, token, refreshData, type]
  );

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();

      const promise = apiConfig.delete(
        `${endpointsServer.groomingServices}/delete/${dataId}`,
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
            "deleting grooming services data on progress, please wait..!",
          success: "Data has been successfully deleted!",
          error: "Failed to delete data!",
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

      promise
        .then((res) => {
          deleteStatus.current = res.data.success;
        })
        .catch((error) => {
          console.error("Error deleting menu data:", error);
        });
    },
    [dataId, token, refreshData]
  );

  return (
    <>
      {type === "delete" ? (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalRef={groomingModal}
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
            <div className="confirm" onClick={handleDelete}>
              delete
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          titleModal={type === "create" ? "Insert" : "Update"}
          otherTitleModal={"Grooming Services"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalRef={groomingModal}
        >
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <label htmlFor="name">
                Service's Name <span>(Required)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter name"
                value={values.name}
                onChange={handleChange}
              />
            </div>
            <div className="modal-form-group">
              <label htmlFor="price">
                Service's Price <span>(Required)</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Enter price"
                value={values.price === 0 ? "" : values.price}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Submit</button>
          </form>
        </Modal>
      )}
    </>
  );
}

GroomingServicesManModal.propTypes = {
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default GroomingServicesManModal;
