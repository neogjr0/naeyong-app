// ── Types ──────────────────────────────────────────────────────────────────

export type CaseId = "미지급" | "계약해지" | "환불" | "명예훼손" | "부당해고" | "기타";

export interface FormData {
  caseId: CaseId | "";
  senderName: string;
  senderAddr: string;
  senderContact: string;
  receiverName: string;
  receiverAddr: string;
  receiverContact: string;
  detail: string;
  demand: string;
  deadline: string;
  amount: string;
  contractDate: string;
  incidentDate: string;
}

export interface CaseMeta {
  id: CaseId;
  label: string;
  icon: string;
  fields: (keyof FormData)[];         // 이 유형에서 보여줄 추가 필드
  demandHint: string;
  detailPlaceholder: string;
  legalBasis: string;                 // 민법 조항 등
  consequenceWarning: string;         // 불이행 시 예고 문구
}

// ── Case metadata ──────────────────────────────────────────────────────────

export const CASES: CaseMeta[] = [
  {
    id: "미지급",
    label: "미지급금 청구",
    icon: "₩",
    fields: ["amount", "contractDate", "incidentDate"],
    demandHint: "예) 용역 잔금 150만 원 즉시 지급",
    detailPlaceholder:
      "예) 2024년 3월 15일 웹사이트 디자인 용역 계약을 체결하고 납품을 완료하였으나, 잔금 150만 원을 4월 30일까지 지급하기로 한 약정을 이행하지 않고 있습니다.",
    legalBasis:
      "민법 제390조(채무불이행과 손해배상) 및 제544조(이행지체와 해제)에 의거하여",
    consequenceWarning:
      "위 기한 내 이행이 없을 경우, 민사소송 제기 및 지연이자(연 12%) 청구, 필요 시 강제집행 절차를 진행할 것임을 엄중히 경고합니다.",
  },
  {
    id: "계약해지",
    label: "계약 해지 통보",
    icon: "✕",
    fields: ["contractDate", "incidentDate"],
    demandHint: "예) 계약 즉시 해지 및 원상복구 이행",
    detailPlaceholder:
      "예) 2024년 1월 임대차 계약 체결 후 상대방이 3개월 연속 차임을 연체하여 계약상 중대한 의무를 위반하였습니다.",
    legalBasis:
      "민법 제543조(해지, 해제권) 및 제640조(차임연체와 해지)에 의거하여",
    consequenceWarning:
      "위 기한 내 원상복구 및 목적물 반환이 이루어지지 않을 경우, 부당이득반환 청구 및 손해배상 소송을 제기할 것입니다.",
  },
  {
    id: "환불",
    label: "환불·반환 요구",
    icon: "↩",
    fields: ["amount", "contractDate", "incidentDate"],
    demandHint: "예) 보증금 500만 원 전액 반환",
    detailPlaceholder:
      "예) 2024년 2월 보증금 500만 원을 지급하고 계약을 체결하였으나, 귀하의 귀책사유로 계약이 해제되었음에도 보증금을 반환하지 않고 있습니다.",
    legalBasis:
      "민법 제548조(해제의 효과, 원상회복의무) 및 제741조(부당이득의 내용)에 의거하여",
    consequenceWarning:
      "위 기한 내 반환이 이루어지지 않을 경우, 부당이득반환 청구소송 및 지연이자 청구를 진행할 것임을 통지합니다.",
  },
  {
    id: "명예훼손",
    label: "명예훼손 중지",
    icon: "🚫",
    fields: ["incidentDate"],
    demandHint: "예) 허위 게시물 즉시 삭제 및 재게시 중단",
    detailPlaceholder:
      "예) 귀하는 2024년 4월부터 온라인 커뮤니티에 사실과 다른 내용을 반복적으로 게시하여 본인의 명예를 지속적으로 훼손하고 있습니다.",
    legalBasis:
      "형법 제307조(명예훼손) 및 민법 제750조(불법행위의 내용)에 의거하여",
    consequenceWarning:
      "위 기한 내 삭제 및 중단이 이루어지지 않을 경우, 형사고소(명예훼손·모욕죄) 및 민사상 손해배상 청구를 즉시 진행할 것입니다.",
  },
  {
    id: "부당해고",
    label: "부당해고 이의",
    icon: "⚖",
    fields: ["incidentDate"],
    demandHint: "예) 즉각적인 복직 및 해고 기간 임금 지급",
    detailPlaceholder:
      "예) 귀사는 2024년 5월 1일 정당한 이유 및 적법한 절차 없이 본인을 일방적으로 해고하였습니다.",
    legalBasis:
      "근로기준법 제23조(해고 등의 제한) 및 제27조(해고사유 등의 서면통지)에 의거하여",
    consequenceWarning:
      "위 기한 내 복직 조치가 없을 경우, 노동위원회 부당해고 구제신청 및 민사소송을 제기할 것임을 통지합니다.",
  },
  {
    id: "기타",
    label: "기타",
    icon: "…",
    fields: ["incidentDate"],
    demandHint: "요구 사항을 명확히 입력해 주세요.",
    detailPlaceholder: "상황을 구체적으로 작성해 주세요.",
    legalBasis: "관련 법령 및 계약에 의거하여",
    consequenceWarning:
      "위 기한 내 이행이 없을 경우, 법적 절차를 통해 권리를 행사할 것임을 엄중히 통지합니다.",
  },
];

// ── Template engine ────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}년 ${pad(d.getMonth() + 1)}월 ${pad(d.getDate())}일`;
}

export function generateDocument(form: FormData): string {
  const meta = CASES.find((c) => c.id === form.caseId);
  if (!meta) return "";

  const deadline = form.deadline || "본 문서 수령 후 7일 이내";
  const date = todayStr();

  const amountLine =
    form.amount
      ? `\n   금     액: 금 ${Number(form.amount.replace(/,/g, "")).toLocaleString("ko-KR")}원정`
      : "";

  const contractLine =
    form.contractDate ? `\n   계약일자: ${form.contractDate}` : "";

  const incidentLine =
    form.incidentDate ? `\n   발생일자: ${form.incidentDate}` : "";

  return `\
                    내  용  증  명  서


수  신  인
   성     명: ${form.receiverName}
   주     소: ${form.receiverAddr}${form.receiverContact ? `\n   연 락 처: ${form.receiverContact}` : ""}

발  신  인
   성     명: ${form.senderName}
   주     소: ${form.senderAddr}${form.senderContact ? `\n   연 락 처: ${form.senderContact}` : ""}


─────────────────────────────────────────────

귀하에게 아래와 같이 통지합니다.


1. 사실관계
${amountLine}${contractLine}${incidentLine}

   ${form.detail.replace(/\n/g, "\n   ")}


2. 법적 근거

   ${meta.legalBasis} 본인(이하 "발신인")은 귀하(이하 "수신인")에게
   정당한 권리를 행사하고자 본 내용증명을 발송합니다.


3. 요구 사항

   발신인은 수신인에게 다음을 요구합니다.

   ▶ ${form.demand}
   ▶ 이행 기한: ${deadline}


4. 불이행 시 조치 예고

   ${meta.consequenceWarning}


─────────────────────────────────────────────

                                    ${date}

                       발신인: ${form.senderName}  (인)


※ 본 문서는 내용증명 우편(등기)으로 발송하시기 바랍니다.
※ 본 문서는 참고용 초안입니다. 중요한 사안은 법률 전문가와 상담하시기 바랍니다.`;
}
