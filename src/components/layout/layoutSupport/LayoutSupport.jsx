import React, { useState } from "react";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";

function LayoutSupport({
  type,
  title,
  titleSpan,
  data,
  handleDeleteItem,
  handleAddItem,
  handleUpdateItem,
}) {
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: "",
    price: "",
    location: "",
    image: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      handleUpdateItem(currentItem);
    } else {
      handleAddItem(currentItem);
    }
    setCurrentItem({ id: null, name: "", price: "", location: "", image: "" });
    setEditMode(false);
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setEditMode(true);
  };

  return (
    <>
      <div className="header">
        <div className="header-title">
          {title} <span> {titleSpan}</span>
        </div>
        <div className="header-new-item" onClick={() => setEditMode(false)}>
          <span className="material-symbols-rounded">add_task</span>
          <div className="text">add new item</div>
        </div>
      </div>

      <form className="form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="name"
          placeholder="name"
          value={currentItem.name}
          onChange={(e) =>
            setCurrentItem((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="number"
          name="price"
          placeholder="price"
          value={currentItem.price}
          onChange={(e) =>
            setCurrentItem((prev) => ({ ...prev, price: e.target.value }))
          }
        />
        <input
          type="text"
          name="location"
          placeholder="location"
          value={currentItem.location}
          onChange={(e) =>
            setCurrentItem((prev) => ({ ...prev, location: e.target.value }))
          }
        />
        <input
          type="file"
          name="image"
          onChange={(e) =>
            setCurrentItem((prev) => ({
              ...prev,
              image: e.target.files[0].name,
            }))
          }
        />
        <button type="submit">{editMode ? "Update" : "Add"} Item</button>
      </form>

      <div className="content">
        {data.map((item) => {
          const image = `${type}/${item.image}`;
          return (
            <div className="content-item" key={item.id}>
              {type !== "business" ? (
                <img
                  className="content-item-image"
                  src={image}
                  alt={item.name}
                />
              ) : (
                <div className="content-item-image"></div>
              )}
              <div className="content-item-core">
                <div className="name">{item.name}</div>
                {item?.price && (
                  <div className="price">{FormatCurrencyIDR(item.price)}</div>
                )}
                {item?.location && (
                  <div className="location">
                    <div className="text">{item.location}</div>
                  </div>
                )}
                <div className="core-action">
                  <span
                    className="material-symbols-rounded"
                    onClick={() => handleEditClick(item)}
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
    </>
  );
}

export default LayoutSupport;
