"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import {
  Bot,
  ExternalLink,
  Loader2,
  MessageSquareText,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BlurFade } from "@/components/velora/blur-fade";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { askAssistant, type AskResponse } from "@/services/assistantService";

export default function AssistantPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const timer = window.setTimeout(() => {
      setAuthChecked(true);
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await askAssistant(question.trim());
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-to)]" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <AuroraBackground intensity="vivid" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <BlurFade delay={0.05} className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-from)]/40 bg-[var(--brand-from)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-to)]">
            <Sparkles className="h-3.5 w-3.5" />
            AI Travel Assistant
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ask <AnimatedGradientText>KelanaAI</AnimatedGradientText>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--muted-foreground)] sm:text-base">
            Discover travel recommendations, trip plans, and answers from your
            travel documents in a single conversation.
          </p>
        </BlurFade>

        <BlurFade delay={0.12} className="mx-auto w-full max-w-3xl">
          <div className="rounded-[2rem] border border-white/10 bg-[var(--card)]/70 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1 ring-white/5">
            <form
              onSubmit={handleSubmit}
              className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-1)]/90 p-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/80 px-4 py-3 shadow-inner shadow-black/10">
                  <MessageSquareText className="h-4 w-4 text-[var(--brand-to)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about your trip..."
                    disabled={loading}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none disabled:cursor-not-allowed"
                  />
                </div>

                <ShimmerButton
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="h-[52px] rounded-2xl px-5 text-sm sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <SendHorizonal className="h-4 w-4" />
                      <span>Ask</span>
                    </>
                  )}
                </ShimmerButton>
              </div>
            </form>
          </div>
        </BlurFade>

        {error && (
          <BlurFade delay={0.15} className="mx-auto mt-6 w-full max-w-3xl">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          </BlurFade>
        )}

        {result && (
          <BlurFade delay={0.18} className="mx-auto mt-8 w-full max-w-3xl">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--card)]/80 shadow-[0_24px_70px_rgba(59,60,120,0.45)] backdrop-blur-xl">
              <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-from)]/40 bg-[var(--brand-from)]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-to)]">
                    <Bot className="h-3.5 w-3.5" />
                    AI Answer
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/80">
                    Live result
                  </span>
                </div>

                <div className="markdown-content">
                  <ReactMarkdown>{result.answer}</ReactMarkdown>
                </div>
              </div>

              {result.source.length > 0 && (
                <div className="border-t border-white/10 bg-[var(--surface-1)]/80 px-5 py-4 sm:px-6">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-to)]">
                    Source
                  </p>
                  <ul className="space-y-2.5">
                    {result.source.map((source, i) => {
                      const title =
                        source.metadata?._document_title ??
                        source.document_id ??
                        `Document ${i + 1}`;
                      const href =
                        source.metadata?._source_uri ??
                        source.location?.s3Location?.uri ??
                        source.document_id ??
                        "#";

                      return (
                        <li key={`${title}-${i}`} className="flex min-w-0 items-center gap-2">
                          <ExternalLink className="h-4 w-4 shrink-0 text-[var(--brand-to)]" />
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-sm text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
                            title={title}
                          >
                            {title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </BlurFade>
        )}

        {!result && !error && !loading && (
          <BlurFade delay={0.16} className="mx-auto mt-8 w-full max-w-3xl">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/55 px-6 py-16 text-center shadow-xl shadow-black/20 backdrop-blur-xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--brand-from)]/30 bg-[var(--brand-from)]/10 text-[var(--brand-to)]">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-white">
                Ask anything about travel
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
                KelanaAI will answer based on the travel documents you have as
                source references.
              </p>
            </div>
          </BlurFade>
        )}
      </div>
    </main>
  );
}
