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
import guests from "../../../../assests/home/guests.svg";
import gamer from "../../../../assests/home/gamer.svg";
import investor from "../../../../assests/home/investor.svg";
import cardLogo from "../../../../assests/home/cardLogo.png";
import visaLogo from "../../../../assests/home/visaLogo.png";
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
              <img src={SlideOne} alt="Game" />
            </div>
            <div className="item">
              <img src={SlideTwo} alt="Game" />
            </div>
            <div className="item">
              <img src={SlideThree} alt="Game" />
            </div>
            <div className="item">
              <img src={SlideFour} alt="Game" />
            </div>
            <div className="item">
              <img src={SlideFive} alt="Game" />
            </div>
          </Swiper>
        </div>
      </div>
      <div className="how-it-works-section">
        <div className="section-title">HOW IT WORKS?</div>
        <Row container>
          <Col span={8}>
            <div className="role-div">
              <div className="role-title">INVESTORS</div>
              <div className="role-img-div">
                <img src={investor} alt="Investors" />
              </div>
              <div className="role-des">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore
                eveniet omnis beatae in tenetur at dolores nemo, error dolore
                eos saepe fugiat, optio ipsum cupiditate consectetur
                perspiciatis atque quia quibusdam.
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="role-div">
              <div className="role-title">Gamers</div>
              <div className="role-img-div">
                <img src={gamer} alt="Gamer" />
              </div>
              <div className="role-des">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore
                eveniet omnis beatae in tenetur at dolores nemo, error dolore
                eos saepe fugiat, optio ipsum cupiditate consectetur
                perspiciatis atque quia quibusdam.
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="role-div">
              <div className="role-title">Guests</div>
              <div className="role-img-div">
                <img src={guests} alt="Guests" />
              </div>
              <div className="role-des">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore
                eveniet omnis beatae in tenetur at dolores nemo, error dolore
                eos saepe fugiat, optio ipsum cupiditate consectetur
                perspiciatis atque quia quibusdam.
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="about-us-section">
        <div className="about-us-title">About us</div>
        <div className="about-content">
          <div className="about-content-title">
            TRADE GAMING ACCOUNTS AND BOOST YOUR GAMEPLAY
          </div>
          <div className="about-content-des">
            Join our community of gamers who are using our marketplace fortunes
            buy and sell their gaming accounts
          </div>
          <div className="cash-accounts">
            <img src={cardLogo} alt="master card" />
            <img src={visaLogo} alt="visa card" />
          </div>
        </div>
        <div className="about-content">
          <div className="about-content-title">FIND A SUITABLE INVESTOR</div>
          <div className="about-content-des">
            Join our community of gamers who are using our marketplace fortunes
            buy and sell their gaming accounts
          </div>
        </div>
        <div className="about-content">
          <div className="about-content-title">
            WE PROVIDE THE FACILITY OF PUBLIC FUNDING
          </div>
          <div className="about-content-des">
            Join our community of gamers who are using our marketplace fortunes
            buy and sell their gaming accounts
          </div>
        </div>
        <div className="about-content">
          <div className="about-content-title">MARKETPLACE FEATURES</div>
          <div className="about-content-des">
            Join our community of gamers who are using our marketplace fortunes
            buy and sell their gaming accounts
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
