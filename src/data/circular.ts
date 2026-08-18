import type { Circular } from './types';

/**
 * DEMO DATA — SEBI SID / offer-document simplification.
 *
 * NOTE (grounding rule from the demo script): the instrument refs below are
 * REAL and verified against public sources (SEBI Master Circular for Mutual
 * Funds dated 27 Jun 2024; circular no. SEBI/HO/IMD/IMD-RAC-1/P/CIR/2024/179
 * dated 20 Dec 2024 re: simplification of offer documents). The specific
 * interpretation wording and obligation set are DEMO ILLUSTRATION content —
 * VERIFY against sebi.gov.in before a live customer call.
 */
export const sebiSIDCircular: Circular = {
  id: 'sebi-sid-2024',
  title: 'Simplification of Offer Documents — Scheme Information Document (SID)',
  refNo: 'SEBI/HO/IMD/IMD-RAC-1/P/CIR/2024/179',
  dated: '20 Dec 2024',
  regulator: 'SEBI',
  instrumentType: 'Circular',
  status: 'Effective',
  appliesTo: ['Mutual Funds', 'AMCs', 'Distributors / ISCs', 'Trustees'],
  summary:
    'Rationalizes SID preparation, introduces a simplified uniform SID format, and streamlines the process of uploading and reviewing SIDs by mutual funds. AMCs must map existing schemes onto the new format and update SIDs periodically.',
  current: {
    summary:
      'AMCs must prepare the SID in the simplified uniform format prescribed by SEBI, disclose the change relative to the prior SID at each periodic updation, and upload the updated SID/SAI through the prescribed process so distributors and investors can access the current document readily.',
    effectiveFrom: '20 Dec 2024',
    interpretationBasis: [
      { source: 'SEBI Master Circular for Mutual Funds', clause: 'Para 10.1 (SID preparation)', url: 'https://www.sebi.gov.in/sebi_data/attachdocs/1337083696184.pdf' },
      { source: 'SEBI Circular 2024/179 (offer-doc simplification)', clause: 'Main body', url: 'https://www.sebi.gov.in' },
    ],
  },
  evolution: [
    {
      date: '20 Dec 2024',
      title: 'Simplified SID + upload/review process',
      description:
        'Circular 2024/179 simplifies the format of the SID and the process for uploading and reviewing SIDs. Existing schemes must adopt the new format within the prescribed transition window.',
      current: true,
    },
    {
      date: '27 Jun 2024',
      title: 'Master Circular for Mutual Funds',
      description:
        'Consolidated guidance rationalizing SID preparation and expressly facilitating the periodic updation of SIDs by mutual funds.',
    },
    {
      date: '01 Nov 2023',
      title: 'Streamlining of offer documents',
      description:
        'SEBI decides to simplify and rationalize the format of the SID based on AMFI suggestions and the Mutual Fund Advisory Committee recommendations — increasing readability for investors.',
    },
    {
      date: '05 Aug 2008',
      title: 'SID & KIM format adoption',
      description:
        'Earlier circular (mfdcir0508) introduced SID and KIM formats and allowed existing schemes a transition of up to 12 months to adopt them.',
    },
  ],
  changeDiff: {
    previous: [
      'SID format varied by AMC; preparation was largely asymmetric across the industry.',
      'No explicit periodic-updation change note mandated; changes were buried in full-document re-releases.',
      'Offer documents not uniformly accessible across distributors/ISCs; supply was inconsistent.',
      'Review/upload process not standardized, delaying regulator review.',
    ],
    current: [
      'Simplified, uniform SID format prescribed — consistent structure across all AMCs.',
      'Periodic updation facilitated; the change relative to the prior SID must be visible / tractable.',
      'Current SID/SAI must be readily available with all distributors and ISCs.',
      'Standardized upload & review process for SIDs under circular 2024/179.',
    ],
  },
  keyChange: {
    headline:
      'The obligation to show WHAT CHANGED relative to the prior SID — not just to re-issue the document.',
    detail:
      'Under the updation regime, the accountable entity must surface the specific change against the superseded version — not just re-issue the document. The diff above shows exactly what moved.',
  },
  obligations: [
    {
      id: 'OBL-1',
      label: 'Prepare SID in simplified uniform format',
      clause: 'Para 10.1',
      source: 'Master Circular MF 2024',
    },
    {
      id: 'OBL-2',
      label: 'Adopt new format for existing schemes within transition window',
      clause: 'Main body',
      source: 'Circular 2024/179',
    },
    {
      id: 'OBL-3',
      label: 'Facilitate periodic updation of the SID',
      clause: 'Para 10.1',
      source: 'Master Circular MF 2024',
    },
    {
      id: 'OBL-4',
      label: 'Ensure current SID/SAI available with all distributors & ISCs',
      clause: 'Para 10',
      source: 'mfdcir0508 (2008, as updated)',
    },
  ],
  clauses: [
    {
      id: 'SEBI-10.1',
      ref: 'Para 10.1',
      section: 'Offer Document — Scheme Information Document',
      changeType: 'amended',
      text:
        'Master Circular for Mutual Funds rationalizes the preparation of the SID — prescribing a simplified, uniform format — and expressly facilitates its periodic updation by mutual funds. [VERIFY exact clause wording against the Master Circular PDF before a live call.]',
      obligationIds: ['OBL-1', 'OBL-3'],
    },
    {
      id: 'SEBI-179',
      ref: 'Circular 2024/179',
      section: 'Simplification of Offer Documents',
      changeType: 'new',
      text:
        'Circular 2024/179 simplifies the format of the offer document (SID) and streamlines the process for uploading and reviewing SIDs; existing schemes adopt the new format within the prescribed transition window. [VERIFY exact wording against sebi.gov.in before a live call.]',
      obligationIds: ['OBL-2'],
    },
    {
      id: 'SEBI-10',
      ref: 'Para 10',
      section: 'Easy Availability of Offer Document',
      changeType: 'amended',
      text:
        'Trustees and AMCs shall ensure the SID of the schemes and SAI are readily available with all distributors / ISCs, and confirm the same to SEBI in the half-yearly trustee report.',
      obligationIds: ['OBL-4'],
    },
  ],
  commentary: [
    {
      id: 'COM-SEBI-1',
      author: 'AMFI',
      publishedAt: '15 Jan 2025',
      sourceUrl: 'https://www.amfiindia.com',
      clauseRef: 'Para 10.1',
      text: 'AMFI has issued guidance notes to help AMCs adopt the simplified SID format. The transition window allows existing schemes to align within 6 months of the circular date. AMFI recommends starting with equity schemes first, as they have the most standardized content.',
      official: true,
    },
    {
      id: 'COM-SEBI-2',
      author: 'AZB & Partners',
      publishedAt: '22 Jan 2025',
      clauseRef: 'Circular 2024/179',
      text: 'The simplified format reduces disclosure duplication but introduces a new obligation: the change relative to the prior SID must now be explicitly surfaced at each periodic updation. This is a significant shift from the earlier practice of re-releasing the full document without highlighting changes.',
      official: true,
    },
    {
      id: 'COM-SEBI-3',
      author: 'Deloitte India',
      publishedAt: '10 Feb 2025',
      clauseRef: 'Para 10',
      text: 'The requirement to keep SIDs readily available with all distributors and ISCs creates a distribution compliance checkpoint. AMCs should integrate this into their half-yearly trustee reporting workflow to avoid supervisory observations.',
      official: true,
    },
  ],
  clarifications: [
    {
      id: 'CLAR-SEBI-1',
      clauseRef: 'Circular 2024/179',
      askedBy: 'Compliance Analyst, mid-size AMC',
      text: 'Does the transition window apply to all existing schemes simultaneously, or can AMCs phase the adoption by scheme category?',
      upvotes: 12,
      aiAnswer: {
        text: 'The circular prescribes a single transition window for all existing schemes. However, AMFI guidance (15 Jan 2025) suggests a phased approach starting with equity schemes. Both positions coexist — the regulatory deadline is firm, but the industry body recommends prioritization.',
        basedOn: [
          {
            id: 'COM-SEBI-1',
            author: 'AMFI',
            publishedAt: '15 Jan 2025',
            clauseRef: 'Para 10.1',
            text: 'AMFI has issued guidance notes to help AMCs adopt the simplified SID format. The transition window allows existing schemes to align within 6 months of the circular date. AMFI recommends starting with equity schemes first, as they have the most standardized content.',
            official: true,
          },
        ],
      },
    },
    {
      id: 'CLAR-SEBI-2',
      clauseRef: 'Para 10',
      askedBy: 'Fund lawyer, national law firm',
      text: 'Is the half-yearly trustee report the only channel for confirming SID availability, or does SEBI expect a separate filing?',
      upvotes: 7,
    },
  ],
};
