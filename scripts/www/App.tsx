
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Screen from './components/Screen';
import Keypad, { KeypadRef } from './components/Keypad';
import { useCalculator } from './hooks/useCalculator';
import { X, Check, Save, History, Trash2, Coins, Users, ArrowRight, RotateCcw } from 'lucide-react';
import { THEMES } from './constants';
import { toChineseUppercase } from './utils/conversionUtils';

/**
 * 专家级关系映射表 - 核心规则库
 */
const RELATION_RULES: Record<string, Record<string, string>> = {
  '我': { '爸爸': '爸爸', '妈妈': '妈妈', '哥哥': '哥哥', '弟弟': '弟弟', '姐姐': '姐姐', '妹妹': '妹妹', '老公': '老公', '老婆': '老婆', '儿子': '儿子', '女儿': '女儿' },
  '爸爸': { '爸爸': '爷爷', '妈妈': '奶奶', '哥哥': '伯父', '弟弟': '叔叔', '姐姐': '姑妈', '妹妹': '姑妈', '儿子': '我/兄弟', '女儿': '我/姐妹', '老婆': '妈妈' },
  '妈妈': { '爸爸': '外公', '妈妈': '外婆', '哥哥': '舅舅', '弟弟': '舅舅', '姐姐': '姨妈', '妹妹': '姨妈', '儿子': '我/兄弟', '女儿': '我/姐妹', '老公': '爸爸' },
  '爷爷': { '爸爸': '曾爷爷', '妈妈': '曾奶奶', '儿子': '爸爸/伯父/叔叔', '女儿': '姑妈' },
  '奶奶': { '爸爸': '曾爷爷', '妈妈': '曾奶奶', '儿子': '爸爸/伯父/叔叔', '女儿': '姑妈' },
  '外公': { '爸爸': '曾外公', '妈妈': '曾外婆', '儿子': '舅舅', '女儿': '妈妈/姨妈' },
  '外婆': { '爸爸': '曾外公', '妈妈': '曾外婆', '儿子': '舅舅', '女儿': '妈妈/姨妈' },
  '儿子': { '儿子': '孙子', '女儿': '孙女', '老婆': '儿媳', '爸爸': '我/老公', '妈妈': '我/老婆' },
  '女儿': { '儿子': '外孙', '女儿': '外孙女', '老公': '女婿', '爸爸': '我/老公', '妈妈': '我/老婆' },
  '哥哥': { '儿子': '侄子', '女儿': '侄女', '老婆': '嫂子', '爸爸': '爸爸', '妈妈': '妈妈' },
  '弟弟': { '儿子': '侄子', '女儿': '侄女', '老婆': '弟妹', '爸爸': '爸爸', '妈妈': '妈妈' },
  '姐姐': { '儿子': '外甥', '女儿': '外甥女', '老公': '姐夫', '爸爸': '爸爸', '妈妈': '妈妈' },
  '妹妹': { '儿子': '外甥', '女儿': '外甥女', '老公': '妹夫', '爸爸': '爸爸', '妈妈': '妈妈' },
  '舅舅': { '儿子': '表哥/表弟', '女儿': '表姐/表妹', '老婆': '舅妈', '爸爸': '外公', '妈妈': '外婆' },
  '姨妈': { '儿子': '表哥/表弟', '女儿': '表姐/表妹', '老公': '姨父', '爸爸': '外公', '妈妈': '外婆' },
  '姑妈': { '儿子': '表哥/表弟', '女儿': '表姐/表妹', '老公': '姑父', '爸爸': '爷爷', '妈妈': '奶奶' },
  '叔叔': { '儿子': '堂哥/堂弟', '女儿': '堂姐/堂妹', '老婆': '婶婶', '爸爸': '爷爷', '奶奶': '奶奶' },
  '伯父': { '儿子': '堂哥/堂弟', '女儿': '堂姐/堂妹', '老婆': '伯母', '爸爸': '爷爷', '妈妈': '奶奶' },
  '侄子': { '儿子': '侄孙', '女儿': '侄孙女', '老婆': '侄媳妇' },
  '外甥': { '儿子': '外甥孙', '女儿': '外甥孙女', '老婆': '外甥媳' },
  '表哥': { '儿子': '表侄', '女儿': '表侄女', '老婆': '表嫂' },
  '表弟': { '儿子': '表侄', '女儿': '表侄女', '老婆': '表弟妹' },
  '表姐': { '儿子': '表外甥', '女儿': '表外甥女', '老公': '表姐夫' },
  '表妹': { '儿子': '表外甥', '女儿': '表外甥女', '老公': '表妹夫' },
  '老婆': { '爸爸': '岳父', '妈妈': '岳母', '哥哥': '大舅子', '弟弟': '小舅子', '姐姐': '大姨子', '妹妹': '小姨子', '儿子': '儿子', '女儿': '女儿' },
  '老公': { '爸爸': '公公', '妈妈': '婆婆', '哥哥': '大伯子', '弟弟': '小叔子', '姐姐': '大姑子', '妹妹': '小姑子', '儿子': '儿子', '女儿': '女儿' },
  '表侄子': { '儿子': '表侄孙', '女儿': '表侄孙女' },
  '表侄女': { '儿子': '表外孙', '女儿': '表外孙女', '老公': '表侄女婿' },
  '表侄女婿': { '儿子': '表外孙', '女儿': '表外孙女' }
};

