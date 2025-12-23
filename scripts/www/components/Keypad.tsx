
import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { KEYPAD_ROWS, BOTTOM_MENU_ITEMS, EXTRA_PANELS } from '../constants';
import Button from './Button';
import { Volume2, VolumeX, Vibrate, ChevronDown } from 'lucide-react';
import { KeyType, Theme, PanelType, FeedbackMode } from '../types';

interface KeypadProps {
  onPress: (value: string, type: KeyType) => void;
  onInsert: (value: string) => void;
  theme: Theme;
}

export interface KeypadRef {
  playResultVoice: (result: string) => void;
}

const Keypad = forwardRef<KeypadRef, KeypadProps>(({ onPress, onInsert, theme }, ref) => {
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>(() => {
    const saved = localStorage.getItem('calc_feedback_mode') as FeedbackMode;
    return saved || 'VOICE';
  });
  const [activePanel, setActivePanel] = useState<PanelType>('NONE');

  useEffect(() => {
    localStorage.setItem('calc_feedback_mode', feedbackMode);
  }, [feedbackMode]);

  const playVoice = useCallback((text: string) => {
    if (feedbackMode !== 'VOICE' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.6;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('zh') && (v.name.includes('Google') || v.name.includes('Microsoft'))) || 
                          voices.find(v => v.lang.includes('zh'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [feedbackMode]);

  useImperativeHandle(ref, () => ({
    playResultVoice: (result: string) => {
      if (feedbackMode === 'MUTE') return;
      
      if (feedbackMode === 'VIBRATION' || feedbackMode === 'VOICE') {
        if (navigator.vibrate) navigator.vibrate(20);
      }

      if (feedbackMode === 'VOICE') {
        if (result === 'Error') {
          playVoice('计算错误');
        } else {
          const speechResult = result.toString().replace(/^-/, '负');
          playVoice(`等于${speechResult}`);
        }
      }
    }
  }), [feedbackMode, playVoice]);

  const triggerFeedback = useCallback((value: string, label: React.ReactNode) => {
    if (feedbackMode === 'MUTE') return;

    if (navigator.vibrate) {
      const duration = feedbackMode === 'VIBRATION' ? 25 : 12;
      navigator.vibrate(duration);
    }

    if (feedbackMode === 'VOICE') {
      let spokenText = '';
      if (!isNaN(Number(value))) {
        spokenText = value;
      } else {
        switch (value) {
          case 'ac': spokenText = '归零'; break;
          case 'backspace': spokenText = '删除'; break;
          case '+': spokenText = '加'; break;
          case '-': 
          case '−': spokenText = '减'; break;
          case '*': 
          case '×': spokenText = '乘'; break;
          case '/': 
          case '÷': spokenText = '除以'; break;
          case '=': 
          case 'enter': spokenText = '等于'; break;
          case '.': spokenText = '点'; break;
          case '%': spokenText = '百分之'; break;
          case 'parens': spokenText = '括号'; break;
          case 'root': spokenText = '根号'; break;
          case '^': spokenText = '次方'; break;
          case 'undo': spokenText = '撤销'; break;
          case 'redo': spokenText = '重做'; break;
          case 'copy': spokenText = '复制'; break;
          case 'paste': spokenText = '粘贴'; break;
          case 'tabs': spokenText = '切换'; break;
          default:
            if (typeof label === 'string') {
              spokenText = label;
            }
            break;
        }
      }
      if (spokenText) {
        playVoice(spokenText);
      }
    }
  }, [feedbackMode, playVoice]);

  const toggleFeedbackMode = () => {
    let nextMode: FeedbackMode = 'VOICE';
    if (feedbackMode === 'VOICE') nextMode = 'VIBRATION';
    else if (feedbackMode === 'VIBRATION') nextMode = 'MUTE';
    else nextMode = 'VOICE';

    setFeedbackMode(nextMode);

    if (nextMode === 'VOICE') {
      if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
      setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance('语音开启');
          utterance.lang = 'zh-CN';
          window.speechSynthesis.speak(utterance);
      }, 50);
    } else if (nextMode === 'VIBRATION') {
      if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
    }
  };

  const renderPanelContent = () => {
    if (activePanel === 'NONE') return null;
    const panelData = EXTRA_PANELS[activePanel as keyof typeof EXTRA_PANELS];

    if (activePanel === 'COMMON') {
      return (
        <div className="p-4 flex flex-col gap-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          {(panelData as any).map((section: any, sIdx: number) => (
            <div key={sIdx} className="flex flex-col gap-3">
              <h4 className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest pl-1">{section.section}</h4>
              <div className="grid grid-cols-4 gap-2.5">
                {section.items.map((item: any, iIdx: number) => (
                  <button
                    key={iIdx}
                    onClick={() => {
                      triggerFeedback(item.value, item.label);
                      onInsert(item.value);
                      setActivePanel('NONE');
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm active:scale-95 transition-all group"
                  >
                    <div className="text-gray-400 group-active:text-blue-500 transition-colors">
                      {item.icon || <div className="w-[18px] h-[18px] flex items-center justify-center font-bold text-xs">f</div>}
                    </div>
                    <span className="text-[0.6rem] font-black text-gray-600 truncate w-full text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="p-4 grid grid-cols-4 gap-3 max-h-60 overflow-y-auto no-scrollbar">
        {panelData.map((item: any, idx) => (
          <button
            key={idx}
            onClick={() => {
              const val = item.value || '';
              triggerFeedback(val, item.label);
              if (activePanel !== 'HELP') {
                onInsert(val);
                setActivePanel('NONE');
              }
            }}
            className={`py-2.5 px-1 rounded-xl text-[0.9rem] font-black transition-all active:scale-95 text-center truncate shadow-sm
              ${activePanel === 'HELP' ? 'col-span-4 text-left text-gray-600 font-bold bg-transparent shadow-none px-2' : 'bg-white text-gray-800 border border-gray-100'}
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full relative select-none" style={{ backgroundColor: theme.keypadBg }}>
      {activePanel !== 'NONE' && (
        <div 
          className="absolute bottom-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 border-t border-b overflow-hidden rounded-t-[2.5rem]"
          style={{ borderColor: theme.gridLine }}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50/50">
             <span className="text-xs font-black text-gray-400 tracking-widest uppercase">
                {BOTTOM_MENU_ITEMS.find(i => i.panel === activePanel)?.label}
             </span>
             <button onClick={() => setActivePanel('NONE')} className="text-gray-400 p-1 active:scale-90 transition-transform">
                <ChevronDown size={20} />
             </button>
          </div>
          {renderPanelContent()}
        </div>
      )}

      <div 
        className="flex-grow flex flex-col min-h-0" 
        style={{ padding: theme.keypadPadding || '4px' }}
      >
        {KEYPAD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex-grow flex gap-1 mb-1 last:mb-0 min-h-0">
            {row.map((btn, btnIndex) => (
              <div key={`${rowIndex}-${btnIndex}`} className="flex-grow flex-shrink basis-0 min-w-0 min-h-0">
                <Button
                  theme={theme}
                  label={btn.label}
                  variant={btn.variant}
                  className={btn.className}
                  onClick={() => {
                    triggerFeedback(btn.value || '', btn.label);
                    onPress(btn.value || '', btn.type as KeyType);
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div 
        className="flex w-full py-2 px-1 flex-shrink-0 border-t border-black/5"
        style={{ backgroundColor: theme.bottomMenuBg }}
      >
        {BOTTOM_MENU_ITEMS.map((item, idx) => {
            if (item.label === 'sound') {
                 return (
                    <div key={idx} className="flex-grow flex items-center justify-center">
                         <button 
                            onClick={toggleFeedbackMode}
                            className={`transition-all p-2 active:scale-90 flex flex-col items-center gap-0.5
                              ${feedbackMode === 'VOICE' ? 'text-white scale-110' : 
                                feedbackMode === 'VIBRATION' ? 'text-white' : 'text-white/40'}
                            `}
                         >
                             {feedbackMode === 'VOICE' && <Volume2 size={22} strokeWidth={2.5} />}
                             {feedbackMode === 'VIBRATION' && <Vibrate size={22} strokeWidth={2.5} />}
                             {feedbackMode === 'MUTE' && <VolumeX size={22} strokeWidth={2.5} />}
                         </button>
                    </div>
                 )
            }
            return (
                <button 
                  key={idx} 
                  onClick={(e) => {
                    e.preventDefault();
                    if(item.panel) {
                      triggerFeedback('menu', item.label);
                      setActivePanel(activePanel === item.panel ? 'NONE' : item.panel);
                    }
                  }}
                  className={`flex-grow flex items-center justify-center text-white cursor-pointer py-1.5 rounded-xl transition-all
                    ${activePanel === item.panel ? 'bg-white/25 shadow-inner' : ''}
                  `}
                >
                    <span className="text-[0.95rem] font-black opacity-95">{item.label}</span>
                </button>
            )
        })}
      </div>
    </div>
  );
});

Keypad.displayName = 'Keypad';
export default Keypad;
