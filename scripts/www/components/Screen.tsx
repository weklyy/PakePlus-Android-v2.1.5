
import React, { useEffect, useRef, useState } from 'react';
import { HistoryItem, Theme } from '../types';
import { ChevronLeft, Keyboard, Save, History, Share2 } from 'lucide-react';

interface ScreenProps {
  history: HistoryItem[];
  currentInput: string;
  isTextMode: boolean;
  setInputRef: (el: HTMLInputElement | null) => void;
  handleInputCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (e: React.SyntheticEvent<HTMLInputElement, Event>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddText: () => void;
  toggleTextMode: () => void;
  onOpenSave: () => void;
  onOpenHistory: () => void;
  onShare: () => void;
  theme: Theme;
}

const Screen: React.FC<ScreenProps> = ({
  history, currentInput, isTextMode, setInputRef, handleInputCheck,
  handleSelect, handleKeyDown, onAddText, toggleTextMode,
  onOpenSave, onOpenHistory, onShare, theme,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(1.4); 
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  
  // 用于手势缩放的状态记录
  const touchState = useRef({
    initialDist: 0,
    initialFontSize: 1.4,
  });

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [currentInput, history]);

  // 计算两点之间的距离
  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      touchState.current.initialDist = getDistance(e.touches);
      touchState.current.initialFontSize = fontSize;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const currentDist = getDistance(e.touches);
      const ratio = currentDist / touchState.current.initialDist;
      let newFontSize = touchState.current.initialFontSize * ratio;
      
      // 限制字号范围
      newFontSize = Math.max(0.8, Math.min(3.5, newFontSize));
      setFontSize(newFontSize);
    }
  };

  const LINE_HEIGHT_REM = fontSize * 1.714; 
  const GRID_OFFSET = fontSize * 0.35; 

  return (
    <div 
      className="flex flex-col flex-grow relative overflow-hidden h-full"
      style={{ backgroundColor: theme.screenBg }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* 背景方格线 - 随着 fontSize 动态调整背景位置和高度 */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-75"
        style={{ 
          backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px)`,
          backgroundSize: `100% ${LINE_HEIGHT_REM}rem`,
          backgroundPosition: `0 ${GRID_OFFSET}rem`,
        }}
      />

      {/* 内容滚动区域 */}
      <div ref={scrollRef} className="relative z-10 flex-grow overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
        {history.map((item) => (
          <div key={item.id} className="flex items-start font-sans break-all"
            style={{ fontSize: `${fontSize}rem`, lineHeight: `${LINE_HEIGHT_REM}rem`, minHeight: `${LINE_HEIGHT_REM}rem`, color: theme.screenText }}>
            {item.type === 'CALCULATION' ? (
              <div className="flex flex-wrap items-baseline">
                <span className="mr-1 opacity-60 tracking-tight">{item.expression}</span>
                <span className="mr-1 font-bold" style={{ color: theme.resultText }}>=</span>
                <span className="font-bold">{item.result}</span>
              </div>
            ) : (
              <span className="font-semibold italic opacity-80">{item.text}</span>
            )}
          </div>
        ))}
        {/* 输入行 */}
        <div className="flex items-center font-sans relative" style={{ fontSize: `${fontSize}rem`, height: `${LINE_HEIGHT_REM}rem` }}>
           <input ref={setInputRef} type="text" inputMode={isTextMode ? "text" : "none"}
              className="w-full bg-transparent border-none outline-none caret-blue-500 font-bold"
              style={{ fontSize: 'inherit', color: theme.screenText }}
              value={currentInput} onChange={handleInputCheck} onSelect={handleSelect} onKeyDown={handleKeyDown} autoComplete="off" autoFocus />
           {!currentInput && !isTextMode && <div className="absolute left-0 text-gray-300 pointer-events-none font-normal italic">开始计算...</div>}
        </div>
      </div>

      {/* 侧边扩展功能按钮 */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-30 pointer-events-none">
         <div className={`flex items-center gap-2 transition-all duration-300 pointer-events-auto ${isMenuExpanded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 scale-50'}`}>
            <button onClick={onOpenSave} className="bg-white/90 p-2.5 rounded-full shadow-lg border border-gray-100 text-green-600 active:scale-90"><Save size={20} /></button>
            <button onClick={onOpenHistory} className="bg-white/90 p-2.5 rounded-full shadow-lg border border-gray-100 text-blue-600 active:scale-90"><History size={20} /></button>
            <button onClick={onShare} className="bg-white/90 p-2.5 rounded-full shadow-lg border border-gray-100 text-purple-600 active:scale-90"><Share2 size={20} /></button>
         </div>

         <button onClick={() => setIsMenuExpanded(!isMenuExpanded)}
           className={`text-gray-400 active:scale-90 transition-all p-2 pointer-events-auto bg-white/90 rounded-full shadow-md border border-gray-100 backdrop-blur-sm ${isMenuExpanded ? 'rotate-180 bg-gray-100' : ''}`}>
            <ChevronLeft size={24} strokeWidth={3} />
         </button>
         
         <button onClick={toggleTextMode}
           className="border-[2px] rounded-lg px-2.5 py-0.5 font-sans font-black text-lg active:scale-90 transition-all min-w-[40px] pointer-events-auto shadow-md backdrop-blur-sm"
           style={{ color: isTextMode ? theme.resultText : '#4b5563', borderColor: isTextMode ? theme.resultText : '#e5e7eb', backgroundColor: 'rgba(255,255,255,0.9)' }}>
            {isTextMode ? <Keyboard size={20} /> : '文'}
         </button>

         {isTextMode && (
           <button onClick={onAddText} className="bg-blue-600 text-white rounded-lg px-4 py-1.5 font-black text-xs active:scale-90 transition-all pointer-events-auto shadow-lg">记录</button>
         )}
      </div>
    </div>
  );
};

export default Screen;
