import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "../../../components/layout/Modal/Modal";
import LandingCore from "../../../context/landingCore/LandingCore";
import { FormatCurrencyIDR } from "../../../helpers/FormatCurrencyIDR";
// import groomingServices from "../../../data/groomingServices.json";
// import photographyServices from "../../../data/photographyServices.json";
import apiConfig from "../../../helpers/apiConfig";
import endpointsServer from "../../../helpers/endpointsServer";
import LoaderProgress from "../../../components/loader/LoaderProgress";

function BusinessModal({ isOpen, setIsOpen, modalRef, type }) {
  const [bookLoading, setBookLoading] = useState(false);
  const [openService, setOpenService] = useState(false);
  const serviceRef = useRef();
  const [values, setValues] = useState({
    price: 0,
    service: 0,
    schedule: "",
  });

  const { toastMessage, token, groomingServices, photographyServices } =
    LandingCore();

  const handleChange = useCallback((e) => {
    const selectedValue = e.target.value;
    const selectedDate = new Date(selectedValue);
    const hours = selectedDate.getHours();

    if (hours < 10 || hours > 21) {
      // alert("Jam yang diperbolehkan hanya dari 08:00 hingga 20:00");
      toastMessage(
        "info",
        "Jam yang diperbolehkan hanya dari pukul 10.00 hingga 21.00",
        {
          position: "top-right",
        }
      );
      setValues((prev) => ({ ...prev, schedule: "" }));
    } else {
      setValues((prev) => ({ ...prev, schedule: selectedValue }));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (serviceRef.current && !serviceRef.current.contains(e.target)) {
        setOpenService(false);
      }
    };

    if (openService) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serviceRef, openService]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // console.log(values);
      try {
        setBookLoading(true);

        const promiseTransaction = await apiConfig.post(
          `${endpointsServer.transactions}/create`,
          {
            status: "pending",
            type:
              type === "grooming"
                ? "grooming"
                : type === "photography"
                ? "photography"
                : "idk",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (type === "grooming") {
          apiConfig
            .post(
              `${endpointsServer.groomingReservation}/create`,
              {
                transaction_id: promiseTransaction.data.data[0].transactions_id,
                service: values.service,
                schedule: values.schedule,
                price: values.price,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              toastMessage("success", "Success to take grooming reservation!");
            })
            .finally(() => {
              setBookLoading(false);
              setIsOpen(false);
              setValues({
                service: 0,
                price: 0,
                schedule: "",
              });
            });
        } else if (type === "photography") {
          // console.log(values);

          apiConfig
            .post(
              `${endpointsServer.photograpy}/create`,
              {
                transaction_id: promiseTransaction.data.data[0].transactions_id,
                service: values.service,
                schedule: values.schedule,
                price: values.price,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              toastMessage(
                "success",
                "Success to take photography reservation!"
              );
            })
            .finally(() => {
              setBookLoading(false);
              setIsOpen(false);
              setValues({
                service: 0,
                price: 0,
                schedule: "",
              });
            });
        }
      } catch (err) {
        console.log(err);

        if (type === "grooming") {
          toastMessage("error", "Failed to take grooming reservation!");
        } else if (type === "photography") {
          toastMessage("error", "Failed to take photography reservation!");
        }
      }
    },
    [values, token, setIsOpen, type]
  );

  return (
    <Modal
      titleModal={type === "grooming" ? "Grooming" : "Photography"}
      otherTitleModal={"Reservation"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalRef={modalRef}
    >
      <form className="modal-form transaction" onSubmit={handleSubmit}>
        {bookLoading ? (
          <LoaderProgress
            style={{
              height: "40vh",
            }}
          />
        ) : (
          <>
            <div className="modal-form-group">
              <div className="label">
                Service <span>(Required)</span>
              </div>
              <div
                className="select-default"
                onClick={() => setOpenService(true)}
              >
                <div className="text">
                  {values.service === 0
                    ? "Select Service"
                    : type === "grooming"
                    ? groomingServices.find(
                        (item) => item.grooming_services_id === values.service
                      )?.name || "Unknown Service"
                    : photographyServices.find(
                        (item) =>
                          item.photography_services_id === values.service
                      )?.name || "Unknown Service"}
                </div>
                <span
                  className={`material-symbols-outlined ${
                    openService ? "default-closed" : ""
                  }`}
                >
                  south_east
                </span>
              </div>

              {openService && (
                <div className="select-list" ref={serviceRef}>
                  {(type === "grooming"
                    ? groomingServices
                    : photographyServices
                  ).map((data) => (
                    <div
                      className="select-list-item"
                      key={data.id}
                      onClick={() => {
                        setValues((prev) => ({
                          ...prev,
                          service:
                            type === "grooming"
                              ? data.grooming_services_id
                              : data.photography_services_id,
                          price: data.price,
                        }));
                        setOpenService(false);
                      }}
                    >
                      <div className="name">
                        {data.name} — {FormatCurrencyIDR(data.price)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-form-group">
              <label htmlFor="schedule">
                Schedule <span>(required)</span>
              </label>
              <input
                type="datetime-local"
                id="schedule"
                value={values.schedule}
                onChange={handleChange}
              />
            </div>
            <div className="transaction-preview">
              <div className="total-price">
                {FormatCurrencyIDR(values.price)}
              </div>
            </div>
          </>
        )}
        <div className="transaction-button">
          <button type="submit">Take Now</button>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

export default BusinessModal;
