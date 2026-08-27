#!/usr/bin/env python3
"""
ingest_kmt.py — generate real demo data from the KMT backup corpus.

Takes the last 30 days of *available* circular-grade documents from
financial regulators, parses the verbatim payload text into numbered
paragraphs, and emits src/data/generated/kmt.ts. No fabricated content:
commentary/clarifications are empty (hidden states in the UI), and no
checklist is invented — the UI marks derivation as pending.

Usage: python3 scripts/ingest_kmt.py [path/to/kmt_backup.db]
"""
import json
import re
import sqlite3
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

DB_DEFAULT = "/home/mkr/projects/quirkylabs/regulatory-fabric/kmt-backup/kmt_backup.db"
OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "generated" / "kmt.ts"

AUTHORITIES = ("RBI", "SEBI", "IRDAI", "PFRDA", "IFSCA", "MOF")
CONTENT_TYPES = (
    "Circular",
    "Master Direction",
    "Master Circular",
    "Notification",
    "Guideline",
    "Regulation",
)
WINDOW_DAYS = 30
MAX_DOCS = 80  # demo cap

MONTHS = {m: i + 1 for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])}


def parse_doc_date(s: str):
    m = re.match(r"(\d{1,2})-([A-Za-z]{3})-(\d{4})", s or "")
    if not m:
        return None
    mon = MONTHS.get(m.group(2).title())
    if not mon:
        return None
    return date(int(m.group(3)), mon, int(m.group(1)))


ROMAN = re.compile(r"^[IVXLC]+\.\s+\S")
LETTER = re.compile(r"^[A-Z]\.\s+\S")
PARA = re.compile(r"^(\d{1,3})\.\s+(\S.*)$")


def split_paragraphs(text: str):
    """Split payload text into (section, ref, body) triples.

    Numbered paragraphs are kept verbatim; roman/letter headings become the
    current section. The KMT summary tail (everything from the first
    'Ref: <refno>' block on) is dropped — it is KMT's summary, not the
    circular's words.
    """
    cut = re.search(r"^Ref:\s*\S+.*$", text, re.M)
    if cut:
        text = text[: cut.start()]

    clauses = []
    section = ""
    buf_number = None
    buf_lines = []

    def flush():
        if buf_number is not None and buf_lines:
            clauses.append((section, f"Para {buf_number}", " ".join(buf_lines).strip()))

    for raw in text.splitlines():
        line = raw.rstrip()
        if not line.strip():
            continue
        m = PARA.match(line.strip())
        if m:
            flush()
            buf_number, buf_lines = int(m.group(1)), [m.group(2)]
            continue
        if buf_number is not None and (ROMAN.match(line.strip()) or LETTER.match(line.strip())):
            flush()
            section = line.strip()
            buf_number, buf_lines = None, []
            continue
        if buf_number is not None:
            buf_lines.append(line.strip())
    flush()
    return clauses


def guess_applies_to(clauses):
    for _sec, ref, body in clauses:
        m = re.search(
            r"(?:shall apply to|applies to|applicable to)\s+(?:all\s+)?([^.]{3,80})\.", body, re.I)
        if m:
            return [m.group(1).strip().rstrip(";,").title()]
    return ["All regulated entities"]


def main():
    db_path = sys.argv[1] if len(sys.argv) > 1 else DB_DEFAULT
    con = sqlite3.connect(db_path)
    rows = con.execute(
        """
        SELECT u.authority, u.reference_no, u.document_date, u.title, u.content_type, p.text
        FROM updates u JOIN payloads p ON p.item_key = u.item_key
        WHERE p.text IS NOT NULL AND length(p.text) > 0
        """
    ).fetchall()

    # last 30 days of *available* data
    dated = [(parse_doc_date(r[2]), r) for r in rows]
    dated = [(d, r) for d, r in dated if d]
    max_d = max(d for d, _ in dated)
    lo = max_d - timedelta(days=WINDOW_DAYS - 1)

    picked = [
        (d, r) for d, r in dated
        if lo <= d <= max_d
        and r[0] in AUTHORITIES
        and r[4] in CONTENT_TYPES
    ]
    picked.sort(key=lambda x: x[0], reverse=True)
    picked = picked[:MAX_DOCS]

    out = []
    skipped = 0
    for d, (authority, ref_no, doc_date, title, ctype, text) in picked:
        clauses = split_paragraphs(text)
        if len(clauses) < 3:
            skipped += 1
            continue
        cid = re.sub(r"[^a-z0-9]+", "-", f"{authority}-{ref_no or title}".lower()).strip("-")[:60]
        out.append({
            "id": cid,
            "title": title.strip(),
            "refNo": (ref_no or "").strip() or "—",
            "dated": d.strftime("%d %b %Y"),
            "regulator": authority,
            "instrumentType": "Circular" if ctype in ("Circular", "Master Circular") else "Notification",
            "status": "Effective",
            "appliesTo": guess_applies_to(clauses),
            "summary": clauses[0][2][:400],
            "firstTracked": True,  # no prior version in corpus — no diff claims
            "current": {"summary": "", "effectiveFrom": "", "interpretationBasis": []},
            "evolution": [],
            "changeDiff": {"previous": [], "current": []},
            "obligations": [],
            "clauses": [
                {"id": f"{cid}-p{n}", "ref": ref, "section": sec or None,
                 "changeType": "unchanged", "text": body, "obligationIds": []}
                for n, (sec, ref, body) in enumerate(clauses, 1)
            ],
            "commentary": [],
            "clarifications": [],
            "checklist": [],
            "keyChange": {"headline": "First tracked version", "detail": ""},
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "// AUTO-GENERATED by scripts/ingest_kmt.py — real circulars from the KMT corpus.\n"
        f"// Window: {lo:%d %b %Y} - {max_d:%d %b %Y} (last 30 days available in the corpus).\n"
        f"// {len(out)} circulars ({skipped} skipped: unparseable text). Commentary and\n"
        "// checklists intentionally empty — no fabricated content in this build.\n"
        "import type { Circular } from '../types';\n\n"
        f"export const kmtCirculars: Circular[] = {json.dumps(out, indent=2, ensure_ascii=False)} as Circular[];\n",
        encoding="utf-8",
    )
    print(f"wrote {len(out)} circulars ({skipped} skipped) → {OUT}")
    print(f"window {lo} – {max_d}")


if __name__ == "__main__":
    main()
