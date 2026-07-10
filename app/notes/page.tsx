import type { Metadata } from "next";
import { NotesPage } from "./NotesPage";

export const metadata: Metadata = {
  title: "技术笔记 · Jiajun He",
  description: "关于语音识别、LLM 与多模态情感计算的导读、教程和实践笔记。",
};

export default function Page() {
  return <NotesPage />;
}
