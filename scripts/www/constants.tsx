
import React from 'react';
import { ButtonVariant, KeyType, Theme, PanelType } from './types';
import {
  Delete,
  CornerDownLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clipboard,
  SquareStack,
  RotateCcw,
  RotateCw,
  Settings,
  Coins,
  Users,
  Percent
} from 'lucide-react';

export const KEYPAD_ROWS = [
  [
    { label: <SquareStack size={26} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'tabs' },
    { label: <ChevronLeft size={28} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'left' },
    { label: <ChevronRight size={28} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'right' },
    { label: <CornerDownLeft size={26} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'enter' },
    { label: 'AC', type: KeyType.ACTION, variant: ButtonVariant.RED, value: 'ac', className: 'text-2xl font-black' },
  ],
  [
    { label: <RotateCcw size={26} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'undo' },
    { label: <RotateCw size={26} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'redo' },
    { label: <FileText size={26} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'copy' },
    { label: <Clipboard size={26} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.DARK, value: 'paste' },
    { label: <Delete size={26} strokeWidth={2.5} />, type: KeyType.ACTION, variant: ButtonVariant.ORANGE, value: 'backspace' },
  ],
  [
    { label: '( )', type: KeyType.FUNCTION, variant: ButtonVariant.DARKER, value: 'parens', className: 'text-2xl' },
    { label: '7', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '7' },
    { label: '8', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '8' },
    { label: '9', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '9' },
    { label: '÷', type: KeyType.OPERATOR, variant: ButtonVariant.DARKER, value: '÷', className: 'text-3xl' },
  ],
  [
    { label: <span className="text-xl">x<sup>y</sup></span>, type: KeyType.FUNCTION, variant: ButtonVariant.DARKER, value: '^' },
    { label: '4', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '4' },
    { label: '5', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '5' },
    { label: '6', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '6' },
    { label: '×', type: KeyType.OPERATOR, variant: ButtonVariant.DARKER, value: '×', className: 'text-3xl' },
  ],
  [
    { label: <span className="text-xl"><sup>y</sup>√x</span>, type: KeyType.FUNCTION, variant: ButtonVariant.DARKER, value: 'root' },
    { label: '1', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '1' },
    { label: '2', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '2' },
    { label: '3', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '3' },
    { label: '−', type: KeyType.OPERATOR, variant: ButtonVariant.DARKER, value: '−', className: 'text-3xl' },
  ],
  [
    { label: '%', type: KeyType.FUNCTION, variant: ButtonVariant.DARKER, value: '%' },
    { label: '0', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '0' },
    { label: '.', type: KeyType.NUMBER, variant: ButtonVariant.DEFAULT, value: '.' },
    { label: '=', type: KeyType.ACTION, variant: ButtonVariant.BLUE, value: '=', className: 'font-black text-3xl' },
    { label: '+', type: KeyType.OPERATOR, variant: ButtonVariant.DARKER, value: '+', className: 'text-3xl' },
  ],
];

export const EXTRA_PANELS = {
  FUNC: [
    { label: 'sin', value: 'sin(' }, { label: 'cos', value: 'cos(' }, { label: 'tan', value: 'tan(' },
    { label: 'asin', value: 'asin(' }, { label: 'acos', value: 'acos(' }, { label: 'atan', value: 'atan(' },
    { label: 'log', value: 'log(' }, { label: 'ln', value: 'ln(' }, { label: 'exp', value: 'exp(' },
    { label: 'abs', value: 'abs(' }, { label: 'round', value: 'round(' }, { label: 'sqrt', value: 'sqrt(' }
  ],
  CONST: [
    { label: 'π', value: 'π' }, { label: 'e', value: 'e' }, 
    { label: 'c', value: '299792458' }, { label: 'G', value: '6.6743e-11' }
  ],
  COMMON: [
    { section: '生活实用', items: [
      { label: '大写转换', value: 'ACTION_CONVERT_UPPERCASE', icon: <Coins size={18} /> },
      { label: '亲戚称呼', value: 'ACTION_RELATIVES_CALC', icon: <Users size={18} /> },
      { label: '个税计算', value: 'ACTION_TODO', icon: <Percent size={18} /> },
      { label: '设置', value: 'ACTION_OPEN_SETTINGS', icon: <Settings size={18} /> },
    ]},
    { section: '数学工具', items: [
      { label: 'x²', value: '^2' }, { label: 'x³', value: '^3' }, 
      { label: '1/x', value: '1/(' }, { label: '10ⁿ', value: '10^(' },
      { label: 'n!', value: '!' }, { label: 'log₁₀', value: 'log10(' }
    ]}
  ],
  HELP: [
    { label: '点击“文”切换文字备注模式' },
    { label: '支持左右滑动撤销/重做' },
    { label: '常用面板支持财务大写转换' }
  ]
};

