
"use client";

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PatentForm } from '@/components/patent-form';
import type { Patent } from '@/lib/types';
import { Icons } from '@/components/icons';
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from '@/components/ui/skeleton';
import { TextParser } from '@/components/text-parser';

export default function Home() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [selectedPatentId, setSelectedPatentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [initialText, setInitialText] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs once on mount to check for text from the bookmarklet
    const params = new URLSearchParams(window.location.search);
    const textToParse = params.get('text');
    if (textToParse) {
      const decodedText = decodeURIComponent(textToParse);
      handleNewPatentWithText(decodedText);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const res = await fetch('/api/patents');
        if (!res.ok) throw new Error('Failed to fetch patents');
        const data = await res.json();
        setPatents(data);
        if (data.length > 0 && !selectedPatentId) {
          setSelectedPatentId(data[0].id);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить патенты.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatents();
  }, [toast, selectedPatentId]);

  const selectedPatent = patents.find((p) => p.id === selectedPatentId) || null;

  const handleSelectPatent = (id: string) => {
    setSelectedPatentId(id);
  };

  const handleNewPatentWithText = async (text: string) => {
    const newPatent = await createPatent();
    if (newPatent) {
      setInitialText(text); // Pass text to TextParser for the new patent
    }
  };


  const createPatent = async (title: string = 'Новая идея изобретения'): Promise<Patent | null> => {
    const newPatentData: Omit<Patent, 'id'> = {
      inventionTitle: title,
      fieldOfTheInvention: '',
      background: '',
      problemToBeSolved: '',
      summaryOfTheInvention: '',
      briefDescriptionOfDrawings: '',
      detailedDescription: '',
      claims: '',
      applications: '',
    };

    try {
        const res = await fetch('/api/patents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPatentData),
        });
        if (!res.ok) throw new Error('Failed to create patent');
        const createdPatent: Patent = await res.json();
        setPatents([createdPatent, ...patents]);
        setSelectedPatentId(createdPatent.id);
        return createdPatent;
    } catch(error) {
        console.error(error);
        toast({
            title: "Ошибка",
            description: "Не удалось создать новый патент.",
            variant: "destructive"
        });
        return null;
    }
  };


  const handleNewPatent = async () => {
    await createPatent();
     toast({
        title: "Патент создан",
        description: "Ваша новая идея патента была успешно создана.",
    });
  };

  const handleSave = async (data: Patent) => {
     try {
        const res = await fetch(`/api/patents/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to save patent');
        setPatents(patents.map((p) => (p.id === data.id ? data : p)));
        toast({
            title: "Патент сохранен",
            description: `"${data.inventionTitle}" был обновлен.`,
        });
     } catch (error) {
         console.error(error);
         toast({
            title: "Ошибка",
            description: "Не удалось сохранить патент.",
            variant: "destructive"
        });
     }
  };

  const handleDelete = async (id: string) => {
    const deletedPatent = patents.find(p => p.id === id);
     try {
        const res = await fetch(`/api/patents/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete patent');
        
        const newPatents = patents.filter((p) => p.id !== id);
        setPatents(newPatents);
        if (selectedPatentId === id) {
          setSelectedPatentId(newPatents[0]?.id ?? null);
        }
        toast({
            title: "Патент удален",
            description: `"${deletedPatent?.inventionTitle}" был удален.`,
            variant: "destructive"
        });
     } catch (error) {
         console.error(error);
         toast({
            title: "Ошибка",
            description: "Не удалось удалить патент.",
            variant: "destructive"
        });
     }
  };

  const handleCancel = () => {
    // In a real app, you might want to revert changes.
    // Here we just de-select, assuming no changes are kept.
    if(selectedPatent) {
       // do nothing
    }
  };

  const handleParse = (parsedData: Partial<Patent>) => {
    if (!selectedPatent) return;
    const updatedPatent = { ...selectedPatent, ...parsedData };
    setPatents(patents.map(p => p.id === selectedPatent.id ? updatedPatent : p));
    // The key on PatentForm will force a re-render with the new data
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.Logo className="size-6" />
            <h1 className="text-lg font-semibold">Patent Parser</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button onClick={handleNewPatent} className="w-full justify-start">
                <Plus className="mr-2" /> Новая патентная идея
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {isLoading ? (
                <div className="p-2 space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ) : (
                patents.map((patent) => (
                <SidebarMenuItem key={patent.id}>
                    <SidebarMenuButton
                    onClick={() => handleSelectPatent(patent.id)}
                    isActive={selectedPatentId === patent.id}
                    className="w-full justify-start"
                    >
                    <span className="truncate">{patent.inventionTitle}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 flex flex-col h-screen">
            <header className="p-4 border-b flex items-center gap-4">
              <SidebarTrigger />
              <h2 className="text-xl font-semibold truncate">
                {selectedPatent ? selectedPatent.inventionTitle : 'Выберите идею патента'}
              </h2>
            </header>

          <div className="flex-1 overflow-auto p-4 md:p-6">
            {isLoading ? (
                <div className="space-y-6">
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <Skeleton className="h-40 w-full" />
                            <Skeleton className="h-40 w-full" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-40 w-full" />
                            <Skeleton className="h-40 w-full" />
                        </div>
                    </div>
                </div>
            ) : selectedPatent ? (
              <>
                 <TextParser onParse={handleParse} initialText={initialText || ''} />
                 <div className="mt-6">
                    <PatentForm
                        key={selectedPatent.id} // Use key to force re-render on patent change
                        patent={selectedPatent}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        onCancel={handleCancel}
                    />
                 </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Icons.Logo className="size-16 mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold">Добро пожаловать в Patent Parser</h3>
                <p className="text-muted-foreground">
                  Выберите идею патента на боковой панели или создайте новую, чтобы начать.
                </p>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
