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

  const [values, setValues] = useState({ pet: "", location: "", price: "" });

  const modalRef = useRef(null);
  const { token, toastMessage } = DashboardCore();

  // 🔄 Reset State saat Modal Dibuka
  useEffect(() => {
    if (isOpen) {
      console.log("Resetting form values...");
      setValues({ pet: "", location: "", price: "" });
      setSelectedImage({ file: null, preview: null, name: "" });
    }
  }, [isOpen]);

  // 🔥 Fetch data jika mode update
  useEffect(() => {
    if (type !== "create" && dataId) {
      apiConfig
        .get(`${endpointsServer.pets}/${dataId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Fetched pet data:", res.data);

          const petData = res.data.data[0];
          setValues({
            pet: petData.pet || "",
            location: petData.location || "",
            price: petData.price || "",
          });

          setSelectedImage({
            file: petData.image,
            preview: `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/pets/${petData.image}`,
            name: petData.image,
          });
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [type, dataId, token]);

  // 🔥 Debugging `values`
  useEffect(() => {
    console.log("Updated Values State:", values);
  }, [values]);

  // ✅ Handler perubahan input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(`Input Changed: ${name} = ${value}`);

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // ✅ Handler perubahan file
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

  // ✅ Submit data
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      console.log("Submitting Values:", values);

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
        formData.append("image", selectedImage.file);
      }

      console.log("🚀 Sending Data to API:", Object.fromEntries(formData));

      try {
        const endpoint =
          type === "create"
            ? endpointsServer.petsCreate
            : `${endpointsServer.petsUpdate}/${dataId}`;

        const response = await apiConfig.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("✅ API Response:", response.data);

        if (response.data.success) {
          toastMessage("success", "Pet saved successfully!");
          refreshData();
          setIsOpen(false);
        } else {
          toastMessage("error", "Failed to save pet!");
        }
      } catch (error) {
        console.error(
          "❌ API Error:",
          error.response ? error.response.data : error
        );
        toastMessage("error", "Server Error. Please try again!");
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
