import { CreateMLCEngine, InitProgressReport } from "@mlc-ai/web-llm";

export const initializeAndGetEngine = async () => {
    const newEngine = await CreateMLCEngine(
      "Qwen2-1.5B-Instruct-q4f16_1-MLC",
      { initProgressCallback: (report: InitProgressReport) => {
        console.log("Loading model:", report);
      } },
    );

    return newEngine;
  };