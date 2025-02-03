import React, { useState, useEffect, useCallback } from "react";
import products from "../../../data/products.json";
// import pets from "../../../data/pets.json";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";
import imgUser from "/users/pexels-olly-712513.jpg";
import axios from "axios";
import endpointsServer from "../../../helpers/endpointsServer";

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
            const imgSupabase = `https://tailbuddy.supabase.co/storage/v1/object/public/${items}/${data.image}?t=2025-01-13T08%3A25%3A30.956Z`;

            return (
              <div
                className="item"
                key={items === "pets" ? data.pets_id : data.id}
              >
                {items === "pets" ? (
                  <img
                    className="item-image"
                    src={imgSupabase}
                    alt={data.name}
                  />
                ) : (
                  <img className="item-image" src={setImg} alt={data.name} />
                )}
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
  const [pets, setPets] = useState([]);

  const fetchPets = useCallback(async () => {
    try {
      const petsPromise = await axios.get(endpointsServer.pets);

      setPets(petsPromise.data.data);
      console.log(petsPromise.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return <ShowItems itemsData={pets} items={"pets"} />;
}

export function Products() {
  return <ShowItems itemsData={products} items={"products"} />;
}
