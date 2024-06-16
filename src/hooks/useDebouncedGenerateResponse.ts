import { useState, useEffect, useRef } from 'react';
import { useMLCEngine } from './useMLCEngine';

const useDebouncedGenerateResponse = (initialText = '') => {
  const [text, setText] = useState(initialText);
  const [suggestion, setSuggestion] = useState('');
  const engine = useMLCEngine();
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateResponse = async (input: string, signal: AbortSignal) => {
    if (engine) {
      const messages = [
        { role: "system", content: "Utilize your expertise in writing to generate exactly five words that follow the given input, ensuring they are a direct continuation of the provided text. Do not repeat any part of the input in your response. Include appropriate spacing and punctuation as necessary to maintain grammatical integrity." },
        { role: "user", content: input },
      ];

      try {
        const reply = await engine.chat.completions.create({ messages, signal });
        
        // Update suggestion if the request was not aborted
        if (!signal.aborted) {
          setSuggestion(reply.choices[0].message.content);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Request failed:', error);
        }
      }
    }
  };

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (text) {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      generateResponse(text, abortController.signal);
    } else {
      setSuggestion('');
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [text]);

  return {
    text,
    suggestion,
    clearSuggestion: () => setSuggestion(''),
    setModelInputText: setText,
  };
};

export default useDebouncedGenerateResponse;
