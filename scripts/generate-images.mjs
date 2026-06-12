/**
 * Generates the project cover + architecture PNGs and the favicon set.
 *
 * Run with:  node scripts/generate-images.mjs
 * Needs:     npm i --no-save sharp png-to-ico
 *
 * Everything is drawn as SVG using the site's design tokens
 * ("warehouse midnight" + bronze/silver/gold medallion accents)
 * and rasterized with sharp at 2x for crispness.
 */
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ---------------------------------------------------------------- tokens */
const T = {
  bg: "#0a0d14",
  panel: "#10141e",
  panel2: "#151b29",
  line: "#202938",
  lineSoft: "#182030",
  ink: "#e8ecf4",
  muted: "#94a0b8",
  faint: "#5d6880",
  bronze: "#c2824f",
  silver: "#a9b6c9",
  gold: "#e4b05c",
};
// Brand fonts ship as woff2 (not loadable by librsvg), so we render with
// metrically-similar system fonts. Consolas stands in for JetBrains Mono,
// Segoe UI for Space Grotesk / Inter.
const MONO = "Consolas, 'Courier New', monospace";
const DISPLAY = "'Segoe UI', Arial, sans-serif";

const W = 1200;
const H = 630;

/* --------------------------------------------------------------- helpers */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const monoW = (text, fs) => text.length * fs * 0.55;

function gridBg(opacity = 0.05) {
  let lines = "";
  for (let x = 56; x < W; x += 56)
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#94a0b8" stroke-opacity="${opacity}"/>`;
  for (let y = 56; y < H; y += 56)
    lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#94a0b8" stroke-opacity="${opacity}"/>`;
  return `<rect width="${W}" height="${H}" fill="${T.bg}"/>${lines}`;
}

function glow(cx, cy, r, color = T.gold, opacity = 0.07) {
  const id = `glow${Math.round(cx)}x${Math.round(cy)}`;
  return `<defs><radialGradient id="${id}"><stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
}

/** rounded node box with title + optional caption lines */
function node(x, y, w, h, title, caption, accent = T.silver, opts = {}) {
  const fs = opts.fs ?? 17;
  const cfs = opts.cfs ?? 12;
  const capLines = Array.isArray(caption) ? caption : caption ? [caption] : [];
  const titleY = capLines.length
    ? y + h / 2 - (capLines.length * (cfs + 4)) / 2 + 2
    : y + h / 2 + fs * 0.35;
  let cap = "";
  capLines.forEach((c, i) => {
    cap += `<text x="${x + w / 2}" y="${titleY + 18 + i * (cfs + 4)}" font-family="${MONO}" font-size="${cfs}" fill="${T.faint}" text-anchor="middle">${esc(c)}</text>`;
  });
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${T.panel}" stroke="${accent}" stroke-opacity="0.85" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${titleY}" font-family="${MONO}" font-size="${fs}" font-weight="600" fill="${accent}" text-anchor="middle">${esc(title)}</text>${cap}`;
}

/** dashed flow connector with arrowhead */
function flow(x1, y1, x2, y2, color = T.faint, opts = {}) {
  const mid = opts.mid; // optional [x,y] elbow
  const d = mid
    ? `M ${x1} ${y1} L ${mid[0]} ${mid[1]} L ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;
  const ang = Math.atan2(y2 - (mid ? mid[1] : y1), x2 - (mid ? mid[0] : x1));
  const a1x = x2 - 9 * Math.cos(ang - 0.42);
  const a1y = y2 - 9 * Math.sin(ang - 0.42);
  const a2x = x2 - 9 * Math.cos(ang + 0.42);
  const a2y = y2 - 9 * Math.sin(ang + 0.42);
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" stroke-dasharray="${opts.solid ? "none" : "5 5"}" stroke-opacity="0.9"/>
  <path d="M ${x2} ${y2} L ${a1x} ${a1y} L ${a2x} ${a2y} Z" fill="${color}" fill-opacity="0.9"/>`;
}

