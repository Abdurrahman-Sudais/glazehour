import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Info, MessageSquare } from 'lucide-react';
import { EXAMPLE_QUESTIONS, answer, type AssistantAnswer } from '../domain/assistant';
import { useStore } from '../state/store';
import { cx, inputCls } from '../components/ui';

/** “Ask about this facility” — answers from the demo records and lists the records it used. */
export function AssistantPanel() {
  const { state, team } = useStore();
  const [q, setQ] = useState('');
  const [asked, setAsked] = useState<{ q: string; a: AssistantAnswer } | null>(null);
  const ask = (question: string) => {
    if (!question.trim()) return;
    setAsked({ q: question.trim(), a: answer(question, { ...state, team }) });
    setQ('');
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(q);
  };
  return (
    <section className="overflow-hidden rounded-lg border border-signal-500/30 bg-white" aria-labelledby="assistant-title">
      <header className="flex items-center gap-2 border-b border-mist-200 bg-ink-900 px-4 py-3 text-white">
        <Bot size={16} className="text-signal-400" aria-hidden />
        <h2 id="assistant-title" className="text-sm font-semibold">Ask about this facility</h2>
        <span className="rounded border border-ink-600 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-graphite-300">Simulated assistant</span>
      </header>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((e) => (
            <button key={e} type="button" onClick={() => ask(e)} className="rounded-full border border-mist-200 bg-mist-50 px-3 py-1.5 text-xs text-ink-800 hover:border-signal-500 hover:bg-white">
              {e}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <label htmlFor="assistant-q" className="sr-only">Ask a question about the demo facility</label>
          <input id="assistant-q" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. What happened on J-24152?" maxLength={200} />
          <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-ink-900 px-3 py-2 text-sm font-medium text-white hover:bg-ink-700">
            <MessageSquare size={14} aria-hidden /> Ask
          </button>
        </form>
        {asked && (
          <div className={cx('rounded-lg border p-4', asked.a.kind === 'refusal' ? 'border-amber-300 bg-amber-50' : 'border-mist-200 bg-mist-50')} aria-live="polite">
            <p className="text-[11px] text-graphite-500">“{asked.q}”</p>
            <h3 className="mt-1 font-semibold">{asked.a.title}</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-800">
              {asked.a.lines.map((l) => <li key={l}>{l}</li>)}
            </ul>
            {asked.a.sources.length > 0 && (
              <p className="mt-3 font-mono text-[11px] text-graphite-500">From {asked.a.sources.length} record{asked.a.sources.length > 1 ? 's' : ''}: {asked.a.sources.join(', ')}</p>
            )}
            {asked.a.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {asked.a.links.map((l) => (
                  <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 text-xs font-medium text-volt-600 hover:underline">{l.label} <ArrowRight size={12} aria-hidden /></Link>
                ))}
              </div>
            )}
          </div>
        )}
        <p className="flex items-start gap-1.5 text-[11px] text-graphite-500">
          <Info size={13} className="mt-0.5 shrink-0" aria-hidden /> Answers are computed from this demo’s records and list the records used. No language model is called. It never names causes, prescribes corrective processes, or accepts work.
        </p>
      </div>
    </section>
  );
}
