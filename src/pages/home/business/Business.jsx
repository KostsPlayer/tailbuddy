import React, { useState, useEffect, useCallback, useMemo } from "react";
import businessCategories from "../../../data/businessCategories.json";
import business from "../../../data/business.json";
import dayjs from "dayjs";
import "dayjs/locale/id";

function Business() {
  dayjs.locale("id");
  const [activeCategory, setActiveCategory] = useState(1);

  const handleActiveCatgeory = useCallback((id) => {
    setActiveCategory(id);
  }, []);

  const activeCategoryName = useMemo(
    () =>
      businessCategories.find((category) => category.id === activeCategory)
        ?.name || "Unknown",
    [activeCategory]
  );

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
            const date = dayjs(data.date * 1000).format("DD MMMM YYYY");

            return (
              <div className="item" key={data.id}>
                <div className="item-text-bg">{activeCategoryName}</div>
                <div className="item-wrapper">
                  <div className="item-wrapper-date">{date}</div>
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
