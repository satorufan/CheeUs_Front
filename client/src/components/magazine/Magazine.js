import React from "react";
import MagazineTop from "./MagazineTop";
import MagazineCategory from "./MagazineCategory";
import './Magazine.css';
import AdCarousel from '../app/AdCarousel';



const Magazine = () =>{
  return (
    <div className="magazine-pagelist-container">
      <MagazineTop/>
      <MagazineCategory/>
      <AdCarousel interval={5000} />
    </div>
  );
};

export default Magazine;