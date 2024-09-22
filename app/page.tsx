"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TitlePage from "@/components/title-page";
import Onboarding from "@/components/onboarding";
import GenreSelect from "@/components/genre-select";
import AudioSummary from "@/components/audio-summary";
import AudioFeed from "@/components/audio-feed";

export default function Home() {
  const [step, setStep] = useState(0); // Start with step 0 for TitlePage
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [audioData, setAudioData] = useState<any[]>([]);

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <TitlePage setStep={(newStep) => handleStepChange(newStep)} />;
      case 1:
        return (
          <Onboarding
            setStep={(newStep) => handleStepChange(newStep)}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
        );
      case 2:
        return (
          <GenreSelect
            setStep={(newStep) => handleStepChange(newStep)}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />
        );
      case 3:
        return (
          <AudioSummary
            setStep={(newStep) => handleStepChange(newStep)}
            selectedTopics={selectedTopics}
            selectedGenre={selectedGenre}
            setAudioData={setAudioData}
          />
        );
      case 4:
        return audioData.length > 0 ? (
          <AudioFeed
            setStep={(newStep) => handleStepChange(newStep)}
            audioData={audioData}
          />
        ) : (
          <div className="text-center text-gray-500">No audio data available</div>
        );
      default:
        return <TitlePage setStep={(newStep) => handleStepChange(newStep)} />;
    }
  };

  // Neutral animation with fading and slight scaling
  const getMotionProps = () => {
    return {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.5 }, // Smooth fading and scaling transition
    };
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={`step-${step}`} {...getMotionProps()}>
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
