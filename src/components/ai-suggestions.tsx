"use client";

import { useState } from 'react';
import { suggestMissingData } from '@/ai/flows/suggest-missing-data';
import type { SuggestMissingDataInput } from '@/ai/flows/suggest-missing-data';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function AISuggestions({ data }: { data: SuggestMissingDataInput }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMissingData = Object.values(data).some(
    (value) => typeof value === 'string' && value.trim() === ''
  );

  const handleSuggest = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await suggestMissingData(data);
      setSuggestions(result.suggestedQuestions);
    } catch (e) {
      setError('Не удалось получить предложения. Пожалуйста, попробуйте еще раз.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasMissingData && suggestions.length === 0) {
    return (
       <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
         <Icons.Suggestion className="h-4 w-4 text-green-600 dark:text-green-400" />
         <AlertTitle className="text-green-800 dark:text-green-300">Все разделы заполнены!</AlertTitle>
         <AlertDescription className="text-green-700 dark:text-green-400">
            Эта патентная идея кажется завершенной. Хорошая работа!
         </AlertDescription>
       </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                <Icons.AI />
                ИИ-помощник
                </CardTitle>
                <CardDescription>Получите помощь в заполнении недостающей информации.</CardDescription>
            </div>
            <Button onClick={handleSuggest} disabled={isLoading || !hasMissingData}>
            {isLoading ? (
                <Icons.Loading className="animate-spin" />
            ) : (
                <Icons.Suggestion />
            )}
            <span>Предложить вопросы</span>
            </Button>
        </div>
      </CardHeader>
      {suggestions.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold">Вот несколько вопросов, которые помогут вам заполнить документ:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {suggestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
      {error && (
         <CardContent>
            <p className="text-destructive">{error}</p>
         </CardContent>
      )}
    </Card>
  );
}
