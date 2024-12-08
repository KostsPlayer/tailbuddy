import React from "react";
import imageHero from "../../../assets/images/hero/pngwing.com (2).png";
import iconHero1 from "../../../assets/images/hero/pet_8036693.png";
import iconHero2 from "../../../assets/images/hero/kitty_763764.png";
import iconHero3 from "../../../assets/images/hero/kitty_763752.png";

function Hero() {
  return (
    <>
      <div className="hero">
        <div className="hero-preface">
          <svg
            viewBox="0 0 200 200"
            width={300}
            height={300}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FF0066"
              d="M36,-55.8C48.9,-47.7,63.2,-41.6,68.9,-31C74.5,-20.3,71.4,-5.3,70,10.6C68.5,26.5,68.8,43.2,61.4,55.1C54,67.1,39,74.3,24.3,75C9.7,75.7,-4.5,69.8,-20.4,66.5C-36.2,63.2,-53.7,62.4,-66.7,54.1C-79.7,45.8,-88.3,29.8,-89.9,13.4C-91.4,-3,-86,-19.9,-77.1,-33.5C-68.2,-47,-55.8,-57.3,-42.4,-65.1C-28.9,-72.9,-14.5,-78.2,-1.5,-76C11.5,-73.7,23.1,-63.8,36,-55.8Z"
              transform="translate(100 100)"
            />
          </svg>
          <img src={iconHero1} alt="Intro's Icon" />
          <img src={iconHero2} alt="Intro's Icon" />
          <img src={iconHero3} alt="Intro's Icon" />
          <div className="container">
            <div className="text">
              whether <span className="big">big</span>
            </div>
            <div className="text">
              <span className="small">or</span> small
            </div>
            <div className="text">we have all</div>
          </div>
        </div>
        <img className="hero-image" src={imageHero} alt="Intro's Image" />
        {/* <div className="hero-search">
          <div className="by-anything">
            <div className="label">Search for</div>
            <input
              type="text"
              name="anything"
              placeholder="eg: orange cat, mockingbird"
            />
          </div>
          <div className="by-category">
            <div className="label">Category</div>
            <div className="default">
              <div className="default-display">Cat</div>
              <span className="material-symbols-rounded">
                keyboard_arrow_down
              </span>
            </div>
          </div>
          <div className="by-location">
            <div className="label">Location</div>
            <input
              type="text"
              name="location"
              placeholder="eg: west java, indonesia"
            />
          </div>
          <button className="go-search">
            <span className="material-symbols-rounded">search</span>
          </button>
        </div> */}
      </div>
    </>
  );
}

export default Hero;
