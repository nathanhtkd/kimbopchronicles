import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// Defining the prop type for AudioSummaryComponent
interface AudioSummaryProps {
  selectedTopics: string[]
}

// Simulate an audio service for a given topic
const fetchAudioSummary = async (topic: string): Promise<string> => {
  console.log(`Fetching audio for topic: ${topic}`)
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API delay
  return `https://samplelib.com/lib/preview/mp3/sample-3s.mp3` // Simulate different audio
}

export default function AudioSummaryComponent({ selectedTopics }: AudioSummaryProps) {
  const [selected, setSelected] = useState<string[]>(selectedTopics) // Track which topics are selected
  const [audioUrls, setAudioUrls] = useState<{ topic: string; url: string }[]>([]) // Store audio URLs
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleToggleTopic = (topic: string) => {
    if (selected.includes(topic)) {
      setSelected(selected.filter((t) => t !== topic)) // Deselect the topic
    } else {
      setSelected([...selected, topic]) // Select the topic
    }
  }

  const handleFetchAudio = async () => {
    setIsLoading(true)
    
    try {
      // Send a GET request to the FastAPI generate_audio endpoint
      const response = await fetch('/api/py/generate_audio', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log(data)
      //setAudioMessage(data.message)  // Store the message returned by FastAPI
    } catch (error) {
      console.error("Error fetching audio:", error)
    }

    const fetchedAudio: { topic: string; url: string }[] = []

    for (const topic of selected) {
      const audioUrl = await fetchAudioSummary(topic)
      fetchedAudio.push({ topic, url: audioUrl })
    }

    setAudioUrls(fetchedAudio)
    setIsLoading(false)
  }

  return (
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
              onCheckedChange={() => handleToggleTopic(topic)}
              id={topic}
            />
            <label htmlFor={topic} className="text-gray-700">
              {topic}
            </label>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={handleFetchAudio} disabled={isLoading || selected.length === 0}>
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </CardFooter>

      {audioUrls.length > 0 && (
        <CardContent className="mt-4">
          <CardTitle>Audio Feed</CardTitle>
          <div className="grid gap-4">
            {audioUrls.map((audio, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-md">
                <h3 className="text-lg font-semibold">{audio.topic}</h3>
                <audio controls src={audio.url} />
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
