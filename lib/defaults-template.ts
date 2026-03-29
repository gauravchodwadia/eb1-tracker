// ---------------------------------------------------------------------------
// Generic EB-1A template defaults for new users (onboarding flow)
// ---------------------------------------------------------------------------

const now = () => new Date().toISOString();

// ---------------------------------------------------------------------------
// CLAUDE.md content (from eb1-tracker-data — already generic)
// ---------------------------------------------------------------------------
const CLAUDE_MD = `# EB-1A Tracker — Data Repository

This repo stores all data for the EB-1A Tracker portal. The portal is **read-only** — all updates happen here via git commits.

## How to update data

Edit the JSON files in \`/data/\` and commit with a clear message describing the change.

Examples:
\`\`\`
git commit -m "Mark reviewer status as applied for [venue]"
git commit -m "Add new evidence: citation report"
git commit -m "Update criterion 4 (Judging) strength to 4/5"
\`\`\`

## Data files

| File | Description | Key fields |
|------|-------------|------------|
| \`settings.json\` | Applicant profile | name, field, target filing date, attorney info |
| \`criteria.json\` | 10 EB-1A criteria | status, strengthScore (0-5), notes |
| \`evidence.json\` | Evidence items linked to criteria | title, status, criterionId, dueDate |
| \`reviewers.json\` | Conference/journal reviewer applications | venueName, status, relevance, followUpDate |
| \`letters.json\` | Recommendation letter tracking | recommenderName, status, relationship |
| \`checklist.json\` | Master checklist by category | sections with checkable items |
| \`timeline.json\` | Project phases and milestones | phases with tasks and dates |
| \`budget.json\` | Cost tracking | estimated/actual costs, paid status |
| \`resources.json\` | Curated links and references | sections with URLs |
| \`activity.json\` | Activity log (auto-generated) | events with timestamps |

## Schemas

### Criteria statuses
\`"not_started"\` | \`"researching"\` | \`"evidence_gathering"\` | \`"strong"\` | \`"weak"\` | \`"not_applicable"\`

### Evidence statuses
\`"needed"\` | \`"requested"\` | \`"received"\` | \`"reviewed"\` | \`"final"\`

### Reviewer statuses
\`"enrolled"\` | \`"applied"\` | \`"to_apply"\` | \`"watch"\` | \`"via_arr"\` | \`"in_progress"\` | \`"accepted"\` | \`"rejected"\` | \`"closed"\`

### Reviewer relevance
\`"highest"\` | \`"high"\` | \`"medium_high"\` | \`"medium"\` | \`"low"\`

### Letter statuses
\`"identified"\` | \`"contacted"\` | \`"draft_sent"\` | \`"draft_received"\` | \`"revision"\` | \`"final_signed"\`

### Timeline phase statuses
\`"not_started"\` | \`"in_progress"\` | \`"completed"\`

### Budget phases
\`"i140"\` | \`"i485"\` | \`"both"\`

## The 10 EB-1A Criteria (USCIS 8 CFR 204.5(h)(3))

1. Awards or Prizes
2. Membership in Associations
3. Published Material About the Applicant
4. Judging the Work of Others
5. Original Contributions of Major Significance
6. Authorship of Scholarly Articles
7. Artistic Exhibitions or Showcases
8. Leading or Critical Role
9. High Salary or Remuneration
10. Commercial Success in Performing Arts

**You need to meet at least 3 of these 10 criteria.**

## Setup instructions for Claude

When helping a new user set up their EB-1A tracker:

1. Ask about their profile: name, field of expertise, current role, target filing date
2. Update \`settings.json\` with their info
3. Go through each of the 10 criteria and assess their current strength based on what they tell you
4. Update \`criteria.json\` with statuses and notes
5. Add any existing evidence items to \`evidence.json\`
6. If they have reviewer applications, add them to \`reviewers.json\`
7. Customize \`checklist.json\` based on their specific situation
8. Set realistic dates in \`timeline.json\`
9. Commit all changes with a clear message like "Initial setup for [Name] — [Field]"

## Generating IDs

For new items, use a format like: \`{prefix}-{random}\` where prefix indicates the type:
- Evidence: \`ev-{descriptive-slug}\`
- Reviewers: \`rv-{number}\`
- Letters: \`lt-{number}\`
- Budget: \`b-{number}\`
- Checklist items: \`{section-prefix}-{number}\`

## Important notes

- All dates should be ISO format: \`"2026-03-27"\` or full ISO \`"2026-03-27T00:00:00.000Z"\`
- IDs must be unique within each file
- \`criterionId\` in evidence and reviewers links to criteria IDs 1-10
- The portal auto-refreshes every 30 seconds — changes appear shortly after committing
`;

