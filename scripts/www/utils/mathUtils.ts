import { evaluate, format } from 'mathjs';

// 智能提取并计算
export const safeEvaluate = (expression: string): string => {
  if (!expression.trim()) return '';
  
  try {
    // 1. 预处理：替换视觉运算符
    let processing = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/%/g, '/100');

    // 2. 核心逻辑：提取数学表达式部分
    let mathOnly = processing.replace(/[^\d.+\-*/^%()e]/g, '');

    if (!mathOnly.trim()) return 'Error';

    // 3. 使用 mathjs 计算
    const result = evaluate(mathOnly);

    if (result === undefined || result === null || isNaN(result)) {
      return 'Error';
    }

    // 4. 格式化结果：取消科学计数法，使用 notation: 'fixed' 确保大数完整显示
    // 我们先尝试获取一个足够长的定点数字符串
    let resultStr = format(result, { 
      notation: 'fixed', 
      precision: 20 // 保留一定精度，之后手动处理末尾的零
    });

    // 如果结果本身是整数或者非常大的数，mathjs 的 fixed 可能会带很多 .000
    // 我们手动清理掉无用的末尾 0 和小数点
    if (resultStr.includes('.')) {
      resultStr = resultStr.replace(/\.?0+$/, '');
    }

    // 针对极大的整数（超出 precision 20 的范围），mathjs 可能会强制返回科学计数法
    // 此时我们需要用 BigInt 或者更高的精度配置再转换一次
    if (resultStr.includes('e')) {
        // 如果依然存在 e，说明数值极大，改用更底层的格式化
        resultStr = format(result, { notation: 'fixed' });
        if (resultStr.includes('.')) {
          resultStr = resultStr.replace(/\.?0+$/, '');
        }
    }

    return resultStr;
  } catch (e) {
    console.error("Eval Error:", e);
    return 'Error';
  }
};

export const insertAtCursor = (
  original: string,
  toInsert: string,
  cursorPos: number
): { newText: string; newCursorPos: number } => {
  const before = original.slice(0, cursorPos);
  const after = original.slice(cursorPos);
  const newText = before + toInsert + after;
  return { newText, newCursorPos: cursorPos + toInsert.length };
};

export const deleteAtCursor = (
  text: string,
  cursorPos: number
): { newText: string; newCursorPos: number } => {
  if (cursorPos === 0) return { newText: text, newCursorPos: 0 };
  const before = text.slice(0, cursorPos - 1);
  const after = text.slice(cursorPos);
  return { newText: before + after, newCursorPos: cursorPos - 1 };
};