import { useState, useEffect, useRef } from 'react';
import { useMLCEngine } from './useMLCEngine';

const processCompletion = (input: string, completion: string) => {
    // Check if the completion starts with the input
    if (completion.startsWith(input)) {
        // Remove the input part from the completion
        return completion.slice(input.length);
    }
    // If the completion does not start with the input, return it as is
    return completion;
}

const getLastNWords = (sentence: string, n: number = 20) => {
    const words = sentence.split(/\s+/);
    
    if (words.length <= n) {
        return words.join(' ');
    }
    
    const lastTwentyWords = words.slice(-n);
    
    return lastTwentyWords.join(' ');
}
 


const useDebouncedGenerateResponse = (initialText = '') => {
  const [text, setText] = useState(initialText);
  const [suggestion, setSuggestion] = useState('');
  const { engine, progress } = useMLCEngine();
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateResponse = async (input: string, signal: AbortSignal) => {
    if (engine) {
      const messages = [
        { role: "system", content: "Complete the following text with a maximum of five words that follow the given input." },
        { role: "user", content: input },
      ];

      try {
        const reply = await engine.chat.completions.create({ messages, signal });
        
        // Update suggestion if the request was not aborted
        if (!signal.aborted) {
          setSuggestion(processCompletion(getLastNWords(input), reply.choices[0].message.content));
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
    progress
  };
};

export default useDebouncedGenerateResponse;
