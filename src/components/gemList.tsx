'use client';

import { useState, useEffect } from 'react';
import fetchGemData from '../api/fetchGemData';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import gemData from '../data/combined_skill_gems.json';


export default function GemsList() {
  const [gems, setGems] = useState<string[]>([]);
  const [displayedGems, setDisplayedGems] = useState<(string | null)[]>([null, null, null]);
  const [locked, setLocked] = useState<boolean[]>([false, false, false]);

/* This is from trade api, currently not in use
  useEffect(() => {
    fetchGemData().then(setGems);
  }, []);*/

  useEffect(() => {
    const formattedGems = gemData.map(item => item.Name);
    setGems(formattedGems);
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
    <div className="flex flex-col items-center">
      <Button onClick={handleReroll}>Reroll</Button>
      <div className="gem-list">
        {displayedGems.map((gem, index) => (
          <div key={index} onClick={() => toggleLock(index)} className="cursor-pointer text-base text-center mt-4 " style={{ color: locked[index] ? 'green' : 'black' }}>
            {gem}
            {index < 2 && displayedGems[index + 1] && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}