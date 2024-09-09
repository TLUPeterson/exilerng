'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import gemData from '../data/combined_skill_gems.json';
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function GemsList() {
  const [gems, setGems] = useState<{ Name: string; Table: string }[]>([]);
  const [displayedGems, setDisplayedGems] = useState<( { Name: string; Table: string } | null )[]>([null, null, null]);
  const [locked, setLocked] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    setGems(gemData);
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

  const getGemColor = (table: string | undefined) => {
    if (table === 'Table 1') return 'text-red-500';
    if (table === 'Table 2') return 'text-green-500';
    if (table === 'Table 3') return 'text-blue-500';
    return 'text-gray-400';
  };

  return (
    <div className="relative flex flex-col items-center bg-[#1E1E1E] rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="absolute top-2 right-2 w-6 h-6 text-[#FFA500] cursor-pointer">?</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Click on a gem to lock/unlock it from being rerolled
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button 
        onClick={handleReroll}
        className="mb-6 bg-[#FFA500] hover:bg-[#E69500] text-[#1E1E1E] font-bold py-2 px-4 rounded-full transition-transform duration-200 hover:scale-105"
      >
        Reroll Gems
      </Button>
      <div className="gem-list w-full space-y-4">
        {displayedGems.map((gem, index) => (
          <div 
            key={index} 
            onClick={() => toggleLock(index)} 
            className={`cursor-pointer text-xl font-medium text-center p-4 rounded-lg transition-all duration-300 ease-in-out transform flex justify-between items-center
                      ${locked[index] 
                        ? 'bg-gray-700 ring-2 ring-[#FFA500] shadow-lg' 
                        : 'bg-gray-600 hover:bg-gray-650'
                      }`}
          >
            <span className={`flex-grow ${getGemColor(gem?.Table)}`}>
              {gem?.Name || 'Click Reroll'}
            </span>
            {locked[index] ? (
              <LockClosedIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <LockOpen1Icon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