/** small mono label along a flow */
function flowLabel(x, y, text, color = T.faint) {
  return `<text x="${x}" y="${y}" font-family="${MONO}" font-size="11.5" fill="${color}" text-anchor="middle">${esc(text)}</text>`;
}

/** dashed zone group with lowercase mono label */
function zone(x, y, w, h, label) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${T.panel2}" fill-opacity="0.35" stroke="${T.line}" stroke-dasharray="6 6"/>
  <text x="${x + 14}" y="${y + 22}" font-family="${MONO}" font-size="12.5" fill="${T.faint}">${esc(label)}</text>`;
}

/** diagram header: eyebrow + title */
function header(eyebrow, title) {
  return `<text x="56" y="58" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${T.gold}">${esc(eyebrow)}</text>
  <text x="56" y="96" font-family="${DISPLAY}" font-size="29" font-weight="700" fill="${T.ink}">${esc(title)}</text>`;
}

function footerSlug(slug) {
  return `<text x="56" y="${H - 26}" font-family="${MONO}" font-size="13" fill="${T.faint}">${esc(slug)}</text>
  <text x="${W - 56}" y="${H - 26}" font-family="${MONO}" font-size="13" fill="${T.faint}" text-anchor="end">raufmuritala.github.io</text>`;
}

/** mono chip; returns {svg, w} so rows can be laid out */
function chip(x, y, text, color = T.muted, opts = {}) {
  const fs = opts.fs ?? 13;
  const padX = 12;
  const w = monoW(text, fs) + padX * 2;
  const h = opts.h ?? 30;
  return {
    w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${T.panel2}" stroke="${T.line}"/>
    <text x="${x + w / 2}" y="${y + h / 2 + fs * 0.36}" font-family="${MONO}" font-size="${fs}" fill="${color}" text-anchor="middle">${esc(text)}</text>`,
  };
}

function chipRow(x, y, items, gap = 10) {
  let svg = "";
  let cx = x;
  for (const it of items) {
    const c = chip(cx, y, it.text, it.color, it);
    svg += c.svg;
    cx += c.w + gap;
  }
  return svg;
}

const svgDoc = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;

/* ===================================================== architecture: payvault */
function archPayvault() {
  let s = gridBg() + glow(1050, 120, 420);
  s += header("architecture · medallion_lakehouse", "PayVault — Azure Lakehouse, Bronze to Gold");

  const rowY = 220; // main flow centerline
  // sources
  s += zone(46, 140, 160, 268, "sources");
  s += node(62, 176, 128, 56, "transactions", null, T.silver, { fs: 14 });
  s += node(62, 246, 128, 56, "fraud_signals", null, T.silver, { fs: 14 });
  s += node(62, 316, 128, 56, "fx_rates", null, T.silver, { fs: 14 });

  // ingestion
  s += zone(236, 140, 170, 268, "ingestion");
  s += node(252, 192, 138, 62, "Event Hubs", "streaming", T.muted, { fs: 15 });
  s += node(252, 296, 138, 62, "Data Factory", "batch", T.muted, { fs: 15 });

  // landing
  s += node(442, 240, 142, 70, "ADLS Gen2", "raw landing", T.muted, { fs: 15 });

  // medallion zone
  s += zone(620, 140, 360, 268, "databricks · delta lake");
  s += node(642, 184, 96, 170, "Bronze", ["raw", "immutable", "history"], T.bronze, { fs: 16 });
  s += node(752, 184, 96, 170, "Silver", ["clean", "dedup", "conform"], T.silver, { fs: 16 });
  s += node(862, 184, 96, 170, "Gold", ["GMV", "fraud", "marts"], T.gold, { fs: 16 });
  s += `<text x="800" y="388" font-family="${MONO}" font-size="12" fill="${T.faint}" text-anchor="middle">ACID · time travel · schema enforcement</text>`;

  // serving
  s += node(1016, 192, 140, 62, "Databricks SQL", "serving", T.gold, { fs: 14 });
  s += node(1016, 296, 140, 62, "Dashboards", "finance + risk", T.muted, { fs: 14 });

  // flows: sources -> ingestion
  s += flow(190, 204, 252, 216, T.faint);
  s += flow(190, 274, 252, 250, T.faint);
  s += flow(190, 344, 252, 320, T.faint);
  // ingestion -> adls
  s += flow(390, 223, 442, 262, T.faint);
  s += flow(390, 327, 442, 290, T.faint);
  // adls -> bronze
  s += flow(584, 275, 642, 270, T.bronze);
  // medallion internal
  s += flow(738, 270, 752, 270, T.silver, { solid: true });
  s += flow(848, 270, 862, 270, T.gold, { solid: true });
  // gold -> serving
  s += flow(958, 240, 1016, 222, T.gold);
  s += flow(1086, 254, 1086, 296, T.gold);

  // metric chips
  s += chipRow(56, 452, [
    { text: "88,121 transactions", color: T.gold },
    { text: "$55.8M GMV standardized", color: T.gold },
    { text: "1m 07s end-to-end", color: T.silver },
    { text: "~$0.60/month compute", color: T.silver },
    { text: "PySpark + Delta", color: T.muted },
  ]);

  s += footerSlug("payvault-data-platform");
  return svgDoc(s);
}

