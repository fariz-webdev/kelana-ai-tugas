// "use client";

// import { Fragment, type ReactNode, useState } from "react";

// type ViewState = "form" | "loading" | "result";

// type TripForm = {
//   destination: string;
//   budget: string;
//   days: string;
//   travelStyle: string;
// };

// type RecommendationDay = {
//   title: string;
//   bullets: string[];
//   total: string;
// };

// type RecommendationResult = {
//   destination: string;
//   travelStyle: string;
//   budget: number;
//   days: number;
//   summary: string[];
//   daysPlan: RecommendationDay[];
//   aiText?: string;
// };

// const emptyForm: TripForm = {
//   destination: "",
//   budget: "",
//   days: "",
//   travelStyle: "",
// };

// function renderInlineMarkdown(text: string): ReactNode[] {
//   const parts = text.split(/(\*\*.*?\*\*)/g);

//   return parts.map((part, index) => {
//     if (part.startsWith("**") && part.endsWith("**")) {
//       return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
//     }

//     return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
//   });
// }

// function extractDayCards(
//   text: string,
// ): Array<{ title: string; content: ReactNode[] }> {
//   const blocks: Array<{ title: string; content: ReactNode[] }> = [];
//   const rawSections = text
//     .split(/(?=^##?\s+Day\s+\d+)/m)
//     .map((section) => section.trim())
//     .filter(Boolean);

//   if (rawSections.length === 0) {
//     return [{ title: "Day 1", content: renderMarkdownContent(text) }];
//   }

//   rawSections.forEach((section, sectionIndex) => {
//     const match = section.match(
//       /^(?:##|#)?\s*(Day\s+\d+(?:[-–]\d+)?(?:\s*:\s*.*)?)\s*\n?/i,
//     );
//     const title = match?.[1]?.trim() || `Day ${sectionIndex + 1}`;
//     const contentText = section.replace(match?.[0] ?? "", "").trim();

//     blocks.push({
//       title,
//       content: contentText ? renderMarkdownContent(contentText) : [],
//     });
//   });

//   return blocks;
// }

// function renderMarkdownContent(text: string): ReactNode[] {
//   const lines = text.split(/\n/);
//   const blocks: ReactNode[] = [];
//   let listItems: string[] = [];

//   const flushList = () => {
//     if (listItems.length === 0) return;

//     blocks.push(
//       <ul
//         key={`list-${blocks.length}`}
//         className="mb-3 list-disc space-y-2 pl-6"
//       >
//         {listItems.map((item, index) => (
//           <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
//         ))}
//       </ul>,
//     );

//     listItems = [];
//   };

//   lines.forEach((line, index) => {
//     const trimmed = line.trim();

//     if (!trimmed) {
//       flushList();
//       return;
//     }

//     if (/^#{1,6}\s+/.test(trimmed)) {
//       flushList();
//       const headingLevel = Math.min(trimmed.match(/^#+/)?.[0].length ?? 1, 6);
//       const title = trimmed.replace(/^#{1,6}\s+/, "");
//       const headingClasses =
//         headingLevel === 1
//           ? "mb-3 mt-4 text-2xl font-bold text-[#1d97eb]"
//           : headingLevel === 2
//             ? "mb-3 mt-4 text-xl font-bold text-[#1d97eb]"
//             : headingLevel === 3
//               ? "mb-3 mt-4 text-lg font-bold text-[#1d97eb]"
//               : "mb-3 mt-4 text-base font-bold text-[#1d97eb]";

//       if (headingLevel === 1) {
//         blocks.push(
//           <h1 key={`heading-${index}`} className={headingClasses}>
//             {renderInlineMarkdown(title)}
//           </h1>,
//         );
//       } else if (headingLevel === 2) {
//         blocks.push(
//           <h2 key={`heading-${index}`} className={headingClasses}>
//             {renderInlineMarkdown(title)}
//           </h2>,
//         );
//       } else if (headingLevel === 3) {
//         blocks.push(
//           <h3 key={`heading-${index}`} className={headingClasses}>
//             {renderInlineMarkdown(title)}
//           </h3>,
//         );
//       } else {
//         blocks.push(
//           <h4 key={`heading-${index}`} className={headingClasses}>
//             {renderInlineMarkdown(title)}
//           </h4>,
//         );
//       }
//       return;
//     }

