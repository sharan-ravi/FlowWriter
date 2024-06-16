import { useState, useEffect } from 'react';
import { CreateMLCEngine, InitProgressReport, MLCEngine } from '@mlc-ai/web-llm';
import { chatConfig } from '../utils';

const initializeAndGetEngine = async (onProgressUpdate: (progress: number) => void) => {
  const newEngine = await CreateMLCEngine(
    "Qwen2-1.5B-Instruct-q4f16_1-MLC",
    {
      initProgressCallback: (report: InitProgressReport) => {
        console.log("Loading model:", report);
        onProgressUpdate(report.progress); // Update progress via callback
      }
    },
    chatConfig
  );

  return newEngine;
};

export const useMLCEngine = () => {
  const [engine, setEngine] = useState<MLCEngine | null>(null);
  const [progress, setProgress] = useState<number>(0); // State to track the progress

  useEffect(() => {
    const initializeEngine = async () => {
      const newEngine = await initializeAndGetEngine(setProgress);
      setEngine(newEngine);
    };

    initializeEngine();
  }, []);

  return { engine, progress }; // Return both engine and progress
};
