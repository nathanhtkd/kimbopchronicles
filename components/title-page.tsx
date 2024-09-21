import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TitlePageProps {
  onStart: () => void
}

export default function TitlePage({ onStart }: TitlePageProps) {
  return (
    <Card className="mx-auto max-w-xl p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold mb-2">Welcome to Your Daily Audio Digest</CardTitle>
        <p className="text-gray-600 text-lg">Select your favorite topics and receive personalized audio summaries every day.</p>
      </CardHeader>

      <CardContent className="mt-4">
        <p className="text-lg text-center">Explore the latest news in the form of personalized audio updates.</p>
      </CardContent>

      <CardFooter className="mt-4 flex justify-center">
        <Button onClick={onStart} className="px-8 py-3 text-lg">
          Get Started
        </Button>
      </CardFooter>
    </Card>
  )
}
