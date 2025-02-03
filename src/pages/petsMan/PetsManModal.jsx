import React, { useState, useCallback, useRef, useEffect } from "react";
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

  // ✅ Menggunakan `pet` bukan `name`
  const [values, setValues] = useState({ pet: "", location: "", price: "" });

  const modalRef = useRef(null);
  const actionStatus = useRef(false);

  const { token, toastPromise, toastMessage } = DashboardCore();

  // 🔥 Fetch data jika mode update
  useEffect(() => {
    if (type !== "create" && dataId) {
      apiConfig
        .get(`${endpointsServer.pets}/${dataId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Fetched pet data:", res.data); // ✅ Debugging
          setValues({
            pet: res.data.data.pet, // ✅ Menggunakan `pet` sesuai dengan backend
            location: res.data.data.location,
            price: res.data.data.price,
          });
          setSelectedImage({
            file: null,
            preview: res.data.data.image,
            name: res.data.data.image,
          });
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [type, dataId, token]);

  // 🔥 Pastikan perubahan `onChange` berhasil
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setValues((prev) => {
      const newValues = { ...prev, [name]: value };
      console.log("Updated Values:", newValues); // ✅ Debugging
      return newValues;
    });
  }, []);

  // ✅ Menangani perubahan file
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

  // 🔥 Perbaiki handleSubmit agar tidak error "Pet's Name is required"
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!values.pet) {
        toastMessage("error", "Pet's Name is required");
        return;
      }

      if (!selectedImage.file) {
        toastMessage("error", "Please select an image before submitting.");
        return;
      }

      try {
        await petsSchema.validate(
          { ...values, image: selectedImage.file },
          { abortEarly: false }
        );

        const formData = new FormData();
        formData.append("pet", values.pet); // ✅ Gunakan 'pet' sesuai dengan backend
        formData.append("location", values.location);
        formData.append("price", values.price);
        formData.append("image", selectedImage.file);

        const request =
          type === "create"
            ? apiConfig.post(endpointsServer.petsCreate, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              })
            : apiConfig.put(
                `${endpointsServer.petsUpdate}/${dataId}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

        toastPromise(request, {
          pending:
            type === "create" ? "Creating pet data..." : "Updating pet data...",
          success: "Success!",
          error: "Failed!",
        });

        request.then((res) => {
          actionStatus.current = res.data.success;
          if (actionStatus.current) refreshData();
          setIsOpen(false);
        });
      } catch (error) {
        if (error.inner) {
          error.inner.forEach((err) => toastMessage("error", err.message));
        } else {
          toastMessage("error", "Operation failed!");
        }
      }
    },
    [values, selectedImage, token, type, dataId, refreshData, setIsOpen]
  );

  return (
    <Modal
      titleModal={type === "create" ? "Insert Pet" : "Update Pet"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalRef={modalRef}
    >
      <form className="modal-dashboard-form" onSubmit={handleSubmit}>
        <div className="modal-dashboard-form-group">
          <label htmlFor="pet">
            Pet Name <span>(Required)</span>
          </label>
          <input
            type="text"
            id="pet"
            name="pet" // ✅ Harus sesuai dengan state
            placeholder="Enter pet name"
            value={values.pet} // ✅ Pastikan ini benar
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal-dashboard-form-group">
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
        <div className="modal-dashboard-form-group">
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
        <div className="modal-dashboard-form-group">
          <label className="special-image" htmlFor="image">
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