export const BOTTOM_MENU_ITEMS: { label: string, panel?: PanelType }[] = [
  { label: '帮助', panel: 'HELP' },
  { label: '函数', panel: 'FUNC' },
  { label: '常量', panel: 'CONST' },
  { label: 'sound' },
  { label: '常用', panel: 'COMMON' },
];

export const THEMES: Theme[] = [
  {
    id: 'doodle-white',
    name: '经典手绘',
    previewColor: '#ffffff',
    screenBg: '#fffdf9',
    gridLine: '#f0f0f0',
    screenText: '#2a2a2a',
    resultText: '#60affa',
    keypadBg: '#ffffff',
    bottomMenuBg: '#3b82f6',
    borderRadius: '16px',
    keypadPadding: '12px',
    buttonBorder: '3px solid #000000',
    buttonShadow: '0 4px 0 rgba(0,0,0,1)',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#ffffff', text: '#000000' },
      [ButtonVariant.DARK]: { bg: '#ffffff', text: '#000000' },
      [ButtonVariant.DARKER]: { bg: '#60affa', text: '#000000' },
      [ButtonVariant.RED]: { bg: '#ff8a80', text: '#000000' },
      [ButtonVariant.ORANGE]: { bg: '#fbbf24', text: '#000000' },
      [ButtonVariant.BLUE]: { bg: '#60affa', text: '#ffffff' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#000000' },
    }
  },
  {
    id: 'spring-outing',
    name: '春日出游',
    previewColor: '#fdf6e3',
    screenBg: '#fdfaf2',
    gridLine: '#e8dfc4',
    screenText: '#5d4037',
    resultText: '#e57373',
    keypadBg: '#fcf9f2',
    bottomMenuBg: '#a5d6a7',
    borderRadius: '20px',
    keypadPadding: '14px',
    buttonBorder: '2.5px solid #5d4037',
    buttonShadow: '0 5px 0 #d7ccc8',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#ffffff', text: '#5d4037' },
      [ButtonVariant.DARK]: { bg: '#f1f8e9', text: '#5d4037' },
      [ButtonVariant.DARKER]: { bg: '#fff9c4', text: '#795548' },
      [ButtonVariant.RED]: { bg: '#ffcdd2', text: '#c62828' },
      [ButtonVariant.ORANGE]: { bg: '#ffe0b2', text: '#e65100' },
      [ButtonVariant.BLUE]: { bg: '#c8e6c9', text: '#2e7d32' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#5d4037' },
    }
  },
  {
    id: 'bilibili',
    name: '粉萌次元',
    previewColor: '#fb7299',
    screenBg: '#ffffff',
    gridLine: '#fff0f3',
    screenText: '#212121',
    resultText: '#fb7299',
    keypadBg: '#f6f6f6',
    bottomMenuBg: '#fb7299',
    borderRadius: '8px',
    keypadPadding: '6px',
    buttonShadow: '0 2px 0 rgba(0,0,0,0.05)',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#ffffff', text: '#212121' },
      [ButtonVariant.DARK]: { bg: '#ffffff', text: '#212121' },
      [ButtonVariant.DARKER]: { bg: '#ffecf2', text: '#fb7299' },
      [ButtonVariant.RED]: { bg: '#fb7299', text: '#ffffff' },
      [ButtonVariant.ORANGE]: { bg: '#fb7299', text: '#ffffff' },
      [ButtonVariant.BLUE]: { bg: '#fb7299', text: '#ffffff' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#fb7299' },
    }
  },
  {
    id: 'wechat',
    name: '微信 Style',
    previewColor: '#07c160',
    screenBg: '#f2f2f2',
    gridLine: '#e0e0e0',
    screenText: '#000000',
    resultText: '#07c160',
    keypadBg: '#f2f2f2',
    bottomMenuBg: '#07c160',
    borderRadius: '10px',
    keypadPadding: '8px',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#ffffff', text: '#000000' },
      [ButtonVariant.DARK]: { bg: '#ffffff', text: '#000000' },
      [ButtonVariant.DARKER]: { bg: '#95ec69', text: '#000000' },
      [ButtonVariant.RED]: { bg: '#fa5151', text: '#ffffff' },
      [ButtonVariant.ORANGE]: { bg: '#fa5151', text: '#ffffff' },
      [ButtonVariant.BLUE]: { bg: '#07c160', text: '#ffffff' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#07c160' },
    }
  },
  {
    id: 'coolapk',
    name: '酷安 Style',
    previewColor: '#009688',
    screenBg: '#ffffff',
    gridLine: '#f0f0f0',
    screenText: '#333333',
    resultText: '#009688',
    keypadBg: '#f5f5f5',
    bottomMenuBg: '#009688',
    borderRadius: '6px',
    keypadPadding: '6px',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#ffffff', text: '#333333' },
      [ButtonVariant.DARK]: { bg: '#ffffff', text: '#333333' },
      [ButtonVariant.DARKER]: { bg: '#009688', text: '#ffffff' },
      [ButtonVariant.RED]: { bg: '#ff5252', text: '#ffffff' },
      [ButtonVariant.ORANGE]: { bg: '#ff5252', text: '#ffffff' },
      [ButtonVariant.BLUE]: { bg: '#009688', text: '#ffffff' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#009688' },
    }
  },
  {
    id: 'frosted-blue',
    name: '磨砂深蓝',
    previewColor: '#1e3a8a',
    screenBg: '#0f172a',
    gridLine: '#1e293b',
    screenText: '#f8fafc',
    resultText: '#38bdf8',
    keypadBg: '#0f172a',
    bottomMenuBg: '#3b82f6',
    borderRadius: '16px',
    glassmorphism: true,
    keypadPadding: '10px',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: 'rgba(30, 41, 59, 0.7)', text: '#f1f5f9' },
      [ButtonVariant.DARK]: { bg: 'rgba(15, 23, 42, 0.5)', text: '#94a3b8' },
      [ButtonVariant.DARKER]: { bg: 'rgba(59, 130, 246, 0.2)', text: '#38bdf8' },
      [ButtonVariant.RED]: { bg: '#ef4444', text: '#ffffff' },
      [ButtonVariant.ORANGE]: { bg: '#f59e0b', text: '#ffffff' },
      [ButtonVariant.BLUE]: { bg: '#3b82f6', text: '#ffffff' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#3b82f6' },
    }
  },
  {
    id: 'minimal-dark',
    name: '极简暗黑',
    previewColor: '#1a1a1a',
    screenBg: '#000000',
    gridLine: '#1a1a1a',
    screenText: '#ffffff',
    resultText: '#3b82f6',
    keypadBg: '#000000',
    bottomMenuBg: '#1a1a1a',
    borderRadius: '24px',
    keypadPadding: '10px',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#333333', text: '#ffffff' },
      [ButtonVariant.DARK]: { bg: '#1a1a1a', text: '#ffffff' },
      [ButtonVariant.DARKER]: { bg: '#f59e0b', text: '#000000' },
      [ButtonVariant.RED]: { bg: '#ef4444', text: '#ffffff' },
      [ButtonVariant.ORANGE]: { bg: '#f59e0b', text: '#ffffff' },
      [ButtonVariant.BLUE]: { bg: '#3b82f6', text: '#ffffff' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#ffffff' },
    }
  },
  {
    id: 'macos-light',
    name: '玻璃拟态',
    previewColor: '#e5e7eb',
    screenBg: '#f9fafb',
    gridLine: '#e5e7eb',
    screenText: '#1f2937',
    resultText: '#2563eb',
    keypadBg: '#ffffff',
    bottomMenuBg: '#2563eb',
    borderRadius: '12px',
    glassmorphism: true,
    keypadPadding: '8px',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#ffffff', text: '#1f2937' },
      [ButtonVariant.DARK]: { bg: '#f3f4f6', text: '#1f2937' },
      [ButtonVariant.DARKER]: { bg: '#d1d5db', text: '#1f2937' },
      [ButtonVariant.RED]: { bg: '#fecaca', text: '#dc2626' },
      [ButtonVariant.ORANGE]: { bg: '#fed7aa', text: '#ea580c' },
      [ButtonVariant.BLUE]: { bg: '#2563eb', text: '#ffffff' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#2563eb' },
    }
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    previewColor: '#fef08a',
    screenBg: '#111827',
    gridLine: '#1f2937',
    screenText: '#fef08a',
    resultText: '#ec4899',
    keypadBg: '#111827',
    bottomMenuBg: '#ec4899',
    borderRadius: '0px',
    keypadPadding: '4px',
    buttonBorder: '2px solid #fef08a',
    buttonColors: {
      [ButtonVariant.DEFAULT]: { bg: '#1f2937', text: '#fef08a' },
      [ButtonVariant.DARK]: { bg: '#111827', text: '#fef08a' },
      [ButtonVariant.DARKER]: { bg: '#ec4899', text: '#ffffff' },
      [ButtonVariant.RED]: { bg: '#ef4444', text: '#ffffff' },
      [ButtonVariant.ORANGE]: { bg: '#f59e0b', text: '#ffffff' },
      [ButtonVariant.BLUE]: { bg: '#fef08a', text: '#000000' },
      [ButtonVariant.TRANSPARENT]: { bg: 'transparent', text: '#ec4899' },
    }
  }
];
