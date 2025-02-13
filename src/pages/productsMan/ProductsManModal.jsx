import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../helpers/apiConfig";
import { productsSchema } from "../../validations/Products";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import { FormatCurrencyIDR } from "../../helpers/FormatCurrencyIDR";

function ProductsManModal({
  type = "create",
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
  const [values, setValues] = useState({
    name: "",
    price: null,
    stock: null,
  });

  const productsModal = useRef(null);
  const createStatus = useRef(false);
  const updateStatus = useRef(false);
  const deleteStatus = useRef(false);

  const { token, toastPromise, toastMessage } = DashboardCore();

  useEffect(() => {
    if (type === "create") {
      setValues({ name: "", price: null, stock: null });
      setSelectedImage({ file: null, preview: null, name: "" });
    } else {
      if (dataId) {
        apiConfig
          .get(`${endpointsServer.productId}?id=${dataId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const getData = res.data.data;

            // console.log("Data:", getData);

            setValues({
              name: getData.name,
              price: getData.price,
              stock: getData.stock,
            });
            setSelectedImage({
              file: getData.image,
              preview: `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/products/${getData.image}`,
              name: getData.image,
            });
          })
          .catch((err) => {
            console.log("Error:", err);
          });
      }
    }
  }, [type, dataId, token]);

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

  // useEffect(() => {
  //   console.log(values);
  // }, [values]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (type === "create") {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("stock", values.stock);
        if (selectedImage.file) {
          formData.append("image", selectedImage.file);
        }

        try {
          await productsSchema.validate(
            {
              name: values.name,
              price: values.price,
              stock: values.stock,
              image: selectedImage.file,
            },
            { abortEarly: false }
          );

          const promise = apiConfig.post(endpointsServer.products, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          toastPromise(
            promise,
            {
              pending: "Creating products data on progress, please wait..!",
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
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("stock", values.stock);

        if (selectedImage.file) {
          formData.append("image", selectedImage.file);
        }

        try {
          await productsSchema.validate(
            {
              name: values.name,
              price: values.price,
              stock: values.stock,
              image: selectedImage.file,
            },
            { abortEarly: false }
          );

          const promise = apiConfig.put(
            `${endpointsServer.products}?id=${dataId}`,
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
              pending: "Updating products data on progress, please wait..!",
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

            // console.log(res.data);
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

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();

      const promise = apiConfig.delete(
        `${endpointsServer.products}?id=${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toastPromise(
        promise,
        {
          pending: "deleting products data on progress, please wait..!",
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
          modalRef={productsModal}
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
          otherTitleModal={"Products"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalRef={productsModal}
        >
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <label htmlFor="name">
                Product's Name <span>(Required)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Product's Name"
                value={values.name}
                onChange={handleChange}
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="price">
                Price — Rp <span>(Required)</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Product's Price"
                value={values.price}
                onChange={handleChange}
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="stock">
                Stock <span>(Required)</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                placeholder="Product's Stock"
                value={values.stock}
                onChange={handleChange}
              />
            </div>

            <div className="modal-form-group">
              <div className="label">
                Products's Image <span>(Required)</span>
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
                    <span className="material-symbols-rounded">
                      cloud_upload
                    </span>
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
      )}
    </>
  );
}

ProductsManModal.propTypes = {
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default ProductsManModal;
