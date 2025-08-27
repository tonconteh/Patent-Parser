
import {
  FileText,
  FlaskConical,
  History,
  Target,
  BookText,
  GalleryHorizontal,
  BookOpenCheck,
  Gavel,
  AppWindow,
  Lightbulb,
  Loader2,
  BrainCircuit,
  ClipboardPaste,
  Wand2,
  BookMarked
} from 'lucide-react';

export const Icons = {
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 10.5 2 2 2-2" />
      <path d="M12 12.5v-2" />
      <path d="M9 16h6" />
      <path d="M9 18h3" />
    </svg>
  ),
  InventionTitle: FileText,
  FieldOfTheInvention: FlaskConical,
  Background: History,
  ProblemToBeSolved: Target,
  SummaryOfTheInvention: BookText,
  BriefDescriptionOfDrawings: GalleryHorizontal,
  DetailedDescription: BookOpenCheck,
  Claims: Gavel,
  Applications: AppWindow,
  Suggestion: Lightbulb,
  Loading: Loader2,
  AI: BrainCircuit,
  Paster: ClipboardPaste,
  Analyze: Wand2,
  Bookmark: BookMarked,
};
