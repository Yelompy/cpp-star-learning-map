import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TopicLesson } from "@/components/topic-lesson";
import { knowledgeNodes, stages } from "@/lib/course-data";
import { deepDives } from "@/lib/deep-dives";

export function generateStaticParams() {
  return knowledgeNodes.map((node) => ({ id: node.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const node = knowledgeNodes.find((item) => item.id === id);
  return node ? { title: `${node.title}｜C++ 星航图`, description: node.summary } : {};
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = knowledgeNodes.findIndex((item) => item.id === id);
  if (index < 0 || !deepDives[id]) notFound();
  const node = knowledgeNodes[index];
  const stage = stages.find((item) => item.id === node.stageId);
  if (!stage) notFound();
  return <TopicLesson node={node} stage={stage} deepDive={deepDives[id]} previous={knowledgeNodes[index - 1]} next={knowledgeNodes[index + 1]} />;
}