/* ============================================== architecture: aws-serverless */
function archAwsEtl() {
  let s = gridBg() + glow(1050, 120, 420);
  s += header("architecture · event_driven_etl", "Serverless ETL — JSON to Parquet on AWS");

  // main flow
  s += node(56, 210, 130, 64, "Producers", "raw JSON", T.muted, { fs: 15 });
  s += zone(226, 152, 250, 150, "raw zone");
  s += node(246, 210, 210, 64, "S3 raw bucket", "landing", T.silver, { fs: 16 });
  s += node(530, 196, 170, 92, "Lambda", ["validate · flatten", "JSON → Parquet"], T.bronze, { fs: 17 });
  s += zone(740, 152, 250, 150, "curated zone");
  s += node(760, 210, 210, 64, "S3 curated", "partitioned parquet", T.gold, { fs: 16 });
  s += node(1030, 210, 130, 64, "Athena", "serverless SQL", T.gold, { fs: 16 });

  s += flow(186, 242, 246, 242, T.faint);
  s += flow(456, 242, 530, 242, T.bronze);
  s += flowLabel(493, 318, "s3:ObjectCreated", T.bronze);
  s += flow(700, 242, 760, 242, T.gold);
  s += flow(970, 242, 1030, 242, T.gold);

  // catalog row
  s += node(560, 392, 180, 64, "Glue crawler", "schema discovery", T.silver, { fs: 15 });
  s += node(800, 392, 200, 64, "Glue Data Catalog", "schema truth", T.silver, { fs: 15 });
  s += flow(865, 274, 700, 392, T.silver, { mid: [865, 340] });
  s += flow(740, 424, 800, 424, T.silver);
  s += flow(940, 392, 1080, 274, T.silver, { mid: [940, 340] });
  s += flowLabel(905, 358, "crawls", T.faint);
  s += flowLabel(1035, 358, "table schemas", T.faint);

  s += chipRow(56, 512, [
    { text: "event-driven · zero schedules", color: T.gold },
    { text: "scales to zero when idle", color: T.silver },
    { text: "idempotent replays", color: T.silver },
    { text: "IAM least privilege", color: T.muted },
  ]);

  s += footerSlug("aws-serverless-etl");
  return svgDoc(s);
}