//     if (/^[-*]\s+/.test(trimmed)) {
//       listItems.push(trimmed.replace(/^[-*]\s+/, ""));
//       return;
//     }

//     flushList();
//     blocks.push(
//       <p key={`paragraph-${index}`} className="mb-3 leading-7 text-[#2d3d4d]">
//         {renderInlineMarkdown(trimmed)}
//       </p>,
//     );
//   });

//   flushList();

//   return blocks;
// }

// function buildFallbackRecommendation(form: TripForm): RecommendationResult {
//   const destination = form.destination || "Indonesia";
//   const budget = Number(form.budget || 5000);
//   const days = Number(form.days || 5);
//   const travelStyle = form.travelStyle || "Business";

//   return {
//     destination,
//     travelStyle,
//     budget,
//     days,
//     summary: [
//       `Destination: ${destination}`,
//       `Business`,
//       `Budget: USD ${budget.toLocaleString()}`,
//     ],
//     daysPlan: [
//       {
//         title: "Day 1: Arrival in Jakarta",
//         bullets: [
//           "Flight: Book a flight to Jakarta, Indonesia (approx. USD 1200).",
//           "Accommodation: 4-star hotel in Jakarta (approx. USD 150/night x 6 nights = USD 900).",
//           "Activities:",
//           "Settle into the hotel.",
//           "Attend any scheduled business meetings.",
//           "Dinner at a local restaurant (approx. USD 30).",
//         ],
//         total: "Total Cost for Day 1: USD 1550",
//       },
//       {
//         title: "Day 2-3: Jakarta",
//         bullets: [
//           "Activities:",
//           "Visit business districts (e.g., Sudirman, Thamrin).",
//           "Attend business meetings/conferences.",
//           "Cultural visits (e.g., National Monument).",
//           "Meals (approx. USD 40/day x 2 days = USD 80).",
//         ],
//         total: "Total Cost for Days 2-3: USD 480",
//       },
//       {
//         title: "Day 4: Jakarta to Bali",
//         bullets: [
//           "Flight: Jakarta to Bali (approx. USD 100).",
//           "Accommodation: 4-star hotel in Bali (approx. USD 120/night x 4 nights = USD 480).",
//           "Activities:",
//           "Attend business meetings/conferences in Bali.",
//           "Explore local business hubs (e.g., Sanur, Kuta).",
//         ],
//         total: "Total Cost for Day 4: USD 600",
//       },
//       {
//         title: "Day 5-7: Bali",
//         bullets: [
//           "Activities:",
//           "Continue business meetings.",
//           "Networking events.",
//           "Cultural visits (e.g., Ubud, Tanah Lot).",
//           "Meals (approx. USD 40/day x 3 days = USD 120).",
//         ],
//         total: "Total Cost for Days 5-7: USD 720",
//       },
//     ],
//   };
// }

// export default function Home() {
//   const [view, setView] = useState<ViewState>("form");
//   const [form, setForm] = useState<TripForm>(emptyForm);
//   const [result, setResult] = useState<RecommendationResult | null>(null);
//   const [error, setError] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const destination = form.destination.trim();
//     const budget = Number(form.budget);
//     const days = Number(form.days);

//     if (!destination || !form.travelStyle || !budget || !days) {
//       setError("Please complete all fields before generating your itinerary.");
//       setView("form");
//       return;
//     }

//     setError("");
//     setView("loading");

//     try {
//       const payload = {
//         destination,
//         budget,
//         days,
//         travel_style: form.travelStyle,
//       };

//       const response = await fetch("http://localhost:8000/api/v1/trips", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           errorText || "Unable to generate the itinerary right now.",
//         );
//       }

//       const data = await response.json();

