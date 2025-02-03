import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../helpers/apiConfig";
import { businessSchema } from "../../validations/Business";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";

function BusinessCategoryManModal({
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
    business: "",
    business_category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);

  const categoriesRef = useRef(null);
  const businessCategoriesModal = useRef(null);
  const createStatus = useRef(false);
  const updateStatus = useRef(false);
  const deleteStatus = useRef(false);

  const { token, toastPromise, toastMessage } = DashboardCore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setOpenCategories(false);
      }
    };

    if (openCategories) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoriesRef, openCategories]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiConfig.get(
        endpointsServer.businessCategoriesAll,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);

      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch data!", error);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (type === "update" && isOpen === false) {
      setValues({ business: "", business_category_id: "" });
      setSelectedImage({ file: null, preview: null, name: "" });
    }
  }, [type, isOpen]);

  useEffect(() => {
    if (type === "create") {
      setValues({ business: "", business_category_id: "" });
      setSelectedImage({ file: null, preview: null, name: "" });
    } else {
      if (dataId) {
        apiConfig
          .get(`${endpointsServer.businessCategoriesID}/${dataId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setValues({
              business: res.data.data?.name,
              business_category_id: res.data.data?.business_category_id,
            });
            setSelectedImage({
              file: res.data.data.image,
              preview: `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/business/${res.data.data.image}`,
              name: res.data.data.image,
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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (type === "create") {
        const formData = new FormData();
        formData.append("business", values.business);
        formData.append("business_category_id", values.business_category_id);
        if (selectedImage.file) {
          formData.append("image", selectedImage.file);
        }

        try {
          await businessSchema.validate(
            {
              business: values.business,
              business_category_id: values.business_category_id,
              image: selectedImage.file,
            },
            { abortEarly: false }
          );

          const promise = apiConfig.post(endpointsServer.business, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

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
        formData.append("business", values.business);
        formData.append("business_category_id", values.business_category_id);
        if (selectedImage.file) {
          formData.append("image", selectedImage.file);
        }

        try {
          await businessSchema.validate(
            {
              business: values.business,
              business_category_id: values.business_category_id,
              image: selectedImage.file,
            },
            { abortEarly: false }
          );

          const promise = apiConfig.put(
            `${endpointsServer.businessCategoriesUpdate}/${dataId}`,
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
                "Updating business categories data on progress, please wait..!",
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
    [values, selectedImage, token, refreshData, type]
  );

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();

      const promise = apiConfig.delete(
        `${endpointsServer.businessCategoriesDelete}/${dataId}`,
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
            "deleting business categories data on progress, please wait..!",
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
          modalRef={businessCategoriesModal}
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
          otherTitleModal={"Business Categories"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalRef={businessCategoriesModal}
        >
          <form className="modal-dashboard-form" onSubmit={handleSubmit}>
            <div className="modal-dashboard-form-group">
              <label htmlFor="business">
                Business's Name <span>(Required)</span>
              </label>
              <input
                type="text"
                id="business"
                name="business"
                placeholder="Pet Business"
                value={values.business}
                onChange={handleChange}
              />
            </div>

            <div className="modal-dashboard-form-group">
              <div className="modal-dashboard-form-group">
                <div className="label">
                  Business Category's Parent <span>(Required)</span>
                </div>
                <div
                  className="select-default"
                  onClick={() => setOpenCategories(true)}
                >
                  <div className="text">
                    {values.business_category_id === ""
                      ? "Select Business Category's Parent"
                      : categories
                          .filter(
                            (item) =>
                              item.business_categories_id ===
                              values.business_category_id
                          )
                          .map((data) => data.name)}
                  </div>
                  <span
                    className={`material-symbols-outlined ${
                      openCategories ? "default-closed" : ""
                    }`}
                  >
                    south_east
                  </span>
                </div>
                {openCategories && (
                  <div className="select-list" ref={categoriesRef}>
                    {categories
                      .filter(
                        (item) =>
                          item.business_categories_id !==
                          values.business_category_id
                      )
                      .map((data) => {
                        return (
                          <div
                            className="select-list-item"
                            key={data.business_categories_id}
                            onClick={() => {
                              setValues((prev) => ({
                                ...prev,
                                business_category_id:
                                  data.business_categories_id,
                              }));
                              setOpenCategories(false);
                            }}
                          >
                            <div className="name">{data.name}</div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-dashboard-form-group">
              <div className="label">
                Business's Image <span>(Required)</span>
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

BusinessCategoryManModal.propTypes = {
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default BusinessCategoryManModal;
