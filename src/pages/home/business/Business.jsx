import React, { useState, useEffect, useCallback, useMemo } from "react";
import LandingCore from "../../../context/landingCore/LandingCore";

function Business() {
  const [activeCategory, setActiveCategory] = useState(
    "5f665206-48e7-4c60-ab90-5d970299f7d2"
  );

  const { business, businessCategories } = LandingCore();

  const handleActiveCatgeory = useCallback((id) => {
    setActiveCategory(id);
  }, []);

  const convertTime = (timestamp) => {
    // Buat objek Date dari timestamp
    const date = new Date(timestamp);

    // Array nama hari dan nama bulan dalam bahasa Indonesia
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Ambil data waktu sesuai zona waktu Jakarta (UTC+7)
    const options = {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("id-ID", options);
    const formattedDate = formatter.formatToParts(date);

    // Ekstrak bagian-bagian tanggal yang diperlukan
    const day = date.getUTCDay(); // Hari dalam format angka (0-6)
    const dateNumber = formattedDate.find((part) => part.type === "day").value;
    const month = formattedDate.find((part) => part.type === "month").value - 1; // Sesuaikan index bulan
    const year = formattedDate.find((part) => part.type === "year").value;
    const hour = formattedDate.find((part) => part.type === "hour").value;
    const minute = formattedDate.find((part) => part.type === "minute").value;
    // const second = formattedDate.find((part) => part.type === "second").value;

    // Gabungkan ke dalam format yang diinginkan
    return `${days[day]}, ${dateNumber} ${months[month]} ${year}, ${hour}.${minute} WIB`;
  };

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
            return (
              <div className="item" key={data.business_id}>
                <div className="item-text-bg">{data.business}</div>
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
