"use client"

import { useState } from "react"
import TitlePage from "@/components/title-page"
import Onboarding from "@/components/onboarding"

import Link from "next/link";

export default function Home() {
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    setStarted(true)
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center min-h-screen">
        {!started ? (
          <TitlePage onStart={handleStart} />
        ) : (
          <Onboarding />
        )}
      </div>
      {/* <div>
            <Link href="/api/py/helloFastApi">
              <code className="font-mono font-bold">api/index.py</code>
            </Link>
            <Link href="/api/helloNextJs">
              <code className="font-mono font-bold">app/api/helloNextJs</code>
            </Link>
      </div> */}
    </div>
  );
}
