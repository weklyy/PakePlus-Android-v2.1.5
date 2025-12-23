
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { safeEvaluate, insertAtCursor, deleteAtCursor } from '../utils/mathUtils';
import { HistoryItem, KeyType, SavedRecord } from '../types';

interface CalculatorOptions {
  onResultReady?: (result: string) => void;
}

export const useCalculator = (options?: CalculatorOptions) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [isTextMode, setIsTextMode] = useState(false);
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const lastResultRef = useRef<string | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem('calc_saved_records');
    if (localData) {
      setSavedRecords(JSON.parse(localData));
    }
  }, []);

  const recordState = useCallback((text: string) => {
    setUndoStack(prev => {
      if (prev.length > 0 && prev[prev.length - 1] === text) return prev;
      return [...prev, text];
    });
    setRedoStack([]);
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef) {
      inputRef.focus();
      if (!isTextMode) {
        setTimeout(() => {
          inputRef.setSelectionRange(cursorPos, cursorPos);
        }, 0);
      }
    }
  }, [inputRef, cursorPos, isTextMode]);

  const saveCurrentSession = useCallback((title: string) => {
    if (history.length === 0) return alert('当前没有可保存的内容');
    const newRecord: SavedRecord = {
      id: Date.now().toString(),
      title: title.trim() || '未命名记录',
      date: new Date().toLocaleString(),
      items: [...history]
    };
    const updated = [newRecord, ...savedRecords];
    setSavedRecords(updated);
    localStorage.setItem('calc_saved_records', JSON.stringify(updated));
  }, [history, savedRecords]);

  const deleteRecord = useCallback((id: string) => {
    const updated = savedRecords.filter(r => r.id !== id);
    setSavedRecords(updated);
    localStorage.setItem('calc_saved_records', JSON.stringify(updated));
  }, [savedRecords]);

  const loadRecord = useCallback((record: SavedRecord) => {
    setHistory(record.items);
    setCurrentInput('');
  }, []);

  const shareContent = useCallback(async () => {
    if (history.length === 0) return alert('内容为空，无法分享');
    const textToShare = history.map(item => 
      item.type === 'CALCULATION' ? `${item.expression} = ${item.result}` : `[备注] ${item.text}`
    ).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: '我的计算笔记', text: textToShare });
      } catch (e) { console.error(e); }
    } else {
      await navigator.clipboard.writeText(textToShare);
      alert('计算结果已复制到剪贴板');
    }
  }, [history]);

  useEffect(() => {
    if (!isTextMode) {
      focusInput();
    }
  }, [currentInput, cursorPos, focusInput, isTextMode]);

  const handleInputCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (newVal !== currentInput) {
      recordState(currentInput);
    }
    setCurrentInput(newVal);
    setCursorPos(e.target.selectionStart || 0);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
    setCursorPos(e.currentTarget.selectionStart || 0);
  };

  const toggleTextMode = useCallback(() => {
    setIsTextMode(prev => !prev);
    setTimeout(() => inputRef?.focus(), 50);
  }, [inputRef]);

  const insertText = useCallback((text: string) => {
    recordState(currentInput);
    const insRes = insertAtCursor(currentInput, text, cursorPos);
    setCurrentInput(insRes.newText);
    setCursorPos(insRes.newCursorPos);
  }, [currentInput, cursorPos, recordState]);

  const handlePress = useCallback(async (value: string, type: KeyType) => {
    switch (value) {
      case 'ac':
        if (currentInput === '') {
          if (history.length > 0 && confirm('是否清空当前屏幕？')) {
            setHistory([]);
            lastResultRef.current = null;
            setUndoStack([]);
            setRedoStack([]);
          }
        } else {
          recordState(currentInput);
          setCurrentInput('');
          setCursorPos(0);
        }
        break;

      case 'backspace':
        if (currentInput === '') {
          if (history.length > 0) {
            const lastItem = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            const contentToRestore = lastItem.type === 'CALCULATION' ? (lastItem.expression || '') : (lastItem.text || '');
            setCurrentInput(contentToRestore);
            setCursorPos(contentToRestore.length);
            setUndoStack([]);
            setRedoStack([]);
          }
        } else {
          recordState(currentInput);
          const delRes = deleteAtCursor(currentInput, cursorPos);
          setCurrentInput(delRes.newText);
          setCursorPos(delRes.newCursorPos);
        }
        break;

      case 'undo':
        if (undoStack.length > 0) {
          const prevState = undoStack[undoStack.length - 1];
          setRedoStack(prev => [...prev, currentInput]);
          setUndoStack(prev => prev.slice(0, -1));
          setCurrentInput(prevState);
          setCursorPos(prevState.length);
        } else if (history.length > 0) {
          const lastItem = history[history.length - 1];
          const contentToRestore = lastItem.type === 'CALCULATION' ? lastItem.expression : lastItem.text;
          if (contentToRestore !== undefined) {
            setHistory(prev => prev.slice(0, -1));
            setCurrentInput(contentToRestore);
            setCursorPos(contentToRestore.length);
            setRedoStack([]);
          }
        }
        break;
      case 'redo':
        if (redoStack.length > 0) {
          const nextState = redoStack[redoStack.length - 1];
          setUndoStack(prev => [...prev, currentInput]);
          setRedoStack(prev => prev.slice(0, -1));
          setCurrentInput(nextState);
          setCursorPos(nextState.length);
        }
        break;
      case 'copy':
        const textToCopy = lastResultRef.current || currentInput;
        if (textToCopy) {
          try {
            await navigator.clipboard.writeText(textToCopy);
          } catch (err) { console.error(err); }
        }
        break;
      case 'paste':
        try {
          const clipboardText = await navigator.clipboard.readText();
          if (clipboardText) {
            recordState(currentInput);
            const pRes = insertAtCursor(currentInput, clipboardText, cursorPos);
            setCurrentInput(pRes.newText);
            setCursorPos(pRes.newCursorPos);
          }
        } catch (err) { console.error(err); }
        break;
      case 'left': setCursorPos(prev => Math.max(0, prev - 1)); break;
      case 'right': setCursorPos(prev => Math.min(currentInput.length, prev + 1)); break;
      case 'enter':
      case '=':
        if (!currentInput.trim()) break;
        let finalExpression = currentInput;
        if (/^[+×÷−\-*\/^%]/.test(currentInput) && lastResultRef.current) {
           finalExpression = lastResultRef.current + currentInput;
        }
        const calcResult = safeEvaluate(finalExpression);
        const newItem: HistoryItem = { id: Date.now().toString(), expression: finalExpression, result: calcResult, type: 'CALCULATION' };
        setHistory((prev) => [...prev, newItem]);
        if (calcResult !== 'Error') lastResultRef.current = calcResult;
        
        if (options?.onResultReady) {
          options.onResultReady(calcResult);
        }

        recordState(currentInput); 
        setCurrentInput('');
        setCursorPos(0);
        break;
      case 'parens':
        recordState(currentInput);
        const paRes = insertAtCursor(currentInput, '()', cursorPos);
        setCurrentInput(paRes.newText);
        setCursorPos(paRes.newCursorPos - 1);
        break;
      default:
        recordState(currentInput);
        const insRes = insertAtCursor(currentInput, value, cursorPos);
        setCurrentInput(insRes.newText);
        setCursorPos(insRes.newCursorPos);
        break;
    }
  }, [currentInput, cursorPos, history, undoStack, redoStack, recordState, options]);

  const handleAddText = useCallback(() => {
    if (currentInput.trim()) {
      const newItem: HistoryItem = { id: Date.now().toString(), text: currentInput, type: 'TEXT' };
      setHistory((prev) => [...prev, newItem]);
      recordState(currentInput);
      setCurrentInput('');
      setCursorPos(0);
      setIsTextMode(false);
    } else {
      setIsTextMode(false);
    }
  }, [currentInput, recordState]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isTextMode) {
        handleAddText();
      } else {
        handlePress('enter', KeyType.ACTION);
      }
    }
  }, [handlePress, isTextMode, handleAddText]);

  return {
    history, currentInput, cursorPos, isTextMode, savedRecords,
    setInputRef, handleInputCheck, handleSelect, handleKeyDown, handlePress, insertText,
    handleAddText, toggleTextMode, saveCurrentSession, loadRecord, deleteRecord, shareContent
  };
};
