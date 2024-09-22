"use client";

import { useState, useEffect } from "react";
import LyricsModal from "@/components/ui/lyrics-modal";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AudioCard from "@/components/ui/audio-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel"


interface AudioFeedProps {
  setStep: (step: number) => void;
  audioData: any[];
}

export default function AudioFeed({
  audioData,
  setStep,
}: AudioFeedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLyrics, setSelectedLyrics] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleLyricsClick = (lyrics: string) => {
    setSelectedLyrics(lyrics);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLyrics(null);
  };

  return (
    <>
      {isModalOpen && selectedLyrics && (
        <LyricsModal lyrics={selectedLyrics} onClose={handleCloseModal} />
      )}

<Card className="mx-auto w-full max-w-2xl mt-10 mb-10 bg-white shadow-xl rounded-lg border border-gray-200 p-6">
        <CardContent className="mt-8">
          
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold mb-6">KimBOPs</CardTitle>
          </CardHeader>

          <Carousel
            setApi={setApi}
            className="w-full max-w-xs mx-auto"
            orientation="horizontal"
          >
            <CarouselContent>
              {audioData.map((audio, index) => (
                <CarouselItem key={index}>
                  <AudioCard audio={audio} onLyricsClick={handleLyricsClick} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            Slide {current} of {count}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={() => setStep(3)}>Back</Button>
        </CardFooter>
      </Card>
    </>
  );
}
