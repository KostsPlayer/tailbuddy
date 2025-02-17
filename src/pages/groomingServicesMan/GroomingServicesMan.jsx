import { useState, useEffect, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import LoaderPages from "../../components/loader/LoaderPages";
import GroomingServicesManModal from "./GroomingServicesManModal";
import { FormatCurrencyIDR } from "../../helpers/FormatCurrencyIDR";

function GroomingServicesMan() {
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { token, isLoadingDashboardCore, setDashboardCoreLoader } =
    DashboardCore();

  const fetchGroomingServices = useCallback(async () => {
    try {
      setDashboardCoreLoader(true);

      const response = await apiConfig.get(endpointsServer.groomingServices, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch data!", error);
      setDashboardCoreLoader(false);
    } finally {
      setDashboardCoreLoader(false);
    }
  }, [token, setDashboardCoreLoader]);

  useEffect(() => {
    fetchGroomingServices();
  }, [fetchGroomingServices]);

  return (
    <>
      {isLoadingDashboardCore ? (
        <LoaderPages />
      ) : (
        <LayoutDashboard>
          <div className="grooming-services-man">
            <div className="header">
              <div className="header-title">
                Grooming Services <span> Management</span>
              </div>
              <div
                className="header-new-item"
                onClick={() => setOpenCreate(true)}
              >
                <span className="material-symbols-rounded">add_task</span>
                <div className="text">add new item</div>
              </div>
            </div>

            <div className="content">
              {data.map((item) => {
                return (
                  <div className="content-item" key={item.grooming_services_id}>
                    <div className="content-item-core">
                      <div className="name">{item.name}</div>
                      <div className="price">
                        {FormatCurrencyIDR(item.price)}
                      </div>
                      <div className="core-action">
                        <span
                          className="material-symbols-rounded"
                          onClick={() => {
                            setDataId(item.grooming_services_id);
                            setOpenUpdate(true);
                          }}
                        >
                          edit_square
                        </span>
                        <span
                          className="material-symbols-rounded"
                          onClick={() => {
                            setDataId(item.grooming_services_id);
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

          <GroomingServicesManModal
            type="create"
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            refreshData={fetchGroomingServices}
          />
          <GroomingServicesManModal
            type="update"
            isOpen={openUpdate}
            setIsOpen={setOpenUpdate}
            refreshData={fetchGroomingServices}
            dataId={dataId}
          />
          <GroomingServicesManModal
            type="delete"
            isOpen={openDelete}
            setIsOpen={setOpenDelete}
            refreshData={fetchGroomingServices}
            dataId={dataId}
          />
        </LayoutDashboard>
      )}
    </>
  );
}

export default GroomingServicesMan;
