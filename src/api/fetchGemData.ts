'use server';

interface ApiResponse {
  result: {
    id: string;
    label: string;
    entries: { type: string; text?: string; disc?: string }[];
  }[];
}

export default async function fetchGemData(): Promise<string[]> {
  try{

  const response = await fetch('https://www.pathofexile.com/api/trade/data/items');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: ApiResponse = await response.json();

  const exclusions = ['Vaal', 'Banner', 'Support', 'Link', 'Mark', 'Portal', 'Purity', 'Automation', 'Blood and Sand', 'Flesh and Stone', 'Anger', 'Clarity', 'Determ', 'Discipline', 'Grace', 'Haste', 'Hatred', 'Malevolance', 'Precision', 'Pride', 'Vitality', 'Wrath', 'Zealotry'];
  const gemsItems = data.result
    .filter(category => category.id === 'gems')
    .flatMap(category => category.entries
      .map(entry => entry.text ?? entry.type)
      .filter(name => 
        !exclusions.some(exclude => name.includes(exclude))
      )
    );

  return gemsItems

  }catch(error){
    console.log(error);
    return [];
  }
}