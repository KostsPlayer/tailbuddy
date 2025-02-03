import React, { useState, useEffect, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401, Error403 } from "../Error/Error";
import businessCategories from "../../data/businessCategories.json";
import { toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import LayoutSupport from "../../components/layout/layoutSupport/LayoutSupport";

function BusinessCategoryMan() {
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));
  const [data, setData] = useState(businessCategories);
  const [addItem, setAddItem] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [values, setValues] = useState({
    name: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null); // Untuk URL sementara

  // Mengelola input teks
  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  // Mengelola unggahan file
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Membuat URL sementara untuk preview
      const tempUrl = URL.createObjectURL(file);
      setPreviewImage(tempUrl);

      // Simpan nama file saja ke state
      setValues((prevState) => ({
        ...prevState,
        image: file.name,
      }));
    }
  }, []);

  // Menyimpan data form
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (values.name && values.image) {
        const newItem = {
          id: data.length + 1,
          ...values,
        };
        setData((prevData) => [...prevData, newItem]);
        setValues({
          name: "",
          image: null,
        });
        setPreviewImage(null); // Reset URL sementara
        setAddItem(false);
        toastMessage("success", "Item added successfully!");
      } else {
        toastMessage("error", "Please fill in all fields!");
      }
    },
    [data, values, dataCookie]
  );

  // Menghapus item
  const handleDeleteItem = useCallback(
    (id) => {
      const newData = data.filter((item) => item.id !== id);
      toastMessage("success", "Item deleted successfully!");
      setData(newData);
    },
    [data]
  );

  // Memulai proses edit
  const handleEditItem = useCallback(
    (id) => {
      const itemToEdit = data.find((item) => item.id === id);
      if (itemToEdit) {
        setValues({
          name: itemToEdit.name,
          image: itemToEdit.image,
        });
        setPreviewImage(`businessCategories/${itemToEdit.image}`);
        setIsEditing(true);
        setEditItemId(id);
      }
    },
    [data]
  );

  // Menyimpan perubahan data
  const handleUpdateSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (values.name && values.image) {
        const updatedData = data.map((item) =>
          item.id === editItemId ? { ...item, ...values } : item
        );
        setData(updatedData);
        setValues({
          name: "",
          image: null,
        });
        setPreviewImage(null); // Reset URL sementara
        setIsEditing(false);
        setEditItemId(null);
        toastMessage("success", "Item updated successfully!");
      } else {
        toastMessage("error", "Please fill in all fields!");
      }
    },
    [data, values, editItemId]
  );

  return (
    <>
      {/* {!dataCookie ? (
        <Error401 />
      ) : dataCookie.role === "user" ? (
        <Error403 />
      ) : (
      )} */}
        <LayoutDashboard>
          <div className="business-category-man">
            <div className="header">
              <div className="header-title">
                Business Categories <span> Management</span>
              </div>
              {!isEditing && (
                <div
                  className="header-new-item"
                  onClick={() => setAddItem(true)}
                >
                  <span className="material-symbols-rounded">add_task</span>
                  <div className="text">add new item</div>
                </div>
              )}
            </div>

            {(addItem || isEditing) && (
              <>
                <form
                  className="form"
                  onSubmit={isEditing ? handleUpdateSubmit : handleSubmit}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={values.name}
                    onChange={handleOnChange}
                  />
                  <input type="file" onChange={handleFileChange} />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ width: 100, height: 100, marginTop: 10 }}
                    />
                  )}
                  <button type="submit">
                    {isEditing ? "Update" : "Submit"}
                  </button>
                </form>
              </>
            )}

            <div className="content">
              {data.map((item) => {
                const image = `businessCategories/${item.image}`;
                return (
                  <div className="content-item" key={item.id}>
                    <img
                      className="content-item-image"
                      src={image}
                      alt={item.name}
                    />
                    <div className="content-item-core">
                      <div className="name">{item.name}</div>
                      <div className="core-action">
                        <span
                          className="material-symbols-rounded"
                          onClick={() => handleEditItem(item.id)}
                        >
                          edit_square
                        </span>
                        <span
                          className="material-symbols-rounded"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          auto_delete
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </LayoutDashboard>
      <ToastContainer />
    </>
  );
}

export default BusinessCategoryMan;
