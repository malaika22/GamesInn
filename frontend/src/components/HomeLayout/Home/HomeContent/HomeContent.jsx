import { useState } from "react";
import { Button, Col, Row } from "antd";
import homeSection from "../../../../assests/illustrations/homeSection.svg";
import Fade from "react-reveal/Fade";
import OwlCarousel from "react-owl-carousel";
import SlideOne from "../../../../assests/home/slideOne.jpeg";
import SlideTwo from "../../../../assests/home/slideTwo.jpeg";
import SlideThree from "../../../../assests/home/slideThree.jpeg";
import SlideFour from "../../../../assests/home/slideFour.jpeg";
import SlideFive from "../../../../assests/home/slideFive.jpeg";
//import {Swiper, SwiperSlide} from 'swiper/react'
import "swiper/swiper-bundle.min.css";

// swiper core styles
import "swiper/swiper.min.css";
// Import Swiper styles
// import "swiper/components/pagination/pagination.min.css";

import Swiper from "react-id-swiper";

import SwiperCore, { Pagination } from "swiper";
import "./styles.scss";

SwiperCore.use([Pagination]);
const HomeContent = () => {
  console.log("checking");
  const [responsive] = useState({
    0: {
      items: 1,
    },
    // 450: {
    //   items: 2,
    // },
    // 600: {
    //   items: 3,
    // },
    // 1000: {
    //   items: 4,
    // },
  });

  const params = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
  };
  return (
    <div className="homeContent-container">
      <div className="home-section">
        <Row style={{ alignItems: "center" }}>
          <Col lg={12}>
            <div className="homeContent">
              <h1 className="home-title">The place for gamers</h1>
              <div className="home-desc">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro
                dolore voluptate ratione! Ipsa vitae tenetur ut, qui maxime
                sequi voluptate quas magnam sunt autem iure minus totam velit?
                Aut, eligendi.
              </div>
              <Button className="get-started-button">Get started</Button>
            </div>
          </Col>

          <Col lg={12}>
            <Fade right>
              <div className="image-container">
                <img src={homeSection} alt="Video game" />
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
      <div className="marketplace-section">
        <h1 className="top-selling">TOP SELLING GAMER MARKETPLACES</h1>
        <p className="desc">
          PlayerAuctions is a platform that provides a secure player-to-player
          trading experience for buyers and sellers of online gaming products.
          We provide a system for secure transactions – you do the rest. We have
          marketplaces for 250+ games and leading titles, including the
          following:
        </p>
        <div className="slider-container">
          <Swiper {...params} className="swiper-div">
            <div className="item">
              <img src={SlideOne} alt="game" />
            </div>
            <div className="item">
              <img src={SlideTwo} alt="game" />
            </div>
            <div className="item">
              <img src={SlideThree} alt="game" />
            </div>
            <div className="item">
              <img src={SlideFour} alt="game" />
            </div>
            <div className="item">
              <img src={SlideFive} alt="game" />
            </div>
          </Swiper>
        </div>
      </div>
      <div className="how-it-works-section">
        <div>
          <Row>
            <Col></Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