//       const normalizedResult = {
//         destination: data.destination || destination,
//         travelStyle: data.travel_style || form.travelStyle,
//         budget: Number(data.budget ?? budget),
//         days: Number(data.days ?? days),
//         summary: [
//           `Destination: ${data.destination || destination}`,
//           data.travel_style || form.travelStyle,
//           `Budget: USD ${(data.budget ?? budget).toLocaleString()}`,
//         ],
//         daysPlan: buildFallbackRecommendation(form).daysPlan,
//         aiText: data.ai_recommendation || "",
//       };

//       setResult(normalizedResult);
//       setView("result");
//     } catch (err) {
//       console.error(err);
//       setError(
//         "Failed to generate itinerary. Please check your input and try again.",
//       );
//       setResult(null);
//       setView("form");
//     }
//   };

//   const handleReset = () => {
//     setForm(emptyForm);
//     setResult(null);
//     setError("");
//     setView("form");
//   };

//   if (view === "loading") {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#dfe6eb] px-4">
//         <div className="flex flex-col items-center justify-center gap-4 text-center">
//           <div className="h-14 w-14 animate-spin rounded-full border-[5px] border-[#cfe5f5] border-t-[#1d98eb]" />
//           <p className="text-xl font-medium text-[#2d4759]">
//             Generating your itinerary...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   if (view === "result") {
//     const displayResult = result ?? buildFallbackRecommendation(form);

//     return (
//       <main className="flex min-h-screen justify-center bg-[#dfe6eb] px-4 py-8">
//         <div className="w-full max-w-[760px]">
//           <div className="mb-5 text-center">
//             <h1 className="text-[3rem] font-bold tracking-tight text-[#1f9ce7]">
//               KelanaAI
//             </h1>
//           </div>

//           <div className="mb-5 flex items-center justify-center gap-4 rounded-[999px] bg-[#dfeaf4] px-6 py-3 text-[1.05rem] font-semibold text-[#2b3d4e] shadow-inner shadow-white/60">
//             <span>
//               <span className="font-bold">Destination:</span>{" "}
//               {displayResult.destination}
//             </span>
//             <span className="h-6 w-px bg-[#a8b9c7]" />
//             <span>{displayResult.travelStyle}</span>
//             <span className="h-6 w-px bg-[#a8b9c7]" />
//             <span>Budget: USD {displayResult.budget.toLocaleString()}</span>
//           </div>

//           <div className="rounded-[20px] bg-[#dfeaf4] p-5 shadow-inner shadow-white/60">
//             <h2 className="mb-4 text-[1.15rem] font-bold uppercase tracking-[0.08em] text-[#1f9ce7]">
//               AI Recommendation
//             </h2>

//             {displayResult.aiText ? (
//               <div className="space-y-5">
//                 {extractDayCards(displayResult.aiText).map((day) => (
//                   <div
//                     key={day.title}
//                     className="rounded-[16px] bg-[#dbe7f2] p-4 shadow-inner shadow-white/50"
//                   >
//                     <h3 className="mb-3 text-[1.05rem] font-bold text-[#1d97eb]">
//                       {day.title}
//                     </h3>
//                     <div className="text-[0.98rem] leading-7 text-[#2d3d4d]">
//                       {day.content}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               displayResult.daysPlan.map((day) => (
//                 <div
//                   key={day.title}
//                   className="mb-5 rounded-[16px] bg-[#dbe7f2] p-4"
//                 >
//                   <h3 className="mb-3 text-[1.05rem] font-bold text-[#1d97eb]">
//                     {day.title}
//                   </h3>

