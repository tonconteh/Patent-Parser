'use server';

/**
 * @fileOverview AI flow to suggest questions or prompts to fill in missing data in the scanned tab.
 *
 * - suggestMissingData - A function that suggests questions for missing patent data.
 * - SuggestMissingDataInput - The input type for the suggestMissingData function.
 * - SuggestMissingDataOutput - The return type for the suggestMissingData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMissingDataInputSchema = z.object({
  inventionTitle: z.string().optional().describe('The title of the invention.'),
  fieldOfTheInvention: z
    .string()
    .optional()
    .describe('The field to which the invention pertains.'),
  background: z.string().optional().describe('Background or prior art.'),
  problemToBeSolved: z.string().optional().describe('The problem the invention solves.'),
  summaryOfTheInvention: z
    .string()
    .optional()
    .describe('A summary of the invention.'),
  briefDescriptionOfDrawings: z
    .string()
    .optional()
    .describe('A brief description of any drawings.'),
  detailedDescription: z
    .string()
    .optional()
    .describe('A detailed description of the invention.'),
  claims: z.string().optional().describe('The claims of the invention.'),
  applications: z.string().optional().describe('Possible applications of the invention.'),
});
export type SuggestMissingDataInput = z.infer<typeof SuggestMissingDataInputSchema>;

const SuggestMissingDataOutputSchema = z.object({
  suggestedQuestions: z.array(z.string()).describe('Suggested questions to fill in missing data.'),
});
export type SuggestMissingDataOutput = z.infer<typeof SuggestMissingDataOutputSchema>;

export async function suggestMissingData(input: SuggestMissingDataInput): Promise<SuggestMissingDataOutput> {
  return suggestMissingDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMissingDataPrompt',
  input: {schema: SuggestMissingDataInputSchema},
  output: {schema: SuggestMissingDataOutputSchema},
  prompt: `Based on the following information extracted from a scanned tab, suggest questions to ask the user to fill in any missing information related to a patent invention.

  Invention Title: {{{inventionTitle}}}
  Field of the Invention: {{{fieldOfTheInvention}}}
  Background: {{{background}}}
  Problem to be Solved: {{{problemToBeSolved}}}
  Summary of the Invention: {{{summaryOfTheInvention}}}
  Brief Description of Drawings: {{{briefDescriptionOfDrawings}}}
  Detailed Description: {{{detailedDescription}}}
  Claims: {{{claims}}}
  Applications: {{{applications}}}

  Suggest specific questions that can be asked to gather more details about each missing section. Return the questions as a JSON array of strings.
  `,
});

const suggestMissingDataFlow = ai.defineFlow(
  {
    name: 'suggestMissingDataFlow',
    inputSchema: SuggestMissingDataInputSchema,
    outputSchema: SuggestMissingDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
