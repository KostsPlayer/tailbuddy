import React from "react";

function LayoutSupport({ type, title, titleSpan, data, handleDeleteItem }) {
  return (
    <>
      <div className="header">
        <div className="header-title">
          {title} <span> {titleSpan}</span>
        </div>
        <div className="header-new-item">
          <span className="material-symbols-rounded">add_task</span>
          <div className="text">add new item</div>
        </div>
      </div>
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
                <div className="core-data">{item.name}</div>
                <div className="core-action">
                  <span class="material-symbols-rounded">edit_square</span>
                  <span
                    class="material-symbols-rounded"
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
