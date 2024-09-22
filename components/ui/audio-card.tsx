"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AudioCardProps {
  audio: any;
  onLyricsClick: (lyrics: string) => void;
}

export default function AudioCard({ audio, onLyricsClick }: AudioCardProps) {
  return (
    <div
      className="bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 flex flex-col items-center w-full border border-gray-300"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{audio.topic}</h3>
      <img
        src={audio.avatar_image_url}
        alt={`${audio.topic} related image`}
        className="mb-4 rounded-md object-cover w-[360px] h-[360px] shadow-md border border-gray-200"
      />
      <div className="relative">
        <p
          className="text-blue-500 hover:underline transition duration-150 ease-in-out block mb-2 text-center text-sm font-semibold cursor-pointer"
          onClick={() => onLyricsClick(audio.lyrics)}
        >
          View Full Lyrics
        </p>
      </div>

      <audio controls src={audio.audio_url} className="mb-4 w-full rounded-lg border-blue-200" />

      <div className="w-full">
        {audio.news_sources.map((linkObj: any, linkIndex: number) => (
          <a
            key={linkIndex}
            href={linkObj.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline transition duration-150 ease-in-out block mb-2 text-center text-sm font-semibold"
          >
            {linkObj.title}
          </a>
        ))}
      </div>
    </div>
  );
}
