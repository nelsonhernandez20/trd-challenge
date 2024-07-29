/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";
import Slider from "react-slick";

const Carousel = ({ images, width, height }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Deshabilita las flechas predeterminadas
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          top: "300px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#4B4B4B66",
            borderRadius: "30px",
            position: "relative",
            height: 35,
          }}
        >
          <button
            onClick={() => sliderRef.current.slickPrev()}
            style={{
              padding: "10px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.82375 0.944716L0.93875 4.82972C0.35375 5.41472 0.35375 6.35972 0.93875 6.94472L4.82375 10.8297C5.76875 11.7747 7.38875 11.0997 7.38875 9.76471V1.99472C7.38875 0.659716 5.76875 -0.000284135 4.82375 0.944716Z"
                fill="white"
              />
            </svg>
          </button>
          <ul
            style={{
              margin: "0",
              padding: "0",
              display: "flex",
              listStyle: "none",
            }}
          >
            {dots.map((dot, index) => (
              <li
                key={index}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 50,
                  backgroundColor: "#FFFFFF",
                }}
              >
                {dot}
              </li>
            ))}
          </ul>
          <button
            onClick={() => sliderRef.current.slickNext()}
            style={{
              padding: "10px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.565 10.8194L6.45 6.93436C7.035 6.34936 7.035 5.40436 6.45 4.81936L2.565 0.934356C1.62 0.00435624 0 0.664356 0 1.99936V9.75436C0 11.1044 1.62 11.7644 2.565 10.8194Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#333",
        }}
      />
    ),
  };

  return (
    <div className={`relative ${width} ${height}`}>
      <Slider ref={sliderRef} {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
