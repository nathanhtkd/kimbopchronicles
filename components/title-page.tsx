"use client";

import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import lottie from "lottie-web";

interface TitlePageProps {
  setStep: (step: number) => void;
}

export default function TitlePage({ setStep }: TitlePageProps) {
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const animation = lottie.loadAnimation({
        container: animationContainer.current!,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/kimbop.json", // Ensure the path is correct and accessible
      });

      return () => animation.destroy();
    }
  }, []);

  return (
    <Card className="mx-auto max-w-xl p-6 bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-400 to-gray-700 text-transparent bg-clip-text">
          Welcome to KimBOP Chronicles!
        </CardTitle>
        <p className="text-gray-600 text-lg">
          A fun, fresh way to get your personalized daily audio summaries. Just like Kimbap, we wrap up your favorite news and serve it with a dash of flavor!
        </p>
      </CardHeader>

      <CardContent className="mt-4 flex justify-center">
        <div ref={animationContainer} style={{ height: "300px", width: "300px" }}></div>
      </CardContent>

      <CardFooter className="mt-4 flex justify-center">
        <Button onClick={() => setStep(1)} className="px-8 py-3 text-lg">
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
