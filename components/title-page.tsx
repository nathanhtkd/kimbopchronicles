import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TitlePageProps {
  onStart: () => void
}

export default function TitlePage({ onStart }: TitlePageProps) {
  return (
    <Card className="mx-auto max-w-xl p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold mb-2">Welcome to KimBOPChronicles</CardTitle>
        <p className="text-gray-600 text-lg">A fun, fresh way to get your personalized daily audio summaries. Just like Kimbap, we wrap up your favorite news and serve it with a dash of flavor!</p>
      </CardHeader>

      <CardContent className="mt-4">
        <p className="text-lg text-center">Explore the latest headlines wrapped in personalized audio snippets, curated just for you. Inspired by the Korean rice snack Kimbap, we roll your favorite topics into bite-sized updates!</p>
      </CardContent>

      <CardFooter className="mt-4 flex justify-center">
        <Button onClick={onStart} className="px-8 py-3 text-lg">
          Get Started
        </Button>
      </CardFooter>
    </Card>
  )
}
