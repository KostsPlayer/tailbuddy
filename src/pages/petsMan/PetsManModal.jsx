import React, { useState, useCallback, useEffect, useRef } from "react";
import Modal from "../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../helpers/apiConfig";
import { petsSchema } from "../../validations/Pets";
import endpointsServer from "../../helpers/endpointsServer";
import DashboardCore from "../../context/dashboardCore/DashboardCore";

function PetsManModal({
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
    pet: "",
    location: "",
    price: "",
    pet_category_id: "",
  });
  const deleteStatus = useRef(false);
  const modalRef = useRef(null);

  const { token, toastPromise, toastMessage } = DashboardCore();

  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const categoriesRef = useRef(null);

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
      const response = await apiConfig.get(endpointsServer.petCategories, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch data!", error);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isOpen) {
      setValues({ pet: "", location: "", price: "", pet_category_id: "" });
      setSelectedImage({ file: null, preview: null, name: "" });
    }
  }, [isOpen]);

  useEffect(() => {
    if (type !== "create" && dataId) {
      apiConfig
        .get(`${endpointsServer.petsID}${dataId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const getData = res.data.data;
          setValues({
            pet: getData.pet || "",
            location: getData.location || "",
            price: getData.price || "",
            pet_category_id: getData.pet_category_id || "",
          });
          setSelectedImage({
            file: getData.image,
            preview: `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/pets/${getData.image}`,
            name: getData.image,
          });
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [type, dataId, token]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage({
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!values.pet.trim()) {
        toastMessage("error", "Pet's Name is required");
        return;
      }

      if (!selectedImage.file) {
        toastMessage("error", "Please select an image before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("pet", values.pet.trim());
      formData.append("location", values.location.trim());
      formData.append("price", values.price);
      formData.append("pet_category_id", values.pet_category_id);
      formData.append("image", selectedImage.file);
      console.log("formData");

      try {
        const endpoint =
          type === "create"
            ? endpointsServer.petsCreate
            : `${endpointsServer.petsUpdate}/${dataId}`;
        const method = type === "create" ? "post" : "put";

        const promise = apiConfig[method](endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toastPromise(
          promise,
          {
            pending: `${
              type === "create" ? "Creating" : "Updating"
            } pet data on progress, please wait..!`,
            success: `Data has been successfully ${
              type === "create" ? "created" : "updated"
            }!`,
            error: `Failed to ${type === "create" ? "create" : "update"} data!`,
          },
          {
            autoClose: 2500,
            position: "top-center",
          },
          () => {
            refreshData();
          }
        );
      } catch (error) {
        console.error("Error submitting data:", error);
        toastMessage("error", "Server Error. Please try again!");
      }
    },
    [values, selectedImage, token, refreshData, type, dataId]
  );

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();

      const promise = apiConfig.delete(
        `${endpointsServer.petsDelete}/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toastPromise(
        promise,
        {
          pending: "Deleting pet data on progress, please wait..!",
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
          console.error("Error deleting pet data:", error);
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
            <div className="confirm" onClick={handleDelete}>
              delete
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          titleModal={type === "create" ? "Insert" : "Update"}
          otherTitleModal={"Pet"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalRef={modalRef}
        >
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <label htmlFor="pet">
                Pet Name <span>(Required)</span>
              </label>
              <input
                type="text"
                id="pet"
                name="pet"
                placeholder="Enter pet name"
                value={values.pet}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <label htmlFor="location">
                Location <span>(Required)</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter location"
                value={values.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <label htmlFor="price">
                Price <span>(Required)</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Enter price"
                value={values.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <div className="label">
                Pet Category's Parent <span>(Required)</span>
              </div>
              <div
                className="select-default"
                onClick={() => setOpenCategories(true)}
              >
                <div className="text">
                  {values.pet_category_id === ""
                    ? "Select Pet Parent"
                    : categories
                        .filter(
                          (item) =>
                            item.pet_categories_id === values.pet_category_id
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
                        item.pet_categories_id !== values.pet_category_id
                    )
                    .map((data) => {
                      return (
                        <div
                          className="select-list-item"
                          key={data.pet_categories_id}
                          onClick={() => {
                            setValues((prev) => ({
                              ...prev,
                              pet_category_id: data.pet_categories_id,
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
            <div className="modal-form-group">
              <label className="label" htmlFor="image">
                Pet's Image <span>(Required)</span>
              </label>
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
            <button type="submit">
              {type === "create" ? "Add Pet" : "Update Pet"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

PetsManModal.propTypes = {
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  refreshData: PropTypes.func,
  dataId: PropTypes.string,
};

export default PetsManModal;
