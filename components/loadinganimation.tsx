"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LoadingAnimation = () => {
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: animationContainer.current!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/music.json", 
    });

    return () => animation.destroy(); // Cleanup when unmounted
  }, []);

  return (
    <div
      ref={animationContainer}
      style={{ width: 100, height: 100 }} // Adjust size based on your needs
    ></div>
  );
};

export default LoadingAnimation;
