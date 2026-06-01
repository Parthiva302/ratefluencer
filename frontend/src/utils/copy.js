import { playSound } from './sound';

export const copyToClipboard = async (text) => {
  try {
    let success = false;
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      success = true;
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      success = true;
    }
    
    if (success) {
      playSound('ding');
      return true;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};
