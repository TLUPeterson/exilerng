import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'combined_skill_gems.json'), 'utf8');
    res.status(200).json(JSON.parse(fileContents));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
}
