import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../../helpers/apiConfig";
import { transactionsSchema } from "../../../validations/transactions";
import endpointsServer from "../../../helpers/endpointsServer";
import LandingCore from "../../../context/landingCore/LandingCore";

function BusinessCategoryManModal({
  isOpen,
  setIsOpen,
  refreshData,
  dataId = null,
}) {
  const [selectedImage, setSelectedImage] = useState({
    file: null,
    preview: null,
    name: "",
  });
  const [values, setValues] = useState({ pet: "", location: "", price: "" });

  const transactionsModal = useRef(null);
  const transactionStatus = useRef(false);

  const { token, toastPromise, toastMessage } = LandingCore();

  const handleFileChange = useCallback((e) => {
    if (e.target.files.length > 0) {
      setSelectedImage({
        file: e.target.files[0],
        preview: URL.createObjectURL(e.target.files[0]),
        name: e.target.files[0].name,
      });
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (type === "create") {
        const formData = new FormData();
        formData.append("name", values.name);
        if (selectedImage.file) {
          formData.append("image", selectedImage.file);
        }

        try {
          await transactionsSchema.validate(
            { name: values.name, image: selectedImage.file },
            { abortEarly: false }
          );

          const promise = apiConfig.post(
            endpointsServer.transactionsCreate,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          toastPromise(
            promise,
            {
              pending:
                "Creating business categories data on progress, please wait..!",
              success: "Data has been successfully created!",
              error: "Failed to create data!",
            },
            {
              autoClose: 2500,
              position: "top-center",
            },
            () => {
              if (transactionStatus.current === true) {
                refreshData();
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
    [values, selectedImage, token, refreshData, type]
  );

  return (
    <>
      <Modal
        titleModal={type === "create" ? "Insert" : "Update"}
        otherTitleModal={"Business Categories"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalRef={transactionsModal}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
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

          <div className="modal-form-group">
            <div className="label">
              Business Category's Image <span>(Required)</span>
            </div>
            <div className="select-image-wrapper">
              <div className="select-image">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="image" className="select-image-button">
                  <span className="material-symbols-rounded">cloud_upload</span>
                  <span className="text">Choose File</span>
                </label>
              </div>
              {selectedImage.preview && (
                <div className="select-image-note">
                  <img
                    className="select-image-note-file"
                    src={selectedImage.preview}
                    alt={selectedImage.name}
                  />
                  <div className="select-image-note-name">
                    {selectedImage.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
}

BusinessCategoryManModal.propTypes = {
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default BusinessCategoryManModal;
