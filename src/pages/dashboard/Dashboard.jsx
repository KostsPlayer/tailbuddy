import { useState, useEffect, useCallback, useRef } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { useLocation, useNavigate } from "react-router-dom";
import apiConfig from "../../helpers/apiConfig";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import endpointsServer from "../../helpers/endpointsServer";
import LoaderPages from "../../components/loader/LoaderPages";
import { indonesianTime } from "../../helpers/IndonesianTime";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import UpdateStatusModal from "./UpdateStatusModal";
import { FormatCurrencyIDR } from "../../helpers/FormatCurrencyIDR";
import usePriceDashboard from "./usePriceDashboard";
import useFetchDashboard from "./useFetchDashboard";
import DetailTransactionModal from "./DetailTransactionModal";

function Dashboard() {
  const [transactionData, setTransactionData] = useState([]);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [openDetailTransaction, setOpenDetailTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState({});
  const [detailTransaction, setDetailTransaction] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const updateStatusRef = useRef(null);
  const detailTransactionRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    toastMessage,
    token,
    isMe,
    setDashboardCoreLoader,
    isLoadingDashboardCore,
  } = DashboardCore();
  const { grooming, pet, product, photography } = useFetchDashboard();
  const {
    groomingPriceToday,
    groomingPriceThisMonth,
    petPriceToday,
    petPriceThisMonth,
    productPriceThisMonth,
    productPriceToday,
    photographyPriceThisMonth,
    photographyPriceToday,
  } = usePriceDashboard();

  const widthWindow = useWindowWidth();

  const fetchTransactionData = useCallback(async () => {
    try {
      setDashboardCoreLoader(true);

      await apiConfig
        .get(endpointsServer.transactions, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // console.log(res.data.data);

          const combinedArray = [
            ...grooming,
            ...pet,
            ...product,
            ...photography,
          ];

          const getData = res.data.data.map((item) => {
            const data = combinedArray.find(
              (data) => data.transaction_id === item.transactions_id
            );

            return { type: item.type, status: item.status, users: item.users, ...data }
          });

           const sortedData = getData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          console.log(sortedData);
          
          
          setTransactionData(sortedData);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setDashboardCoreLoader(false);
    }
  }, [token, setDashboardCoreLoader, grooming, pet, product, photography]);

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        updateStatusRef.current &&
        !updateStatusRef.current.contains(e.target)
      ) {
        setOpenUpdateStatus(false);
      }
    };

    if (openUpdateStatus) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [updateStatusRef, openUpdateStatus]);

  useEffect(() => {
    if (location.state?.messageLogin) {
      toastMessage("success", location.state.messageLogin);
      navigate(location.pathname, {
        state: { ...location.state, messageLogin: undefined },
        replace: true,
      });
    }
  }, [location.state, navigate, toastMessage, location.pathname]);

  return (
    <>
      {isLoadingDashboardCore ? (
        <LoaderPages />
      ) : (
        <LayoutDashboard>
          {isMe.role_id === "067c970c-6870-406b-8b29-de9fc21f3675" ||
          isMe.role_id === "5bc702b0-cb8a-4996-a4f9-3feef9710b10" ? (
            <div className="dashboard-transaction">
              <div className="dashboard-transaction-cards">
                <div className="card-item">
                  <div className="card-item-title">Profit Harian</div>
                  <div className="card-item-content">
                    <div className="total">
                      {FormatCurrencyIDR(
                        groomingPriceToday +
                          productPriceToday +
                          petPriceToday +
                          photographyPriceToday
                      )}
                    </div>
                    <div className="detail">
                      <div className="detail-text">Grooming</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(groomingPriceToday)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Product</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(productPriceToday)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Pet</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(petPriceToday)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Photography</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(photographyPriceToday)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-item">
                  <div className="card-item-title">Profit Bulanan</div>
                  <div className="card-item-content">
                    <div className="total">
                      {" "}
                      {FormatCurrencyIDR(
                        groomingPriceThisMonth +
                          productPriceThisMonth +
                          petPriceThisMonth +
                          photographyPriceThisMonth
                      )}
                    </div>
                    <div className="detail">
                      <div className="detail-text">Grooming</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(groomingPriceThisMonth)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Product</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(productPriceThisMonth)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Pet</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(petPriceThisMonth)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Photography</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(photographyPriceThisMonth)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {widthWindow < 767.98 ? (
                <>
                  <div className="dashboard-transaction-list">
                    {transactionData.map((transaction, index) => {
                      return (
                        <div className="list-item" key={index}>
                          <div className="list-item-user">
                            <span>{transaction.users.email}</span>
                            <span>{transaction.users.username}</span>
                          </div>
                          <div className="list-item-price">
                            {FormatCurrencyIDR(transaction.type === "pet" ? transaction?.pets?.price : transaction.type === "product" ? transaction?.price * transaction?.quantity : transaction?.price )}
                          </div>
                          <div className="list-item-service">
                            <span>{transaction.type === "pet" ? transaction.pets?.pet : transaction.type === "product" ? transaction.products?.name : transaction.type === "grooming" ? transaction.gromming_services?.name : transaction.photography_services?.name}</span>
                            {transaction.type === "product" ? (
                                <span>x {transaction.quantity}</span>
                              ) : null}
                          </div>
                          <div className="list-item-type">
                            <span className={`${transaction.type}`}>
                              <div className="box"></div>
                              {transaction.type}
                            </span>
                            <div className="text">— Transaction Type</div>
                          </div>
                          <div className="list-item-status">
                            <span className={`${transaction.status}`}>
                              <div className="box"></div>
                              {transaction.status}
                            </span>
                            <div className="text">— Transaction Status</div>
                          </div>
                          <div className="list-item-action">
                            <div className="date">
                              {indonesianTime(transaction.created_at)}
                            </div>
                            {transaction.status === "done" ? (
                              <button
                                className="detail"
                                onClick={() => {
                                  const combinedArray = [
                                    ...grooming,
                                    ...pet,
                                    ...product,
                                    ...photography,
                                  ];

                                  const data = combinedArray.find(
                                    (item) =>
                                      item.transaction_id ===
                                      transaction.transactions_id
                                  );

                                  setTransactionId(transaction);
                                  setDetailTransaction(data);
                                  setOpenDetailTransaction(true);
                                }}
                              >
                                <span className="material-symbols-rounded">
                                  info
                                </span>
                              </button>
                            ) : null}
                            <button
                              className="edit"
                              onClick={() => {
                                setTransactionId(transaction);
                                setOpenUpdateStatus(true);
                              }}
                            >
                              <span className="material-symbols-rounded">
                                edit
                              </span>
                            </button>
                            <button className="delete">
                              <span className="material-symbols-rounded">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {openDetailTransaction ? (
                    <DetailTransactionModal
                      isOpen={openDetailTransaction}
                      setIsOpen={setOpenDetailTransaction}
                      modalRef={detailTransactionRef}
                      data={[detailTransaction, transactionId]}
                    />
                  ) : null}

                  {openUpdateStatus ? (
                    <UpdateStatusModal
                      isOpen={openUpdateStatus}
                      setIsOpen={setOpenUpdateStatus}
                      modalRef={updateStatusRef}
                      refreshData={fetchTransactionData}
                      dataId={transactionId}
                    />
                  ) : null}
                </>
              ) : (
                <div className="dashboard-transaction-table">
                  <div className="table-thead">
                    <div className="table-thead-col">No</div>
                    <div className="table-thead-col">User ID</div>
                    <div className="table-thead-col">Date</div>
                    <div className="table-thead-col">Type</div>
                    <div className="table-thead-col">Status</div>
                    <div className="table-thead-col">Action</div>
                  </div>
                  {transactionData.map((transaction, index) => {
                    return (
                      <div className="table-tbody" key={index}>
                        <div className="table-tbody-col">{index + 1}</div>
                        <div className="table-tbody-col">
                          <span>{transaction.users.email}</span>
                          <span>{transaction.users.username}</span>
                        </div>
                        <div className="table-tbody-col">
                          {indonesianTime(transaction.created_at)}
                        </div>
                        <div className="table-tbody-col">
                          <span className={`${transaction.type}`}>
                            <div className="box"></div>
                            {transaction.type}
                          </span>
                        </div>
                        <div className="table-tbody-col">
                          <span className={`${transaction.status}`}>
                            <div className="box"></div>
                            {transaction.status}
                          </span>
                        </div>
                        <div className="table-tbody-col">
                          <button className="detail">
                            <span className="material-symbols-rounded">
                              info
                            </span>
                          </button>
                          <button className="edit">
                            <span className="material-symbols-rounded">
                              edit
                            </span>
                          </button>
                          <button className="delete">
                            <span className="material-symbols-rounded">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="dashboard-text">
              Dashboard <span> User</span>
            </div>
          )}
        </LayoutDashboard>
      )}
    </>
  );
}

export default Dashboard;
