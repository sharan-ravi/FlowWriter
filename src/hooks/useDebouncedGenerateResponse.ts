import { useState, useEffect, useRef } from 'react';
import { useMLCEngine } from './useMLCEngine';

const useDebouncedGenerateResponse = (initialText = '', delay = 1000) => {
  const [text, setText] = useState(initialText);
  const [suggestion, setSuggestion] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const engine = useMLCEngine();

  const generateResponse = async (input: string) => {
    if (engine) {
      const messages = [
        { role: "system", content: "You are an expert in writing. Complete the following text as best you can. Only give the next 5 words in the input text. Add space if needed." },
        { role: "user", content: input },
      ];

      try {
        const reply = await engine.chat.completions.create({ messages });
        console.log(reply.choices[0].message);
        console.log(reply.usage);

        setSuggestion(reply.choices[0].message.content);
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (text) {
        timeoutRef.current = setTimeout(() => {
          generateResponse(text);
        }, delay);
      } else {
        setSuggestion('');
      }
  }, [text]);

  return {
    text,
    suggestion,
    clearSuggestion: () => setSuggestion(''),
    setModelInputText: setText,
  };
};

export default useDebouncedGenerateResponse;
