'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import gemData from '../data/combined_skill_gems.json';
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
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

  return (
    <div className="relative flex flex-col items-center bg-[#5C4433] rounded-lg shadow-lg p-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <QuestionMarkCircledIcon className="absolute top-2 right-2 w-6 h-6 text-[#FFBF1F] cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent side="top">
            Click on the skill to keep it from being rolled
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button 
        onClick={handleReroll}
        className="mb-6 bg-[#FFBF1F] hover:bg-[#CC9200] text-[#261C15] font-bold py-2 px-4 rounded-full "
      >
        Reroll
      </Button>
      <div className="gem-list w-full">
  {displayedGems.map((gem, index) => (
    <div key={index} 
         onClick={() => toggleLock(index)} 
         className={`cursor-pointer text-xl font-medium text-center mt-4 p-3 rounded-md
                    ${locked[index] 
                      ? 'bg-[#CC9200] text-[#5C4433]' 
                      : 'bg-[#DBCABD]'
                    } `}
                    style={{ color: gem?.Table === 'Table 1' ? '#EE291B' : gem?.Table === 'Table 2' ? '#008F47' : gem?.Table === 'Table 3' ? '#3C5190' : 'gray-800' }}
                    >
      {gem?.Name || 'Click Reroll'}
    </div>
  ))}
</div>

    </div>
  );
}  