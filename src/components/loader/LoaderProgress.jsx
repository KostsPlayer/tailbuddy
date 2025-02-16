import React from "react";

function LoaderProgress({ type = "transaction", style = {} }) {
  return (
    // <!-- From Uiverse.io by alexruix -->
    <div className="loader-progress-wrapper" style={style}>
      <div className="loader-progress"></div>
      <div className="loader-progress-text">
        {type === "transaction"
          ? "Your transaction on progress..."
          : "Loading..."}
      </div>
    </div>
  );
}

export default LoaderProgress;
