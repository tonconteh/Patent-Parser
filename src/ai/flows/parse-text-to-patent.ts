
'use server';

/**
 * @fileOverview AI flow to parse a block of text into a structured patent format.
 *
 * - parseTextToPatent - A function that parses text and distributes it into patent fields.
 * - ParseTextToPatentInput - The input type for the function.
 * - ParseTextToPatentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Patent } from '@/lib/types';

const ParseTextToPatentInputSchema = z.object({
  text: z.string().describe('The raw text to be parsed and structured.'),
});
export type ParseTextToPatentInput = z.infer<typeof ParseTextToPatentInputSchema>;

// The output schema is a partial Patent type, as not all fields may be found.
const ParseTextToPatentOutputSchema = z.object({
  inventionTitle: z.string().optional(),
  fieldOfTheInvention: z.string().optional(),
  background: z.string().optional(),
  problemToBeSolved: z.string().optional(),
  summaryOfTheInvention: z.string().optional(),
  briefDescriptionOfDrawings: z.string().optional(),
  detailedDescription: z.string().optional(),
  claims: z.string().optional(),
  applications: z.string().optional(),
}).describe('The structured patent data extracted from the text.');
export type ParseTextToPatentOutput = z.infer<typeof ParseTextToPatentOutputSchema>;


export async function parseTextToPatent(input: ParseTextToPatentInput): Promise<ParseTextToPatentOutput> {
  return parseTextToPatentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseTextToPatentPrompt',
  input: {schema: ParseTextToPatentInputSchema},
  output: {schema: ParseTextToPatentOutputSchema},
  prompt: `You are an expert in patent documentation. Your task is to analyze the following text and extract information for the standard sections of a patent application.

**IMPORTANT: All output must be in Russian.**

The sections are:
- Invention Title: A concise, descriptive title.
- Field of the Invention: The technical area.
- Background: Prior art and existing solutions.
- Problem to be Solved: The specific problem the invention addresses.
- Summary of the Invention: A brief overview of the invention's main aspects.
- Brief Description of Drawings: A short description of any figures or diagrams.
- Detailed Description: A thorough explanation of how the invention works.
- Claims: The specific legal claims defining the scope of the invention.
- Applications: Potential uses and scenarios for the invention.

Analyze the text below and populate as many of these sections as you can based on the content. If a section is not clearly present in the text, leave it empty. The "Detailed Description" should contain the main body of the text if it's not otherwise categorized.

Text to analyze:
{{{text}}}
`,
});

const parseTextToPatentFlow = ai.defineFlow(
  {
    name: 'parseTextToPatentFlow',
    inputSchema: ParseTextToPatentInputSchema,
    outputSchema: ParseTextToPatentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // Ensure the detailed description is not lost if the model doesn't return it
    if (output && !output.detailedDescription && input.text.length > 200) {
        output.detailedDescription = input.text;
    }

    return output!;
  }
);