const App: React.FC = () => {
  const keypadRef = useRef<KeypadRef>(null);
  const uppercaseInputRef = useRef<HTMLInputElement>(null);

  const {
    history, currentInput, isTextMode, savedRecords,
    handlePress, insertText, setInputRef, handleInputCheck,
    handleSelect, handleKeyDown, handleAddText, toggleTextMode,
    saveCurrentSession, loadRecord, deleteRecord, shareContent
  } = useCalculator({
    onResultReady: (result) => {
      keypadRef.current?.playResultVoice(result);
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showUppercaseModal, setShowUppercaseModal] = useState(false);
  const [showRelativesModal, setShowRelativesModal] = useState(false);
  
  const [recordTitle, setRecordTitle] = useState('');
  const [currentThemeId, setCurrentThemeId] = useState('doodle-white');
  const [screenRatio, setScreenRatio] = useState(55); 

  const [uppercaseInputValue, setUppercaseInputValue] = useState('');
  const [relativesChain, setRelativesChain] = useState<string[]>(['我']);
  const [relativeResult, setRelativeResult] = useState('我');

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  const lastCalculation = [...history].reverse().find(h => h.type === 'CALCULATION');
  const lastResult = lastCalculation?.result || '0';

  useEffect(() => {
    if (showUppercaseModal) {
      setUppercaseInputValue(lastResult === 'Error' ? '0' : lastResult);
      const timer = setTimeout(() => {
        if (uppercaseInputRef.current) uppercaseInputRef.current.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [showUppercaseModal, lastResult]);

  const handleConfirmSave = () => {
    saveCurrentSession(recordTitle || `笔记 ${new Date().toLocaleTimeString()}`);
    setRecordTitle('');
    setShowNamingModal(false);
  };

  const handleInsertOrAction = useCallback((value: string) => {
    if (value === 'ACTION_OPEN_SETTINGS') {
      setShowSettings(true);
    } else if (value === 'ACTION_CONVERT_UPPERCASE') {
      setShowUppercaseModal(true);
    } else if (value === 'ACTION_RELATIVES_CALC') {
      setShowRelativesModal(true);
      setRelativesChain(['我']);
      setRelativeResult('我');
    } else {
      insertText(value);
    }
  }, [insertText]);

  const handleRelativeAdd = (role: string) => {
    const newChain = [...relativesChain, role];
    setRelativesChain(newChain);

    const currentOptions = relativeResult.split('/');
    let nextMatch = '';

    for (const option of currentOptions) {
      const match = RELATION_RULES[option]?.[role];
      if (match) {
        nextMatch = match;
        break;
      }
    }

    if (!nextMatch) {
      if (role === '儿子' || role === '女儿') {
        if (relativeResult.includes('孙')) nextMatch = '曾' + relativeResult;
        else if (relativeResult.includes('侄')) nextMatch = relativeResult + '子';
        else nextMatch = relativeResult + '的' + role;
      } else if (role === '老公' || role === '老婆') {
        if (relativeResult.endsWith('子')) nextMatch = relativeResult + '媳';
        else if (relativeResult.endsWith('女')) nextMatch = relativeResult + '婿';
        else nextMatch = relativeResult + '的' + role;
      } else {
        nextMatch = relativeResult + '的' + role;
      }
    }

    if (nextMatch.length > 20) {
      setRelativeResult('关系太复杂啦');
    } else {
      setRelativeResult(nextMatch);
    }
  };

  const currentScreenHeight = isTextMode ? 100 : screenRatio;
  const uppercaseResult = toChineseUppercase(uppercaseInputValue);

  return (
    <div className="flex flex-col h-screen w-screen bg-black sm:max-w-md sm:mx-auto sm:h-[95vh] sm:my-[2.5vh] sm:rounded-[3rem] overflow-hidden sm:shadow-2xl transition-all duration-300 relative text-sm sm:text-base">
      <div style={{ height: `${currentScreenHeight}%` }} className="flex flex-col min-h-0 overflow-hidden relative z-10 transition-all duration-500 ease-in-out">
        <Screen 
          theme={currentTheme} history={history} currentInput={currentInput}
          isTextMode={isTextMode} setInputRef={setInputRef} handleInputCheck={handleInputCheck}
          handleSelect={handleSelect} handleKeyDown={handleKeyDown} onAddText={handleAddText}
          toggleTextMode={toggleTextMode} 
          onOpenSave={() => setShowNamingModal(true)}
          onOpenHistory={() => setShowHistoryModal(true)}
          onShare={shareContent}
        />
      </div>
      
      <div style={{ height: `${100 - screenRatio}%` }} className={`relative z-20 flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out ${isTextMode ? 'translate-y-full opacity-0 invisible' : 'translate-y-0 opacity-100 visible'}`}>
        <Keypad ref={keypadRef} theme={currentTheme} onPress={handlePress} onInsert={handleInsertOrAction} />
      </div>

      {/* 亲戚称呼计算弹窗 */}
      {showRelativesModal && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[360px] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="px-8 pt-9 pb-5 flex justify-between items-center border-b border-gray-50/50">
              <h3 className="font-black text-[#1a1a1a] text-xl flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f0f3ff] rounded-2xl flex items-center justify-center text-[#5c68ff]">
                  <Users size={26} strokeWidth={2.5} />
                </div>
                亲戚关系计算
              </h3>
              <button onClick={() => setShowRelativesModal(false)} className="text-[#d1d5db] p-2 hover:text-gray-400 transition-colors">
                <X size={34} strokeWidth={2} />
              </button>
            </div>

            <div className="p-8 pt-6 flex flex-col gap-8">
              <div className="bg-[#f0f3ff] p-8 rounded-[3.2rem] min-h-[170px] flex flex-col justify-center border border-[#e0e7ff] relative">
                <div className="flex flex-wrap items-center gap-y-1 gap-x-0.5 mb-5 leading-tight">
                  {relativesChain.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-[1.1rem] font-bold text-[#8a96ff]">{item}</span>
                      {idx < relativesChain.length - 1 && (
                        <span className="text-[0.8rem] font-medium text-[#8a96ff]/40 px-0.5">的</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <ArrowRight size={32} className="text-[#a5b4fc] flex-shrink-0" strokeWidth={3} />
                  <span className={`text-[2.4rem] font-black tracking-tight leading-none ${relativeResult === '关系太复杂啦' ? 'text-[#c0c0c0]' : 'text-[#5c68ff]'}`}>
                    {relativeResult}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3.5 px-0.5">
                {['爸爸', '妈妈', '哥哥', '弟弟', '姐姐', '妹妹', '老公', '老婆', '儿子', '女儿'].map((role) => (
                  <button 
                    key={role}
                    onClick={() => handleRelativeAdd(role)}
                    className="aspect-square flex items-center justify-center bg-[#f9f9f9] rounded-[1.2rem] font-bold text-[#333] active:translate-y-0.5 active:bg-white active:shadow-sm transition-all text-[1rem]"
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => { setRelativesChain(['我']); setRelativeResult('我'); }} 
                  className="px-7 py-4 bg-[#f9f9f9] text-[#666] rounded-full font-bold active:scale-95 transition-all flex items-center gap-2 text-sm border border-gray-100/50"
                >
                  <RotateCcw size={18} strokeWidth={3} /> 重置
                </button>
                <button 
                  onClick={() => {
                    insertText(`关系链: ${relativesChain.join('的')} = ${relativeResult}`);
                    setShowRelativesModal(false);
                  }}
                  className="flex-grow py-4.5 bg-[#5b5fff] text-white rounded-full font-black shadow-[0_15px_35px_rgba(91,95,255,0.45)] active:scale-95 active:brightness-110 transition-all text-[1.2rem]"
                >
                  记入笔记
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-w-sm">
            <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
              <h3 className="font-bold text-[#1e2329] text-xl">设置</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 active:scale-90 transition-transform"><X size={28} /></button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2 tracking-widest uppercase">显示区域高度</label>
                <div className="flex items-center gap-5">
                  <input type="range" min="25" max="80" step="1" value={screenRatio} onChange={(e) => setScreenRatio(parseInt(e.target.value))}
                    className="flex-grow h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                  <span className="font-mono font-bold text-gray-600 w-12 text-right">{screenRatio}%</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 mb-4 block tracking-widest uppercase">更换皮肤</label>
                <div className="grid grid-cols-3 gap-4">
                  {THEMES.map((theme) => (
                    <div key={theme.id} onClick={() => setCurrentThemeId(theme.id)}
                      className={`flex flex-col items-center gap-2 cursor-pointer p-2 rounded-2xl transition-all border-2 ${currentThemeId === theme.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-100'}`}>
                      <div className="w-12 h-12 rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden" 
                        style={{ backgroundColor: theme.previewColor, border: theme.id === 'doodle-white' ? '2px solid black' : 'none' }}>
                        {currentThemeId === theme.id && (
                          <div className="bg-blue-500 rounded-full p-0.5 shadow-lg">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[0.6rem] font-black truncate w-full text-center ${currentThemeId === theme.id ? 'text-blue-600' : 'text-gray-500'}`}>{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 bg-white border-t border-gray-50">
              <button onClick={() => setShowSettings(false)} className="bg-blue-600 text-white w-full py-3.5 rounded-2xl font-black shadow-lg active:scale-95 transition-all">确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 财务大写转换弹窗 */}
      {showUppercaseModal && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-7 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-800 text-xl flex items-center gap-2"><Coins size={22} className="text-yellow-500" /> 财务大写</h3>
              <button onClick={() => setShowUppercaseModal(false)} className="text-gray-400 p-2 active:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="bg-gray-50 p-6 rounded-[2rem] mb-6 border border-gray-100">
              <div className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-3">请输入数字金额</div>
              <input 
                ref={uppercaseInputRef} type="number" inputMode="decimal"
                className="w-full bg-transparent text-4xl font-black text-gray-900 outline-none placeholder-gray-200 mb-6"
                value={uppercaseInputValue} onChange={(e) => setUppercaseInputValue(e.target.value)} placeholder="0.00"
              />
              <div className="h-[1.5px] bg-gray-200/50 w-full mb-6"></div>
              <div className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">大写转换结果</div>
              <div className="text-lg font-black text-blue-600 break-all leading-relaxed min-h-[3rem]">{uppercaseResult}</div>
            </div>
            <button 
              onClick={() => { insertText(uppercaseResult); setShowUppercaseModal(false); }}
              className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95 transition-all"
            >
              插入到笔记
            </button>
          </div>
        </div>
      )}

      {showNamingModal && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden">
             <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-gray-800 text-xl flex items-center gap-2">
                    <Save size={22} className="text-green-500" /> 保存笔记
                  </h3>
                  <button onClick={() => setShowNamingModal(false)} className="text-gray-400">
                    <X size={24} />
                  </button>
                </div>
                <div className="mb-8">
                  <input 
                    autoFocus type="text" placeholder="例如：今日买菜清单..."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:border-green-400 focus:bg-white transition-all font-bold text-gray-700"
                    value={recordTitle} onChange={(e) => setRecordTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
                  />
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setShowNamingModal(false)} className="flex-grow py-3.5 rounded-2xl font-black text-gray-400 bg-gray-50">取消</button>
                   <button onClick={handleConfirmSave} className="flex-grow py-3.5 rounded-2xl font-black text-white bg-green-500 shadow-lg">确认保存</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50/80">
              <h3 className="font-black text-gray-800 flex items-center gap-2"><History size={20} className="text-blue-500"/> 历史存档</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400"><X size={24}/></button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 no-scrollbar">
              {savedRecords.length === 0 ? (
                <div className="py-16 text-center text-gray-300 italic font-medium">还没有任何保存的记录</div>
              ) : (
                savedRecords.map(record => (
                  <div key={record.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center transition-all border border-transparent hover:border-blue-100">
                    <div className="flex-grow cursor-pointer" onClick={() => { loadRecord(record); setShowHistoryModal(false); }}>
                      <div className="font-bold text-gray-800 line-clamp-1">{record.title}</div>
                      <div className="text-[0.65rem] text-gray-400 mt-1 uppercase tracking-tight font-semibold">{record.date}</div>
                    </div>
                    <button onClick={() => deleteRecord(record.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
