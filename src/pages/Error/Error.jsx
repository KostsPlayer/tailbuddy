import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ErrorComponent({ type, message }) {
  const visualRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (visualRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = 45 / (width / height);
        visualRef.current.style.transform = `translate(-50%, -50%) rotate(-${ratio}deg)`;
      }
    };

    // Tambahkan event listener
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    // Panggil fungsi sekali untuk inisialisasi
    handleResize();

    // Cleanup saat komponen unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, []);

  return (
    <div className="error-page">
      <Link to="/">
        <svg
          height="0.8em"
          width="0.8em"
          viewBox="0 0 2 1"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#777777"
            strokeWidth="0.1"
            points="0.9,0.1 0.1,0.5 0.9,0.9"
          />
        </svg>{" "}
        Home
      </Link>
      <div className="background-wrapper">
        <h1 id="visual" ref={visualRef}>
          {type}
        </h1>
      </div>
      <p>{message}</p>
    </div>
  );
}

export function Error404() {
  return (
    <ErrorComponent
      type={404}
      message={"Oops! The page you are looking for doesn't exist."}
    />
  );
}

export function Error403() {
  return (
    <ErrorComponent
      type={403}
      message={"You’re not allowed to access this page."}
    />
  );
}

export function Error401() {
  return (
    <ErrorComponent
      type={401}
      message={"Access Denied. You don't have permission to view this page."}
    />
  );
}
