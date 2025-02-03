import { useState, useEffect, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import LoaderPages from "../../components/loader/LoaderPages";
import BusinessCategoryManModal from "./BusinessCategoryManModal";

function BusinessCategoryMan() {
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { token, isLoadingDashboardCore, setDashboardCoreLoader } =
    DashboardCore();

  const fetchBusinessCategories = useCallback(async () => {
    try {
      setDashboardCoreLoader(true);

      const response = await apiConfig.get(
        endpointsServer.businessCategoriesAll,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch data!", error);
      setDashboardCoreLoader(false);
    } finally {
      setDashboardCoreLoader(false);
    }
  }, [token, setDashboardCoreLoader]);

  useEffect(() => {
    fetchBusinessCategories();
  }, [fetchBusinessCategories]);

  return (
    <>
      {isLoadingDashboardCore ? (
        <LoaderPages />
      ) : (
        <LayoutDashboard>
          <div className="business-category-man">
            <div className="header">
              <div className="header-title">
                Business Categories <span> Management</span>
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
                const image = `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/business_categories/${item.image}`;
                return (
                  <div
                    className="content-item"
                    key={item.business_categories_id}
                  >
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
                          onClick={() => {
                            setDataId(item.business_categories_id);
                            setOpenUpdate(true);
                          }}
                        >
                          edit_square
                        </span>
                        <span
                          className="material-symbols-rounded"
                          onClick={() => {
                            setDataId(item.business_categories_id);
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

          <BusinessCategoryManModal
            type="create"
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            refreshData={fetchBusinessCategories}
          />
          <BusinessCategoryManModal
            type="update"
            isOpen={openUpdate}
            setIsOpen={setOpenUpdate}
            refreshData={fetchBusinessCategories}
            dataId={dataId}
          />
          <BusinessCategoryManModal
            type="delete"
            isOpen={openDelete}
            setIsOpen={setOpenDelete}
            refreshData={fetchBusinessCategories}
            dataId={dataId}
          />
        </LayoutDashboard>
      )}
    </>
  );
}

export default BusinessCategoryMan;
