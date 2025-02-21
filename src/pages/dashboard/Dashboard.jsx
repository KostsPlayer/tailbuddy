import { useState, useEffect, useCallback, useRef } from "react";
import LayoutDashboard from "../../components/layout/LayoutDashboard";
import { useLocation, useNavigate } from "react-router-dom";
import apiConfig from "../../helpers/apiConfig";
import DashboardCore from "../../context/dashboardCore/DashboardCore";
import endpointsServer from "../../helpers/endpointsServer";
import LoaderPages from "../../components/loader/LoaderPages";
import { indonesianTime } from "../../helpers/IndonesianTime";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import UpdateDeleteModal from "./UpdateDeleteModal";
import { FormatCurrencyIDR } from "../../helpers/FormatCurrencyIDR";
import usePriceDashboard from "./usePriceDashboard";
import useFetchDashboard from "./useFetchDashboard";
import DetailTransactionModal from "./DetailTransactionModal";

function Dashboard() {
  const [transactionData, setTransactionData] = useState([]);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetailTransaction, setOpenDetailTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState({});
  const [detailTransaction, setDetailTransaction] = useState({});

  const updateStatusRef = useRef(null);
  const deleteRef = useRef(null);
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
    groomingPriceThisWeek,
    groomingPriceThisMonth,
    petPriceToday,
    petPriceThisWeek,
    petPriceThisMonth,
    productPriceToday,
    productPriceThisWeek,
    productPriceThisMonth,
    photographyPriceToday,
    photographyPriceThisWeek,
    photographyPriceThisMonth,
  } = usePriceDashboard();

  const widthWindow = useWindowWidth();

  useEffect(() => {
    console.log(isMe);
  }, [isMe]);

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

            return {
              type: item.type,
              status: item.status,
              users: item.users,
              ...data,
            };
          });

          const sortedData = getData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          console.log(sortedData.length);

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
      } else if (deleteRef.current && !deleteRef.current.contains(e.target)) {
        setOpenDelete(false);
      }
    };

    if (openUpdateStatus || openDelete) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [updateStatusRef, openUpdateStatus, deleteRef, openDelete]);

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
                  <div className="card-item-title">Profit Mingguan</div>
                  <div className="card-item-content">
                    <div className="total">
                      {FormatCurrencyIDR(
                        groomingPriceThisWeek +
                          productPriceThisWeek +
                          petPriceThisWeek +
                          photographyPriceThisWeek
                      )}
                    </div>
                    <div className="detail">
                      <div className="detail-text">Grooming</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(groomingPriceThisWeek)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Product</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(productPriceThisWeek)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Pet</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(petPriceThisWeek)}
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-text">Photography</div>
                      <div className="detail-number">
                        {FormatCurrencyIDR(photographyPriceThisWeek)}
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
                          <div className="list-item-service">
                            <span>
                              {transaction.type === "pet"
                                ? transaction.pets?.pet
                                : transaction.type === "product"
                                ? transaction.products?.name
                                : transaction.type === "grooming"
                                ? transaction.grooming_services?.name
                                : transaction.photography_services?.name}
                            </span>
                            {transaction.type === "product" ? (
                              <span>x {transaction.quantity}</span>
                            ) : null}
                          </div>
                          <div className="list-item-price">
                            {FormatCurrencyIDR(
                              transaction.type === "pet"
                                ? transaction?.pets?.price
                                : transaction.type === "product"
                                ? transaction?.price * transaction?.quantity
                                : transaction?.price
                            )}
                          </div>
                          {transaction.type === "grooming" ||
                          transaction.type === "photography" ? (
                            <div className="list-item-schedule">
                              {indonesianTime(transaction.schedule)}
                              <div className="text">— Schedule</div>
                            </div>
                          ) : null}
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
                            {/* {transaction.status === "done" ? (
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
                            ) : null} */}
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
                            <button
                              className="delete"
                              onClick={() => {
                                setOpenDelete(true);
                                setTransactionId(transaction);
                              }}
                            >
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
                    <UpdateDeleteModal
                      type="update"
                      isOpen={openUpdateStatus}
                      setIsOpen={setOpenUpdateStatus}
                      modalRef={updateStatusRef}
                      refreshData={() => {
                        setOpenUpdateStatus(false);
                        window.location.reload();
                      }}
                      dataId={transactionId}
                    />
                  ) : null}

                  {openDelete ? (
                    <UpdateDeleteModal
                      type="delete"
                      isOpen={openDelete}
                      setIsOpen={setOpenDelete}
                      modalRef={deleteRef}
                      refreshData={() => {
                        window.location.reload();
                        setOpenDelete(false);
                      }}
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
            <div className="dashboard-transaction">
              {widthWindow < 767.98 ? (
                <>
                  {transactionData.filter(
                    (item) => item.users.users_id === isMe.users_id
                  ).length !== 0 ? (
                    <div className="dashboard-transaction-list">
                      {transactionData
                        .filter((item) => item.users.users_id === isMe.users_id)
                        .map((transaction, index) => {
                          return (
                            <div className="list-item" key={index}>
                              <div className="list-item-user">
                                <span>{transaction.users.email}</span>
                                <span>{transaction.users.username}</span>
                              </div>
                              <div className="list-item-service">
                                <span>
                                  {transaction.type === "pet"
                                    ? transaction.pets?.pet
                                    : transaction.type === "product"
                                    ? transaction.products?.name
                                    : transaction.type === "grooming"
                                    ? transaction.grooming_services?.name
                                    : transaction.photography_services?.name}
                                </span>
                                {transaction.type === "product" ? (
                                  <span>x {transaction.quantity}</span>
                                ) : null}
                              </div>
                              <div className="list-item-price">
                                {FormatCurrencyIDR(
                                  transaction.type === "pet"
                                    ? transaction?.pets?.price
                                    : transaction.type === "product"
                                    ? transaction?.price * transaction?.quantity
                                    : transaction?.price
                                )}
                              </div>
                              {transaction.type === "grooming" ||
                              transaction.type === "photography" ? (
                                <div className="list-item-schedule">
                                  {indonesianTime(transaction.schedule)}
                                  <div className="text">— Schedule</div>
                                </div>
                              ) : null}
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
                                {isMe.role_id ===
                                "0ed16806-0500-448d-b245-524f2c5ee8bc" ? (
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
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="no-transaction">
                      No Transaction <span>Found</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="dashboard-text">
                  Dashboard <span>Transaction</span>
                </div>
              )}
            </div>
          )}
        </LayoutDashboard>
      )}
    </>
  );
}

export default Dashboard;
