import type {
  Settings,
  CriteriaData,
  EvidenceData,
  LettersData,
  ChecklistData,
  TimelineData,
  BudgetData,
  ActivityData,
  ResourcesData,
  ReviewersData,
} from "./types";

const now = () => new Date().toISOString();

export const defaultSettings: Settings = {
  applicantName: "Gaurav Chodwadia",
  fieldOfExpertise: "Machine Learning / Agentic AI Systems",
  targetFilingDate: "2027-09-01",
  attorneyName: null,
  attorneyEmail: null,
  theme: "dark",
  createdAt: now(),
  lastModified: now(),
};

export const defaultCriteria: CriteriaData = [
  {
    id: 1,
    title: "Awards or Prizes",
    shortDescription:
      "Documentation of the beneficiary's receipt of nationally or internationally recognized prizes or awards for excellence in the field of endeavor.",
    status: "not_started",
    strengthScore: 0,
    notes: "No known awards. Not actively targeted.",
    updatedAt: now(),
  },
  {
    id: 2,
    title: "Membership in Associations",
    shortDescription:
      "Documentation of the beneficiary's membership in associations in the field which require outstanding achievements of their members, as judged by recognized national or international experts.",
    status: "not_started",
    strengthScore: 0,
    notes: "Not actively targeted.",
    updatedAt: now(),
  },
  {
    id: 3,
    title: "Published Material About the Applicant",
    shortDescription:
      "Published material in professional or major trade publications or major media about the beneficiary, relating to the beneficiary's work in the field.",
    status: "not_started",
    strengthScore: 0,
    notes: "PLANNED: Use HARO and Qwoted to get quoted by journalists on AI topics. Publish thought leadership on LLMs for enterprise, RAG in production, multi-agent system design. No outreach sent yet.",
    updatedAt: now(),
  },
  {
    id: 4,
    title: "Judging the Work of Others",
    shortDescription:
      "Evidence of the beneficiary's participation on a panel, or individually, as a judge of the work of others in the same or an allied field of specialization.",
    status: "evidence_gathering",
    strengthScore: 3,
    notes: "HIGHEST PRIORITY criterion being built.\n\nENROLLED: CVPR 2026, ICLR 2026 workshops.\nAPPLIED (awaiting): ACL ARR, COLM 2026, UAI 2026, TMLR, ACM CAIS.\nDRAFTS READY: PAAMS 2026, ICML SRAS Workshop, Applied Intelligence (Springer), IJCAI-ECAI, JAIR, IEEE TNNLS, ACM TIST, AIJ, KDD workshops.\nFUTURE: NeurIPS 2026 (May), ICML workshops (Apr).\n\nStrategy: Journal > Conference workshop in USCIS officers' eyes. TMLR, JAIR, AIJ, IEEE TNNLS are highest value.\nDifferentiator: Industry practitioner framing — deploying production agentic systems at Walmart scale.",
    updatedAt: now(),
  },
  {
    id: 5,
    title: "Original Contributions of Major Significance",
    shortDescription:
      "Evidence of the beneficiary's original scientific, scholarly, artistic, athletic, or business-related contributions of major significance in the field.",
    status: "researching",
    strengthScore: 1,
    notes: "Potentially supportable: \"Marty\" — Walmart's first Agentic AI assistant for Marketplace Sellers (LangGraph, LangChain, FastAPI, Postgres, Redis, SSE streaming). Could be framed as an industry-first original contribution. Not formally documented yet.",
    updatedAt: now(),
  },
  {
    id: 6,
    title: "Authorship of Scholarly Articles",
    shortDescription:
      "Evidence of the beneficiary's authorship of scholarly articles in professional or major trade publications or other major media.",
    status: "weak",
    strengthScore: 1,
    notes: "EXISTING: \"Supervised Question Answering System for Technical Support\" — IEEE ICMLA 2017 (DOI: 10.1109/ICMLA.2017.00-60). ~2 citations. Paper NOT yet indexed on OpenReview — needs to be claimed via Semantic Scholar.\n\nACTION PLAN: Write survey articles on arXiv/ResearchGate. Target IEEE Transactions, top NLP venues. Topics: LLMs for enterprise, RAG in production, multi-agent system design.",
    updatedAt: now(),
  },
  {
    id: 7,
    title: "Artistic Exhibitions or Showcases",
    shortDescription:
      "Evidence of the display of the beneficiary's work in the field at artistic exhibitions or showcases.",
    status: "not_applicable",
    strengthScore: 0,
    notes: "N/A — not applicable to software engineering / ML field.",
    updatedAt: now(),
  },
  {
    id: 8,
    title: "Leading or Critical Role",
    shortDescription:
      "Evidence that the beneficiary has performed in a leading or critical role for organizations or establishments that have a distinguished reputation.",
    status: "researching",
    strengthScore: 1,
    notes: "Potentially supportable: Staff SWE at Walmart Global Tech, leading the Marty agentic AI project. Could argue critical role for a Fortune 1 company. Not formally pursued yet.",
    updatedAt: now(),
  },
  {
    id: 9,
    title: "High Salary or Remuneration",
    shortDescription:
      "Evidence that the beneficiary has commanded a high salary or other significantly high remuneration for services in relation to others in the field.",
    status: "strong",
    strengthScore: 5,
    notes: "QUALIFIES — Strong. Staff SWE compensation at Walmart Global Tech. Considered a strong, defensible criterion. No additional action needed; documentation required at filing time.",
    updatedAt: now(),
  },
  {
    id: 10,
    title: "Commercial Success in Performing Arts",
    shortDescription:
      "Evidence of commercial successes in the performing arts, as shown by box office receipts or record, cassette, compact disk, or video sales.",
    status: "not_applicable",
    strengthScore: 0,
    notes: "N/A — not applicable.",
    updatedAt: now(),
  },
];

