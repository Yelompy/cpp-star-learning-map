"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  Compass,
  Lightbulb,
  Orbit,
  Play,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EMPTY_PROGRESS,
  knowledgeNodes,
  PROGRESS_STORAGE_KEY,
  stages,
  type KnowledgeNode,
  type LearningProgress,
} from "@/lib/course-data";

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: {
          name: string;
          title: string;
          description: string;
          inputSchema: object;
          annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
          execute: (input: unknown) => unknown;
        },
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

const connectorPairs = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [4, 5]];

function readProgress(): LearningProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const value = JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");
    if (
      value?.version !== 1 ||
      !Array.isArray(value.completedIds) ||
      !Array.isArray(value.favoriteIds)
    ) return EMPTY_PROGRESS;

    const validIds = new Set(knowledgeNodes.map((node) => node.id));
    return {
      version: 1,
      completedIds: [...new Set<string>((value.completedIds as unknown[]).filter((id: unknown): id is string => typeof id === "string" && validIds.has(id)))],
      favoriteIds: [...new Set<string>((value.favoriteIds as unknown[]).filter((id: unknown): id is string => typeof id === "string" && validIds.has(id)))],
      lastVisitedId: validIds.has(value.lastVisitedId) ? value.lastVisitedId : undefined,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function CodeBlock({ node }: { node: KnowledgeNode }) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => {
    const pattern = /(\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:alignas|auto|bool|break|case|catch|char|class|const|constexpr|continue|default|delete|do|double|else|enum|explicit|false|float|for|friend|if|include|inline|int|long|namespace|new|nullptr|operator|override|private|protected|public|return|short|signed|sizeof|static|struct|switch|template|this|thread_local|throw|true|try|typename|union|unsigned|using|virtual|void|volatile|while)\b|\b(?:std|string|vector|array|unique_ptr|shared_ptr|optional|size_t|uint32_t)\b|\b\d+(?:\.\d+)?\b)/gm;
    return node.example.code.split(pattern).filter(Boolean).map((part) => {
      if (part.startsWith("//")) return { part, kind: "comment" };
      if (/^["']/.test(part)) return { part, kind: "string" };
      if (/^\d/.test(part)) return { part, kind: "number" };
      if (/^(std|string|vector|array|unique_ptr|shared_ptr|optional|size_t|uint32_t)$/.test(part)) return { part, kind: "type" };
      if (/^[a-z_]+$/i.test(part)) return { part, kind: "keyword" };
      return { part, kind: "plain" };
    });
  }, [node]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(node.example.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-window">
      <div className="code-window__bar">
        <div className="code-dots" aria-hidden="true"><span /><span /><span /></div>
        <span>example.cpp</span>
        <button type="button" onClick={copy} aria-label="复制示例代码">
          {copied ? <Check size={16} /> : <Clipboard size={16} />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <pre><code>{tokens.map(({ part, kind }, index) => <span className={`token-${kind}`} key={`${part}-${index}`}>{part}</span>)}</code></pre>
    </div>
  );
}

function StageConstellation({
  stageId,
  completedIds,
  favoriteIds,
  onSelect,
}: {
  stageId: string;
  completedIds: Set<string>;
  favoriteIds: Set<string>;
  onSelect: (node: KnowledgeNode) => void;
}) {
  const stage = stages.find((item) => item.id === stageId)!;
  const nodes = knowledgeNodes.filter((node) => node.stageId === stageId);
  const completed = nodes.filter((node) => completedIds.has(node.id)).length;

  return (
    <article className="constellation-card" id={`stage-${stage.id}`} style={{ "--stage-color": stage.color } as React.CSSProperties}>
      <header className="constellation-card__header">
        <div>
          <span className="stage-kicker">STAGE {String(stage.order).padStart(2, "0")}</span>
          <h2>{stage.title}</h2>
          <p>{stage.subtitle}</p>
        </div>
        <div className="stage-progress" aria-label={`${stage.title}完成 ${completed}/6`}>
          <strong>{completed}</strong><span>/ 6</span>
        </div>
      </header>

      <div className="constellation-field">
        <svg className="star-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {connectorPairs.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              x1={nodes[from].position.x}
              y1={nodes[from].position.y}
              x2={nodes[to].position.x}
              y2={nodes[to].position.y}
              className={completedIds.has(nodes[to].id) ? "is-complete" : ""}
            />
          ))}
        </svg>

        {nodes.map((node, index) => {
          const isComplete = completedIds.has(node.id);
          const isFavorite = favoriteIds.has(node.id);
          return (
            <Tooltip key={node.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`star-node ${isComplete ? "is-complete" : ""}`}
                  style={{ left: `${node.position.x}%`, top: `${node.position.y}%`, animationDelay: `${index * 0.37}s` }}
                  onClick={() => onSelect(node)}
                  aria-label={`${node.title}${isComplete ? "，已学完" : ""}${isFavorite ? "，已收藏" : ""}`}
                >
                  <span className="star-node__spark" aria-hidden="true"><span /></span>
                  <span className="star-node__label">{node.title}</span>
                  {isComplete && <CheckCircle2 className="star-node__status" size={15} aria-hidden="true" />}
                  {isFavorite && <Bookmark className="star-node__favorite" size={13} aria-hidden="true" />}
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={12} className="star-tooltip">
                <span className="star-tooltip__stage">{stage.title} · {String(index + 1).padStart(2, "0")}</span>
                <strong>{node.title}</strong>
                <p>{node.summary}</p>
                <span className="star-tooltip__action">点击进入学习 <ArrowRight size={13} /></span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </article>
  );
}

export function StarCourse() {
  const [progress, setProgress] = useState<LearningProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<KnowledgeNode | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setProgress(readProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Learning stays available when storage is blocked or full.
    }
  }, [progress, ready]);

  const completedIds = useMemo(() => new Set(progress.completedIds), [progress.completedIds]);
  const favoriteIds = useMemo(() => new Set(progress.favoriteIds), [progress.favoriteIds]);
  const percent = Math.round((progress.completedIds.length / knowledgeNodes.length) * 100);
  const nextNode = knowledgeNodes.find((node) => !completedIds.has(node.id)) ?? knowledgeNodes[0];

  const openNode = useCallback((node: KnowledgeNode) => {
    setSelected(node);
    setShowHint(false);
    setProgress((current) => ({ ...current, lastVisitedId: node.id }));
  }, []);

  const updateNodeStatus = useCallback((nodeId: string, key: "completedIds" | "favoriteIds", enabled?: boolean) => {
    setProgress((current) => {
      const values = new Set(current[key]);
      const shouldEnable = enabled ?? !values.has(nodeId);
      if (shouldEnable) values.add(nodeId);
      else values.delete(nodeId);
      return { ...current, [key]: [...values] };
    });
  }, []);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const validIds = new Set(knowledgeNodes.map((node) => node.id));
    void Promise.resolve(context.registerTool({
      name: "set_cpp_topic_status",
      title: "更新 C++ 学习状态",
      description: "把指定 C++ 知识点标记为已学或未学，并同步更新页面进度。",
      inputSchema: {
        type: "object",
        properties: { topicId: { type: "string" }, completed: { type: "boolean" } },
        required: ["topicId", "completed"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const value = input as { topicId?: unknown; completed?: unknown };
        if (typeof value.topicId !== "string" || !validIds.has(value.topicId) || typeof value.completed !== "boolean") {
          throw new Error("topicId 或 completed 无效");
        }
        updateNodeStatus(value.topicId, "completedIds", value.completed);
        return { topicId: value.topicId, completed: value.completed };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [updateNodeStatus]);

  const continueLearning = () => {
    const last = knowledgeNodes.find((node) => node.id === progress.lastVisitedId);
    openNode(last && !completedIds.has(last.id) ? last : nextNode);
  };

  return (
    <TooltipProvider delayDuration={180}>
      <main className="site-shell">
        <div className="sky-noise" aria-hidden="true" />
        <div className="nebula nebula-one" aria-hidden="true" />
        <div className="nebula nebula-two" aria-hidden="true" />

        <header className="topbar">
          <a href="#top" className="brand" aria-label="C++ 星航图首页">
            <span className="brand-mark"><Orbit size={22} /></span>
            <span><strong>C++ 星航图</strong><small>从第一行代码，到第一份工作</small></span>
          </a>
          <nav className="stage-nav" aria-label="学习阶段">
            {stages.map((stage) => <a key={stage.id} href={`#stage-${stage.id}`}>{stage.order}. {stage.title}</a>)}
          </nav>
          <Button className="continue-button" onClick={continueLearning}>
            <Play size={15} fill="currentColor" /> 继续学习
          </Button>
        </header>

        <section className="mission-control" id="top">
          <div className="mission-copy">
            <span className="eyebrow"><Sparkles size={14} /> 你的 C++ 学习宇宙</span>
            <h1>循着星光，<br /><em>建立真正的工程能力。</em></h1>
            <p>48 个知识点，8 段成长轨道。将鼠标移向星星查看线索，点击进入完整章节。</p>
          </div>
          <div className="progress-panel">
            <div className="progress-orbit" style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{ready ? percent : 0}<span>%</span></strong><small>航程完成</small></div>
            </div>
            <div className="progress-summary">
              <span>总学习进度</span>
              <strong>{ready ? progress.completedIds.length : 0} <small>/ {knowledgeNodes.length} 颗星</small></strong>
              <Progress value={ready ? percent : 0} aria-label={`总学习进度 ${percent}%`} />
              <button type="button" onClick={continueLearning}>{progress.completedIds.length ? "从上次的位置继续" : "点亮第一颗星"}<ArrowRight size={15} /></button>
            </div>
          </div>
        </section>

        <section className="map-intro" aria-labelledby="map-title">
          <div><span className="section-index">STAR MAP / 01</span><h2 id="map-title">学习星图</h2></div>
          <div className="map-legend" aria-label="星图图例">
            <span><i className="legend-star" /> 待探索</span>
            <span><i className="legend-star is-complete" /> 已学完</span>
            <span><Bookmark size={14} /> 已收藏</span>
          </div>
        </section>

        <section className="constellation-grid" aria-label="C++ 学习阶段星图">
          {stages.map((stage) => (
            <StageConstellation key={stage.id} stageId={stage.id} completedIds={completedIds} favoriteIds={favoriteIds} onSelect={openNode} />
          ))}
        </section>

        <footer>
          <span><Orbit size={18} /> C++ 星航图</span>
          <p>学习不是收集术语，而是不断写下、运行、解释和改进代码。</p>
          <a href="#top">返回星图顶部</a>
        </footer>

        <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent className="lesson-sheet" aria-describedby={selected ? `${selected.id}-summary` : undefined}>
            {selected && (
              <>
                <SheetHeader className="lesson-header">
                  <div className="lesson-stage"><span>{stages.find((stage) => stage.id === selected.stageId)?.title}</span><i />{String(knowledgeNodes.filter((node) => node.stageId === selected.stageId).findIndex((node) => node.id === selected.id) + 1).padStart(2, "0")}</div>
                  <SheetTitle>{selected.title}</SheetTitle>
                  <SheetDescription id={`${selected.id}-summary`}>{selected.summary}</SheetDescription>
                  <div className="lesson-actions">
                    <Button
                      variant={completedIds.has(selected.id) ? "secondary" : "default"}
                      onClick={() => updateNodeStatus(selected.id, "completedIds")}
                    >
                      {completedIds.has(selected.id) ? <CheckCircle2 /> : <Target />}
                      {completedIds.has(selected.id) ? "已完成本节" : "标记为已学"}
                    </Button>
                    <Button variant="outline" onClick={() => updateNodeStatus(selected.id, "favoriteIds")}>
                      {favoriteIds.has(selected.id) ? <BookmarkCheck /> : <Bookmark />}
                      {favoriteIds.has(selected.id) ? "已收藏" : "收藏"}
                    </Button>
                  </div>
                  <Link className="deep-dive-link" href={`/topic/${selected.id}`}>
                    <BookOpen size={17} />
                    进入完整专题页
                    <ArrowRight size={15} />
                  </Link>
                </SheetHeader>

                <div className="lesson-body">
                  <section className="lesson-goal"><Target size={19} /><div><h3>本节目标</h3><p>{selected.goal}</p></div></section>

                  <section>
                    <span className="lesson-kicker">CONCEPT</span>
                    <h3>核心概念</h3>
                    {selected.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {selected.facts && (
                      <div className="type-facts" role="table" aria-label="常用基础类型大小">
                        <div className="type-facts__row type-facts__head" role="row">
                          <span role="columnheader">类型</span><span role="columnheader">常见 64 位平台</span><span role="columnheader">标准保证</span>
                        </div>
                        {selected.facts.map((fact) => (
                          <div className="type-facts__row" role="row" key={fact.label}>
                            <code role="cell">{fact.label}</code><strong role="cell">{fact.typical}</strong><span role="cell">{fact.guarantee}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <span className="lesson-kicker">CODE LAB</span>
                    <h3><Code2 size={18} /> 示例代码</h3>
                    <CodeBlock node={selected} />
                    <div className="output-block"><span>运行结果</span><pre>{selected.example.output}</pre></div>
                    <p>{selected.example.explanation}</p>
                  </section>

                  <section className="lesson-warnings">
                    <span className="lesson-kicker">WATCH OUT</span>
                    <h3><TriangleAlert size={18} /> 常见错误</h3>
                    <ul>{selected.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul>
                  </section>

                  <section className="interview-card">
                    <Lightbulb size={20} />
                    <div><span>面试观测站</span><p>{selected.interviewTip}</p></div>
                  </section>

                  <section className="exercise-card">
                    <span className="lesson-kicker">PRACTICE</span>
                    <h3>动手练习</h3>
                    <p>{selected.exercise.prompt}</p>
                    <button type="button" onClick={() => setShowHint((value) => !value)}>
                      <Compass size={16} /> {showHint ? "收起提示" : "查看提示"}
                    </button>
                    {showHint && <div className="exercise-hint"><strong>提示</strong>{selected.exercise.hint}</div>}
                  </section>

                  <section className="career-note"><span>与就业的连接</span><p>{selected.career}</p></section>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </TooltipProvider>
  );
}
