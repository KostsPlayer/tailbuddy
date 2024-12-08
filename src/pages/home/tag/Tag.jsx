import React, { useEffect, useMemo } from "react";
import categoriesData from "../../../data/tags.json";

function Tag() {
  const displayCategories = useMemo(() => {
    return categoriesData.map((category) => {
      const imgIcon = `/tags/${category.image}`;

      return (
        <div className="wrapper-item" key={category.id}>
          {category.id === 1 ? (
            <img className="icon" src={imgIcon} alt="icon" />
          ) : category.id === 2 ? (
            <img className="icon" src={imgIcon} alt="icon" />
          ) : category.id === 3 ? (
            <img className="icon" src={imgIcon} alt="icon" />
          ) : category.id === 4 ? (
            <img className="icon" src={imgIcon} alt="icon" />
          ) : null}
          <div className="text">{category.text}</div>
        </div>
      );
    });
  }, []);

  return (
    <div className="tag">
      <div className="wrapper">{displayCategories}</div>
    </div>
  );
}

export default Tag;
