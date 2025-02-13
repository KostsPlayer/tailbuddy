import { useState, useEffect, useCallback } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import apiConfig from "../../helpers/apiConfig";
import endpointsServer from "../../helpers/endpointsServer";
import LoaderPages from "../../components/loader/LoaderPages";
import BusinessManModal from "./ProductsManModal";
import { FormatCurrencyIDR } from "../../helpers/FormatCurrencyIDR";

function ProductsMan() {
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { token, isLoadingDashboardCore, setDashboardCoreLoader } =
    DashboardCore();

  const fetchBusiness = useCallback(async () => {
    try {
      setDashboardCoreLoader(true);

      const promise = await apiConfig.get(endpointsServer.products, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(promise.data.data);
    } catch (error) {
      console.error("Failed to fetch data!", error);
      setDashboardCoreLoader(false);
    } finally {
      setDashboardCoreLoader(false);
    }
  }, [token, setDashboardCoreLoader]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return (
    <>
      {isLoadingDashboardCore ? (
        <LoaderPages />
      ) : (
        <LayoutDashboard>
          <div className="products-man">
            <div className="header">
              <div className="header-title">
                Products <span> Management</span>
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
                const image = `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/products/${item.image}`;

                return (
                  <div className="content-item" key={item.products_id}>
                    <img
                      className="content-item-image"
                      src={image}
                      alt={item.image}
                    />
                    <div className="content-item-core">
                      <div className="name">{item.name}</div>
                      <div className="price">
                        {FormatCurrencyIDR(item.price)}
                      </div>
                      <div className="stock">
                        Stock: <span>{item.stock}</span>
                      </div>
                      <div className="core-action">
                        <span
                          className="material-symbols-rounded"
                          onClick={() => {
                            setDataId(item.products_id);
                            setOpenUpdate(true);
                          }}
                        >
                          edit_square
                        </span>
                        <span
                          className="material-symbols-rounded"
                          onClick={() => {
                            setDataId(item.products_id);
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

          <BusinessManModal
            type="create"
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            refreshData={fetchBusiness}
          />
          <BusinessManModal
            type="update"
            isOpen={openUpdate}
            setIsOpen={setOpenUpdate}
            refreshData={fetchBusiness}
            dataId={dataId}
          />
          <BusinessManModal
            type="delete"
            isOpen={openDelete}
            setIsOpen={setOpenDelete}
            refreshData={fetchBusiness}
            dataId={dataId}
          />
        </LayoutDashboard>
      )}
    </>
  );
}

export default ProductsMan;
