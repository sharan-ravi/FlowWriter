import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.scss';
import useDebouncedGenerateResponse from '../hooks/useDebouncedGenerateResponse';
import _ from 'lodash';

const Editor = () => {
    const [text, setText] = useState('');
    const quillRef = useRef<any>(null);

    // Custom hook to manage suggestions and input text
    const { suggestion, setModelInputText, clearSuggestion } = useDebouncedGenerateResponse();
    const debouncedSetModelInputText = useMemo(
        () => _.debounce(setModelInputText, 1500),
        [setModelInputText]
    );

    // Effect for handling suggestions
    useEffect(() => {
        if (quillRef.current && suggestion) {
            const quillEditor = quillRef.current.getEditor();
            const range = quillEditor.getSelection();
            if (range) {
                quillEditor.deleteText(range.index, suggestion.length);
                quillEditor.formatText(range.index, suggestion.length, 'color', 'gray');
                quillEditor.formatText(range.index, suggestion.length, 'opacity', '0.5');
                quillEditor.insertText(range.index, suggestion, 'color', 'gray');
                quillEditor.setSelection(range.index, 0);
            }
        }
    }, [suggestion]);

    // Remove the 'gray' attribute from text (discard suggestion)
    const discardSuggestion = () => {
        if (quillRef.current) {
            const quillEditor = quillRef.current.getEditor();
            const range = quillEditor.getSelection();
            const newContents = quillEditor.getContents().ops.filter(op => !(op.attributes && op.attributes.color === 'gray'));
            quillEditor.setContents({ ops: newContents }, 'silent');
            if (range) {
                quillEditor.setSelection(range.index, range.length, 'silent');
            }
            return quillEditor.getText().trim();
        }
        return '';
    };

    // Accept suggestion by removing the 'gray' attribute
    const acceptSuggestion = () => {
        if (quillRef.current) {
            const quillEditor = quillRef.current.getEditor();
            const newContents = quillEditor.getContents().ops.map(op => {
                if (op.attributes && op.attributes.color === 'gray') {
                    let { color, ...otherAttrs } = op.attributes;  // Destructure to omit the color attribute
                    return { ...op, attributes: otherAttrs };
                }
                return op;
            });
            quillEditor.setContents({ ops: newContents }, 'silent');  // Update contents silently
            quillEditor.setSelection(quillEditor.getLength(), 0);  // Move cursor to the end
        }
    };


    // Event handler for Tab key
    const handleTabPress = () => {
        if (suggestion) {
            acceptSuggestion();
            clearSuggestion();
        }
    };

    // Get plain text from Quill editor
    const getPlainText = () => {
        return quillRef.current ? quillRef.current.getEditor().getText() : '';
    };

    // Update plain text state and potentially model input text
    useEffect(() => {
        const plainText = getPlainText();
        if (!suggestion) {
            debouncedSetModelInputText(plainText);
        }
    }, [text, suggestion]);

    // Effect to adjust Quill's keyboard bindings
    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (quill?.getModule('keyboard')) {
            delete quill.getModule('keyboard').bindings['Tab'];
            delete quill.getModule('keyboard').bindings["9"];
        }
    }, []);

    return (
        <ReactQuill
            ref={quillRef}
            theme="snow"
            value={text}
            onChange={setText}
            onKeyDown={(e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    handleTabPress();
                } else if (suggestion) {
                    discardSuggestion();
                    clearSuggestion();
                }
            }}
        />
    );
};

export default Editor;
