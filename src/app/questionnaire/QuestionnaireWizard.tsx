"use client";

import { useState, useTransition } from "react";
import type { Category } from "@/data/coverage-categories";
import { recordAnswer, submitQuestionnaire } from "./actions";

export default function QuestionnaireWizard({ category }: { category: Category }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const question = category.questions[step];
  const isLast = step === category.questions.length - 1;
  const canContinue = Boolean(answers[question.key]);

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
    void recordAnswer(category.key, question.key, question.label, value);
  }

  function handleNext() {
    if (!canContinue) return;
    if (isLast) {
      startTransition(() => {
        submitQuestionnaire(category.key, answers);
      });
      return;
    }
    setStep((s) => s + 1);
  }

  function handleBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  return (
    <div className="as-skin">
      <main className="case-shell">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="eyebrow">{category.label}</div>
          <div className="progress-dots">
            {category.questions.map((_, i) => (
              <span key={i} className={`dot${i <= step ? " active" : ""}`} />
            ))}
          </div>
          <p className="small" style={{ color: "var(--slate-light)" }}>
            Question {step + 1} of {category.questions.length}
          </p>
          <h2>{question.label}</h2>
          <div className="chip-options">
            {question.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`chip${answers[question.key] === opt ? " selected" : ""}`}
                onClick={() => selectOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <button type="button" className="btn btn-outline" onClick={handleBack} disabled={step === 0}>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={handleNext} disabled={!canContinue || isPending}>
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}