//                   <ul className="space-y-2 text-[0.98rem] leading-6 text-[#2d3d4d]">
//                     {day.bullets.map((bullet, index) => (
//                       <li key={`${day.title}-${index}`} className="flex gap-2">
//                         <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1f9ce7]" />
//                         <span>{bullet}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="mt-4 border-t border-[#b7c9d7] pt-3 text-[0.98rem] font-bold text-[#2f3d4d]">
//                     {day.total}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="mt-5 flex justify-center">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="rounded-full border border-[#1d98eb] bg-transparent px-6 py-2 text-base font-medium text-[#1d98eb] transition hover:bg-[#eaf6ff]"
//             >
//               Plan another trip
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[#dfe6eb] px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-[420px] rounded-[22px]"
//       >
//         {error ? (
//           <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
//             {error}
//           </div>
//         ) : null}

//         <div className="mb-7 text-center">
//           <h1 className="text-[2.5rem] font-bold tracking-tight text-[#1f9ce7]">
//             KelanaAI
//           </h1>
//           <p className="mt-1 text-[0.95rem] text-[#6c7b87]">
//             Plan your next adventure
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div className="rounded-xl bg-[#dfeaf4] px-4 py-3 shadow-inner shadow-white/60">
//             <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#5b7386]">
//               Destination
//             </label>
//             <input
//               type="text"
//               name="destination"
//               value={form.destination}
//               onChange={handleChange}
//               placeholder="e.g. Japan"
//               className="w-full border-0 bg-transparent text-[1.05rem] text-[#2f3d4d] placeholder:text-[#7a8b9a] focus:outline-none"
//             />
//           </div>

//           <div className="rounded-xl bg-[#dfeaf4] px-4 py-3 shadow-inner shadow-white/60">
//             <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#5b7386]">
//               Budget (USD)
//             </label>
//             <input
//               type="number"
//               name="budget"
//               value={form.budget}
//               onChange={handleChange}
//               placeholder="e.g. 2000"
//               className="w-full border-0 bg-transparent text-[1.05rem] text-[#2f3d4d] placeholder:text-[#7a8b9a] focus:outline-none"
//             />
//           </div>

//           <div className="rounded-xl bg-[#dfeaf4] px-4 py-3 shadow-inner shadow-white/60">
//             <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#5b7386]">
//               Days
//             </label>
//             <input
//               type="number"
//               name="days"
//               value={form.days}
//               onChange={handleChange}
//               placeholder="e.g. 5"
//               className="w-full border-0 bg-transparent text-[1.05rem] text-[#2f3d4d] placeholder:text-[#7a8b9a] focus:outline-none"
//             />
//           </div>

//           <div className="rounded-xl bg-[#dfeaf4] px-4 py-3 shadow-inner shadow-white/60">
//             <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#5b7386]">
//               Travel Style
//             </label>
//             <select
//               name="travelStyle"
//               value={form.travelStyle}
//               onChange={handleChange}
//               className="w-full appearance-none border-0 bg-transparent text-[1rem] text-[#6f7a84] focus:outline-none"
//             >
//               <option value="" disabled>
//                 Select a style
//               </option>
//               <option value="Adventure">Adventure</option>
//               <option value="Luxury">Luxury</option>
//               <option value="Relaxing">Relaxing</option>
//               <option value="Cultural">Cultural</option>
//               <option value="Backpacking">Backpacking</option>
//               <option value="Business">Business</option>
//             </select>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full rounded-xl bg-[#1d98eb] px-4 py-3 text-base font-semibold text-white shadow-[0_6px_18px_rgba(29,152,235,0.35)] transition hover:bg-[#1889d8] focus:outline-none"
//         >
//           Generate AI Trip
//         </button>
//       </form>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface TripResponse {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation: string;
}

interface DayPlan {
  title: string;
  body: string;
}

/**
 * Split the markdown AI response into per-day blocks.
 * Handles "## Day 1", "**Day 1**", "Day 1:", "Day 2-3:"
 */
