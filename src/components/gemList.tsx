'use client';

import { useState, useEffect } from 'react';
import fetchGemData from '../api/fetchGemData';

export default function GemsList() {
  const [gems, setGems] = useState<string[]>([]);
  const [displayedGems, setDisplayedGems] = useState<(string | null)[]>([null, null, null]);
  const [locked, setLocked] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    fetchGemData().then(setGems);
  }, []);

  const handleReroll = () => {
    const newDisplayedGems = displayedGems.map((gem, index) => {
      if (locked[index]) {
        return gem;
      }
      const randomIndex = Math.floor(Math.random() * gems.length);
      return gems[randomIndex];
    });
    setDisplayedGems(newDisplayedGems);
  };

  const toggleLock = (index: number) => {
    setLocked(locked.map((lock, i) => (i === index ? !lock : lock)));
  };

  return (
    <div>
      <button onClick={handleReroll}>Reroll</button>
      <div className="gem-list">
        {displayedGems.map((gem, index) => (
          <div key={index} onClick={() => toggleLock(index)} style={{ cursor: 'pointer', color: locked[index] ? 'green' : 'black' }}>
            {gem}
          </div>
        ))}
      </div>
    </div>
  );
}
