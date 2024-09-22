import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingAnimation from "./loadinganimation"; 

interface AudioSummaryProps {
  setStep: (step: number) => void;
  selectedTopics: string[];
  selectedGenre: string;
}

export default function AudioSummaryComponent({ setStep, selectedTopics, selectedGenre }: AudioSummaryProps) {
  const [selected, setSelected] = useState<string[]>(selectedTopics); // Track which topics are selected
  const [audioData, setAudioData] = useState<any[]>([]); // Store audio data
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      // Simulate a 5-second delay
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await fetch("/api/py/generate_audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedTopics: selected, selectedGenre }), // Send updated topics
      });
      const data = await response.json();
      console.log("Audio data:", data);
      setAudioData(data.data);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Modal Popup for Loading */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg flex items-center flex-col">
            <span className="text-lg font-semibold mb-4">Generating...</span>
            <LoadingAnimation />
          </div>
        </div>
      )}

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Selected Topics</CardTitle>
          <CardDescription>Select or deselect the topics for which you want to generate an audio summary.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-2">
          {selectedTopics.map((topic, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(topic)}
                onCheckedChange={() => handleToggleTopic(topic)} // Update selected topics
                id={topic}
              />
              <label htmlFor={topic} className="text-gray-700">
                {topic}
              </label>
            </div>
          ))}
        </CardContent>

        <CardContent>
          <h3 className="text-lg font-semibold">Selected Genre</h3>
          {selectedGenre ? (
            <p className="text-gray-600 mb-4">{selectedGenre}</p>
          ) : (
            <p className="text-gray-600 mb-4">No genre selected</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button onClick={() => setStep(2)}>Back</Button>
          <Button onClick={handleFetchAudio} disabled={isLoading || selected.length === 0}>
            Generate
          </Button>
        </CardFooter>

        {audioData.length > 0 && (
          <CardContent className="mt-8">
            <CardTitle className="text-center text-2xl font-bold mb-6">Audio Feed</CardTitle>
            <div className="grid gap-6">
              {audioData.map((audio, index) => (
                <div key={index} className="bg-white shadow-lg rounded-md p-6 flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{audio.topic}</h3>
                  <img
                    src={audio.imgUrl}
                    alt={`${audio.topic} related image`}
                    className="mb-4 rounded-md w-full object-cover max-h-48"
                  />
                  <p className="mb-4 text-gray-600 text-center">{audio.lyrics}</p>
                  <audio controls src={audio.mp3} className="mb-4 w-full" />
                  <div className="w-full">
                    {audio.articleLink?.map((link: string, linkIndex: number) => (
                      <a key={linkIndex} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline block mb-2 text-center">
                        Read More {linkIndex + 1}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
}
