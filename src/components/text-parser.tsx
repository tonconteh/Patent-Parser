
"use client";

import { useEffect, useState } from 'react';
import type { Patent } from '@/lib/types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Icons } from './icons';
import { parseTextToPatent } from '@/ai/flows/parse-text-to-patent';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


type TextParserProps = {
    onParse: (parsedData: Partial<Patent>) => void;
    initialText?: string;
};

export function TextParser({ onParse, initialText = '' }: TextParserProps) {
  const [text, setText] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setText(initialText);
  }, [initialText]);


  const handleAnalyze = async () => {
    if (!text.trim()) {
        toast({
            title: "Текст отсутствует",
            description: "Пожалуйста, вставьте текст для анализа.",
            variant: "destructive"
        });
        return;
    }
    setIsLoading(true);
    try {
        const result = await parseTextToPatent({ text });
        onParse(result);
        toast({
            title: "Анализ завершен",
            description: "Данные были распределены по соответствующим полям."
        });
    } catch (error) {
        console.error("Failed to parse text:", error);
        toast({
            title: "Ошибка анализа",
            description: "Не удалось проанализировать текст. Пожалуйста, попробуйте еще раз.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  const bookmarkletCode = `javascript:(function(){const text=document.body.innerText;const url='${
    typeof window !== 'undefined' ? window.location.origin : ''
  }/?text='+encodeURIComponent(text);window.open(url,'_blank');})();`;

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Icons.Paster />
                Парсер текста
            </CardTitle>
            <CardDescription>
                Вставьте сюда текст для автоматического разбора или используйте закладку для захвата текста с любой страницы.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Textarea
                placeholder="Вставьте скопированный текст здесь..."
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-between items-center">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? (
                        <Icons.Loading className="animate-spin" />
                    ) : (
                        <Icons.Analyze />
                    )}
                    <span>Анализировать текст</span>
                </Button>
                
                 <Accordion type="single" collapsible className="w-auto">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <Icons.Bookmark />
                            <span>Как использовать Bookmarklet?</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                       <div className="p-4 bg-muted/50 rounded-lg space-y-3 max-w-md">
                         <p className="text-sm">1. Перетащите эту ссылку на панель закладок вашего браузера: <a href={bookmarkletCode} className="font-semibold text-primary">Parse Tab Content</a></p>
                         <p className="text-sm">2. Находясь на любой странице, кликните на эту закладку.</p>
                         <p className="text-sm">3. Откроется новая вкладка с вашим приложением, и текст со страницы будет вставлен в это поле.</p>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </div>
        </CardContent>
    </Card>
  );
}