// ---------------------------------------------------------------------------
// README.md content (username placeholder gets replaced)
// ---------------------------------------------------------------------------
function getReadmeContent(username: string): string {
  return `# EB-1A Tracker Data

Private data repository for [EB-1A Tracker](https://github.com/${username}/eb1-tracker).

## Quick start

1. **Your data lives here** — The EB-1A Tracker portal reads from this repo
2. **Update data** — Ask Claude to update your tracker, or edit the JSON files directly and commit

## File structure

\`\`\`
data/
├── settings.json      # Your profile and preferences
├── criteria.json      # 10 EB-1A criteria with status/strength
├── evidence.json      # Evidence items linked to criteria
├── reviewers.json     # Conference/journal reviewer applications
├── letters.json       # Recommendation letter tracking
├── checklist.json     # Master document checklist
├── timeline.json      # Project phases and milestones
├── budget.json        # Cost tracking
├── resources.json     # Curated links and references
└── activity.json      # Activity log
\`\`\`

## How updates work

The portal is **read-only** — it just displays your data. To update:

- **Via Claude**: Ask Claude to read this repo's \`CLAUDE.md\`, then tell it what to update. It will edit the JSON files and commit.
- **Manually**: Edit any JSON file in \`/data/\`, commit, and push. The portal refreshes automatically.

All changes are tracked in git history with clear commit messages.
`;
}

// ---------------------------------------------------------------------------
// Template data generators
// ---------------------------------------------------------------------------

function templateSettings(name: string, field: string, targetDate: string | null) {
  return {
    applicantName: name,
    fieldOfExpertise: field,
    targetFilingDate: targetDate,
    attorneyName: null,
    attorneyEmail: null,
    theme: "dark",
    createdAt: now(),
    lastModified: now(),
  };
}