/* ==================================================== architecture: dbt + bq */
function archDbt() {
  let s = gridBg() + glow(1050, 120, 420);
  s += header("architecture · layered_transformations", "Analytics Engineering — dbt on BigQuery");

  // sources
  s += zone(46, 150, 200, 230, "bigquery · raw");
  s += node(64, 192, 164, 54, "raw sources", "freshness-checked", T.muted, { fs: 14 });
  s += node(64, 264, 164, 54, "source contracts", "declared in dbt", T.muted, { fs: 14 });

  // dbt zone with three layers
  s += zone(290, 150, 600, 230, "dbt · transformation layers");
  s += node(312, 200, 170, 130, "staging", ["stg_* · views", "rename · cast", "1:1 with sources"], T.bronze, { fs: 16 });
  s += node(506, 200, 170, 130, "intermediate", ["int_* · logic", "reusable joins", "business rules"], T.silver, { fs: 16 });
  s += node(700, 200, 170, 130, "marts", ["fct_* · dim_*", "tables", "reporting-ready"], T.gold, { fs: 16 });

  // consumers
  s += node(936, 200, 220, 60, "BI · reporting", "shared definitions", T.gold, { fs: 15 });
  s += node(936, 286, 220, 60, "dbt docs", "lineage + columns", T.silver, { fs: 15 });

  s += flow(228, 240, 312, 256, T.faint);
  s += flow(482, 265, 506, 265, T.bronze, { solid: true });
  s += flow(676, 265, 700, 265, T.silver, { solid: true });
  s += flow(870, 240, 936, 226, T.gold);
  s += flow(870, 300, 936, 312, T.faint);

  // tests bar
  s += `<rect x="290" y="412" width="600" height="56" rx="12" fill="${T.panel}" stroke="${T.gold}" stroke-opacity="0.45"/>
  <text x="590" y="440" font-family="${MONO}" font-size="14" fill="${T.gold}" text-anchor="middle">dbt tests · every build · CI</text>
  <text x="590" y="458" font-family="${MONO}" font-size="12" fill="${T.faint}" text-anchor="middle">unique · not_null · relationships · accepted_values</text>`;
  s += flow(397, 380, 397, 412, T.faint);
  s += flow(591, 380, 591, 412, T.faint);
  s += flow(785, 380, 785, 412, T.faint);

  s += chipRow(56, 512, [
    { text: "3 layers · staging → marts", color: T.gold },
    { text: "tests as layer contracts", color: T.silver },
    { text: "docs generated from code", color: T.silver },
    { text: "version-controlled SQL", color: T.muted },
  ]);

  s += footerSlug("dbt-bigquery-analytics-engineering");
  return svgDoc(s);
}

/* ===================================================== architecture: youtube */
function archYoutube() {
  let s = gridBg() + glow(1050, 120, 420);
  s += header("architecture · multi_zone_pipeline", "YouTube Analytics — API to Dashboard on AWS");

  s += node(50, 206, 132, 68, "YouTube API", "nested JSON", T.muted, { fs: 14 });

  s += zone(218, 152, 690, 150, "s3 data zones");
  s += node(238, 206, 150, 68, "landing", "raw API drops", T.bronze, { fs: 16 });
  s += node(456, 206, 150, 68, "cleansed", "normalized JSON", T.silver, { fs: 16 });
  s += node(736, 206, 150, 68, "analytics", "partitioned by region", T.gold, { fs: 16 });

  s += node(1004, 206, 150, 68, "Athena", "SQL analytics", T.gold, { fs: 16 });

  s += flow(182, 240, 238, 240, T.faint);
  s += flow(388, 240, 456, 240, T.bronze);
  s += flowLabel(422, 224, "Lambda", T.bronze);
  s += flow(606, 240, 736, 240, T.silver);
  s += flowLabel(671, 224, "Glue ETL · joins", T.silver);
  s += flow(886, 240, 1004, 240, T.gold);

  // catalog + quicksight row
  s += node(380, 396, 220, 60, "Glue Data Catalog", "schemas for all zones", T.silver, { fs: 15 });
  s += node(700, 396, 250, 60, "QuickSight", "stakeholder dashboards", T.gold, { fs: 16 });
  s += flow(490, 302, 490, 396, T.faint, { solid: false });
  s += flowLabel(560, 352, "tracks zones", T.faint);
  s += flow(1079, 274, 950, 414, T.gold, { mid: [1079, 414] });

  s += chipRow(56, 512, [
    { text: "landing → cleansed → analytics", color: T.gold },
    { text: "100% serverless · pay-per-use", color: T.silver },
    { text: "incremental Glue runs", color: T.silver },
    { text: "region-partitioned scans", color: T.muted },
  ]);

  s += footerSlug("youtube-analytics-pipeline");
  return svgDoc(s);
}

