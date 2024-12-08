import React, { useState, useEffect, useCallback } from "react";
import products from "../../../data/products.json";
import pets from "../../../data/pets.json";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";
import imgUser from "/users/pexels-olly-712513.jpg";

function ShowItems({ itemsData, items }) {
  const [activeFavorite, setActiveFavorite] = useState([]);

  const handleActiveFavorite = useCallback(
    (id) => {
      const isFavorite = activeFavorite.includes(id);
      setActiveFavorite(
        isFavorite
          ? activeFavorite.filter((item) => item !== id)
          : [...activeFavorite, id]
      );
    },
    [activeFavorite]
  );

  return (
    <div className={`${items}`}>
      <div className={`${items}-title`}>
        Featured <span>{items}</span>
      </div>
      <div className={`${items}-content`}>
        <span className="material-symbols-outlined">trending_flat</span>
        <div className={`${items}-content-list`}>
          {itemsData.map((data) => {
            const setImg = `/${items}/${data.image}`;

            return (
              <div className="item" key={data.id}>
                <img className="item-image" src={setImg} alt={data.name} />
                <span
                  className={`material-symbols-rounded item-favourite ${
                    activeFavorite.includes(data.id) ? "active" : ""
                  }`}
                  onClick={() => handleActiveFavorite(data.id)}
                >
                  favorite
                </span>
                {items === "pets" && (
                  <img
                    className="item-user"
                    src={imgUser}
                    alt="User's nametag"
                  />
                )}
                <div className="item-wrapper">
                  {items === "pets" && (
                    <div className="item-wrapper-location">
                      <span className="material-symbols-rounded">
                        share_location
                      </span>
                      <div className="text">{data.location}</div>
                    </div>
                  )}
                  <div className="item-wrapper-name">{data.name}</div>
                  <div className="item-wrapper-price">
                    {FormatCurrencyIDR(data.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <span className="material-symbols-outlined">trending_flat</span>
      </div>
      <div className={`${items}-more`}>view all {items}</div>
    </div>
  );
}

export function Pets() {
  return <ShowItems itemsData={pets} items={"pets"} />;
}

export function Products() {
  return <ShowItems itemsData={products} items={"products"} />;
}