function templateCriteria() {
  const ts = now();
  return [
    { id: 1, title: "Awards or Prizes", shortDescription: "Documentation of the beneficiary's receipt of nationally or internationally recognized prizes or awards for excellence in the field of endeavor.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 2, title: "Membership in Associations", shortDescription: "Documentation of the beneficiary's membership in associations in the field which require outstanding achievements of their members, as judged by recognized national or international experts.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 3, title: "Published Material About the Applicant", shortDescription: "Published material in professional or major trade publications or major media about the beneficiary, relating to the beneficiary's work in the field.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 4, title: "Judging the Work of Others", shortDescription: "Evidence of the beneficiary's participation on a panel, or individually, as a judge of the work of others in the same or an allied field of specialization.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 5, title: "Original Contributions of Major Significance", shortDescription: "Evidence of the beneficiary's original scientific, scholarly, artistic, athletic, or business-related contributions of major significance in the field.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 6, title: "Authorship of Scholarly Articles", shortDescription: "Evidence of the beneficiary's authorship of scholarly articles in professional or major trade publications or other major media.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 7, title: "Artistic Exhibitions or Showcases", shortDescription: "Evidence of the display of the beneficiary's work in the field at artistic exhibitions or showcases.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 8, title: "Leading or Critical Role", shortDescription: "Evidence that the beneficiary has performed in a leading or critical role for organizations or establishments that have a distinguished reputation.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 9, title: "High Salary or Remuneration", shortDescription: "Evidence that the beneficiary has commanded a high salary or other significantly high remuneration for services in relation to others in the field.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
    { id: 10, title: "Commercial Success in Performing Arts", shortDescription: "Evidence of commercial successes in the performing arts, as shown by box office receipts or record, cassette, compact disk, or video sales.", status: "not_started", strengthScore: 0, targeted: false, notes: "", updatedAt: ts },
  ];
}

function templateChecklist() {
  const ts = now();
  return [
    {
      id: "personal-docs",
      title: "Personal Documents",
      icon: "📄",
      items: [
        { id: "pd-1", label: "Valid passport (6+ months validity)", checked: false, notes: "", updatedAt: ts },
        { id: "pd-2", label: "Birth certificate (with certified translation if not in English)", checked: false, notes: "", updatedAt: ts },
        { id: "pd-3", label: "Marriage certificate (if applicable)", checked: false, notes: "", updatedAt: ts },
        { id: "pd-4", label: "Degree certificates and diplomas", checked: false, notes: "", updatedAt: ts },
        { id: "pd-5", label: "Academic transcripts", checked: false, notes: "", updatedAt: ts },
        { id: "pd-6", label: "Detailed resume / CV", checked: false, notes: "", updatedAt: ts },
        { id: "pd-7", label: "Current immigration status documentation (I-94, visa stamp, approval notices)", checked: false, notes: "", updatedAt: ts },
        { id: "pd-8", label: "Passport-style photos (2x2)", checked: false, notes: "", updatedAt: ts },
      ],
    },
    {
      id: "professional-evidence",
      title: "Professional Evidence",
      icon: "🏆",
      items: [
        { id: "pe-1", label: "Updated Google Scholar / ORCID profile", checked: false, notes: "", updatedAt: ts },
        { id: "pe-2", label: "Citation report (Google Scholar, Scopus, or Web of Science)", checked: false, notes: "", updatedAt: ts },
        { id: "pe-3", label: "Full publication list with citation counts", checked: false, notes: "", updatedAt: ts },
        { id: "pe-4", label: "Conference/journal reviewer confirmations", checked: false, notes: "", updatedAt: ts },
        { id: "pe-5", label: "Patent filings or grants documentation", checked: false, notes: "", updatedAt: ts },
        { id: "pe-6", label: "Media coverage / press clippings", checked: false, notes: "", updatedAt: ts },
        { id: "pe-7", label: "Compensation documentation (W-2, offer letter)", checked: false, notes: "For High Salary criterion", updatedAt: ts },
        { id: "pe-8", label: "Key project documentation for Original Contributions", checked: false, notes: "", updatedAt: ts },
      ],
    },
    {
      id: "attorney-legal",
      title: "Attorney & Legal (I-140)",
      icon: "⚖️",
      items: [
        { id: "al-1", label: "Research 2-3 EB-1A immigration attorneys", checked: false, notes: "Attorney guidance: 3 criteria min; stronger case with 4-5 well-documented ones", updatedAt: ts },
        { id: "al-2", label: "Schedule initial consultations", checked: false, notes: "", updatedAt: ts },
        { id: "al-3", label: "Review and compare fee structures", checked: false, notes: "", updatedAt: ts },
        { id: "al-4", label: "Sign attorney engagement letter", checked: false, notes: "", updatedAt: ts },
        { id: "al-5", label: "Complete Form I-140", checked: false, notes: "", updatedAt: ts },
        { id: "al-6", label: "Prepare I-140 filing fee ($700)", checked: false, notes: "", updatedAt: ts },
        { id: "al-7", label: "Premium processing fee ($2,805) — if opting in", checked: false, notes: "", updatedAt: ts },
        { id: "al-8", label: "Form G-28 (Notice of Entry of Appearance as Attorney)", checked: false, notes: "", updatedAt: ts },
        { id: "al-9", label: "Prepare petition cover letter", checked: false, notes: "", updatedAt: ts },
        { id: "al-10", label: "Compile exhibit index", checked: false, notes: "", updatedAt: ts },
      ],
    },
    {
      id: "letters-endorsements",
      title: "Letters & Endorsements",
      icon: "✉️",
      items: [
        { id: "le-1", label: "Identify 6-8 potential recommenders", checked: false, notes: "", updatedAt: ts },
        { id: "le-2", label: "Categorize as independent vs. dependent", checked: false, notes: "", updatedAt: ts },
        { id: "le-3", label: "Draft template letters for each recommender", checked: false, notes: "", updatedAt: ts },
        { id: "le-4", label: "Send requests with clear deadlines", checked: false, notes: "", updatedAt: ts },
        { id: "le-5", label: "Follow up at 1-week and 2-week marks", checked: false, notes: "", updatedAt: ts },
        { id: "le-6", label: "Collect final signed letters on organizational letterhead", checked: false, notes: "", updatedAt: ts },
        { id: "le-7", label: "Verify each letter addresses specific EB-1A criteria", checked: false, notes: "", updatedAt: ts },
        { id: "le-8", label: "Ensure mix of independent and dependent experts", checked: false, notes: "", updatedAt: ts },
      ],
    },
    {
      id: "post-approval",
      title: "Post-Approval / I-485 (Future Phase)",
      icon: "🎯",
      items: [
        { id: "pa-1", label: "File I-485 (Adjustment of Status)", checked: false, notes: "", updatedAt: ts },
        { id: "pa-2", label: "Schedule medical exam (I-693)", checked: false, notes: "", updatedAt: ts },
        { id: "pa-3", label: "File I-765/I-131 combo card (EAD/AP)", checked: false, notes: "", updatedAt: ts },
        { id: "pa-4", label: "Prepare civil documents for consular processing (if applicable)", checked: false, notes: "", updatedAt: ts },
      ],
    },
  ];
}

function templateTimeline() {
  const ts = now();
  return [
    {
      id: "phase-1",
      phase: "Phase 1: Self-Assessment & Criterion Building",
      targetStartDate: null,
      targetEndDate: null,
      defaultRange: "Month 1-4",
      status: "not_started",
      description: "Evaluate profile against 10 criteria, identify strongest areas, begin building evidence portfolio. Apply to review for conferences/journals if targeting the Judging criterion.",
      tasks: [
        { id: "t1-1", label: "Review all 10 EB-1A criteria", completed: false },
        { id: "t1-2", label: "Rate strength for each criterion", completed: false },
        { id: "t1-3", label: "Identify top 3-5 criteria to pursue", completed: false },
        { id: "t1-4", label: "Begin collecting existing evidence", completed: false },
        { id: "t1-5", label: "Set up academic profiles (Google Scholar, ORCID)", completed: false },
      ],
      notes: "",
      updatedAt: ts,
    },
    {
      id: "phase-2",
      phase: "Phase 2: Attorney Consultation",
      targetStartDate: null,
      targetEndDate: null,
      defaultRange: "Month 5-7",
      status: "not_started",
      description: "Consult 2-3 experienced EB-1A attorneys with evidence portfolio in hand. Get case evaluation, select and engage attorney.",
      tasks: [
        { id: "t2-1", label: "Research and shortlist EB-1A attorneys", completed: false },
        { id: "t2-2", label: "Schedule consultations with evidence summary", completed: false },
        { id: "t2-3", label: "Compare evaluations and fees", completed: false },
        { id: "t2-4", label: "Sign engagement letter", completed: false },
      ],
      notes: "Attorney guidance: 3 criteria minimum; stronger case with 4-5 well-documented ones.",
      updatedAt: ts,
    },
    {
      id: "phase-3",
      phase: "Phase 3: Evidence Collection & Documentation",
      targetStartDate: null,
      targetEndDate: null,
      defaultRange: "Month 8-13",
      status: "not_started",
      description: "Systematically collect all documentary evidence, request and finalize recommendation letters, continue building criterion-specific evidence.",
      tasks: [
        { id: "t3-1", label: "Gather all personal documents", completed: false },
        { id: "t3-2", label: "Collect supporting evidence for each criterion", completed: false },
        { id: "t3-3", label: "Request 6-8 recommendation letters", completed: false },
        { id: "t3-4", label: "Follow up on pending items", completed: false },
      ],
      notes: "",
      updatedAt: ts,
    },
    {
      id: "phase-4",
      phase: "Phase 4: Petition Preparation",
      targetStartDate: null,
      targetEndDate: null,
      defaultRange: "Month 14-17",
      status: "not_started",
      description: "Draft petition letter with attorney, organize exhibit tabs, prepare filing package.",
      tasks: [
        { id: "t4-1", label: "Draft petition cover letter", completed: false },
        { id: "t4-2", label: "Organize exhibits by criterion", completed: false },
        { id: "t4-3", label: "Review complete package with attorney", completed: false },
        { id: "t4-4", label: "Prepare filing forms (I-140, G-28)", completed: false },
      ],
      notes: "",
      updatedAt: ts,
    },
    {
      id: "phase-5",
      phase: "Phase 5: Filing",
      targetStartDate: null,
      targetEndDate: null,
      defaultRange: "Month 18-19",
      status: "not_started",
      description: "File I-140, optionally elect premium processing, monitor case online.",
      tasks: [
        { id: "t5-1", label: "Submit I-140 petition", completed: false },
        { id: "t5-2", label: "Elect premium processing (optional)", completed: false },
        { id: "t5-3", label: "Receive receipt notice", completed: false },
      ],
      notes: "",
      updatedAt: ts,
    },
    {
      id: "phase-6",
      phase: "Phase 6: Post-Filing",
      targetStartDate: null,
      targetEndDate: null,
      defaultRange: "Month 19+",
      status: "not_started",
      description: "Respond to RFE if received (87-day deadline), receive approval, begin I-485 / consular processing.",
      tasks: [
        { id: "t6-1", label: "Monitor case status online", completed: false },
        { id: "t6-2", label: "Respond to RFE if issued (87-day deadline)", completed: false },
        { id: "t6-3", label: "Receive approval notice", completed: false },
        { id: "t6-4", label: "Begin I-485 or consular processing", completed: false },
      ],
      notes: "",
      updatedAt: ts,
    },
  ];
}

function templateBudget() {
  const ts = now();
  return [
    { id: "b-1", category: "Legal", item: "Attorney fees (petition prep)", estimatedCost: 6000, actualCost: null, paid: false, notes: "Range: $3,000-$15,000+", phase: "i140", updatedAt: ts },
    { id: "b-2", category: "Legal", item: "Attorney fees (RFE response, if needed)", estimatedCost: 2000, actualCost: null, paid: false, notes: "May not be needed", phase: "i140", updatedAt: ts },
    { id: "b-3", category: "Government", item: "USCIS I-140 filing fee", estimatedCost: 700, actualCost: null, paid: false, notes: "Required", phase: "i140", updatedAt: ts },
    { id: "b-4", category: "Government", item: "Premium processing", estimatedCost: 2805, actualCost: null, paid: false, notes: "Optional, 15 business days", phase: "i140", updatedAt: ts },
    { id: "b-5", category: "Administrative", item: "Document translations", estimatedCost: 500, actualCost: null, paid: false, notes: "If documents not in English", phase: "i140", updatedAt: ts },
    { id: "b-6", category: "Administrative", item: "Credential evaluation", estimatedCost: 350, actualCost: null, paid: false, notes: "Foreign degree equivalency", phase: "i140", updatedAt: ts },
    { id: "b-7", category: "Administrative", item: "Copies, postage, notarization", estimatedCost: 200, actualCost: null, paid: false, notes: "Miscellaneous", phase: "both", updatedAt: ts },
    { id: "b-8", category: "Government", item: "Medical exam (I-693)", estimatedCost: 400, actualCost: null, paid: false, notes: "Required for I-485 stage", phase: "i485", updatedAt: ts },
    { id: "b-9", category: "Government", item: "I-485 filing fee", estimatedCost: 1440, actualCost: null, paid: false, notes: "Adjustment of status", phase: "i485", updatedAt: ts },
    { id: "b-10", category: "Government", item: "EAD/AP combo card (I-765/I-131)", estimatedCost: 0, actualCost: null, paid: false, notes: "Included with I-485", phase: "i485", updatedAt: ts },
  ];
}

function templateResources() {
  return [
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
      id: "tips",
      title: "Evidence Strengthening Tips",
      links: [
        { id: "r-12", label: "EB-1A Criteria Guide (VisaNation)", url: "https://www.visanation.com/eb-1a-visa", isCustom: false, notes: "Per-criterion guidance on what makes evidence strong vs weak" },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Main export: getTemplateFiles
// ---------------------------------------------------------------------------

function getSkillContent(username: string): string {
  return `# EB-1A Tracker — Claude Code Skill

You are this user's dedicated EB-1A immigration assistant. You help them build and track their Extraordinary Ability petition across every conversation.

**At the start of every session:** read \`MEMORY.md\` to recall their full context.
**At the end of every session:** update \`MEMORY.md\` with anything new you learned, then commit and push.

## Prerequisites

Before first use, ensure these are set up:

### 1. GitHub CLI (gh)
Check if installed: \`gh --version\`
If not installed:
- **macOS**: \`brew install gh\`
- **Linux**: \`sudo apt install gh\` or \`sudo dnf install gh\`
- **Windows**: \`winget install --id GitHub.cli\`

### 2. GitHub authentication
Check if authenticated: \`gh auth status\`
If not authenticated: ask the user to run \`gh auth login\` (interactive — they need to complete it themselves).

### 3. Clone the data repo
If \`~/eb1-tracker-data\` does not exist:
\`\`\`
git clone https://github.com/${username}/eb1-tracker-data.git ~/eb1-tracker-data
\`\`\`

### 4. Install this skill
\`\`\`
mkdir -p ~/.claude/skills/eb1a-tracker
cp ~/eb1-tracker-data/SKILL.md ~/.claude/skills/eb1a-tracker/SKILL.md
\`\`\`

## Data repo

- **GitHub**: https://github.com/${username}/eb1-tracker-data
- **Local path**: ~/eb1-tracker-data
- **Portal**: https://eb1-tracker.vercel.app (read-only, auto-refreshes every 30s)

## Every session workflow

1. \`cd ~/eb1-tracker-data\`
2. \`git pull\` to get latest changes
3. Read \`MEMORY.md\` to recall the user's full context
4. Help the user with their request — edit JSON files in \`/data/\` as needed
5. Update \`MEMORY.md\` with new information learned this session
6. \`git add -A && git commit -m "description of change" && git push\`
7. The portal at https://eb1-tracker.vercel.app reflects changes within 30 seconds

## Data files

| File | What it tracks |
|------|---------------|
| \`data/settings.json\` | Name, field of expertise, target filing date, attorney info |
| \`data/criteria.json\` | The 10 EB-1A criteria — status, strength score (0-5), notes |
| \`data/evidence.json\` | Evidence items linked to criteria |
| \`data/reviewers.json\` | Conference/journal reviewer applications (Criterion 4) |
| \`data/letters.json\` | Recommendation letter tracking |
| \`data/checklist.json\` | Master document checklist |
| \`data/timeline.json\` | Project phases and milestones |
| \`data/budget.json\` | Cost estimates and payments |
| \`data/resources.json\` | Curated links and references |

## Common tasks

**Update a criterion:**
Edit \`data/criteria.json\` — set \`status\` to one of: \`not_started\`, \`researching\`, \`evidence_gathering\`, \`strong\`, \`weak\`, \`not_applicable\`. Set \`strengthScore\` (0-5) and \`notes\`.

**Add evidence:**
Append to the array in \`data/evidence.json\`. Required fields: \`id\` (unique string), \`criterionId\` (1-10), \`title\`, \`status\` (needed/requested/received/reviewed/final).

**Add a reviewer application:**
Append to \`data/reviewers.json\`. Key fields: \`id\`, \`venueName\`, \`venueType\` (conference/workshop/journal/artifact_eval), \`status\` (enrolled/applied/to_apply/watch/via_arr/in_progress/accepted/rejected/closed), \`relevance\` (highest/high/medium_high/medium/low).

**Toggle checklist items:**
In \`data/checklist.json\`, find the item by \`id\` and set \`checked: true/false\`.

## Long-term memory

This repo includes a \`MEMORY.md\` file that serves as your persistent memory for this user's EB-1A journey. Use it to remember important context across conversations.

### What to store in MEMORY.md
- User's background, role, employer, key projects
- Attorney name, contact, advice given
- Strategic decisions (which criteria to target, priority order)
- Key dates and deadlines (follow-ups, filing targets, conference dates)
- What worked and what didn't (reviewer applications accepted/rejected, evidence strategies)
- Contacts (recommenders, conference organizers, journal editors)
- Immigration status and history
- Anything the user tells you that would be valuable in future conversations

### How to use it
- **Read MEMORY.md at the start of every conversation** about the EB-1A tracker
- **Update MEMORY.md** whenever you learn something new about the user's situation
- Write in clear, factual prose — not chat logs
- Organize by topic with headers
- Include dates so you know when information was recorded
- Commit memory updates alongside data updates

### Format
\`\`\`markdown
# EB-1A Journey — Memory

## Profile
- Name, role, employer, field...

## Strategy
- Which criteria we're targeting and why...

## Key Contacts
- Attorney, recommenders, conference contacts...

## Timeline & Deadlines
- Important dates...

## Session Notes
### 2026-03-28
- What was discussed, decided, or learned...
\`\`\`

## Rules
- All dates must be ISO format: \`"2026-03-28"\`
- IDs must be unique within each file
- \`criterionId\` links to criteria 1-10
- Read \`CLAUDE.md\` in the repo root for full schema documentation
- Always read \`MEMORY.md\` at the start of each session and update it at the end
- Always commit with a clear, descriptive message
`;
}

function getMemoryContent(name: string, field: string): string {
  return `# EB-1A Journey — Memory

## Profile
- **Name:** ${name}
- **Field:** ${field}
- **Tracker created:** ${new Date().toISOString().slice(0, 10)}

## Strategy
_To be filled in after initial criteria assessment._

## Key Contacts
_Attorney, recommenders, conference contacts..._

## Timeline & Deadlines
_Important dates..._

## Session Notes
### ${new Date().toISOString().slice(0, 10)}
- Initial tracker setup. Criteria assessment pending.
`;
}

export function getTemplateFiles(
  name: string,
  field: string,
  targetDate: string | null,
  username: string
): { path: string; content: string }[] {
  const json = (data: unknown) => JSON.stringify(data, null, 2);

  return [
    { path: "data/settings.json", content: json(templateSettings(name, field, targetDate)) },
    { path: "data/criteria.json", content: json(templateCriteria()) },
    { path: "data/evidence.json", content: json([]) },
    { path: "data/reviewers.json", content: json([]) },
    { path: "data/letters.json", content: json([]) },
    { path: "data/checklist.json", content: json(templateChecklist()) },
    { path: "data/timeline.json", content: json(templateTimeline()) },
    { path: "data/budget.json", content: json(templateBudget()) },
    { path: "data/resources.json", content: json(templateResources()) },
    { path: "data/activity.json", content: json([]) },
    { path: "CLAUDE.md", content: CLAUDE_MD },
    { path: "SKILL.md", content: getSkillContent(username) },
    { path: "MEMORY.md", content: getMemoryContent(name, field) },
    { path: "README.md", content: getReadmeContent(username) },
  ];
}
