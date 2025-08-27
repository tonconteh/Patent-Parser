
"use client";

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Patent } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { AISuggestions } from './ai-suggestions';

const patentSchema = z.object({
  id: z.string(),
  inventionTitle: z.string().min(1, 'Требуется название изобретения.'),
  fieldOfTheInvention: z.string(),
  background: z.string(),
  problemToBeSolved: z.string(),
  summaryOfTheInvention: z.string(),
  briefDescriptionOfDrawings: z.string(),
  detailedDescription: z.string(),
  claims: z.string(),
  applications: z.string(),
});

type PatentFormProps = {
  patent: Patent;
  onSave: (data: Patent) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
};

const FormSection = ({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
);

export function PatentForm({ patent, onSave, onDelete, onCancel }: PatentFormProps) {
  const form = useForm<z.infer<typeof patentSchema>>({
    resolver: zodResolver(patentSchema),
    defaultValues: patent,
  });

  useEffect(() => {
    form.reset(patent);
  }, [patent, form]);
  
  const currentFormData = useWatch({ control: form.control });

  const onSubmit = (data: z.infer<typeof patentSchema>) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AISuggestions data={currentFormData} />
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <FormSection
                    icon={<Icons.InventionTitle className="size-6 text-primary" />}
                    title="Название изобретения"
                    description="Краткое и ясное название, отражающее суть изобретения."
                >
                    <FormField
                        control={form.control}
                        name="inventionTitle"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input placeholder="например, Новый метод для..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection
                    icon={<Icons.FieldOfTheInvention className="size-6 text-primary" />}
                    title="Область изобретения"
                    description="Техническая область, к которой относится изобретение."
                >
                    <FormField
                        control={form.control}
                        name="fieldOfTheInvention"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input placeholder="например, Информационные технологии, медицина" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                 <FormSection
                    icon={<Icons.Background className="size-6 text-primary" />}
                    title="Предпосылки / Уровень техники"
                    description="Как подобная проблема решается сейчас? Каковы аналоги и их недостатки?"
                >
                    <FormField
                        control={form.control}
                        name="background"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea rows={5} placeholder="Опишите существующие решения и их ограничения..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>
                
                 <FormSection
                    icon={<Icons.ProblemToBeSolved className="size-6 text-primary" />}
                    title="Проблема, которую нужно решить"
                    description="Какую проблему решает предлагаемое решение?"
                >
                    <FormField
                        control={form.control}
                        name="problemToBeSolved"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea rows={5} placeholder="Четко изложите проблему..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>
                
                 <FormSection
                    icon={<Icons.SummaryOfTheInvention className="size-6 text-primary" />}
                    title="Краткое описание изобретения"
                    description="В чем суть новой идеи и чем она отличается от известных решений?"
                >
                    <FormField
                        control={form.control}
                        name="summaryOfTheInvention"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea rows={5} placeholder="Обобщите основную концепцию..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

            </div>
            <div className="space-y-6">
                <FormSection
                    icon={<Icons.BriefDescriptionOfDrawings className="size-6 text-primary" />}
                    title="Краткое описание чертежей"
                    description="Если есть диаграммы/графики: что на них показано."
                >
                    <FormField
                        control={form.control}
                        name="briefDescriptionOfDrawings"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea rows={5} placeholder="например, На рисунке 1 показана архитектура системы..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>
                 <FormSection
                    icon={<Icons.DetailedDescription className="size-6 text-primary" />}
                    title="Подробное описание"
                    description="Как именно работает система или метод. Выполняемые шаги, взаимодействующие элементы."
                >
                    <FormField
                        control={form.control}
                        name="detailedDescription"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea rows={8} placeholder="Предоставьте подробное описание изобретения..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>
                 <FormSection
                    icon={<Icons.Claims className="size-6 text-primary" />}
                    title="Формула изобретения"
                    description="Один или несколько пунктов в стиле: 'Система, содержащая...' или 'Способ, состоящий из...'"
                >
                    <FormField
                        control={form.control}
                        name="claims"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea rows={5} placeholder="1. Система, включающая..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>
                 <FormSection
                    icon={<Icons.Applications className="size-6 text-primary" />}
                    title="Возможные применения"
                    description="Где и как это можно применить (примеры сценариев)."
                >
                    <FormField
                        control={form.control}
                        name="applications"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea rows={5} placeholder="Опишите потенциальные варианты использования..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>
            </div>
        </div>

        <div className="flex justify-end gap-2 sticky bottom-0 bg-background/80 backdrop-blur-sm py-4">
          <Button type="button" variant="destructive" onClick={() => onDelete(patent.id)}>
            Удалить
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">Сохранить изменения</Button>
        </div>
      </form>
    </Form>
  );
}
