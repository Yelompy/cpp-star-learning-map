"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  Compass,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Orbit,
  Route,
  ShieldAlert,
  Telescope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/star-course";
import {
  EMPTY_PROGRESS,
  PROGRESS_STORAGE_KEY,
  type KnowledgeNode,
  type LearningProgress,
  type LearningStage,
} from "@/lib/course-data";
import type { DeepDive } from "@/lib/deep-dives";
import type { TopicExpansion } from "@/lib/topic-expansions";

function loadProgress(): LearningProgress {
  try {
    const value = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");
    return value?.version === 1 && Array.isArray(value.completedIds) && Array.isArray(value.favoriteIds)
      ? value
      : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function TopicLesson({
  node,
  stage,
  deepDive,
  expansion,
  previous,
  next,
}: {
  node: KnowledgeNode;
  stage: LearningStage;
  deepDive: DeepDive;
  expansion: TopicExpansion;
  previous?: KnowledgeNode;
  next?: KnowledgeNode;
}) {
  const [progress, setProgress] = useState<LearningProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    setProgress({ ...loaded, lastVisitedId: node.id });
    setReady(true);
  }, [node.id]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress)); } catch { /* Reading still works without storage. */ }
  }, [progress, ready]);

  const toggle = (key: "completedIds" | "favoriteIds") => {
    setProgress((current) => {
      const values = new Set(current[key]);
      if (values.has(node.id)) values.delete(node.id); else values.add(node.id);
      return { ...current, [key]: [...values] };
    });
  };

  const complete = progress.completedIds.includes(node.id);
  const favorite = progress.favoriteIds.includes(node.id);

  return (
    <main className="topic-page" style={{ "--stage-color": stage.color } as React.CSSProperties}>
      <div className="topic-sky" aria-hidden="true" />
      <header className="topic-topbar">
        <a href={`/#stage-${stage.id}`}><ArrowLeft size={16} /> 返回学习星图</a>
        <span><Orbit size={18} /> C++ 星航图</span>
        <div className="topic-actions">
          <Button variant="outline" onClick={() => toggle("favoriteIds")}>
            {favorite ? <BookmarkCheck /> : <Bookmark />}{favorite ? "已收藏" : "收藏"}
          </Button>
          <Button onClick={() => toggle("completedIds")}>
            <CheckCircle2 />{complete ? "已学完" : "标记已学"}
          </Button>
        </div>
      </header>

      <div className="topic-layout">
        <aside className="topic-rail" aria-label="专题目录">
          <span className="topic-stage-number">STAGE {String(stage.order).padStart(2, "0")}</span>
          <strong>{stage.title}</strong>
          <nav>
            <a href="#mental-model">核心模型</a>
            <a href="#mechanism">底层机制</a>
            <a href="#code">代码实验</a>
            <a href="#engineering">工程现场</a>
            <a href="#boundaries">陷阱拆解</a>
            <a href="#practice">动手验证</a>
            <a href="#further">扩展路线</a>
          </nav>
        </aside>

        <article className="topic-article">
          <header className="topic-hero">
            <div className="topic-orbit-icon"><Telescope size={27} /></div>
            <span>{stage.title} · 深度专题</span>
            <h1>{node.title}</h1>
            <p>{node.goal}</p>
          </header>

          <section id="mental-model" className="topic-section">
            <span className="topic-kicker">01 / MENTAL MODEL</span>
            <h2>先建立正确的核心模型</h2>
            {node.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {node.facts && (
              <div className="type-facts" role="table" aria-label="常用基础类型大小">
                <div className="type-facts__row type-facts__head" role="row"><span role="columnheader">类型</span><span role="columnheader">常见 64 位平台</span><span role="columnheader">标准保证</span></div>
                {node.facts.map((fact) => <div className="type-facts__row" role="row" key={fact.label}><code role="cell">{fact.label}</code><strong role="cell">{fact.typical}</strong><span role="cell">{fact.guarantee}</span></div>)}
              </div>
            )}
          </section>

          <section id="mechanism" className="topic-section">
            <span className="topic-kicker">02 / UNDER THE HOOD</span>
            <h2>为什么会这样</h2>
            <div className="mechanism-card"><CircleDot size={22} /><p>{deepDive.mechanism}</p></div>
            <ul className="detail-list">{deepDive.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          </section>

          <section id="code" className="topic-section">
            <span className="topic-kicker">03 / CODE LAB</span>
            <h2>用代码观察行为</h2>
            <CodeBlock node={node} />
            <div className="topic-output"><span>预期结果</span><pre>{node.example.output}</pre></div>
            <p>{node.example.explanation}</p>
          </section>

          <section id="engineering" className="topic-section">
            <span className="topic-kicker">04 / IN PRACTICE</span>
            <h2>它在真实工程中解决什么</h2>
            <div className="use-case-grid">
              {expansion.useCases.map(([title, description]) => (
                <article className="use-case-card" key={title}>
                  <BriefcaseBusiness size={21} />
                  <div><h3>{title}</h3><p>{description}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section id="boundaries" className="topic-section">
            <span className="topic-kicker">05 / BOUNDARIES</span>
            <h2>不仅要知道错了，还要知道为什么</h2>
            <div className="boundary-card"><ShieldAlert size={22} /><p>{deepDive.boundary}</p></div>
            <div className="pitfall-explanations">
              {node.pitfalls.map((pitfall, index) => (
                <article key={pitfall}>
                  <span>常见错误 {String(index + 1).padStart(2, "0")}</span>
                  <h3>{pitfall}</h3>
                  <p>{expansion.pitfallAnalysis[index]}</p>
                </article>
              ))}
            </div>
            <div className="interview-card"><Lightbulb size={20} /><div><span>面试观测站</span><p>{node.interviewTip}</p></div></div>
          </section>

          <section id="practice" className="topic-section">
            <span className="topic-kicker">06 / VERIFY IT</span>
            <h2>不要只记结论，亲手验证</h2>
            <div className="verify-card"><FlaskConical size={22} /><p>{deepDive.verify}</p></div>
            <div className="topic-exercise">
              <Compass size={22} />
              <div><h3>练习任务</h3><p>{node.exercise.prompt}</p><button type="button" onClick={() => setShowHint((value) => !value)}>{showHint ? "收起提示" : "查看提示"}</button>{showHint && <small>{node.exercise.hint}</small>}</div>
            </div>
            <div className="mastery-card">
              <div><ListChecks size={22} /><h3>掌握检查清单</h3></div>
              <ul>{expansion.mastery.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </section>

          <section id="further" className="topic-section">
            <span className="topic-kicker">07 / NEXT ORBIT</span>
            <h2>继续扩展这颗知识星</h2>
            <div className="further-grid">
              {expansion.further.map(([title, description]) => (
                <article key={title}><Route size={20} /><div><h3>{title}</h3><p>{description}</p></div></article>
              ))}
            </div>
          </section>

          <section className="career-note topic-career"><span>与就业的连接</span><p>{node.career}</p></section>

          <nav className="topic-pagination" aria-label="相邻知识点">
            {previous ? <a href={`/topic/${previous.id}`}><ArrowLeft size={17} /><span><small>上一节</small>{previous.title}</span></a> : <span />}
            {next ? <a href={`/topic/${next.id}`}><span><small>下一节</small>{next.title}</span><ArrowRight size={17} /></a> : <a href="/"><span><small>完成路线</small>返回学习星图</span><Orbit size={17} /></a>}
          </nav>
        </article>
      </div>
    </main>
  );
}
