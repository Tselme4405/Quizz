"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GeminiIcon from "../icons/GeminiIcon";
import FileIcon from "../icons/FileIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";

type InputCardProps = {
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setArticleId: React.Dispatch<React.SetStateAction<string>>;
};

export default function InputCard({
  setSummary,
  title,
  setTitle,
  content,
  setContent,
  setStep,
  setArticleId,
}: InputCardProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!title || !content) return;

    setLoading(true);
    try {
      const generateRes = await axios.post("/api/generate", {
        content,
      });

      const generatedSummary = generateRes.data.result;

      const articleRes = await axios.post("/api/articles", {
        title,
        content,
        summary: generatedSummary,
      });

      const newArticleId = articleRes.data?.article?.id;

      if (!newArticleId) {
        throw new Error("Article ID not returned from /api/articles");
      }

      setSummary(generatedSummary);
      setArticleId(newArticleId);

      console.log("article saved", articleRes.data);
      console.log("newArticleId", newArticleId);

      setStep(2);
    } catch (err: any) {
      console.error(
        "HANDLE GENERATE ERROR:",
        err?.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-214 w-full min-h-110.5 p-7 gap-5">
      <CardHeader>
        <div className="flex gap-2 items-center">
          <GeminiIcon />
          <CardTitle>Article Quiz Generator</CardTitle>
        </div>
        <CardDescription>
          Paste your article below to generate a summarize and quiz question.
          Your articles will saved in the sidebar for future reference.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <div className="flex gap-1">
                <FileIcon />
                <Label htmlFor="title">Article Title</Label>
              </div>
              <Input
                id="title"
                type="text"
                placeholder="Enter a title for your article..."
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-1">
                <FileIcon />
                <Label htmlFor="content">Article Content</Label>
              </div>
              <Textarea
                id="content"
                required
                placeholder="Paste your article content here..."
                className="min-h-30 max-h-60"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2 items-end">
        <Button
          type="button"
          className="w-40 cursor-pointer"
          disabled={!title || !content || loading}
          onClick={handleGenerate}
        >
          {loading ? "Generate summary..." : "Generate summary"}
        </Button>
      </CardFooter>
    </Card>
  );
}
