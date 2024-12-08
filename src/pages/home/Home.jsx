import React from "react";
import SmoothScroll from "../../helpers/SmoothScroll";
import Navbar from "../../components/navbar/Navbar";
import Hero from "./hero/Hero";
import Tag from "./tag/Tag";
import Business from "./business/Business";
import { Pets, Products } from "./showItems/ShowItems";

function Home() {
  return (
    <>
      <div className="home">
        <SmoothScroll />
        <Navbar />
        <Hero />
        <Tag />
        <Pets />
        <Business />
        <Products />
      </div>
    </>
  );
}

export default Home;
