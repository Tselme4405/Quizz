"use client";
import InputCard from "./InputCard";
import SummarizedCard from "./SummarizedCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import QuickTest from "./QuickTest";
import QuizCompleted from "./QuizCompleted";
import ArticleHistory from "./ArticleHistory";
import HistoryQuickTest from "./HistoryQuickTest";
import HistoryQuizCompleted from "./HistoryQuizCompleted";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
};

type SwitchCardsProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  selectedArticleId: string;
};

export default function SwitchCards({
  step,
  setStep,
  selectedArticleId,
}: SwitchCardsProps) {
  const [summary, setSummary] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [historyQuiz, setHistoryQuiz] = useState<QuizQuestion[]>([]);
  const [articleId, setArticleId] = useState<string>("");
  const [, setSelectedOptions] = useState<number[]>([]);
  const [result, setResult] = useState<
    {
      question: string;
      selected: string;
      correct: number;
      isCorrect: boolean;
    }[]
  >([]);

  console.log("articleId in SwitchCards:", articleId);

  return (
    <div className="flex w-full max-w-[760px] flex-col items-center gap-4">
      <div className="flex w-full flex-col items-start gap-4">
        {(step === 2 || step === 5) && (
          <Button
            onClick={() => {
              setStep(1);
            }}
            variant="outline"
            className="h-10 w-10 cursor-pointer rounded-xl border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <ChevronLeft className="size-4" />
          </Button>
        )}

        {step === 2 && (
          <SummarizedCard
            quiz={quiz}
            setQuiz={setQuiz}
            summary={summary}
            setSummary={setSummary}
            title={title}
            content={content}
            setStep={setStep}
            articleId={articleId}
          />
        )}
      </div>

      {step === 1 && (
        <InputCard
          summary={summary}
          setSummary={setSummary}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          setStep={setStep}
          setArticleId={setArticleId}
        />
      )}

      {step === 3 && (
        <QuickTest
          setStep={setStep}
          quiz={quiz}
          setSelectedOptions={setSelectedOptions}
          setResult={setResult}
        />
      )}

      {step === 4 && (
        <QuizCompleted
          setStep={setStep}
          result={result}
          setSelectedOptions={setSelectedOptions}
          setResult={setResult}
        />
      )}

      {step === 5 && (
        <ArticleHistory
          setStep={setStep}
          selectedArticleId={selectedArticleId}
          setHistoryQuiz={setHistoryQuiz}
        />
      )}

      {step === 6 && (
        <HistoryQuickTest
          setStep={setStep}
          historyQuiz={historyQuiz}
          setSelectedOptions={setSelectedOptions}
          setResult={setResult}
        />
      )}

      {step === 7 && (
        <HistoryQuizCompleted
          setStep={setStep}
          result={result}
          setSelectedOptions={setSelectedOptions}
          setResult={setResult}
        />
      )}
    </div>
  );
}
