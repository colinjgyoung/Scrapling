const assert = require("node:assert/strict");
const { qualify, recencyScore } = require("../scoring.js");

const today = "2026-09-16";

const strongEnglish = qualify({
  roleCompany: "Head of Learning and Development, international technology company",
  location: "Barcelona",
  publishedDate: "2026-09-15",
  text: "We are looking for a communication training partner. Our global managers are struggling with difficult conversations and feedback in English. Can anyone recommend a practical workshop provider?"
}, today);

assert.equal(strongEnglish.level, "strong");
assert.ok(strongEnglish.score >= 70, `Expected strong English score >= 70, got ${strongEnglish.score}`);
assert.equal(strongEnglish.areaKey, "conversations");

const strongSpanish = qualify({
  roleCompany: "Directora de Personas",
  location: "Barcelona",
  publishedDate: "2026-09-10",
  text: "Buscamos proveedor de formación. Nos cuesta conseguir participación en reuniones de nuestros equipos internacionales. ¿Alguien recomienda un taller práctico de comunicación?"
}, today);

assert.equal(strongSpanish.level, "strong");
assert.ok(strongSpanish.score >= 70, `Expected strong Spanish score >= 70, got ${strongSpanish.score}`);
assert.equal(strongSpanish.areaKey, "meetings");

const announcement = qualify({
  roleCompany: "Software Engineer",
  location: "Madrid",
  publishedDate: "2026-09-16",
  text: "Thrilled to announce that I have started a new position. Thank you to everyone who supported me."
}, today);

assert.equal(announcement.level, "weak");
assert.ok(announcement.score < 48, `Expected announcement score < 48, got ${announcement.score}`);

assert.equal(recencyScore("2026-09-16", today), 10);
assert.equal(recencyScore("2026-08-20", today), 7);
assert.equal(recencyScore("2026-06-20", today), 3);
assert.equal(recencyScore("2025-06-20", today), 0);

console.log("All scoring tests passed.");
