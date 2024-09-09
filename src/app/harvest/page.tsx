'use client'
import React, { useState, useEffect } from 'react';

type Color = 'red' | 'blue' | 'yellow';

interface Plant {
  color: Color;
  tier: number;
}

interface Plot {
  plants: Plant[];
}

interface HarvestStep {
  plotIndex: number;
  plantIndex: number;
}

const colors: Color[] = ['red', 'blue', 'yellow'];

const colorClasses: Record<Color, string> = {
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  yellow: 'bg-yellow-500 text-black',
};

const HarvestMechanic: React.FC = () => {
  const [numPlots, setNumPlots] = useState<number>(3);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [harvestPath, setHarvestPath] = useState<HarvestStep[]>([]);
  const [preferredColor, setPreferredColor] = useState<Color>('red');

  useEffect(() => {
    initializePlots();
  }, [numPlots]);

  const initializePlots = (): void => {
    const newPlots: Plot[] = Array.from({ length: numPlots }, () => ({
      plants: [
        { color: 'red', tier: 0 },
        { color: 'red', tier: 0 },
      ],
    }));
    setPlots(newPlots);
    setHarvestPath([]);
  };

  const updatePlantColor = (plotIndex: number, plantIndex: number, color: Color): void => {
    const newPlots = [...plots];
    newPlots[plotIndex].plants[plantIndex].color = color;
    setPlots(newPlots);
  };

  const calculateHarvestPath = (): void => {
    const path: HarvestStep[] = [];
    let remainingPlots = JSON.parse(JSON.stringify(plots));

    while (remainingPlots.length > 0) {
      let bestStep: HarvestStep | null = null;
      let bestScore = -1;

      for (let i = 0; i < remainingPlots.length; i++) {
        for (let j = 0; j < remainingPlots[i].plants.length; j++) {
          const score = calculateStepScore(remainingPlots, i, j, preferredColor);
          if (score > bestScore) {
            bestScore = score;
            bestStep = { plotIndex: i, plantIndex: j };
          }
        }
      }

      if (bestStep) {
        path.push(bestStep);
        const { plotIndex, plantIndex } = bestStep;
        const harvestedColor = remainingPlots[plotIndex].plants[plantIndex].color;

        // Simulate harvest: 10% chance the other plant survives
        const otherPlantSurvives = Math.random() < 0.1;
        remainingPlots[plotIndex].plants.splice(plantIndex, 1);

        if (remainingPlots[plotIndex].plants.length === 0 || !otherPlantSurvives) {
          remainingPlots.splice(plotIndex, 1);
        }

        // Simulate upgrades: 10% chance for other color plants to upgrade their tier
        remainingPlots.forEach((plot: { plants: any[] }) => {
          plot.plants.forEach((plant) => {
            if (plant.color !== harvestedColor && Math.random() < 0.1) {
              plant.tier += 1;
            }
          });
        });
      } else {
        break;
      }
    }

    setHarvestPath(path);
  };

  const calculateStepScore = (
    plots: Plot[],
    plotIndex: number,
    plantIndex: number,
    targetColor: Color
  ): number => {
    const plant = plots[plotIndex].plants[plantIndex];
    const otherPlants = plots.flatMap((p, i) =>
      i !== plotIndex ? p.plants : p.plants.filter((_, j) => j !== plantIndex)
    );
    const upgradePotential = otherPlants.filter(p => p.color !== plant.color).length;

    // Prioritize the target color
    const colorBonus = plant.color === targetColor ? 100 : 0;
    return plant.tier * 10 + upgradePotential + colorBonus;
  };

  const handlePlantClick = (plotIndex: number, plantIndex: number): void => {
    const newPlots = [...plots];
    const harvestedColor = newPlots[plotIndex].plants[plantIndex].color;

    // Remove the harvested plant
    newPlots[plotIndex].plants.splice(plantIndex, 1);

    // Simulate 10% chance of other plant surviving in the same plot
    if (newPlots[plotIndex].plants.length === 1) {
      const otherPlantSurvives = Math.random() < 0.1;
      if (!otherPlantSurvives) {
        newPlots[plotIndex].plants = [];
      }
    }

    // Simulate upgrades for other colors
    newPlots.forEach((plot) => {
      plot.plants.forEach((plant) => {
        if (plant.color !== harvestedColor && Math.random() < 0.1) {
          plant.tier += 1;
        }
      });
    });

    // Remove empty plots
    const filteredPlots = newPlots.filter(plot => plot.plants.length > 0);

    setPlots(filteredPlots);
    calculateHarvestPath();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Harvest Mechanic</h1>
      <div className="mb-4">
        <label htmlFor="numPlots" className="mr-2">Number of plots:</label>
        <input
          type="number"
          id="numPlots"
          min={1}
          max={10}
          value={numPlots}
          onChange={(e) => setNumPlots(parseInt(e.target.value, 10))}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="preferredColor" className="mr-2">Preferred Color:</label>
        <select
          id="preferredColor"
          value={preferredColor}
          onChange={(e) => setPreferredColor(e.target.value as Color)}
          className="border rounded px-2 py-1"
        >
          {colors.map((color) => (
            <option key={color} value={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        {plots.map((plot, plotIndex) => (
          <div key={plotIndex} className="border rounded p-4">
            <h2 className="font-semibold mb-2">Plot {plotIndex + 1}</h2>
            {plot.plants.map((plant, plantIndex) => (
              <div key={plantIndex} className="flex items-center mb-2">
                <select
                  value={plant.color}
                  onChange={(e) => updatePlantColor(plotIndex, plantIndex, e.target.value as Color)}
                  className={`w-20 mr-2 ${colorClasses[plant.color]}`}
                >
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <span
                  className={`cursor-pointer ${colorClasses[plant.color]} p-1 rounded`}
                  onClick={() => handlePlantClick(plotIndex, plantIndex)}
                >
                  Tier: {plant.tier}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {harvestPath.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Recommended Harvest Path:</h2>
          <ol>
            {harvestPath.map((step, index) => (
              <li key={index}>
                Harvest Plot {step.plotIndex + 1}, Plant {step.plantIndex + 1} 
                ({plots[step.plotIndex]?.plants[step.plantIndex]?.color})
              </li>
            ))}
          </ol>
        </div>
      )}
      <button
        onClick={initializePlots}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Reset Plots
      </button>
    </div>
  );
};

export default HarvestMechanic;
