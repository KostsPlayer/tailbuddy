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

function Dashboard() {
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [transactionId, setTransactionId] = useState({});

  const updateStatusRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { toastMessage, token } = DashboardCore();

  const widthWindow = useWindowWidth();

  const fetchTransactionData = useCallback(async () => {
    try {
      setIsLoading(true);

      await apiConfig
        .get(endpointsServer.transactions, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data.data);

          const sortedData = res.data.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          setTransactionData(sortedData);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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
    console.log(transactionId);
  }, [transactionId]);

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
      {isLoading ? (
        <LoaderPages />
      ) : (
        <LayoutDashboard>
          <div className="dashboard-transaction">
            {/* <div className="dashboard-transaction-cards">
              <div className="card-item">
                <div className="card-item-title">Jumlah Pengguna</div>
                <div className="card-item-content"></div>
              </div>
              <div className="card-item">
                <div className="card-item-title">Profit Harian</div>
                <div className="card-item-content"></div>
              </div>
              <div className="card-item">
                <div className="card-item-title">Profit Bulanan</div>
                <div className="card-item-content"></div>
              </div>
            </div> */}
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
                          <button className="detail">
                            <span className="material-symbols-rounded">
                              info
                            </span>
                          </button>
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
                          <span className="material-symbols-rounded">info</span>
                        </button>
                        <button className="edit">
                          <span className="material-symbols-rounded">edit</span>
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
        </LayoutDashboard>
      )}
    </>
  );
}

export default Dashboard;
