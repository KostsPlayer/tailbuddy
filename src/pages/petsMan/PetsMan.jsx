import { useState, useEffect, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import LoaderPages from "../../components/loader/LoaderPages";
import PetsManModal from "./PetsManModal";
import { FormatCurrencyIDR } from "../../helpers/FormatCurrencyIDR";

function PetsMan() {
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const {
    token,
    isLoadingDashboardCore,
    setDashboardCoreLoader,
    toastMessage,
  } = DashboardCore();

  const fetchPets = useCallback(async () => {
    try {
      setDashboardCoreLoader(true);
      const response = await apiConfig.get(endpointsServer.pets, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
    } catch (error) {
      toastMessage("error", "Failed to fetch pets data!");
      console.error("Error fetching pets:", error);
    } finally {
      setDashboardCoreLoader(false);
    }
  }, [token, setDashboardCoreLoader, toastMessage]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return (
    <>
      {isLoadingDashboardCore ? (
        <LoaderPages />
      ) : (
        <LayoutDashboard>
          <div className="pets-man">
            <div className="header">
              <div className="header-title">
                Pets <span>Management</span>
              </div>
              <div
                className="header-new-item"
                onClick={() => setOpenCreate(true)}
              >
                <span className="material-symbols-rounded">add_task</span>
                <div className="text">Add New Pet</div>
              </div>
            </div>

            <div className="content">
              {data.map((item) => {
                const image = `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/pets/${item.image}`;
                return (
                  <div className="content-item" key={item.pets_id}>
                    <img
                      className="content-item-image"
                      src={image}
                      alt={item.pet}
                    />
                    <div className="content-item-core">
                      <div className="name">{item.pet}</div>
                      <div className="price">
                        {FormatCurrencyIDR(item.price)}
                      </div>
                      <div className="location">{item.location}</div>
                      <div className="core-action">
                        <span
                          className="material-symbols-rounded"
                          onClick={() => {
                            setDataId(item.pets_id);
                            setOpenUpdate(true);
                          }}
                        >
                          edit_square
                        </span>
                        <span
                          className="material-symbols-rounded"
                          onClick={() => {
                            setDataId(item.pets_id);
                            setOpenDelete(true);
                          }}
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
      )}
    </>
  );
}

export default PetsMan;
