import { useRef, useEffect, useState } from 'react';
import useDebouncedGenerateResponse from './hooks/useDebouncedGenerateResponse';
import Editor from './components/Editor';

function App() {

  useEffect(() => {
    document.getElementById('my_modal_1')!.showModal()
  }, [])

  return (
    <div className="bg-gray-900 h-screen flex items-center justify-center relative">
       <Editor />
    </div>
  );
}

export default App;
