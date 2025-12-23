
import React from 'react';

export type HistoryEntryType = 'CALCULATION' | 'TEXT';

export type FeedbackMode = 'VOICE' | 'VIBRATION' | 'MUTE';

export interface HistoryItem {
  id: string;
  expression?: string;
  result?: string;
  text?: string;
  type: HistoryEntryType;
}

export interface SavedRecord {
  id: string;
  title: string;
  date: string;
  items: HistoryItem[];
}

export enum KeyType {
  NUMBER = 'NUMBER',
  OPERATOR = 'OPERATOR',
  ACTION = 'ACTION',
  FUNCTION = 'FUNCTION',
}

export enum ButtonVariant {
  DEFAULT = 'DEFAULT', // 数字按键
  DARK = 'DARK', // 功能控制
  DARKER = 'DARKER', // 运算符
  RED = 'RED', // 清除 (AC)
  ORANGE = 'ORANGE', // 退格
  BLUE = 'BLUE', // 等于
  TRANSPARENT = 'TRANSPARENT' 
}

export type PanelType = 'NONE' | 'HELP' | 'FUNC' | 'CONST' | 'COMMON';

export interface Theme {
  id: string;
  name: string;
  previewColor: string;
  screenBg: string;
  gridLine: string;
  screenText: string;
  resultText: string;
  keypadBg: string;
  bottomMenuBg: string;
  borderRadius: string;
  buttonShadow?: string;
  buttonBorder?: string;
  glassmorphism?: boolean;
  keypadPadding?: string;
  buttonColors: {
    [key in ButtonVariant]: {
      bg: string;
      text: string;
    };
  };
}
