#!/usr/bin/env node
// Lee el report.json real que generó Sentinel y arma el cuerpo en Markdown
// del comentario que se postea en el PR — sin esto, solo quedaría visible
// en la pestaña Actions / dentro del artifact descargado.
const fs = require("node:fs");

const reportPath = process.argv[2];
const runUrl = process.argv[3];
const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

const lines = [];
lines.push("## 🛡️ Sentinel Architect");
lines.push("");

if (!report.llmValidated) {
  lines.push(
    `> ⚠️ Este reporte usó \`${report.llmProvider}\`, un modelo **no validado** (no es el Claude con el que se midió el Kappa de 0.953 en la tesis).`,
  );
  lines.push("");
}

if (report.summary.total === 0) {
  lines.push(`✅ **Conforme** — 0 violaciones encontradas (arquitectura ${report.style}).`);
} else {
  lines.push(
    `❌ **${report.summary.total} violación(es)** encontradas (Tier 1: ${report.summary.tier1}, Tier 2: ${report.summary.tier2}) — arquitectura ${report.style}.`,
  );
  lines.push("");
  lines.push("| Regla | Tier | Módulo | Confianza | Mensaje |");
  lines.push("|---|---|---|---|---|");
  for (const v of report.violations) {
    const conf = typeof v.confidence === "number" ? `${Math.round(v.confidence * 100)}%` : "—";
    lines.push(`| ${v.rule.toUpperCase()} | ${v.tier} | \`${v.module}\` | ${conf} | ${v.message} |`);
  }
}

lines.push("");
lines.push(`📄 Dashboard visual completo (katas, diagrama, trade-offs): [descargar el artifact de esta corrida](${runUrl}) — un .zip con \`dashboard.html\` adentro, ábrelo en el navegador.`);

console.log(lines.join("\n"));
