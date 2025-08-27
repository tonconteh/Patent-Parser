import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Patent } from '@/lib/types';

const dataFilePath = (id: string) => path.join(process.cwd(), 'data', `${id}.json`);

// GET a single patent
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const fileContents = await fs.readFile(dataFilePath(id), 'utf8');
    const patent = JSON.parse(fileContents);
    return NextResponse.json(patent);
  } catch (error) {
    return NextResponse.json({ message: 'Patent not found' }, { status: 404 });
  }
}

// UPDATE a patent
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const updatedPatent: Patent = await request.json();
    if (updatedPatent.id !== id) {
        return NextResponse.json({ message: 'ID mismatch' }, { status: 400 });
    }
    await fs.writeFile(dataFilePath(id), JSON.stringify(updatedPatent, null, 2));
    return NextResponse.json(updatedPatent);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating patent', error: (error as Error).message }, { status: 500 });
  }
}

// DELETE a patent
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    try {
        await fs.unlink(dataFilePath(id));
        return NextResponse.json({ message: 'Patent deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting patent', error: (error as Error).message }, { status: 500 });
    }
}

    