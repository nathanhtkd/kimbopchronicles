"use client";

import { useState } from "react";
import TitlePage from "@/components/title-page";
import Onboarding from "@/components/onboarding";
import GenreSelect from "@/components/genre-select";
import AudioSummary from "@/components/audio-summary";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1); // Step management at the top level
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>(""); 

  const handleStart = () => {
    setStarted(true);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Onboarding
            setStep={setStep}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
        );
      case 2:
        return (
          <GenreSelect
            setStep={setStep}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />
        );
      case 3:
        return (
          <AudioSummary
            setStep={setStep}
            selectedTopics={selectedTopics}
            selectedGenre={selectedGenre}
          />
        );
      default:
        return <TitlePage onStart={handleStart} />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {!started ? (
        <TitlePage onStart={handleStart} />
      ) : (
        renderStep()
      )}
    </div>
  );
}