/* ============================================================== cover helper */
function coverBase({ eyebrow, titleLines, sub, chips, slug }) {
  let s = gridBg(0.045) + glow(950, 140, 460) + glow(180, 560, 320, T.bronze, 0.05);
  s += `<text x="64" y="118" font-family="${MONO}" font-size="15" letter-spacing="2.5" fill="${T.gold}">${esc(eyebrow)}</text>`;
  titleLines.forEach((line, i) => {
    s += `<text x="62" y="${190 + i * 64}" font-family="${DISPLAY}" font-size="54" font-weight="700" fill="${i === titleLines.length - 1 ? T.gold : T.ink}">${esc(line)}</text>`;
  });
  const subY = 190 + titleLines.length * 64;
  s += `<text x="64" y="${subY}" font-family="${MONO}" font-size="17" fill="${T.muted}">${esc(sub)}</text>`;
  s += chipRow(64, 500, chips.map((c) => ({ text: c.text, color: c.color ?? T.muted, fs: 14, h: 34 })), 12);
  s += `<text x="64" y="${H - 40}" font-family="${MONO}" font-size="13" fill="${T.faint}">raufmuritala.github.io</text>
  <text x="${W - 64}" y="${H - 40}" font-family="${MONO}" font-size="13" fill="${T.faint}" text-anchor="end">${esc(slug)}</text>`;
  return s;
}

/* ------------------------------------------------ cover art: payvault coins */
function coverPayvault() {
  let s = coverBase({
    eyebrow: "case_study · data_platform",
    titleLines: ["PayVault —", "Fintech Lakehouse"],
    sub: "Azure · Databricks · Delta Lake · Medallion Architecture",
    chips: [
      { text: "88,121 txns", color: T.gold },
      { text: "$55.8M GMV", color: T.gold },
      { text: "1m07s pipeline", color: T.silver },
      { text: "~$0.60/mo", color: T.silver },
    ],
    slug: "payvault-data-platform",
  });

  // medallion stack: three coins rising bronze -> silver -> gold
  const coins = [
    { cx: 880, cy: 380, r: 64, c: T.bronze, label: "bronze" },
    { cx: 980, cy: 300, r: 72, c: T.silver, label: "silver" },
    { cx: 1080, cy: 210, r: 80, c: T.gold, label: "gold" },
  ];
  s += flow(880 + 46, 380 - 46, 980 - 50, 300 + 52, T.silver);
  s += flow(980 + 50, 300 - 52, 1080 - 55, 210 + 58, T.gold);
  for (const k of coins) {
    s += `<circle cx="${k.cx}" cy="${k.cy}" r="${k.r}" fill="${T.panel}" stroke="${k.c}" stroke-width="2.5"/>
    <circle cx="${k.cx}" cy="${k.cy}" r="${k.r - 12}" fill="none" stroke="${k.c}" stroke-opacity="0.4" stroke-dasharray="4 6"/>
    <text x="${k.cx}" y="${k.cy + 5}" font-family="${MONO}" font-size="16" fill="${k.c}" text-anchor="middle">${k.label}</text>`;
  }
  return svgDoc(s);
}

