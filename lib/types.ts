// ===== Settings =====
export interface Settings {
  applicantName: string;
  fieldOfExpertise: string;
  targetFilingDate: string | null;
  attorneyName: string | null;
  attorneyEmail: string | null;
  theme: "dark" | "light";
  createdAt: string;
  lastModified: string;
}

// ===== Criteria =====
export type CriterionStatus =
  | "not_started"
  | "researching"
  | "evidence_gathering"
  | "strong"
  | "weak"
  | "not_applicable";

export interface CriterionEntry {
  id: number;
  title: string;
  shortDescription: string;
  status: CriterionStatus;
  strengthScore: number; // 0-5
  notes: string;
  updatedAt: string;
}

export type CriteriaData = CriterionEntry[];

// ===== Evidence =====
export type EvidenceStatus = "needed" | "requested" | "received" | "reviewed" | "final";

export interface EvidenceItem {
  id: string;
  criterionId: number;
  title: string;
  description: string;
  status: EvidenceStatus;
  fileNote: string;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EvidenceData = EvidenceItem[];

// ===== Letters =====
export type LetterStatus =
  | "identified"
  | "contacted"
  | "draft_sent"
  | "draft_received"
  | "revision"
  | "final_signed";

export interface RecommendationLetter {
  id: string;
  recommenderName: string;
  recommenderTitle: string;
  organization: string;
  email: string;
  relationship: "independent" | "dependent";
  criteriaAddressed: number[];
  status: LetterStatus;
  requestedDate: string | null;
  dueDate: string | null;
  receivedDate: string | null;
  notes: string;
  followUpCount: number;
  createdAt: string;
  updatedAt: string;
}

export type LettersData = RecommendationLetter[];

// ===== Checklist =====
export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes: string;
  updatedAt: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

export type ChecklistData = ChecklistSection[];

// ===== Timeline =====
export interface TimelineTask {
  id: string;
  label: string;
  completed: boolean;
}

export type TimelinePhaseStatus = "not_started" | "in_progress" | "completed";

export interface TimelinePhase {
  id: string;
  phase: string;
  targetStartDate: string | null;
  targetEndDate: string | null;
  defaultRange: string;
  status: TimelinePhaseStatus;
  description: string;
  tasks: TimelineTask[];
  notes: string;
  updatedAt: string;
}

export type TimelineData = TimelinePhase[];

// ===== Budget =====
export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  estimatedCost: number;
  actualCost: number | null;
  paid: boolean;
  notes: string;
  phase: "i140" | "i485" | "both";
  updatedAt: string;
}

export type BudgetData = BudgetItem[];

// ===== Activity =====
export type ActivityAction = "created" | "updated" | "deleted" | "status_changed";
export type ActivityEntityType =
  | "criterion"
  | "evidence"
  | "letter"
  | "checklist"
  | "timeline"
  | "budget"
  | "reviewer"
  | "settings";

export interface ActivityEvent {
  id: string;
  timestamp: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: ActivityAction;
  summary: string;
}

export type ActivityData = ActivityEvent[];

// ===== Resources =====
export interface ResourceLink {
  id: string;
  label: string;
  url: string;
  isCustom: boolean;
  notes: string;
}

export interface ResourceSection {
  id: string;
  title: string;
  links: ResourceLink[];
}

export type ResourcesData = ResourceSection[];

// ===== Reviewers =====
export type ReviewerVenueType = "conference" | "workshop" | "journal" | "artifact_eval";
export type ReviewerRelevance = "highest" | "high" | "medium_high" | "medium" | "low";
export type ReviewerStatus =
  | "enrolled"
  | "applied"
  | "to_apply"
  | "watch"
  | "via_arr"
  | "in_progress"
  | "accepted"
  | "rejected"
  | "closed";

export interface ReviewerApplication {
  id: string;
  venueName: string;
  venueType: ReviewerVenueType;
  openReviewUrl: string | null;
  websiteUrl: string | null;
  contactInfo: string;
  location: string;
  eventDates: string | null;
  relevance: ReviewerRelevance;
  status: ReviewerStatus;
  eb1aValue: string;
  criterionId: number; // typically 4 (Judging)
  formalTitle: string | null;
  letterObtained: boolean;
  followUpDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ReviewersData = ReviewerApplication[];

// ===== Backup =====
export interface BackupBundle {
  version: 1;
  exportedAt: string;
  data: {
    settings: Settings;
    criteria: CriteriaData;
    evidence: EvidenceData;
    letters: LettersData;
    checklist: ChecklistData;
    timeline: TimelineData;
    budget: BudgetData;
    activity: ActivityData;
    resources: ResourcesData;
    reviewers: ReviewersData;
  };
}
