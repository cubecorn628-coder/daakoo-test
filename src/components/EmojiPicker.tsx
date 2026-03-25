import React, { useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function EmojiPicker({ onSelect, onClose }: { onSelect: (emoji: string) => void, onClose: () => void }) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={pickerRef} 
      className="absolute z-50 mt-2 bg-m3-surface rounded-2xl shadow-2xl border border-m3-outline/10 overflow-hidden"
      style={{
        // Smart positioning: try to keep it within viewport
        transform: 'translate(-50%, 0)',
        left: '50%'
      }}
    >
      <Picker 
        data={data} 
        onEmojiSelect={(emoji: any) => {
          onSelect(emoji.native);
          onClose();
        }}
        theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
        set="native"
        showPreview={false}
        showSkinTones={true}
      />
    </div>
  );
}