export const defaultEvidence: EvidenceData = [
  // === Criterion 9: High Salary ===
  {
    id: "ev-salary-1",
    criterionId: 9,
    title: "Walmart Staff SWE compensation documentation",
    description: "W-2, offer letter, pay stubs showing Staff SWE compensation at Walmart Global Tech. Compare against BLS/Levels.fyi data for field.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  // === Criterion 4: Judging — Enrolled ===
  {
    id: "ev-judge-cvpr",
    criterionId: 4,
    title: "CVPR 2026 — Reviewer enrollment confirmation",
    description: "Top computer vision conference. Already enrolled as reviewer.",
    status: "received",
    fileNote: "Enrolled — confirmed active",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-iclr",
    criterionId: 4,
    title: "ICLR 2026 Workshops — Reviewer enrollment confirmation",
    description: "Top deep learning conference workshops. Already enrolled as reviewer.",
    status: "received",
    fileNote: "Enrolled — confirmed active",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  // === Criterion 4: Judging — Applied, Awaiting ===
  {
    id: "ev-judge-acl-arr",
    criterionId: 4,
    title: "ACL ARR (Rolling Review) — Reviewer application",
    description: "Rolling journal-like review covering ACL, EMNLP, NAACL, CoNLL. Sent Mar 27.",
    status: "requested",
    fileNote: "Contact: support@aclrollingreview.org",
    dueDate: "2026-04-05",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-colm",
    criterionId: 4,
    title: "COLM 2026 — Reviewer application",
    description: "Top LLM conference. Sent Mar 27.",
    status: "requested",
    fileNote: "Contact: colm-pcs@googlegroups.com",
    dueDate: "2026-04-05",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-uai",
    criterionId: 4,
    title: "UAI 2026 — Reviewer application",
    description: "AI/uncertainty conference. Reviews due Apr 11. Sent Mar 27.",
    status: "requested",
    fileNote: "Contact: uai2026chairs+program@gmail.com",
    dueDate: "2026-04-03",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-tmlr",
    criterionId: 4,
    title: "TMLR — Reviewer application",
    description: "Transactions on Machine Learning Research. Rolling journal, affiliated NeurIPS/ICML/ICLR. HIGHEST VALUE for EB-1A. Sent Mar 27.",
    status: "requested",
    fileNote: "Contact: tmlr-editors@jmlr.org",
    dueDate: "2026-04-10",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-cais",
    criterionId: 4,
    title: "ACM CAIS 2026 — Artifact Evaluation application",
    description: "Paper reviews closed; artifact eval offered. Push for formal 'AEC Member' title + written confirmation letter. Josh replied Mar 26.",
    status: "requested",
    fileNote: "Contact: josh@cmpnd.ai (Josh Quicksall), CC: Heather Miller (CMU). Weaker than paper review but still counts with formal title.",
    dueDate: "2026-04-02",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  // === Criterion 4: Judging — Drafts ready, not sent ===
  {
    id: "ev-judge-paams",
    criterionId: 4,
    title: "PAAMS 2026 — Reviewer application (DRAFT)",
    description: "Agents/Multi-agent systems conference. Paper deadline Apr 17. Draft created Mar 27 — SEND ASAP.",
    status: "needed",
    fileNote: "Contact: pc@paams.net",
    dueDate: "2026-03-29",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-icml-sras",
    criterionId: 4,
    title: "ICML 2026 SRAS Workshop — Reviewer application (DRAFT)",
    description: "\"Scalable & Resilient Agentic Systems\" workshop — perfect fit. Draft created Mar 27.",
    status: "needed",
    fileNote: "Contact: sras2026workshop@gmail.com (verify on sras2026.space)",
    dueDate: "2026-03-30",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-applied-intel",
    criterionId: 4,
    title: "Applied Intelligence (Springer) — Reviewer application (DRAFT)",
    description: "Rolling journal, LLM agents, RAG, NLP systems. Draft created Mar 27.",
    status: "needed",
    fileNote: "Contact: apin@springer.com. Rolling — always open.",
    dueDate: "2026-03-30",
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-ijcai",
    criterionId: 4,
    title: "IJCAI-ECAI 2026 — Reviewer application (PLANNED)",
    description: "Top AI conference. Draft status unclear.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-jair",
    criterionId: 4,
    title: "JAIR — Reviewer application (PLANNED)",
    description: "Journal of AI Research. Prestigious AI journal.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-judge-ieee-tnnls",
    criterionId: 4,
    title: "IEEE TNNLS — Reviewer application (PLANNED)",
    description: "IEEE Transactions on Neural Networks & Learning Systems. Matches existing IEEE publication.",
    status: "needed",
    fileNote: "Planned for April",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  // === Criterion 6: Publications ===
  {
    id: "ev-pub-icmla",
    criterionId: 6,
    title: "IEEE ICMLA 2017 — \"Supervised QA System for Technical Support\"",
    description: "DOI: 10.1109/ICMLA.2017.00-60. ~2 citations. Needs to be claimed on OpenReview via Semantic Scholar.",
    status: "received",
    fileNote: "Paper exists but not indexed on OpenReview profile",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-pub-claim-openreview",
    criterionId: 6,
    title: "Claim IEEE paper on OpenReview / Semantic Scholar",
    description: "Import existing ICMLA 2017 paper to OpenReview profile via Semantic Scholar.",
    status: "needed",
    fileNote: "OpenReview: https://openreview.net/profile?id=~Gaurav_Chodwadia1",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-pub-survey-arxiv",
    criterionId: 6,
    title: "Write survey articles on arXiv / ResearchGate",
    description: "Topics: LLMs for enterprise support, RAG in production, multi-agent system design. Target IEEE Transactions and top NLP venues.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  // === Criterion 5: Original Contributions ===
  {
    id: "ev-contrib-marty",
    criterionId: 5,
    title: "Document \"Marty\" — Walmart's first Agentic AI assistant",
    description: "Built with LangGraph, LangChain, FastAPI, Postgres, Redis, SSE streaming. Industry-first agentic AI for Marketplace Sellers. Needs formal documentation for EB-1A framing.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  // === Criterion 8: Leading/Critical Role ===
  {
    id: "ev-role-walmart",
    criterionId: 8,
    title: "Staff SWE role documentation — Walmart Global Tech",
    description: "Staff Software Engineer (Jul 2025–Present), prior Senior SWE (Sep 2022–Jul 2025). Leading Marty agentic AI project. Critical role at Fortune 1 company.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  // === Criterion 3: Media / Press ===
  {
    id: "ev-media-haro",
    criterionId: 3,
    title: "Sign up for HARO / Qwoted for journalist quotes",
    description: "Get quoted by journalists on AI topics — LLMs, multi-agent systems, RAG production deployment.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "ev-media-thought-leadership",
    criterionId: 3,
    title: "Publish thought leadership articles",
    description: "Write pieces on LLMs for enterprise support, RAG in production, multi-agent system design. Target major tech publications.",
    status: "needed",
    fileNote: "",
    dueDate: null,
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const defaultLetters: LettersData = [];

export const defaultChecklist: ChecklistData = [
  {
    id: "personal-docs",
    title: "Personal Documents",
    icon: "📄",
    items: [
      { id: "pd-1", label: "Valid passport (6+ months validity)", checked: false, notes: "", updatedAt: now() },
      { id: "pd-2", label: "Birth certificate (with certified translation if not in English)", checked: false, notes: "", updatedAt: now() },
      { id: "pd-3", label: "Marriage certificate (if applicable)", checked: false, notes: "", updatedAt: now() },
      { id: "pd-4", label: "Degree certificates and diplomas", checked: false, notes: "", updatedAt: now() },
      { id: "pd-5", label: "Academic transcripts", checked: false, notes: "", updatedAt: now() },
      { id: "pd-6", label: "Detailed resume / CV", checked: false, notes: "", updatedAt: now() },
      { id: "pd-7", label: "Current immigration status documentation (I-94, visa stamp, approval notices)", checked: false, notes: "", updatedAt: now() },
      { id: "pd-8", label: "Passport-style photos (2x2)", checked: false, notes: "", updatedAt: now() },
    ],
  },
  {
    id: "professional-evidence",
    title: "Professional Evidence",
    icon: "🏆",
    items: [
      { id: "pe-1", label: "Updated Google Scholar profile", checked: false, notes: "https://scholar.google.com/citations?user=TUGVys0AAAAJ&hl=en", updatedAt: now() },
      { id: "pe-2", label: "Claim ICMLA paper on OpenReview via Semantic Scholar", checked: false, notes: "https://openreview.net/profile?id=~Gaurav_Chodwadia1", updatedAt: now() },
      { id: "pe-3", label: "Citation report (Google Scholar, Scopus, or Web of Science)", checked: false, notes: "", updatedAt: now() },
      { id: "pe-4", label: "Full publication list with citation counts", checked: false, notes: "", updatedAt: now() },
      { id: "pe-5", label: "Conference reviewer confirmations (CVPR, ICLR, etc.)", checked: false, notes: "", updatedAt: now() },
      { id: "pe-6", label: "Patent filings or grants documentation", checked: false, notes: "", updatedAt: now() },
      { id: "pe-7", label: "Media coverage / press clippings", checked: false, notes: "Pending — HARO/Qwoted sign-up needed", updatedAt: now() },
      { id: "pe-8", label: "Walmart compensation documentation (W-2, offer letter)", checked: false, notes: "For High Salary criterion", updatedAt: now() },
      { id: "pe-9", label: "Marty project documentation for Original Contributions claim", checked: false, notes: "LangGraph, LangChain, FastAPI stack — industry-first agentic AI", updatedAt: now() },
    ],
  },
  {
    id: "reviewer-outreach",
    title: "Reviewer Applications — Send Drafts",
    icon: "📧",
    items: [
      { id: "ro-1", label: "Send PAAMS 2026 application (pc@paams.net)", checked: false, notes: "Draft ready Mar 27. SEND ASAP — paper deadline Apr 17", updatedAt: now() },
      { id: "ro-2", label: "Send ICML SRAS Workshop application (sras2026workshop@gmail.com)", checked: false, notes: "Draft ready. Verify contact on sras2026.space", updatedAt: now() },
      { id: "ro-3", label: "Send Applied Intelligence / Springer application (apin@springer.com)", checked: false, notes: "Draft ready. Rolling — always open", updatedAt: now() },
      { id: "ro-4", label: "Draft + send IJCAI-ECAI 2026 application", checked: false, notes: "", updatedAt: now() },
      { id: "ro-5", label: "Draft + send JAIR application", checked: false, notes: "", updatedAt: now() },
      { id: "ro-6", label: "Draft + send IEEE TNNLS application (April)", checked: false, notes: "Matches existing IEEE pub", updatedAt: now() },
      { id: "ro-7", label: "Draft + send ACM TIST application", checked: false, notes: "", updatedAt: now() },
      { id: "ro-8", label: "Draft + send AIJ (Elsevier) application", checked: false, notes: "", updatedAt: now() },
      { id: "ro-9", label: "Draft + send KDD 2026 Workshop application", checked: false, notes: "", updatedAt: now() },
    ],
  },
  {
    id: "follow-ups",
    title: "Pending Follow-ups",
    icon: "🔔",
    items: [
      { id: "fu-1", label: "Apr 2 — Follow up with Josh (ACM CAIS) re: AEC title + confirmation letter", checked: false, notes: "josh@cmpnd.ai", updatedAt: now() },
      { id: "fu-2", label: "Apr 3 — Follow up with UAI 2026 if no reply", checked: false, notes: "uai2026chairs+program@gmail.com", updatedAt: now() },
      { id: "fu-3", label: "Apr 5 — Check replies from ACL ARR + COLM 2026", checked: false, notes: "", updatedAt: now() },
      { id: "fu-4", label: "Apr 10 — Check reply from TMLR", checked: false, notes: "tmlr-editors@jmlr.org", updatedAt: now() },
      { id: "fu-5", label: "Apr 15 — Check OpenReview for ICML 2026 workshop reviewer openings", checked: false, notes: "", updatedAt: now() },
      { id: "fu-6", label: "May 1 — Check blog.neurips.cc for NeurIPS 2026 self-nomination form", checked: false, notes: "", updatedAt: now() },
    ],
  },
  {
    id: "attorney-legal",
    title: "Attorney & Legal (I-140)",
    icon: "⚖️",
    items: [
      { id: "al-1", label: "Research 2-3 EB-1A immigration attorneys", checked: false, notes: "Attorney guidance: 3 criteria min; stronger case with 4-5 well-documented ones", updatedAt: now() },
      { id: "al-2", label: "Schedule initial consultations", checked: false, notes: "", updatedAt: now() },
      { id: "al-3", label: "Review and compare fee structures", checked: false, notes: "", updatedAt: now() },
      { id: "al-4", label: "Sign attorney engagement letter", checked: false, notes: "", updatedAt: now() },
      { id: "al-5", label: "Complete Form I-140", checked: false, notes: "", updatedAt: now() },
      { id: "al-6", label: "Prepare I-140 filing fee ($700)", checked: false, notes: "", updatedAt: now() },
      { id: "al-7", label: "Premium processing fee ($2,805) — if opting in", checked: false, notes: "", updatedAt: now() },
      { id: "al-8", label: "Form G-28 (Notice of Entry of Appearance as Attorney)", checked: false, notes: "", updatedAt: now() },
      { id: "al-9", label: "Prepare petition cover letter", checked: false, notes: "", updatedAt: now() },
      { id: "al-10", label: "Compile exhibit index", checked: false, notes: "", updatedAt: now() },
    ],
  },
  {
    id: "letters-endorsements",
    title: "Letters & Endorsements",
    icon: "✉️",
    items: [
      { id: "le-1", label: "Identify 6-8 potential recommenders", checked: false, notes: "", updatedAt: now() },
      { id: "le-2", label: "Categorize as independent vs. dependent", checked: false, notes: "", updatedAt: now() },
      { id: "le-3", label: "Draft template letters for each recommender", checked: false, notes: "", updatedAt: now() },
      { id: "le-4", label: "Send requests with clear deadlines", checked: false, notes: "", updatedAt: now() },
      { id: "le-5", label: "Follow up at 1-week and 2-week marks", checked: false, notes: "", updatedAt: now() },
      { id: "le-6", label: "Collect final signed letters on organizational letterhead", checked: false, notes: "", updatedAt: now() },
      { id: "le-7", label: "Verify each letter addresses specific EB-1A criteria", checked: false, notes: "", updatedAt: now() },
      { id: "le-8", label: "Ensure mix of independent and dependent experts", checked: false, notes: "", updatedAt: now() },
    ],
  },
  {
    id: "post-approval",
    title: "Post-Approval / I-485 (Future Phase)",
    icon: "🎯",
    items: [
      { id: "pa-1", label: "File I-485 (Adjustment of Status)", checked: false, notes: "", updatedAt: now() },
      { id: "pa-2", label: "Schedule medical exam (I-693)", checked: false, notes: "", updatedAt: now() },
      { id: "pa-3", label: "File I-765/I-131 combo card (EAD/AP)", checked: false, notes: "", updatedAt: now() },
      { id: "pa-4", label: "Prepare civil documents for consular processing (if applicable)", checked: false, notes: "", updatedAt: now() },
    ],
  },
];

export const defaultTimeline: TimelineData = [
  {
    id: "phase-1",
    phase: "Phase 1: Self-Assessment & Criterion Building",
    targetStartDate: "2026-03-01",
    targetEndDate: "2026-06-30",
    defaultRange: "Month 1-4 (Mar–Jun 2026)",
    status: "in_progress",
    description:
      "Evaluate profile against 10 criteria, build reviewer portfolio (judging criterion), claim existing publications, begin media outreach. Currently focused on reviewer applications.",
    tasks: [
      { id: "t1-1", label: "Review all 10 EB-1A criteria", completed: true },
      { id: "t1-2", label: "Rate strength for each criterion", completed: true },
      { id: "t1-3", label: "Enroll as reviewer for CVPR 2026 + ICLR 2026", completed: true },
      { id: "t1-4", label: "Apply to review for 5+ additional venues (ACL ARR, COLM, UAI, TMLR, ACM CAIS)", completed: true },
      { id: "t1-5", label: "Send remaining draft applications (PAAMS, ICML SRAS, Springer, IJCAI, JAIR, IEEE TNNLS)", completed: false },
      { id: "t1-6", label: "Claim ICMLA paper on OpenReview/Semantic Scholar", completed: false },
      { id: "t1-7", label: "Sign up for HARO / Qwoted for press coverage", completed: false },
      { id: "t1-8", label: "Begin writing survey article(s) for arXiv", completed: false },
      { id: "t1-9", label: "Check NeurIPS 2026 self-nomination (May 1)", completed: false },
    ],
    notes: "Priority order: Judging (highest) → Publications → Media → Original Contributions.\nJournal reviews (TMLR, JAIR, AIJ, IEEE TNNLS) are higher EB-1A value than conference workshops.",
    updatedAt: now(),
  },
  {
    id: "phase-2",
    phase: "Phase 2: Attorney Consultation",
    targetStartDate: "2026-07-01",
    targetEndDate: "2026-09-30",
    defaultRange: "Month 5-7 (Jul–Sep 2026)",
    status: "not_started",
    description:
      "Consult 2-3 experienced EB-1A attorneys with reviewer portfolio and evidence in hand. Get case evaluation, select and engage attorney.",
    tasks: [
      { id: "t2-1", label: "Research and shortlist EB-1A attorneys", completed: false },
      { id: "t2-2", label: "Schedule consultations (bring reviewer confirmations + evidence)", completed: false },
      { id: "t2-3", label: "Compare evaluations and fees", completed: false },
      { id: "t2-4", label: "Sign engagement letter", completed: false },
    ],
    notes: "Attorney guidance: 3 criteria minimum; stronger case with 4-5 well-documented ones.",
    updatedAt: now(),
  },
  {
    id: "phase-3",
    phase: "Phase 3: Evidence Collection & Documentation",
    targetStartDate: "2026-10-01",
    targetEndDate: "2027-03-31",
    defaultRange: "Month 8-13 (Oct 2026–Mar 2027)",
    status: "not_started",
    description:
      "Systematically collect all documentary evidence, request and finalize recommendation letters, continue building reviewer portfolio.",
    tasks: [
      { id: "t3-1", label: "Gather all personal documents", completed: false },
      { id: "t3-2", label: "Collect salary documentation (W-2, offer letters, pay stubs)", completed: false },
      { id: "t3-3", label: "Document Marty project for Original Contributions claim", completed: false },
      { id: "t3-4", label: "Compile all reviewer confirmation letters", completed: false },
      { id: "t3-5", label: "Request 6-8 recommendation letters", completed: false },
      { id: "t3-6", label: "Follow up on pending items", completed: false },
    ],
    notes: "",
    updatedAt: now(),
  },
  {
    id: "phase-4",
    phase: "Phase 4: Petition Preparation",
    targetStartDate: "2027-04-01",
    targetEndDate: "2027-07-31",
    defaultRange: "Month 14-17 (Apr–Jul 2027)",
    status: "not_started",
    description:
      "Draft petition letter with attorney, organize exhibit tabs, prepare filing package.",
    tasks: [
      { id: "t4-1", label: "Draft petition cover letter", completed: false },
      { id: "t4-2", label: "Organize exhibits by criterion", completed: false },
      { id: "t4-3", label: "Review complete package with attorney", completed: false },
      { id: "t4-4", label: "Prepare filing forms (I-140, G-28)", completed: false },
    ],
    notes: "",
    updatedAt: now(),
  },
  {
    id: "phase-5",
    phase: "Phase 5: Filing",
    targetStartDate: "2027-08-01",
    targetEndDate: "2027-09-30",
    defaultRange: "Month 18-19 (Aug–Sep 2027)",
    status: "not_started",
    description:
      "File I-140, optionally elect premium processing, monitor case online.",
    tasks: [
      { id: "t5-1", label: "Submit I-140 petition", completed: false },
      { id: "t5-2", label: "Elect premium processing (optional)", completed: false },
      { id: "t5-3", label: "Receive receipt notice", completed: false },
    ],
    notes: "Target filing: Sep 2027",
    updatedAt: now(),
  },
  {
    id: "phase-6",
    phase: "Phase 6: Post-Filing",
    targetStartDate: "2027-10-01",
    targetEndDate: null,
    defaultRange: "Month 19+ (Oct 2027+)",
    status: "not_started",
    description:
      "Respond to RFE if received (87-day deadline), receive approval, begin I-485 / consular processing.",
    tasks: [
      { id: "t6-1", label: "Monitor case status online", completed: false },
      { id: "t6-2", label: "Respond to RFE if issued (87-day deadline)", completed: false },
      { id: "t6-3", label: "Receive approval notice", completed: false },
      { id: "t6-4", label: "Begin I-485 or consular processing", completed: false },
    ],
    notes: "Mukherji v. Miller (D. Neb., Jan 2026): District court ruling re USCIS final merits review — relevant context but district-level only.",
    updatedAt: now(),
  },
];

export const defaultBudget: BudgetData = [
  { id: "b-1", category: "Legal", item: "Attorney fees (petition prep)", estimatedCost: 6000, actualCost: null, paid: false, notes: "Range: $3,000-$15,000+", phase: "i140", updatedAt: now() },
  { id: "b-2", category: "Legal", item: "Attorney fees (RFE response, if needed)", estimatedCost: 2000, actualCost: null, paid: false, notes: "May not be needed", phase: "i140", updatedAt: now() },
  { id: "b-3", category: "Government", item: "USCIS I-140 filing fee", estimatedCost: 700, actualCost: null, paid: false, notes: "Required", phase: "i140", updatedAt: now() },
  { id: "b-4", category: "Government", item: "Premium processing", estimatedCost: 2805, actualCost: null, paid: false, notes: "Optional, 15 business days", phase: "i140", updatedAt: now() },
  { id: "b-5", category: "Administrative", item: "Document translations", estimatedCost: 500, actualCost: null, paid: false, notes: "If documents not in English", phase: "i140", updatedAt: now() },
  { id: "b-6", category: "Administrative", item: "Credential evaluation", estimatedCost: 350, actualCost: null, paid: false, notes: "Foreign degree equivalency", phase: "i140", updatedAt: now() },
  { id: "b-7", category: "Administrative", item: "Copies, postage, notarization", estimatedCost: 200, actualCost: null, paid: false, notes: "Miscellaneous", phase: "both", updatedAt: now() },
  { id: "b-8", category: "Government", item: "Medical exam (I-693)", estimatedCost: 400, actualCost: null, paid: false, notes: "Required for I-485 stage", phase: "i485", updatedAt: now() },
  { id: "b-9", category: "Government", item: "I-485 filing fee", estimatedCost: 1440, actualCost: null, paid: false, notes: "Adjustment of status", phase: "i485", updatedAt: now() },
  { id: "b-10", category: "Government", item: "EAD/AP combo card (I-765/I-131)", estimatedCost: 0, actualCost: null, paid: false, notes: "Included with I-485", phase: "i485", updatedAt: now() },
];

export const defaultActivity: ActivityData = [];

export const defaultResources: ResourcesData = [
  {
    id: "my-profiles",
    title: "My Profiles",
    links: [
      { id: "r-me-1", label: "OpenReview Profile", url: "https://openreview.net/profile?id=~Gaurav_Chodwadia1", isCustom: false, notes: "ICMLA paper needs to be claimed here" },
      { id: "r-me-2", label: "Google Scholar", url: "https://scholar.google.com/citations?user=TUGVys0AAAAJ&hl=en", isCustom: false, notes: "" },
      { id: "r-me-3", label: "LinkedIn", url: "https://www.linkedin.com/in/gauravchodwadia", isCustom: false, notes: "" },
    ],
  },
  {
    id: "google-drive",
    title: "Google Drive Tracker",
    links: [
      { id: "r-gd-1", label: "EB-1A Reviewer Tracker Spreadsheet", url: "https://docs.google.com/spreadsheets/d/1oh4QsFH9ufUgILLUbEdxBpXW7TwyvWl-GXBE4DjSp7g", isCustom: false, notes: "Sheets: Conference Reviewer Tracker, Action Queue, EB-1A Evidence Log" },
    ],
  },
  {
    id: "uscis-official",
    title: "Official USCIS Resources",
    links: [
      { id: "r-1", label: "USCIS Policy Manual Vol. 6, Part F, Ch. 2", url: "https://www.uscis.gov/policy-manual/volume-6-part-f-chapter-2", isCustom: false, notes: "EB-1A eligibility criteria" },
      { id: "r-2", label: "Form I-140 Page", url: "https://www.uscis.gov/i-140", isCustom: false, notes: "" },
      { id: "r-3", label: "Premium Processing Info", url: "https://www.uscis.gov/forms/how-do-i-request-premium-processing", isCustom: false, notes: "" },
      { id: "r-4", label: "USCIS Case Status Tracker", url: "https://egov.uscis.gov/casestatus/landing.do", isCustom: false, notes: "" },
    ],
  },
  {
    id: "legal-framework",
    title: "Legal Framework",
    links: [
      { id: "r-5", label: "Kazarian v. USCIS (2010) — Two-Step Analysis", url: "https://casetext.com/case/kazarian-v-uscis", isCustom: false, notes: "Landmark case defining the two-step EB-1A analysis" },
      { id: "r-6", label: "AAO Decision Search", url: "https://www.uscis.gov/administrative-appeals/aao-decisions/aao-non-precedent-decisions", isCustom: false, notes: "" },
    ],
  },
  {
    id: "finding-attorney",
    title: "Finding an Attorney",
    links: [
      { id: "r-7", label: "AILA Lawyer Search", url: "https://www.ailalawyer.com/", isCustom: false, notes: "American Immigration Lawyers Association" },
      { id: "r-8", label: "Avvo Immigration Attorneys", url: "https://www.avvo.com/immigration-lawyer.html", isCustom: false, notes: "" },
    ],
  },
  {
    id: "community",
    title: "Community & Forums",
    links: [
      { id: "r-9", label: "VisaJourney EB-1A Tracker", url: "https://www.visajourney.com/", isCustom: false, notes: "" },
      { id: "r-10", label: "Trackitt EB-1A Forum", url: "https://www.trackitt.com/usa-immigration-trackers/eb1-extraordinary-ability", isCustom: false, notes: "" },
      { id: "r-11", label: "Reddit r/immigration", url: "https://www.reddit.com/r/immigration/", isCustom: false, notes: "" },
    ],
  },
  {
    id: "reviewer-venues",
    title: "Reviewer Application Venues",
    links: [
      { id: "r-rv-1", label: "ACL Rolling Review", url: "https://aclrollingreview.org/", isCustom: false, notes: "Covers ACL, EMNLP, NAACL, CoNLL" },
      { id: "r-rv-2", label: "TMLR (Transactions on ML Research)", url: "https://jmlr.org/tmlr/", isCustom: false, notes: "Highest EB-1A value — rolling journal" },
      { id: "r-rv-3", label: "COLM 2026", url: "https://colmweb.org/", isCustom: false, notes: "Top LLM conference" },
      { id: "r-rv-4", label: "ICML SRAS Workshop", url: "https://sras2026.space", isCustom: false, notes: "Scalable & Resilient Agentic Systems" },
      { id: "r-rv-5", label: "OpenReview (ICML workshops)", url: "https://openreview.net", isCustom: false, notes: "Check Apr 15 for workshop reviewer openings" },
      { id: "r-rv-6", label: "NeurIPS Blog", url: "https://blog.neurips.cc", isCustom: false, notes: "Check May 1 for self-nomination form" },
    ],
  },
  {
    id: "tips",
    title: "Evidence Strengthening Tips",
    links: [
      { id: "r-12", label: "EB-1A Criteria Guide (VisaNation)", url: "https://www.visanation.com/eb-1a-visa", isCustom: false, notes: "Per-criterion guidance on what makes evidence strong vs weak" },
    ],
  },
];

export const defaultReviewers: ReviewersData = [
  // === ENROLLED (actively reviewing) ===
  { id: "rv-1", venueName: "CVPR 2026 Workshop MMRAgl", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=thecvf.com/CVPR/2026/Workshop/MMRAgl", websiteUrl: "https://iclr.cc/virtual/2026/events/workshop", contactInfo: "Already enrolled", location: "Nashville, TN, USA", eventDates: null, relevance: "highest", status: "enrolled", eb1aValue: "Already reviewing — strong EB-1A evidence", criterionId: 4, formalTitle: "Reviewer", letterObtained: false, followUpDate: null, notes: "Get confirmation letter", createdAt: now(), updatedAt: now() },
  { id: "rv-2", venueName: "ICLR 2026 Workshop ES-Reasoning", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=ICLR.cc/2026/Workshop/ES-Reasoning", websiteUrl: "https://iclr.cc/virtual/2026/events/workshop", contactInfo: "Already enrolled", location: "Rio de Janeiro, Brazil (Apr 26-27)", eventDates: "2026-04-26", relevance: "highest", status: "enrolled", eb1aValue: "Already reviewing — strong EB-1A evidence", criterionId: 4, formalTitle: "Reviewer", letterObtained: false, followUpDate: null, notes: "Get confirmation letter", createdAt: now(), updatedAt: now() },

  // === APPLIED (awaiting response) ===
  { id: "rv-3", venueName: "ACL 2026 Workshop EvalEval", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=aclweb.org/ACL/2026/Workshop/EvalEval", websiteUrl: "https://2026.aclweb.org/", contactInfo: "acl2026pcs@gmail.com", location: "San Diego, CA, USA", eventDates: null, relevance: "high", status: "applied", eb1aValue: "Evaluation of evaluation methods; ASTRA-bench", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-4", venueName: "ACL 2026 Workshop GEM", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=aclweb.org/ACL/2026/Workshop/GEM", websiteUrl: "https://2026.aclweb.org/", contactInfo: "acl2026pcs@gmail.com", location: "San Diego, CA, USA", eventDates: null, relevance: "high", status: "applied", eb1aValue: "Generation Evaluation; ASTRA-bench", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-5", venueName: "ACL 2026 Workshop LAW (Linguistic Annotation)", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=aclweb.org/ACL/2026/Workshop/LAW", websiteUrl: "https://sigann.github.io/LAW-XX-2026/", contactInfo: "law2026workshop@googlegroups.com", location: "San Diego, CA, USA (Jul 3)", eventDates: "2026-07-03", relevance: "high", status: "applied", eb1aValue: "Linguistic annotation; DIRECT maps", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-6", venueName: "ACL 2026 Workshop NLP-CSS", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=aclweb.org/ACL/2026/Workshop/NLP-CSS", websiteUrl: "https://sites.google.com/site/nlpandcss/", contactInfo: "nlp-and-css@googlegroups.com", location: "San Diego, CA, USA (Jul 6-7)", eventDates: "2026-07-06", relevance: "high", status: "applied", eb1aValue: "NLP for computational social science", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-7", venueName: "ACL 2026 Workshop SURGeLLM", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=aclweb.org/ACL/2026/Workshop/SURGeLLM", websiteUrl: "https://surgellm.github.io/acl2026/", contactInfo: "surgellm@googlegroups.com", location: "San Diego, CA, USA (Jul 2-3)", eventDates: "2026-07-02", relevance: "high", status: "applied", eb1aValue: "Structured understanding; RAG data", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-8", venueName: "ACM AIWare 2026 Data and Benchmark Track", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=ACM.org/AIWare/2026", websiteUrl: "https://openreview.net/group?id=ACM.org/AIWare/2026", contactInfo: "Via OpenReview", location: "TBD", eventDates: null, relevance: "high", status: "applied", eb1aValue: "AI data & benchmarking; annotation platform", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-9", venueName: "CVPR 2026 Workshop DataCV", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=thecvf.com/CVPR/2026/Workshop/DataCV", websiteUrl: "https://sites.google.com/view/datacv/", contactInfo: "Via workshop website", location: "Nashville, TN, USA", eventDates: null, relevance: "high", status: "applied", eb1aValue: "Data-centric computer vision; ML data platforms", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-10", venueName: "KDD 2026 Workshop Agentic AI Evaluation", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=KDD.org/2026/Workshop/AgenticAI", websiteUrl: "https://openreview.net/group?id=KDD.org/2026/Workshop/AgenticAI", contactInfo: "Via OpenReview", location: "TBD", eventDates: null, relevance: "high", status: "applied", eb1aValue: "Agentic AI eval; ASTRA-bench — perfect fit", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-11", venueName: "AAAI 2026 Bridge LMReasoning", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=AAAI.org/2026/Bridge/LMReasoning", websiteUrl: "https://aaai.org/conference/aaai/aaai-26/", contactInfo: "Via conference website", location: "Philadelphia, PA, USA", eventDates: null, relevance: "medium_high", status: "applied", eb1aValue: "Language model reasoning; ASTRA-bench", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-12", venueName: "AAAI 2026 Workshop LM4UC", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=AAAI.org/2026/Workshop/LM4UC", websiteUrl: "https://aaai.org/conference/aaai/aaai-26/", contactInfo: "Via conference website", location: "Philadelphia, PA, USA", eventDates: null, relevance: "medium_high", status: "applied", eb1aValue: "Language models for user context", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-13", venueName: "AAAI 2026 Workshop TrustAgent", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=AAAI.org/2026/Workshop/TrustAgent", websiteUrl: "https://aaai.org/conference/aaai/aaai-26/", contactInfo: "Via conference website", location: "Philadelphia, PA, USA", eventDates: null, relevance: "medium_high", status: "applied", eb1aValue: "Trustworthy agents; AI safety", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-14", venueName: "AAMAS 2026 Workshop GAIW", venueType: "workshop", openReviewUrl: "https://openreview.net/group?id=ifaamas.org/AAMAS/2026/Workshop/GAIW", websiteUrl: "https://www.aamas2026.org/", contactInfo: "Via conference website", location: "Detroit, MI, USA", eventDates: null, relevance: "medium_high", status: "applied", eb1aValue: "Games & AI; agent-based tool use; ASTRA-bench", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-15", venueName: "ACM SIGIR 2026 Conference", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=ACM.org/SIGIR/2026", websiteUrl: "https://sigir.org/sigir2026/", contactInfo: "Via conference website", location: "TBD", eventDates: null, relevance: "medium_high", status: "applied", eb1aValue: "Information retrieval; RAG systems", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-16", venueName: "MLSys 2026 Conference", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=MLSys.org/2026/Conference", websiteUrl: "https://mlsys.org/", contactInfo: "Via conference website", location: "TBD", eventDates: null, relevance: "medium", status: "applied", eb1aValue: "ML systems; production deployment focus", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },

  // === TO APPLY ===
  { id: "rv-17", venueName: "COLM 2026 Conference", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=colmweb.org/COLM/2026", websiteUrl: "https://colmweb.org/", contactInfo: "Via conference website", location: "TBD", eventDates: null, relevance: "high", status: "to_apply", eb1aValue: "Conference on Language Modeling — top fit for LLM/agentic work", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "Check OpenReview signup", createdAt: now(), updatedAt: now() },
  { id: "rv-18", venueName: "UAI 2026 Conference", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=auai.org/UAI/2026/Conference", websiteUrl: "https://www.auai.org/uai2026/", contactInfo: "uai2026chairs+program@gmail.com", location: "Amsterdam, Netherlands (Aug 17)", eventDates: "2026-08-17", relevance: "medium_high", status: "to_apply", eb1aValue: "Uncertainty in AI; reviews underway Mar-Apr 2026", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: "2026-04-03", notes: "Contact for emergency reviewer slot. Reviews due Apr 11.", createdAt: now(), updatedAt: now() },
  { id: "rv-19", venueName: "ACL ARR (Rolling Review)", venueType: "journal", openReviewUrl: "https://openreview.net/group?id=aclweb.org/ACL/ARR", websiteUrl: "https://aclrollingreview.org/", contactInfo: "support@aclrollingreview.org — subject: 'ARR Reviewer Volunteer'", location: "Rolling (every 2 months)", eventDates: null, relevance: "highest", status: "to_apply", eb1aValue: "Covers ACL/EMNLP/NAACL/CoNLL. Best single action. Email now.", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: "2026-04-05", notes: "HIGH — EB-1A priority. Send email ASAP.", createdAt: now(), updatedAt: now() },

  // === WATCH (future / gated) ===
  { id: "rv-20", venueName: "NeurIPS 2026 Evaluations and Datasets Track", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=NeurIPS.cc/2026/Evaluations", websiteUrl: "https://neurips.cc/", contactInfo: "Via conference website", location: "Sydney, Australia (Dec 6-12)", eventDates: "2026-12-06", relevance: "high", status: "watch", eb1aValue: "Eval & dataset track; opens ~May 2026", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: "2026-05-01", notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-21", venueName: "NeurIPS 2026 Main Track", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=NeurIPS.cc/2026/Conference", websiteUrl: "https://neurips.cc/Conferences/2026", contactInfo: "Self-nomination form — opens ~May 2026", location: "Sydney, Australia (Dec 6-12)", eventDates: "2026-12-06", relevance: "highest", status: "watch", eb1aValue: "Premier venue. Watch blog.neurips.cc for form.", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: "2026-05-01", notes: "HIGH — EB-1A priority. Check blog.neurips.cc around May 1.", createdAt: now(), updatedAt: now() },

  // === VIA ARR (covered by ACL ARR application) ===
  { id: "rv-22", venueName: "EMNLP 2026", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=EMNLP/2026/Conference", websiteUrl: "https://2026.emnlp.org/", contactInfo: "Via ARR signup (see ACL ARR)", location: "TBD (Nov 2026)", eventDates: null, relevance: "high", status: "via_arr", eb1aValue: "Reviews due Jul 6; auto-assigned via ARR", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
  { id: "rv-23", venueName: "CoNLL 2026", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=CoNLL/2026/Conference", websiteUrl: "https://conll.org/", contactInfo: "Via ARR + direct OpenReview", location: "San Diego, CA (Jul 3-4)", eventDates: "2026-07-03", relevance: "high", status: "via_arr", eb1aValue: "NLP cognition & linguistics; co-located with ACL", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },

  // === IN PROGRESS ===
  { id: "rv-24", venueName: "ACM CAIS 2026 — Artifact Evaluation", venueType: "artifact_eval", openReviewUrl: null, websiteUrl: "https://caisconf.org/", contactInfo: "josh@cmpnd.ai", location: "San Jose, CA (May 26-29)", eventDates: "2026-05-26", relevance: "medium_high", status: "in_progress", eb1aValue: "Ask for formal title 'AEC Member'. Weaker than paper review but still counts.", criterionId: 4, formalTitle: "AEC Member (pending)", letterObtained: false, followUpDate: "2026-04-02", notes: "Josh replied Mar 26. Paper reviews closed; offered artifact eval + on-site. Push for formal title + confirmation letter.", createdAt: now(), updatedAt: now() },

  // === CLOSED ===
  { id: "rv-25", venueName: "ICML 2026 Conference", venueType: "conference", openReviewUrl: "https://openreview.net/group?id=ICML.cc/2026/Conference", websiteUrl: "https://icml.cc/Conferences/2026", contactInfo: "CLOSED — no longer accepting", location: "Seoul, South Korea (Jul 6-11)", eventDates: "2026-07-06", relevance: "medium_high", status: "closed", eb1aValue: "Top ML venue; closed for this cycle", criterionId: 4, formalTitle: null, letterObtained: false, followUpDate: null, notes: "", createdAt: now(), updatedAt: now() },
];

export function getDefault(filename: string): unknown {
  switch (filename) {
    case "settings": return { ...defaultSettings, createdAt: now(), lastModified: now() };
    case "criteria": return defaultCriteria.map(c => ({ ...c, updatedAt: now() }));
    case "evidence": return defaultEvidence.map(e => ({ ...e, createdAt: now(), updatedAt: now() }));
    case "letters": return defaultLetters;
    case "checklist": return defaultChecklist;
    case "timeline": return defaultTimeline.map(p => ({ ...p, updatedAt: now() }));
    case "budget": return defaultBudget.map(b => ({ ...b, updatedAt: now() }));
    case "activity": return defaultActivity;
    case "resources": return defaultResources;
    case "reviewers": return defaultReviewers.map(r => ({ ...r, createdAt: now(), updatedAt: now() }));
    default: return null;
  }
}
