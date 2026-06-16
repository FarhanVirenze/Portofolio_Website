"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
  loop?: boolean;
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
}

export function Typewriter({
  words,
  loop = true,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
}: TypewriterProps) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let ticker: NodeJS.Timeout;

    const handleType = () => {
      if (!words || words.length === 0) return;
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      let delta = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && text === fullText) {
        delta = delayBetweenWords;
        setIsDeleting(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        delta = 500;
        if (!loop && loopNum === words.length - 1) {
          return; // Stop if not looping and reached the end
        }
      }

      ticker = setTimeout(handleType, delta);
    };

    ticker = setTimeout(handleType, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(ticker);
  }, [text, isDeleting, loopNum, words, loop, typeSpeed, deleteSpeed, delayBetweenWords]);

  return (
    <>
      <span>{text}</span>
      <span className="border-r-2 border-primary ml-1 animate-pulse"></span>
    </>
  );
}