/* ---------------------------------------------- cover art: aws json→parquet */
function coverAwsEtl() {
  let s = coverBase({
    eyebrow: "case_study · data_pipeline",
    titleLines: ["Serverless ETL,", "JSON → Parquet"],
    sub: "Event-driven on AWS · S3 · Lambda · Glue · Athena",
    chips: [
      { text: "seconds to queryable", color: T.gold },
      { text: "0 servers", color: T.gold },
      { text: "scan cost ↓ columnar", color: T.silver },
    ],
    slug: "aws-serverless-etl",
  });

  // JSON doc
  s += `<rect x="800" y="180" width="120" height="150" rx="10" fill="${T.panel}" stroke="${T.silver}" stroke-width="2"/>
  <text x="860" y="240" font-family="${MONO}" font-size="34" fill="${T.silver}" text-anchor="middle">{ }</text>
  <text x="860" y="305" font-family="${MONO}" font-size="13" fill="${T.faint}" text-anchor="middle">raw json</text>`;
  // lambda bolt
  s += `<path d="M 970 220 L 950 268 L 968 268 L 952 308 L 996 256 L 976 256 L 992 220 Z" fill="${T.bronze}"/>`;
  s += flow(920 , 255, 944, 255, T.bronze, { solid: true });
  s += flow(1000, 255, 1024, 255, T.gold, { solid: true });
  // parquet columns
  const cols = [60, 100, 76, 116];
  cols.forEach((h, i) => {
    s += `<rect x="${1032 + i * 30}" y="${330 - h}" width="22" height="${h}" rx="4" fill="${T.gold}" fill-opacity="${0.45 + i * 0.15}"/>`;
  });
  s += `<text x="1078" y="305" font-family="${MONO}" font-size="13" fill="${T.faint}" text-anchor="middle" dy="50">columnar parquet</text>`;
  return svgDoc(s);
}

/* ------------------------------------------------- cover art: youtube chart */
function coverYoutube() {
  let s = coverBase({
    eyebrow: "case_study · analytics_pipeline",
    titleLines: ["YouTube Analytics,", "API → Dashboard"],
    sub: "AWS serverless · S3 zones · Glue · Athena · QuickSight",
    chips: [
      { text: "3 data zones", color: T.gold },
      { text: "100% serverless", color: T.gold },
      { text: "self-serve dashboards", color: T.silver },
    ],
    slug: "youtube-analytics-pipeline",
  });

  // rising bars (engagement trend)
  const bars = [54, 86, 70, 118, 102, 150];
  bars.forEach((h, i) => {
    const x = 850 + i * 46;
    s += `<rect x="${x}" y="${360 - h}" width="30" height="${h}" rx="5" fill="${i >= 4 ? T.gold : i >= 2 ? T.silver : T.bronze}" fill-opacity="0.85"/>`;
  });
  // trend line
  s += `<path d="M 865 318 L 911 286 L 957 300 L 1003 252 L 1049 268 L 1095 220" fill="none" stroke="${T.gold}" stroke-width="2.5" stroke-dasharray="2 6"/>`;
  // play button
  s += `<rect x="900" y="120" width="104" height="74" rx="20" fill="${T.panel}" stroke="${T.gold}" stroke-width="2.5"/>
  <path d="M 938 140 L 938 174 L 972 157 Z" fill="${T.gold}"/>`;
  return svgDoc(s);
}

