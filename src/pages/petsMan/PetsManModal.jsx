import React, { useState, useCallback, useEffect, useRef } from "react";
import Modal from "../../components/layout/Modal/Modal";
import PropTypes from "prop-types";
import apiConfig from "../../helpers/apiConfig";
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

  const [values, setValues] = useState({ pet: "", location: "", price: "" });

  const petsModalRef = useRef(null);
  const { token, toastMessage, toastPromise } = DashboardCore();

  // ✅ Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setValues({ pet: "", location: "", price: "" });
      setSelectedImage({ file: null, preview: null, name: "" });
    }
  }, [isOpen]);

  // ✅ Fetch data jika mode update (GET by ID)
  useEffect(() => {
    if (type === "update" && dataId) {
      apiConfig
        .get(endpointsServer.petsID(dataId), {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const petData = res.data.data;
          console.log("✅ Fetched Pet Data:", petData);

          setValues({
            pet: petData.pet,
            location: petData.location,
            price: petData.price,
          });

          setSelectedImage({
            file: null,
            preview: petData.image,
            name: petData.image,
          });
        })
        .catch((err) => console.error("❌ Error fetching data:", err));
    }
  }, [type, dataId, token]);

  // ✅ Handler perubahan input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ✅ Handler perubahan file
  const handleFileChange = useCallback((e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileName = `${Date.now()}-${file.name}`; // ✅ Tambah timestamp untuk unik

      setSelectedImage({
        file: file,
        preview: URL.createObjectURL(file),
        name: fileName,
      });
    }
  }, []);

  // ✅ Handle Submit (Create / Update)
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!values.pet.trim()) {
        toastMessage("error", "Pet's Name is required");
        return;
      }

      if (!selectedImage.file && type === "create") {
        toastMessage("error", "Please select an image before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("pet", values.pet.trim());
      formData.append("location", values.location.trim());
      formData.append("price", values.price);

      if (selectedImage.file) {
        formData.append("image", selectedImage.file, selectedImage.name);
      }

      console.log("🚀 Sending Data to API:", Object.fromEntries(formData));

      try {
        const endpoint =
          type === "create"
            ? endpointsServer.petsCreate
            : endpointsServer.petsUpdate(dataId);

        const promise = apiConfig.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toastPromise(
          promise,
          {
            pending: type === "create" ? "Adding pet..." : "Updating pet...",
            success: "Pet saved successfully!",
            error: "Failed to save pet!",
          },
          { autoClose: 2500 }
        );

        promise.then((res) => {
          if (res.data.success) {
            refreshData();
            setIsOpen(false);
          }
        });
      } catch (error) {
        console.error("❌ API Error:", error);
        toastMessage("error", "Server Error. Please try again!");
      }
    },
    [values, selectedImage, token, type, dataId, refreshData, setIsOpen]
  );

  // ✅ Handle Delete
  const handleDelete = useCallback(
    async (e) => {
      e.preventDefault();

      const promise = apiConfig.delete(endpointsServer.petsDelete(dataId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      toastPromise(
        promise,
        {
          pending: "Deleting pet...",
          success: "Pet deleted successfully!",
          error: "Failed to delete pet!",
        },
        { autoClose: 2500 }
      );

      promise.then((res) => {
        if (res.data.success) {
          refreshData();
          setIsOpen(false);
        }
      });
    },
    [dataId, token, refreshData, setIsOpen]
  );

  return type === "delete" ? (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} modalRef={petsModalRef}>
      <p>Are you sure you want to delete this pet?</p>
      <button className="delete-button" onClick={handleDelete}>
        Delete Pet
      </button>
    </Modal>
  ) : (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} modalRef={petsModalRef}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label htmlFor="pet">Pet Name (Required)</label>
          <input
            type="text"
            name="pet"
            value={values.pet}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal-form-group">
          <label htmlFor="location">Location (Required)</label>
          <input
            type="text"
            name="location"
            value={values.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal-form-group">
          <label htmlFor="price">Price (Required)</label>
          <input
            type="number"
            name="price"
            value={values.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal-form-group">
          <label htmlFor="image">Pet's Image (Required)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedImage.preview && (
            <img src={selectedImage.preview} alt="Preview" />
          )}
        </div>
        <button type="submit">
          {type === "create" ? "Add Pet" : "Update Pet"}
        </button>
      </form>
    </Modal>
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