function parseDayPlans(markdown: string): DayPlan[] {
  const parts = markdown.split(/(?=(?:#{1,3}\s*)?(?:\*\*)?Day\s+[\d\-–]+)/im);
  const plans: DayPlan[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [firstLine, ...rest] = trimmed.split("\n");
    const title = firstLine
      .replace(/^#{1,3}\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/:$/, "")
      .trim();
    const body = rest.join("\n").trim();
    if (title) plans.push({ title, body });
  }

  return plans.length ? plans : [{ title: "Itinerary", body: markdown }];
}

/**
 * Picsum Photos — stable, free, no API key needed.
 * Uses a deterministic seed from the destination name so the same
 * destination always gets the same image.
 */
function heroImageUrl(destination: string): string {
  let seed = 0;
  for (let i = 0; i < destination.length; i++) {
    seed = (seed * 31 + destination.charCodeAt(i)) & 0xffff;
  }
  return `https://picsum.photos/seed/${seed}/1200/500`;
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [result, setResult] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/v1/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          days: Number(days),
          budget: Number(budget),
          travel_style: travelStyle,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Something went wrong");
      }

      setResult(await res.json());
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to the server",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ── Result view ─────────────────────────────────────────── */
  if (result) {
    const dayPlans = parseDayPlans(result.ai_recommendation ?? "");

    return (
      <main className="min-h-screen bg-white">
        {/* Hero image — full-bleed on all screens */}
        <div
          className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 bg-gray-200 bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroImageUrl(result.destination)}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
          <div className="absolute inset-0 flex items-end px-4 sm:px-8 pb-4 sm:pb-6 max-w-5xl mx-auto">
            <h1 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">
              KelanaAI
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-full px-4 sm:px-6 py-2.5 mb-6 text-sm font-semibold text-gray-800">
            <span>Destination: {result.destination}</span>
            <span className="text-blue-500">{travelStyle}</span>
            <span>Budget: USD {result.budget.toLocaleString()}</span>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-blue-500 tracking-widest whitespace-nowrap">
              AI RECOMMENDATION
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Day cards — single col on mobile, 2-col grid on md+ */}
          <div className="grid grid-cols-1 gap-3">
            {dayPlans.map((plan, idx) => (
              <div key={idx} className="bg-gray-100 rounded-2xl px-5 py-4">
                <p className="text-blue-500 font-semibold text-sm mb-2">
                  {plan.title}
                </p>
                <div
                  className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none
                                prose-p:my-1 prose-ul:my-1 prose-ul:pl-4
                                prose-li:my-0.5 prose-li:marker:text-blue-400
                                prose-strong:text-gray-800 prose-strong:font-semibold"
                >
                  <ReactMarkdown>{plan.body}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* Back */}
          <button
            onClick={() => setResult(null)}
            className="mt-6 text-sm text-blue-400 hover:text-blue-600 underline"
          >
            ← Plan another trip
          </button>
        </div>
      </main>
    );
  }

  /* ── Form view ───────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Hero section */}
      <div
        className="relative w-full h-64 sm:h-80 md:h-96 bg-cover bg-center flex-shrink-0"
        style={{
          backgroundImage: `url('https://picsum.photos/seed/travel/1600/700')`,
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-3 hover:text-indigo-400">
            KelanaAI
          </h1>
          <p className="text-white/90 text-base sm:text-lg lg:text-xl drop-shadow max-w-xl hover:text-indigo-400">
            Your AI-powered travel planner. Tell us where you want to go.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="flex flex-col items-center px-4 py-10 bg-white flex-1">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md md:max-w-2xl lg:max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Destination */}
            <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
              <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
                DESTINATION
              </label>
              <input
                type="text"
                placeholder="e.g. Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-sm outline-none"
              />
            </div>

            {/* Budget */}
            <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
              <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
                BUDGET (USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 2000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-sm outline-none"
              />
            </div>

            {/* Days */}
            <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
              <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
                DAYS
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-sm outline-none"
              />
            </div>

            {/* Travel Style */}
            <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
              <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
                TRAVEL STYLE
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full bg-transparent text-gray-500 text-sm outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a style
                </option>
                <option value="Backpacker">Backpacker</option>
                <option value="Standard">Standard</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60
                     transition-colors text-white font-semibold py-4 rounded-2xl
                     flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading ? "Generating your trip..." : "Generate AI Trip"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div
            className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mt-4 p-4 bg-red-50
                        border border-red-200 rounded-2xl text-red-600 text-sm"
          >
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
