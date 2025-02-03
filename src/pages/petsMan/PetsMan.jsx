import React, { useState, useCallback, useEffect } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import axios from "axios";
import endpointsServer from "../../helpers/endpointsServer";
import { FormatCurrencyIDR } from "../../helpers/FormatCurrencyIDR";
import PetsManModal from "./PetsManModal";

function PetsMan() {
  axios.defaults.withCredentials = true;
  const [data, setData] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataId, setDataId] = useState(null);

  const fetchPets = useCallback(() => {
    axios
      .get(endpointsServer.pets)
      .then((res) => {
        console.log("Fetched pets data:", res.data); // Debugging
        if (Array.isArray(res.data.data)) {
          setData(res.data.data);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching pets:", err);
        setData([]);
      });
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleEditItem = useCallback((id) => {
    setDataId(id);
    setOpenUpdate(true);
  }, []);

  const handleDeleteItem = useCallback((id) => {
    setDataId(id);
    setOpenDelete(true);
  }, []);

  return (
    <LayoutDashboard>
      <div className="pets-man">
        <div className="header">
          <div className="header-title">
            Pets <span>Management</span>
          </div>
          <div className="header-new-item" onClick={() => setOpenCreate(true)}>
            <span className="material-symbols-rounded">add_task</span>
            <div className="text">Add New Pet</div>
          </div>
        </div>

        <div className="content">
          {Array.isArray(data) &&
            data.map((item, index) => {
              const image = `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/pets/${item.image}`;
              return (
                <div className="content-item" key={item.id || index}>
                  <img
                    className="content-item-image"
                    src={image}
                    alt={item.pet}
                  />
                  <div className="content-item-core">
                    <div className="name">{item.pet}</div>
                    <div className="price">{FormatCurrencyIDR(item.price)}</div>
                    <div className="text">{item.location}</div>
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

      <PetsManModal
        type="create"
        isOpen={openCreate}
        setIsOpen={setOpenCreate}
        refreshData={fetchPets}
      />
      <PetsManModal
        type="update"
        isOpen={openUpdate}
        setIsOpen={setOpenUpdate}
        refreshData={fetchPets}
        dataId={dataId}
      />
      <PetsManModal
        type="delete"
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        refreshData={fetchPets}
        dataId={dataId}
      />
    </LayoutDashboard>
  );
}

export default PetsMan;
