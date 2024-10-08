"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingAnimation from "./loadinganimation"; 
import mockApiResponse from "@/components/test-data.json";

interface AudioSummaryProps {
  setStep: (step: number) => void;
  selectedTopics: string[];
  selectedGenre: string;
  setAudioData: (data: any[]) => void;
}

export default function AudioSummaryComponent({ setStep, selectedTopics, selectedGenre, setAudioData }: AudioSummaryProps) {
  const [selected, setSelected] = useState<string[]>(selectedTopics); // Track which topics are selected
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sentiment, setSentiment] = useState<string>("neutral");

  const handleToggleTopic = (topic: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(topic)
        ? prevSelected.filter((t) => t !== topic) 
        : [...prevSelected, topic] 
    );
  };

  const handleFetchAudio = async () => {
    setIsLoading(true);

    try {
      console.log("Fetching audio...");

      const response = await fetch("/api/helloNextJs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topics: selectedTopics,
          genre: selectedGenre, 
          sentiment_preference: sentiment,
        }),
      });

      const data = await response.json();
      console.log(data);

      setAudioData(data.data);

      // console.log(mockApiResponse)
      // setAudioData(mockApiResponse.data);

      setStep(4);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-lg flex items-center flex-col">
            <span className="text-lg font-semibold mb-4">Generating...</span>
            <LoadingAnimation />
          </div>
        </div>
      )}
  
      <Card className="mx-auto max-w-xl bg-white shadow-xl rounded-lg border border-gray-200 p-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">Selected Topics</CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-2">
            Select or deselect the topics for which you want to generate an audio summary.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {selectedTopics.map((topic, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(topic)}
                onCheckedChange={() => handleToggleTopic(topic)} // Update selected topics
                id={topic}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label htmlFor={topic} className="text-gray-700 text-lg">
                {topic}
              </label>
            </div>
          ))}
        </CardContent>
  
        <CardContent className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Selected Genre</h3>
          {selectedGenre ? (
            <p className="text-gray-600 text-base">{selectedGenre}</p>
          ) : (
            <p className="text-gray-500 text-base italic">No genre selected</p>
          )}
        </CardContent>

        <CardContent className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Select Sentiment</h3>
          <CardDescription className="text-sm text-gray-500 mt-2 mb-2">
            Choose the type of sentiment you'd like to see reflected in your audio summary: positive, neutral, or negative.
          </CardDescription>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="positive"
                name="sentiment"
                value="positive"
                checked={sentiment === "positive"}
                onChange={() => setSentiment("positive")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <label htmlFor="positive" className="ml-2 text-gray-700 text-lg">
                Positive
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="neutral"
                name="sentiment"
                value="neutral"
                checked={sentiment === "neutral"}
                onChange={() => setSentiment("neutral")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <label htmlFor="neutral" className="ml-2 text-gray-700 text-lg">
                Neutral
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="negative"
                name="sentiment"
                value="negative"
                checked={sentiment === "negative"}
                onChange={() => setSentiment("negative")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <label htmlFor="negative" className="ml-2 text-gray-700 text-lg">
                Negative
              </label>
            </div>
          </div>
        </CardContent>
  
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => setStep(2)}
            >
            Back
          </Button>
          <Button
            onClick={handleFetchAudio}
            disabled={isLoading || selected.length === 0}
            className={`px-6 py-2 rounded-md ${
              selected.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : ""
            }`}
          >
            Generate
          </Button>
        </CardFooter>
      </Card>
    </>
  );
  
}
