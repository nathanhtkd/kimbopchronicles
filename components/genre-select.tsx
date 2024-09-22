"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface IconProps extends React.SVGProps<SVGSVGElement> {}

interface GenreSelectProps {
  setStep: (step: number) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}

export default function GenreSelect({ setStep, selectedGenre, setSelectedGenre }: GenreSelectProps) {
  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(""); // Deselect the genre if it's clicked again
    } else {
      setSelectedGenre(genre); // Select the new genre
    }
  }

  const handleContinue = () => {
    console.log("Selected genre:", selectedGenre);
    setStep(3);
  }

  return (
    <div>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>What genre interests you?</CardTitle>
          <CardDescription>Select the music genre you'd like to receive in your daily audio digest.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedGenre === "hiphop/rap" ? "default" : "outline"}
              onClick={() => handleGenreSelect("hiphop/rap")}
            >
              <MicIcon className="mr-2 h-5 w-5" />
              Hip-Hop/Rap
            </Button>
            <Button
              variant={selectedGenre === "indie folk" ? "default" : "outline"}
              onClick={() => handleGenreSelect("indie folk")}
            >
              <GuitarIcon className="mr-2 h-5 w-5" />
              Indie Folk
            </Button>
            <Button
              variant={selectedGenre === "reggae" ? "default" : "outline"}
              onClick={() => handleGenreSelect("reggae")}
            >
              <HeadphonesIcon className="mr-2 h-5 w-5" />
              Reggae
            </Button>
            <Button
              variant={selectedGenre === "acoustic singer-songwriter" ? "default" : "outline"}
              onClick={() => handleGenreSelect("acoustic singer-songwriter")}
            >
              <MicIcon className="mr-2 h-5 w-5" />
              Acoustic
            </Button>
            <Button
              variant={selectedGenre === "alt rock" ? "default" : "outline"}
              onClick={() => handleGenreSelect("alt rock")}
            >
              <GuitarIcon className="mr-2 h-5 w-5" />
              Alt Rock
            </Button>
            <Button
              variant={selectedGenre === "progressive rock" ? "default" : "outline"}
              onClick={() => handleGenreSelect("progressive rock")}
            >
              <HeadphonesIcon className="mr-2 h-5 w-5" />
              Progressive Rock
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => setStep(1)}>
            Back
          </Button>
          <Button type="submit" onClick={handleContinue}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function GuitarIcon(props: IconProps) {
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
      <path d="m20 7 1.7-1.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0L17 4v3Z" />
      <path d="m17 7-5.1 5.1" />
      <circle cx="11.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M6 12a2 2 0 0 0 1.8-1.2l.4-.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4" />
      <path d="m6 16 2 2" />
    </svg>
  )
}

function HeadphonesIcon(props: IconProps) {
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
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

function MicIcon(props: IconProps) {
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}
