import { useRef, useEffect, useState } from 'react';
import useDebouncedGenerateResponse from './hooks/useDebouncedGenerateResponse';

function App() {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const displayDivRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');

  const { suggestion, setModelInputText, clearSuggestion } = useDebouncedGenerateResponse();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab" && suggestion !== "") {
      event.preventDefault();
      const newText = text + suggestion;
      clearSuggestion();
      setText(newText);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = newText;
      }
    }
  };

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }

    setModelInputText(text);
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
