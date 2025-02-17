import React, { useState, useEffect, useCallback, useRef } from "react";
// import products from "../../../data/products.json";
// import pets from "../../../data/pets.json";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";
import imgUser from "/users/pexels-olly-712513.jpg";
import axios from "axios";
import endpointsServer from "../../../helpers/endpointsServer";
import TransactionModal from "./ShowItemsModal";
import LandingCore from "../../../context/landingCore/LandingCore";

function ShowItems({ itemsData, items }) {
  const [activeFavorite, setActiveFavorite] = useState([]);
  const [openTransaction, setOpenTransaction] = useState(false);
  const [getPet, setGetPet] = useState([]);
  const [getProduct, setGetProduct] = useState([]);

  const refTransaction = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        refTransaction.current &&
        !refTransaction.current.contains(e.target)
      ) {
        setOpenTransaction(false);
      }
    };

    if (openTransaction) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refTransaction, openTransaction]);

  return (
    <>
      <div className={`${items}`}>
        <div className={`${items}-title`}>
          Featured <span>{items}</span>
        </div>
        <div className={`${items}-content`}>
          <span className="material-symbols-outlined">trending_flat</span>
          <div className={`${items}-content-list`}>
            {itemsData.map((data) => {
              const imgSupabase = `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/${items}/${data.image}`;

              return (
                <div
                  className="item"
                  key={items === "pets" ? data.pets_id : data.products_id}
                  onClick={() => {
                    setOpenTransaction(true);
                    if (items === "pets") {
                      setGetPet(data);
                    } else if (items === "products") {
                      setGetProduct(data);
                    }
                  }}
                >
                  <img
                    className="item-image"
                    src={imgSupabase}
                    alt={data.name}
                  />
                  <span
                    className={`material-symbols-rounded item-favourite ${
                      items === "pets"
                        ? activeFavorite.includes(data.pets_id)
                          ? "active"
                          : ""
                        : activeFavorite.includes(data.products_id)
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleActiveFavorite(
                        items === "pets" ? data.pets_id : data.products_id
                      )
                    }
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
      {openTransaction ? (
        <TransactionModal
          isOpen={openTransaction}
          setIsOpen={setOpenTransaction}
          modalRef={refTransaction}
          dataId={
            items === "pets"
              ? getPet.pets_id
              : items === "products"
              ? getProduct.products_id
              : null
          }
          type={items}
        />
      ) : null}
    </>
  );
}

export function Pets() {
  const { pets } = LandingCore();

  return <ShowItems itemsData={pets} items={"pets"} />;
}

export function Products() {
  const { products } = LandingCore();

  return <ShowItems itemsData={products} items={"products"} />;
}
