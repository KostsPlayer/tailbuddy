import React, { useState, useEffect, useCallback, useMemo } from "react";
import businessCategories from "../../../data/businessCategories.json";
import axios from "axios";
import endpointsServer from "../../../helpers/endpointsServer";

function Business() {
  axios.defaults.withCredentials = true;

  const [business, setBusiness] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    "eaf94b73-871a-475b-8fc1-698df8ce1da6"
  );

  const fetchBusiness = useCallback(async () => {
    try {
      const businessPromise = await axios.get(endpointsServer.business);

      setBusiness(businessPromise.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const handleActiveCatgeory = useCallback((id) => {
    setActiveCategory(id);
  }, []);

  const activeCategoryName = useMemo(
    () =>
      businessCategories.find((category) => category.id === activeCategory)
        ?.name || "Unknown",
    [activeCategory]
  );

  const convertTime = (timestamp) => {
    // Create a Date object
    const date = new Date(timestamp);

    // Convert to Jakarta timezone (UTC+7)
    const options = {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    // Format the date
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  return (
    <div className="business">
      <div className="business-title">
        Featured <span>Pet Business</span>
      </div>
      <div className="business-categories">
        {businessCategories.map((category) => {
          const categoryImg = `/businessCategories/${category.image}`;

          return (
            <div
              key={category.id}
              className={`category ${
                activeCategory === category.id ? "active" : ""
              }`}
              onClick={() => handleActiveCatgeory(category.id)}
            >
              <img
                className="category-image"
                src={categoryImg}
                alt={category.name}
              />
              <div className="category-text">{category.name}</div>
            </div>
          );
        })}
      </div>
      <div className="business-content">
        {business
          .filter((item) => item.business_category_id === activeCategory)
          .map((data) => {
            return (
              <div className="item" key={data.id}>
                <div className="item-text-bg">{activeCategoryName}</div>
                <div className="item-wrapper">
                  <div className="item-wrapper-date">
                    {convertTime(data.created_at)}
                  </div>
                  <div className="item-wrapper-text">{data.name}</div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="business-more">view all business</div>
    </div>
  );
}

export default Business;
