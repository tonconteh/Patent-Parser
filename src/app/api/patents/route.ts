import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Patent } from '@/lib/types';
import { initialPatents } from '@/lib/data';

const dataDir = path.join(process.cwd(), 'data');

// Function to ensure the data directory and initial files exist
async function ensureDataExists() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const files = await fs.readdir(dataDir);
    if (files.length === 0) {
      // If the directory is empty, populate it with initial data
      for (const patent of initialPatents) {
        await fs.writeFile(path.join(dataDir, `${patent.id}.json`), JSON.stringify(patent, null, 2));
      }
    }
  } catch (error) {
    console.error("Error ensuring data directory exists:", error);
  }
}

// GET all patents
export async function GET() {
  await ensureDataExists();
  try {
    const files = await fs.readdir(dataDir);
    const patents: Patent[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        patents.push(JSON.parse(fileContents));
      }
    }
    // Sort patents to show newest first, assuming higher ID is newer
    patents.sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
    return NextResponse.json(patents);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading patents', error: (error as Error).message }, { status: 500 });
  }
}

// CREATE a new patent
export async function POST(request: Request) {
  await ensureDataExists();
  try {
    const newPatentData: Omit<Patent, 'id'> = await request.json();
    const newId = Date.now().toString();
    const newPatent: Patent = { id: newId, ...newPatentData };
    
    const filePath = path.join(dataDir, `${newId}.json`);
    await fs.writeFile(filePath, JSON.stringify(newPatent, null, 2));
    
    return NextResponse.json(newPatent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating patent', error: (error as Error).message }, { status: 500 });
  }
}

    