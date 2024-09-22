"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface OnboardingProps {
  setStep: (step: number) => void;
  selectedTopics?: string[];
  setSelectedTopics: (topics: string[]) => void;
}

export default function Onboarding({ setStep, selectedTopics = [], setSelectedTopics }: OnboardingProps) {
  const [customTopic, setCustomTopic] = useState<string>("");

  useEffect(() => {
    console.log("Selected topics updated:", selectedTopics);
  }, [selectedTopics]);

  const handleTopicSelect = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleContinue = () => {
    if (customTopic.trim() !== "") {
      console.log("Custom topic:", customTopic.trim());
      const newTopics = [...selectedTopics, customTopic.trim()]; // Directly create new array
      setSelectedTopics(newTopics);
      console.log("Selected topics:", newTopics);
    }
    setStep(2);
  };

  return (
        <div>
          <Card className="mx-auto max-w-md">
            <CardHeader>
            <CardTitle>What topics interest you?</CardTitle>
            <CardDescription>Select the news categories you'd like to receive in your daily audio digest.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedTopics.includes("technology") ? "default" : "outline"}
                onClick={() => handleTopicSelect("technology")}
              >
                <LaptopIcon className="mr-2 h-5 w-5" />
                Technology
              </Button>
              <Button
                variant={selectedTopics.includes("finance") ? "default" : "outline"}
                onClick={() => handleTopicSelect("finance")}
              >
                <DollarSignIcon className="mr-2 h-5 w-5" />
                Finance
              </Button>
              <Button
                variant={selectedTopics.includes("entertainment") ? "default" : "outline"}
                onClick={() => handleTopicSelect("entertainment")}
              >
                <FilmIcon className="mr-2 h-5 w-5" />
                Entertainment
              </Button>
              <Button
                variant={selectedTopics.includes("politics") ? "default" : "outline"}
                onClick={() => handleTopicSelect("politics")}
              >
                <PodcastIcon className="mr-2 h-5 w-5" />
                Politics
              </Button>
              <Button
                variant={selectedTopics.includes("health") ? "default" : "outline"}
                onClick={() => handleTopicSelect("health")}
              >
                <HeartIcon className="mr-2 h-5 w-5" />
                Health & Wellness
              </Button>
              <Button
                variant={selectedTopics.includes("science") ? "default" : "outline"}
                onClick={() => handleTopicSelect("science")}
              >
                <BeakerIcon className="mr-2 h-5 w-5" />
                Science
              </Button>
              <div className="col-span-2">
                <Input type="text" 
                  placeholder="Enter a custom topic" 
                  className="w-full" 
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="submit" onClick={handleContinue}>Continue</Button>
          </CardFooter>
        </Card>
      </div>
  )
}
// icons.tsx
function BeakerIcon(props : React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 3h15" />
      <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>
  )
}

function DollarSignIcon(props : React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function FilmIcon(props : React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  )
}


function HeartIcon(props : React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function LaptopIcon(props : React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  )
}

function PodcastIcon(props : React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.85 18.58a9 9 0 1 0-9.7 0" />
      <path d="M8 14a5 5 0 1 1 8 0" />
      <circle cx="12" cy="11" r="1" />
      <path d="M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z" />
    </svg>
  )
}
