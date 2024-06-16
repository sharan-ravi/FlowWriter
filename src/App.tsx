import { useState, useEffect, useRef } from 'react';
import { CreateMLCEngine, InitProgressReport, MLCEngine } from '@mlc-ai/web-llm';
import { initializeAndGetEngine } from './utils/ai-utils';
import { useMLCEngine } from './hooks/useMLCEngine';

function App() {
  const [text, setText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const displayDivRef = useRef<HTMLDivElement>(null);

  const engine = useMLCEngine();

  const generateResponse = async (input: string) => {
    if (engine) {
      const messages = [
        { role: "system", content: "You are an expert in writing. Complete the following text as best you can. Only give the next 5 words in the input text." },
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textContent = event.target.value;
    setText(textContent);
    if (textContent) {
      generateResponse(textContent);
    } else {
      setSuggestion('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab" && suggestion !== "") {
      event.preventDefault();
      const newText = text + suggestion;
      setText(newText);
      setSuggestion('');
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = newText;
      }
    }
  };

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [text]);

  return (
    <div className="bg-gray-900 h-screen flex items-center justify-center relative">
      <div
        ref={displayDivRef}
        className="w-full h-full bg-transparent text-white resize-none outline-none p-16 border"
        onClick={() => hiddenInputRef.current && hiddenInputRef.current.focus()}
      >
        <span>{text}</span>
        {suggestion && <span className="text-gray-500">{suggestion}</span>}
      </div>
      <input
        ref={hiddenInputRef}
        type="text"
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 w-full h-full"
        style={{ top: 0, left: 0 }}
      />
    </div>
  );
}

export default App;
