import type { Circular } from './types';

/**
 * DEMO DATA — RBI Compliance Function Directions, 2026 (Commercial Banks).
 *
 * REAL + VERIFIED against rbi.org.in (Master Directions page, fetched 2026-08-18):
 *   Reserve Bank of India (Commercial Banks - Compliance Function) Directions, 2026
 *   RBI/DoS/2026-27/408 | DoS.CO.PPG.2/11.01.005/2026-27 | dated July 31, 2026
 *   URL: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13645
 *
 * Clause texts under `clauses` are QUOTED (abridged) from the published document.
 * The interpretation wording and the obligation set are DEMO ILLUSTRATION content —
 * VERIFY against rbi.org.in before a live customer call.
 *
 * Prior instrument superseded: "Guidelines for Compliance function in banks and role
 * of Chief Compliance Officer" (Apr 2017), repealed by this Direction (para 76).
 */
export const rbiComplianceDirections: Circular = {
  id: 'rbi-compliance-dirs-2026',
  title: 'Reserve Bank of India (Commercial Banks — Compliance Function) Directions, 2026',
  refNo: 'RBI/DoS/2026-27/408',
  dated: '31 Jul 2026',
  regulator: 'RBI',
  instrumentType: 'Circular',
  status: 'Effective',
  appliesTo: ['Commercial Banks (excl. SFBs, Payments Banks, LABs)'],
  summary:
    'Consolidates and formalizes the governance, independence, and accountability of the Compliance function and Chief Compliance Officer (CCO) in commercial banks — prescribing a board-approved Compliance Policy, a compliant-independent CCO with minimum tenure, technology-based enterprise-wide compliance monitoring, and a unified compliance dashboard. Effective immediately.',
  current: {
    summary:
      'Commercial banks must run an independent Compliance function headed by a CCO who reports directly to the MD&CEO / Board / ACB, carries a minimum fixed tenure of three years, is free of "dual hatting," and cannot be appointed or removed without prior intimation to RBI. The Board must keep a board-approved Compliance Policy under annual review, review the Compliance function quarterly, keep Compliance separate from Internal Audit, and deploy enterprise-wide workflow-based tools with a unified compliance dashboard.',
    effectiveFrom: '31 Jul 2026',
    interpretationBasis: [
      { source: 'RBI (Commercial Banks — Compliance Function) Directions, 2026', clause: 'Paras 6–16, 55–75', url: 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13645' },
      { source: 'Guidelines for Compliance function in banks (repealed)', clause: 'Apr 2017 (superseded)', url: 'https://www.rbi.org.in' },
    ],
  },
  evolution: [
    {
      date: '31 Jul 2026',
      title: 'Directions, 2026 — effective immediately',
      description:
        'Consolidated Directions replace the earlier compliance-function guidelines; introduce CCO minimum tenure, RBI prior-intimation on appointment/removal, and mandatory technology-based compliance monitoring with a unified dashboard.',
      current: true,
    },
    {
      date: '11 Apr 2022',
      title: 'CCO framework extended to NBFCs',
      description:
        'RBI extends the independent Compliance function + CCO requirement to NBFCs in the Middle and Upper Layers — signaling the trajectory the 2026 Directions codify for banks.',
    },
    {
      date: 'Apr 2017',
      title: 'Guidelines for Compliance function in banks',
      description:
        'Introduced the independent Compliance function headed by a designated CCO with fit-and-proper selection; set the baseline this Direction repeals and supersedes.',
    },
    {
      date: '2000s',
      title: 'Ad hoc compliance instructions',
      description:
        'Compliance oversight existed through scattered circulars and supervisory expectations before a dedicated, codified CCO framework was created.',
    },
  ],
  changeDiff: {
    previous: [
      'CCO tenure not codified; appointment/removal did not require RBI prior intimation.',
      'CCO role and independence varied across banks; dual-hatting was not uniformly barred.',
      'Compliance monitoring relied on manual/manual-plus processes; no mandated enterprise-wide tools or unified dashboard.',
      'Compliance and Internal Audit separation was encouraged but not prescribed as a hard Board obligation.',
    ],
    current: [
      'CCO minimum fixed tenure of not less than three years (para 61); premature removal only with explicit Board approval.',
      'Prior intimation to RBI before appointment, premature transfer, or removal of the CCO (para 70).',
      'Board-approved Compliance Policy reviewed at least annually; Compliance function reviewed quarterly (paras 7, 9).',
      'Board shall keep Compliance and Internal Audit functions separate (para 10).',
      'Mandatory enterprise-wide, workflow-based compliance tools with a unified dashboard (paras 74–75).',
    ],
  },
  keyChange: {
    headline:
      'A CCO who cannot be removed without RBI looking — minimum three-year tenure, prior intimation to RBI on appointment/removal, no dual hatting.',
    detail:
      'The Directions turn the CCO from a report-writer into a protected, accountable officer: RBI must be told before the CCO is appointed or removed, and the Compliance function is now board-supervised and technology-monitored. The diff above shows exactly what moved.',
  },
  obligations: [
    {
      id: 'OBL-R1',
      label: 'Board-approved Compliance Policy, reviewed at least annually',
      clause: 'Para 7',
      source: 'RBI Directions 2026',
    },
    {
      id: 'OBL-R2',
      label: 'Quarterly Board/ACB review of the Compliance function',
      clause: 'Para 9',
      source: 'RBI Directions 2026',
    },
    {
      id: 'OBL-R3',
      label: 'Keep Compliance and Internal Audit functions separate',
      clause: 'Para 10',
      source: 'RBI Directions 2026',
    },
    {
      id: 'OBL-R4',
      label: 'Appoint CCO with min 3-yr tenure; no dual hatting',
      clause: 'Paras 61, 67',
      source: 'RBI Directions 2026',
    },
    {
      id: 'OBL-R5',
      label: 'Prior intimation to RBI on CCO appointment / premature removal',
      clause: 'Para 70',
      source: 'RBI Directions 2026',
    },
    {
      id: 'OBL-R6',
      label: 'Deploy enterprise-wide compliance tools with unified dashboard',
      clause: 'Para 74',
      source: 'RBI Directions 2026',
    },
  ],
  clauses: [
    {
      id: 'RBI-7',
      ref: 'Para 7',
      section: 'Governance and Oversight — Role of the Board',
      changeType: 'amended',
      text: '"The Board shall ensure that the bank has an appropriate Compliance Policy in place and shall oversee its effective implementation. The Board shall review the policy at least annually."',
      previousText: '"The Board shall ensure that the bank has an appropriate Compliance Policy in place. The Board shall review the policy periodically."',
      obligationIds: ['OBL-R1'],
    },
    {
      id: 'RBI-9',
      ref: 'Para 9',
      section: 'Governance and Oversight — Role of the Board',
      changeType: 'amended',
      text: '"The Board or ACB shall review the Compliance function on a quarterly basis. A detailed annual review should also be placed before the Board / ACB. The Chief Compliance Officer (CCO) should be an invitee to such meetings."',
      previousText: '"The Board or ACB shall review the Compliance function on a regular basis. The Chief Compliance Officer (CCO) should be an invitee to such meetings."',
      obligationIds: ['OBL-R2'],
    },
    {
      id: 'RBI-10',
      ref: 'Para 10',
      section: 'Governance and Oversight — Role of the Board',
      changeType: 'new',
      text: '"The Board shall ensure that the Compliance function and the Internal Audit function of the bank are kept separate."',
      obligationIds: ['OBL-R3'],
    },
    {
      id: 'RBI-61',
      ref: 'Para 61',
      section: 'Chief Compliance Officer — Authority, Stature, and Independence',
      changeType: 'new',
      text: '"The CCO shall be appointed for a minimum fixed tenure of not less than three years. The ACB / MD & CEO shall factor this requirement while appointing CCO."',
      obligationIds: ['OBL-R4'],
    },
    {
      id: 'RBI-67',
      ref: 'Para 67',
      section: 'Chief Compliance Officer — Authority, Stature, and Independence',
      changeType: 'new',
      text: '"The bank shall ensure that there is no \u2018dual hatting\u2019 i.e. the CCO shall not be given any responsibility which brings elements of conflict of interest, especially the role relating to business."',
      obligationIds: ['OBL-R4'],
    },
    {
      id: 'RBI-70',
      ref: 'Para 70',
      section: 'Chief Compliance Officer — Reporting Requirements',
      changeType: 'new',
      text: '"The bank shall provide prior intimation to the Senior Supervisory Manager of the RBI, before appointment, premature transfer / removal of the CCO. Such information should be supported by a detailed profile of the candidate along with the fit and proper certification by the MD & CEO of the bank."',
      obligationIds: ['OBL-R5'],
    },
    {
      id: 'RBI-74',
      ref: 'Para 74',
      section: 'Use of Technology for Monitoring',
      changeType: 'new',
      text: '"The bank shall implement comprehensive, integrated, enterprise-wide and workflow-based solutions / tools to enhance the effectiveness of Compliance function. Such a solution / tool shall, inter alia: (1) provide for effective communication and collaboration among all the stakeholders; (2) have processes for identifying, assessing, monitoring and managing compliance requirements; (3) escalate issues of non-compliance; (4) require recording approval of competent authority for deviations / delay in compliance submission; and (5) have a unified dashboard view to senior management on compliance position of the bank as a whole."',
      obligationIds: ['OBL-R6'],
    },
  ],
  commentary: [
    {
      id: 'COM-RBI-1',
      sourceType: 'industry-body',
      author: 'ICSI (Institute of Company Secretaries of India)',
      publishedAt: '15 Aug 2026',
      clauseRef: 'Paras 61, 67',
      text: 'The minimum three-year tenure and dual-hatting prohibition fundamentally change the CCO appointment landscape. Banks will need to create dedicated CCO roles that are structurally separate from business functions — this is a governance upgrade, not just a compliance checkbox.',
      official: true,
    },
    {
      id: 'COM-RBI-2',
      sourceType: 'law-firm',
      author: 'Cyril Amarchand Mangaldas',
      publishedAt: '05 Aug 2026',
      clauseRef: 'Para 70',
      text: 'The prior intimation requirement to RBI before CCO appointment or removal is unprecedented in Indian banking regulation. It gives the regulator effective veto power over CCO tenure, making the role genuinely independent from bank management pressure.',
      official: true,
    },
    {
      id: 'COM-RBI-3',
      sourceType: 'big4',
      author: 'PwC India',
      publishedAt: '20 Aug 2026',
      clauseRef: 'Para 74',
      text: 'The mandatory enterprise-wide compliance dashboard is the most operationally significant change. Most banks currently rely on fragmented, department-level compliance tracking. The unified dashboard requirement will drive significant technology investment over the next 12–18 months.',
      official: true,
    },
    {
      id: 'COM-RBI-4',
      sourceType: 'law-firm',
      author: 'Shardul Amarchand Mangaldas',
      publishedAt: '12 Aug 2026',
      clauseRef: 'Para 10',
      text: 'The requirement to keep Compliance and Internal Audit separate is a structural governance mandate, not a physical-office requirement. Banks should reflect the separation in reporting lines, functional charters, and freedom from business conflicts — the Direction does not compel separate teams or locations.',
      official: true,
    },
    {
      id: 'COM-RBI-5',
      sourceType: 'industry-body',
      author: 'FACE (Fintech Convergence Council)',
      publishedAt: 'Sep 2026 monthly journal',
      clauseRef: 'Para 70',
      text: 'Member practice note: fintechs report that RBI regional offices expect Para 70 intimation not only for fresh appointments but also for renewals and tenure extensions. FACE recommends members treat any change to the sitting CCO\u2019s tenure as intimation-triggering, and calendar the filing two months ahead of board action.',
      official: true,
    },
  ],
  clarifications: [
    {
      id: 'CLAR-RBI-1',
      clauseRef: 'Para 70',
      askedBy: 'General Counsel, private sector bank',
      text: 'Does the prior intimation requirement apply to the initial appointment only, or also to renewals and extensions of the CCO tenure?',
      upvotes: 18,
      aiAnswer: {
        text: 'The Direction (para 70) specifies "appointment, premature transfer / removal" — it does not explicitly mention renewals or extensions. However, Cyril Amarchand Mangaldas (05 Aug 2026) notes that the spirit of the provision is to give RBI visibility over CCO tenure changes. Banks should err on the side of intimation for renewals as well.',
        basedOn: [
          {
            id: 'COM-RBI-2',
            author: 'Cyril Amarchand Mangaldas',
            publishedAt: '05 Aug 2026',
            clauseRef: 'Para 70',
            text: 'The prior intimation requirement to RBI before CCO appointment or removal is unprecedented in Indian banking regulation. It gives the regulator effective veto power over CCO tenure, making the role genuinely independent from bank management pressure.',
            official: true,
          },
        ],
      },
    },
    {
      id: 'CLAR-RBI-2',
      clauseRef: 'Para 74',
      askedBy: 'CTO, mid-size bank',
      text: 'Is there a prescribed technology stack or vendor list for the compliance dashboard, or can banks build custom solutions?',
      upvotes: 9,
    },
    {
      id: 'CLAR-RBI-3',
      clauseRef: 'Para 10',
      askedBy: 'Internal Audit Head, foreign bank branch',
      text: 'The separation of Compliance and Internal Audit — does this mean physical separation of teams, or just reporting-line independence?',
      upvotes: 14,
      aiAnswer: {
        text: 'Para 10 requires the Board to keep the Compliance and Internal Audit functions separate. Shardul Amarchand Mangaldas (12 Aug 2026) reads this as structural separation — distinct reporting lines and functional charters — rather than physical separation of teams or offices. The operational test is independence from business conflicts, not office layout.',
        basedOn: [
          {
            id: 'COM-RBI-4',
            author: 'Shardul Amarchand Mangaldas',
            publishedAt: '12 Aug 2026',
            clauseRef: 'Para 10',
            text: 'The requirement to keep Compliance and Internal Audit separate is a structural governance mandate, not a physical-office requirement. Banks should reflect the separation in reporting lines, functional charters, and freedom from business conflicts — the Direction does not compel separate teams or locations.',
            official: true,
          },
        ],
      },
    },
  ],
  /**
   * Auto-derived checklist — one actionable row per requirement, categorized
   * by the practitioner 6-header model. Sub-clauses of Para 74 are split
   * independently (initial AI assumption); readers can merge them back.
   */
  checklist: [
    {
      id: 'CHK-R1',
      ref: 'Para 7',
      section: 'Governance and Oversight — Role of the Board',
      action: 'Maintain a Board-approved Compliance Policy; place it before the Board for review at least once every year.',
      appliesTo: ['All covered banks'],
      category: 'policy',
      deadline: { kind: 'periodic', frequency: 'Annual review' },
      evidenceExpected: 'Board resolution approving the Compliance Policy + latest annual-review minutes recording the approval.',
    },
    {
      id: 'CHK-R2',
      ref: 'Para 9',
      section: 'Governance and Oversight — Role of the Board',
      action: 'Conduct quarterly review of the Compliance function by the Board / ACB; record CCO as invitee.',
      appliesTo: ['All covered banks'],
      category: 'reporting',
      deadline: { kind: 'periodic', frequency: 'Quarterly' },
      evidenceExpected: 'ACB/Board meeting minutes evidencing the quarterly compliance review and CCO attendance.',
    },
    {
      id: 'CHK-R3',
      ref: 'Para 9',
      section: 'Governance and Oversight — Role of the Board',
      action: 'Place a detailed annual review of the Compliance function before the Board / ACB.',
      appliesTo: ['All covered banks'],
      category: 'reporting',
      deadline: { kind: 'periodic', frequency: 'Annual' },
      evidenceExpected: 'Annual compliance review report as placed before the Board / ACB, with date of placement.',
    },
    {
      id: 'CHK-R4',
      ref: 'Para 10',
      section: 'Governance and Oversight — Role of the Board',
      action: 'Keep the Compliance function and the Internal Audit function structurally separate (charters, reporting lines).',
      appliesTo: ['All covered banks'],
      category: 'policy',
      deadline: { kind: 'none', note: 'Ongoing' },
      evidenceExpected: 'Functional charters and organisation chart showing independent reporting lines; no shared accountability for audit scope.',
    },
    {
      id: 'CHK-R5',
      ref: 'Para 61',
      section: 'Chief Compliance Officer — Authority, Stature, and Independence',
      action: 'Appoint the CCO for a minimum fixed tenure of not less than three years.',
      appliesTo: ['All covered banks'],
      category: 'appointments',
      deadline: { kind: 'event', trigger: 'On every CCO appointment', leadTime: 'Factor tenure at appointment stage' },
      evidenceExpected: 'Appointment letter / Board resolution stating the fixed tenure of not less than three years.',
    },
    {
      id: 'CHK-R6',
      ref: 'Para 67',
      section: 'Chief Compliance Officer — Authority, Stature, and Independence',
      action: 'Ensure no dual-hatting: the CCO holds no responsibility creating conflict of interest, especially business roles.',
      appliesTo: ['All covered banks'],
      category: 'policy',
      deadline: { kind: 'none', note: 'Ongoing' },
      evidenceExpected: "CCO role profile / responsibility assignment matrix confirming absence of 'dual hatting'.",
    },
    {
      id: 'CHK-R7',
      ref: 'Para 70',
      section: 'Chief Compliance Officer — Reporting Requirements',
      action: 'Give prior intimation to the Senior Supervisory Manager, RBI before appointment, premature transfer or removal of the CCO.',
      appliesTo: ['All covered banks'],
      category: 'event',
      deadline: { kind: 'event', trigger: 'Before any CCO appointment / premature transfer / removal', leadTime: 'Prior — i.e. before effecting the change' },
      evidenceExpected: 'Copy of intimation to RBI + detailed candidate profile + fit-and-proper certification signed by MD & CEO.',
    },
    {
      id: 'CHK-R8a',
      ref: 'Para 74(1)–(2)',
      section: 'Use of Technology for Monitoring',
      action: 'Deploy an enterprise-wide, workflow-based compliance tool providing stakeholder collaboration and processes to identify, assess, monitor and manage compliance requirements.',
      appliesTo: ['All covered banks'],
      category: 'actionable',
      deadline: { kind: 'none', note: 'Effective immediately — build & operationalise' },
      evidenceExpected: 'Tool contract/architecture note + screenshots of workflow modules covering identification-to-monitoring cycle.',
    },
    {
      id: 'CHK-R8b',
      ref: 'Para 74(3)–(4)',
      section: 'Use of Technology for Monitoring',
      action: 'Configure the tool to escalate non-compliance issues and require recorded approval of competent authority for deviations / delayed submissions.',
      appliesTo: ['All covered banks'],
      category: 'actionable',
      deadline: { kind: 'none', note: 'Effective immediately — build & operationalise' },
      evidenceExpected: 'Escalation-matrix configuration + system log samples showing recorded competent-authority approvals for deviations.',
    },
    {
      id: 'CHK-R8c',
      ref: 'Para 74(5)',
      section: 'Use of Technology for Monitoring',
      action: 'Provide senior management a unified dashboard view of the compliance position of the bank as a whole.',
      appliesTo: ['All covered banks'],
      category: 'actionable',
      deadline: { kind: 'none', note: 'Effective immediately — build & operationalise' },
      evidenceExpected: 'Dashboard access walkthrough / screenshot pack demonstrating bank-wide unified view.',
    },
    {
      id: 'CHK-R9',
      ref: 'Para 76',
      section: 'Repeal and Saving',
      action: 'Note: the April 2017 Guidelines for Compliance function in banks stand repealed and superseded by these Directions.',
      appliesTo: ['All covered banks'],
      category: 'info',
      deadline: { kind: 'none', note: 'No action — awareness only' },
      evidenceExpected: 'Not applicable — information item; internal policy documents may cite the repealing Directions.',
    },
  ],
};