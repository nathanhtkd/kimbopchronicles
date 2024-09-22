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
      style={{ width: 150, height: 150 }}
    ></div>
  );
};

export default LoadingAnimation;
