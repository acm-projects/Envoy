import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import './styles/Marquis.css'

const marqueeTexts = [
  "Envoy",
  "使者",
  "посланник",
  "مبعوث",
  "特使",
  "ਰਾਜਦੂਤ",
  "రాయబారి",
  "ایلچی",
  "Legatus",
  "πρέσβυς",
  "Envoy",
  "使者",
  "посланник",
  "مبعوث",
  "特使",
  "ਰਾਜਦੂਤ",
  "రాయబారి",
  "ایلچی",
  "Legatus",
  "πρέσβυς"
];

const Marquee = () => {
  const marqueeElements = useRef([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const marqueeTween = useRef();

  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      marqueeTween.pause().kill();
    };
  }, []);

  useEffect(() => {
    marqueeInitialSet();
    marqueeTween.current && marqueeTween.current.pause().kill();
    marqueeTween.current = gsap.to(marqueeElements.current, {
      x: `+=${screenWidth * 1.5}`,
      ease: "none",
      repeat: -1,
      duration: 200,
      rotation: 30,
      modifiers: {
        x: (x) => {
          return (parseFloat(x) % (screenWidth * 1.5)) + "px";
        }
      }
    });
  }, [screenWidth]);

  const marqueeInitialSet = () => {
    gsap.set(marqueeElements.current, {
      xPercent: -10,
      x: function (index) {
        return (screenWidth / 2) * index;
      }
    });
  };

  const resizeHandler = () => {
    gsap.set(marqueeElements.current, { clearProps: "all" });
    setScreenWidth(window.innerWidth);
  };

  const marqueeElementsRefHandler = (e, i) => {
    marqueeElements.current[i] = e;
  };

  const renderMarqueeElements = () => {
    if (marqueeTexts.length === 1) {
      marqueeTexts[2] = marqueeTexts[1] = marqueeTexts[0];
    }
    if (marqueeTexts.length === 2) {
      marqueeTexts[2] = marqueeTexts[0];
    }
    return marqueeTexts.map((e, i) => (
      <p
        className=" text-center px-4 text-2xl font-semibold absolute pin-l w-1/2"
        key={`marquee-${i}`}
        ref={(el) => marqueeElementsRefHandler(el, i)}
      >
        {e}
      </p>
    ));
  };
  return (
    <div
      className=" relative w-screen mt-8 py-4 bg-green-600 text-gray-200 flex overflow-hidden items-center"
      style={{ minHeight: "110px" }}
    >
      {renderMarqueeElements()}
    </div>
  );
};

export default Marquee;