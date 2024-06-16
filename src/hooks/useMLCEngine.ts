import { useState, useEffect } from 'react';
import { CreateMLCEngine, InitProgressReport, MLCEngine } from '@mlc-ai/web-llm';

const initializeAndGetEngine = async () => {
  const newEngine = await CreateMLCEngine(
    "Qwen2-1.5B-Instruct-q4f16_1-MLC",
    {
      initProgressCallback: (report: InitProgressReport) => {
        console.log("Loading model:", report);
      }
    }
  );

  return newEngine;
};

export const useMLCEngine = () => {
  const [engine, setEngine] = useState<MLCEngine | null>(null);

  useEffect(() => {
    const initializeEngine = async () => {
      const newEngine = await initializeAndGetEngine();
      setEngine(newEngine);
    };

    initializeEngine();
  }, []);

  return engine;
};