/* ----------------------------------------------------- cover art: dbt DAG */
function coverDbt() {
  let s = coverBase({
    eyebrow: "case_study · analytics_engineering",
    titleLines: ["Tested Models,", "dbt + BigQuery"],
    sub: "staging → intermediate → marts · tests in CI · dbt docs",
    chips: [
      { text: "3 model layers", color: T.gold },
      { text: "tested contracts", color: T.gold },
      { text: "full lineage docs", color: T.silver },
    ],
    slug: "dbt-bigquery-analytics-engineering",
  });

  // lineage DAG
  const nodes = [
    { x: 820, y: 200, c: T.faint, r: 9 },
    { x: 820, y: 290, c: T.faint, r: 9 },
    { x: 920, y: 165, c: T.bronze, r: 11 },
    { x: 920, y: 245, c: T.bronze, r: 11 },
    { x: 920, y: 325, c: T.bronze, r: 11 },
    { x: 1020, y: 205, c: T.silver, r: 12 },
    { x: 1020, y: 295, c: T.silver, r: 12 },
    { x: 1120, y: 250, c: T.gold, r: 15 },
  ];
  const edges = [
    [0, 2], [0, 3], [1, 3], [1, 4],
    [2, 5], [3, 5], [3, 6], [4, 6],
    [5, 7], [6, 7],
  ];
  for (const [a, b] of edges) {
    const A = nodes[a], B = nodes[b];
    s += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="${B.c}" stroke-opacity="0.5" stroke-width="1.8"/>`;
  }
  for (const n of nodes) {
    s += `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${T.panel}" stroke="${n.c}" stroke-width="2.5"/>`;
  }
  s += `<text x="820" y="370" font-family="${MONO}" font-size="12" fill="${T.faint}" text-anchor="middle">src</text>
  <text x="920" y="370" font-family="${MONO}" font-size="12" fill="${T.bronze}" text-anchor="middle">stg</text>
  <text x="1020" y="370" font-family="${MONO}" font-size="12" fill="${T.silver}" text-anchor="middle">int</text>
  <text x="1120" y="370" font-family="${MONO}" font-size="12" fill="${T.gold}" text-anchor="middle">marts</text>`;
  return svgDoc(s);
}

/* ================================================================= favicon */
/** Terminal-prompt monogram: gold "r" + bronze cursor on midnight tile. */
function faviconSvg(size = 512) {
  const u = size / 512; // scale unit
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${T.bg}"/>
  <rect x="14" y="14" width="484" height="484" rx="84" fill="none" stroke="${T.gold}" stroke-opacity="0.35" stroke-width="10"/>
  <text x="150" y="380" font-family="${MONO}" font-size="340" font-weight="700" fill="${T.gold}" text-anchor="middle">r</text>
  <rect x="300" y="300" width="116" height="80" rx="14" fill="${T.bronze}"/>
</svg>`.replace(/\$\{u\}/g, u);
}

/* ==================================================================== main */
const projects = [
  ["payvault-data-platform", coverPayvault, archPayvault],
  ["aws-serverless-etl", coverAwsEtl, archAwsEtl],
  ["dbt-bigquery-analytics-engineering", coverDbt, archDbt],
  ["youtube-analytics-pipeline", coverYoutube, archYoutube],
];

const render = (svg, file, width = 2400) =>
  sharp(Buffer.from(svg), { density: 72 * (width / W) })
    .resize(width)
    .png({ compressionLevel: 9, palette: true })
    .toFile(file)
    .then(() => console.log("wrote", path.relative(root, file)));

for (const [slug, cover, arch] of projects) {
  const dir = path.join(root, "public", "images", "projects", slug);
  await mkdir(dir, { recursive: true });
  await render(cover(), path.join(dir, "cover.png"));
  await render(arch(), path.join(dir, "architecture.png"));
}

// favicons → src/app file conventions (favicon.ico, icon.svg, apple-icon.png)
const appDir = path.join(root, "src", "app");
await writeFile(path.join(appDir, "icon.svg"), faviconSvg(512));
const icoSizes = [16, 32, 48];
const pngBufs = await Promise.all(
  icoSizes.map((sz) => sharp(Buffer.from(faviconSvg(512))).resize(sz, sz).png().toBuffer())
);
await writeFile(path.join(appDir, "favicon.ico"), await pngToIco(pngBufs));
console.log("wrote src/app/favicon.ico + icon.svg");
await sharp(Buffer.from(faviconSvg(512)))
  .resize(180, 180)
  .png()
  .toFile(path.join(appDir, "apple-icon.png"));
console.log("wrote src/app/apple-icon.png");
