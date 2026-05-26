"use client";

import { useState, useRef } from "react";
import {
  CASES,
  FormData,
  CaseId,
  generateDocument,
  todayStr,
} from "@/app/lib/templates";

// ── Constants ──────────────────────────────────────────────────────────────

const DEADLINE_OPTIONS = [
  "본 문서 수령 후 3일 이내",
  "본 문서 수령 후 7일 이내",
  "본 문서 수령 후 14일 이내",
  "본 문서 수령 후 30일 이내",
];

const EMPTY_FORM: FormData = {
  caseId: "",
  senderName: "",
  senderAddr: "",
  senderContact: "",
  receiverName: "",
  receiverAddr: "",
  receiverContact: "",
  detail: "",
  demand: "",
  deadline: "",
  amount: "",
  contractDate: "",
  incidentDate: "",
};

// ── Validation ─────────────────────────────────────────────────────────────

function validate(form: FormData): string | null {
  if (!form.caseId) return "상황 유형을 선택해 주세요.";
  if (!form.senderName.trim()) return "발신인 성명을 입력해 주세요.";
  if (!form.senderAddr.trim()) return "발신인 주소를 입력해 주세요.";
  if (!form.receiverName.trim()) return "수신인 성명을 입력해 주세요.";
  if (!form.receiverAddr.trim()) return "수신인 주소를 입력해 주세요.";
  if (!form.detail.trim()) return "상황을 구체적으로 입력해 주세요.";
  if (!form.demand.trim()) return "요구 사항을 입력해 주세요.";
  return null;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          color: "var(--muted)",
          marginBottom: "6px",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--gold)", marginLeft: "3px" }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function NaeyongPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const set =
    (key: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (error) setError("");
    };

  const selectedMeta = CASES.find((c) => c.id === form.caseId);
  const showAmount = selectedMeta?.fields.includes("amount");
  const showContractDate = selectedMeta?.fields.includes("contractDate");
  const showIncidentDate = selectedMeta?.fields.includes("incidentDate");

  const handleGenerate = () => {
    const err = validate(form);
    if (err) { setError(err); return; }
    setError("");
    setResult(generateDocument(form));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult("");
    setError("");
  };


  const formDone = !!(
    form.caseId && form.senderName && form.receiverName
  );
  const step = result ? 2 : formDone ? 1 : 0;

  return (
    <>

      <div className="page">
        {/* Header */}
        <div className="header no-print">
          <p className="eyebrow">Legal Document Generator</p>
          <h1 className="title">내용증명 자동 작성</h1>
          <p className="subtitle">
            정보를 입력하면 법적 형식에 맞는 내용증명서 초안을 즉시 생성합니다.
          </p>
        </div>

        {/* Progress */}
        <div className="progress no-print">
          {["유형 선택", "정보 입력", "문서 생성"].map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div className={`prog-step ${i < step ? "done" : i === step ? "active" : ""}`}>
                <div className="prog-dot" />
                <span>{label}</span>
              </div>
              {i < 2 && <div className="prog-line" />}
            </div>
          ))}
        </div>

        {!result ? (
          /* ── FORM ──────────────────────────────────────────────── */
          <>
            {/* Case type */}
            <div className="section no-print">
              <p className="section-label">상황 유형 선택</p>
              <div className="case-grid">
                {CASES.map((c) => (
                  <button
                    key={c.id}
                    className={`case-btn ${form.caseId === c.id ? "active" : ""}`}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        caseId: c.id as CaseId,
                        demand: "",
                        detail: "",
                      }))
                    }
                  >
                    <span className="ci">{c.icon}</span>
                    <span className="cl">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="layout no-print">
              {/* Left column */}
              <div>
                {/* Sender */}
                <div className="section">
                  <p className="section-label">발신인 (나)</p>
                  <Field label="성명 / 상호" required>
                    <input
                      value={form.senderName}
                      onChange={set("senderName")}
                      placeholder="홍길동 또는 (주)길동"
                    />
                  </Field>
                  <Field label="주소" required>
                    <input
                      value={form.senderAddr}
                      onChange={set("senderAddr")}
                      placeholder="서울특별시 강남구 테헤란로 123"
                    />
                  </Field>
                  <Field label="연락처">
                    <input
                      value={form.senderContact}
                      onChange={set("senderContact")}
                      placeholder="010-0000-0000"
                    />
                  </Field>
                </div>

                {/* Receiver */}
                <div className="section">
                  <p className="section-label">수신인 (상대방)</p>
                  <Field label="성명 / 상호" required>
                    <input
                      value={form.receiverName}
                      onChange={set("receiverName")}
                      placeholder="김철수 또는 (주)철수기업"
                    />
                  </Field>
                  <Field label="주소" required>
                    <input
                      value={form.receiverAddr}
                      onChange={set("receiverAddr")}
                      placeholder="서울특별시 서초구 반포대로 456"
                    />
                  </Field>
                  <Field label="연락처">
                    <input
                      value={form.receiverContact}
                      onChange={set("receiverContact")}
                      placeholder="010-0000-0000"
                    />
                  </Field>
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className="section">
                  <p className="section-label">사안 내용</p>

                  {showAmount && (
                    <Field label="금액">
                      <div className="amount-wrap">
                        <input
                          value={form.amount}
                          onChange={set("amount")}
                          placeholder="1,500,000"
                        />
                        <span className="amount-unit">원</span>
                      </div>
                    </Field>
                  )}

                  {showContractDate && (
                    <Field label="계약 일자">
                      <input
                        type="date"
                        value={form.contractDate}
                        onChange={set("contractDate")}
                      />
                    </Field>
                  )}

                  {showIncidentDate && (
                    <Field label="사건 발생일">
                      <input
                        type="date"
                        value={form.incidentDate}
                        onChange={set("incidentDate")}
                      />
                    </Field>
                  )}

                  <Field label="구체적인 상황" required>
                    <textarea
                      value={form.detail}
                      onChange={set("detail")}
                      placeholder={
                        selectedMeta?.detailPlaceholder ??
                        "상황을 구체적으로 작성해 주세요."
                      }
                      rows={5}
                    />
                  </Field>

                  <Field label="요구 사항" required>
                    <input
                      value={form.demand}
                      onChange={set("demand")}
                      placeholder={selectedMeta?.demandHint ?? "요구 사항 입력"}
                    />
                  </Field>

                  <Field label="이행 기한">
                    <select value={form.deadline} onChange={set("deadline")}>
                      <option value="">선택 (기본 7일)</option>
                      {DEADLINE_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            {error && <div className="error no-print">{error}</div>}

            <button className="gen-btn no-print" onClick={handleGenerate}>
              내용증명서 생성하기
            </button>
          </>
        ) : (
          /* ── RESULT ──────────────────────────────────────────────── */
          <div className="result-panel" ref={printRef}>
            <div className="result-toolbar no-print">
              <span className="result-toolbar-label">생성된 내용증명서</span>
              <div className="toolbar-btns">
                <button className="tbtn gold" onClick={handleCopy}>
                  {copied ? "복사됨 ✓" : "복사"}
                </button>
                <button className="tbtn" onClick={handlePrint}>
                  인쇄
                </button>
              </div>
            </div>

            <div className="doc-paper">{result}</div>

            <div className="disclaimer no-print">
              ※ AI 없이 생성된 참고용 초안입니다. 실제 내용증명 발송 전 법률 전문가의 검토를 권장합니다.
              내용증명은 우체국 등기우편으로 발송해야 법적 효력이 발생합니다.
            </div>

            <button className="back-btn no-print" onClick={handleReset}>
              ← 다시 작성하기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
