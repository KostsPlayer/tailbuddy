import React, { useState, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { getDecryptedCookie } from "../../helpers/Crypto";
import { Error401, Error403 } from "../Error/Error";
import businessCategories from "../../data/businessCategories.json"; // Data kategori bisnis
import business from "../../data/business.json"; // Data bisnis
import { toastMessage } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";

function BusinessMan() {
  const [dataCookie, setDataCookie] = useState(getDecryptedCookie("tailbuddy"));
  const [data, setData] = useState(business);
  const [addItem, setAddItem] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [values, setValues] = useState({
    name: "",
    business_category_id: "", // Field untuk kategori
  });

  // Mengelola input teks
  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  // Menyimpan data form
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (values.name && values.business_category_id) {
        const newItem = {
          id: data.length + 1,
          ...values,
          business_category_id: parseInt(values.business_category_id), // Pastikan tipe data sesuai
        };
        setData((prevData) => [...prevData, newItem]);
        setValues({
          name: "",
          business_category_id: "",
        });
        setAddItem(false);
        toastMessage("success", "Item added successfully!");
      } else {
        toastMessage("error", "Please fill in all fields!");
      }
    },
    [data, values]
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
          business_category_id: itemToEdit.business_category_id.toString(), // Konversi ke string untuk dropdown
        });
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
      if (values.name && values.business_category_id) {
        const updatedData = data.map((item) =>
          item.id === editItemId
            ? {
                ...item,
                ...values,
                business_category_id: parseInt(values.business_category_id),
              }
            : item
        );
        setData(updatedData);
        setValues({
          name: "",
          business_category_id: "",
        });
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
      {!dataCookie ? (
        <Error401 />
      ) : dataCookie.role === "user" ? (
        <Error403 />
      ) : (
        <LayoutDashboard>
          <div className="business-category-man">
            <div className="header">
              <div className="header-title">
                Business<span> Management</span>
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
              <form
                className="form"
                onSubmit={isEditing ? handleUpdateSubmit : handleSubmit}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleOnChange}
                />
                <select
                  name="business_category_id"
                  value={values.business_category_id}
                  onChange={handleOnChange}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {businessCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button type="submit">{isEditing ? "Update" : "Submit"}</button>
              </form>
            )}

            <div className="content">
              {data.map((item) => (
                <div className="content-item" key={item.id}>
                  <div className="content-item-image"></div>
                  <div className="content-item-core">
                    <div className="name">{item.name}</div>
                    <div className="category">
                      Category:{" "}
                      {businessCategories.find(
                        (category) => category.id === item.business_category_id
                      )?.name || "Unknown"}
                    </div>
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
              ))}
            </div>
          </div>
        </LayoutDashboard>
      )}
      <ToastContainer />
    </>
  );
}

export default BusinessMan;
