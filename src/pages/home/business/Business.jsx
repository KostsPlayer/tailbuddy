import React, { useState, useEffect, useCallback, useMemo } from "react";
import LandingCore from "../../../context/landingCore/LandingCore";
import { convertTime } from "../../../helpers/convertTime";

function Business() {
  const [activeCategory, setActiveCategory] = useState(
    "5f665206-48e7-4c60-ab90-5d970299f7d2"
  );

  const { business, businessCategories } = LandingCore();

  const handleActiveCatgeory = useCallback((id) => {
    setActiveCategory(id);
  }, []);

  return (
    <div className="business">
      <div className="business-title">
        Featured <span>Pet Business</span>
      </div>
      <div className="business-categories">
        {businessCategories.map((category) => {
          const categoryImg = `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/business_categories/${category.image}`;

          return (
            <div
              key={category.business_categories_id}
              className={`category ${
                activeCategory === category.business_categories_id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleActiveCatgeory(category.business_categories_id)
              }
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
            const businessImg = `https://zvgpdykyzhgpqvrpsmrf.supabase.co/storage/v1/object/public/business/${data.image}`;

            return (
              <div
                className="item"
                key={data.business_id}
                style={{
                  backgroundImage: `url(${businessImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="item-wrapper">
                  <div className="item-wrapper-date">
                    {convertTime(data.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="business-more">
        {activeCategory === "a67555c1-4472-4320-8ae3-5287ea9d2aa9"
          ? "book now"
          : "view all business"}
      </div>
    </div>
  );
}

export default Business;
