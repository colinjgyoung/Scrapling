const assert = require("node:assert/strict");
const { buildSearches, safeUrl, shortlistToCsv, loadStoredList, persistList } = require("../core.js");

const searches = buildSearches({ audience: "direct", topic: "all", language: "both", location: "Barcelona" });
assert.equal(searches.length, 12);
assert.ok(searches.every(item => item.linkedIn.startsWith("https://www.linkedin.com/search/results/content/")));
assert.ok(searches.every(item => decodeURIComponent(item.google).includes("site:linkedin.com/posts")));
assert.ok(searches.some(item => item.query.includes("equipos internacionales")));

assert.equal(safeUrl("javascript:alert(1)"), "");
assert.equal(safeUrl("not a url"), "");
assert.equal(safeUrl("https://www.linkedin.com/posts/example"), "https://www.linkedin.com/posts/example");

const shortlist = [{
  author: 'Doe, "Jane"', roleCompany: "Head of L&D", location: "Barcelona", publishedDate: "2026-09-16",
  url: "https://example.com/post", text: "Need, with comma",
  result: { score: 82, label: "Strong buyer signal", areaLabel: "Meetings", action: "Comment", angle: "Ask a question" }
}];
const csv = shortlistToCsv(shortlist);
assert.match(csv, /"Doe, ""Jane"""/);
assert.match(csv, /"Need, with comma"/);

const memory = {};
const storage = {
  getItem: key => memory[key] || null,
  setItem: (key, value) => { memory[key] = value; }
};
assert.equal(persistList(storage, "signals", shortlist), true);
assert.deepEqual(loadStoredList(storage, "signals"), shortlist);
assert.deepEqual(loadStoredList({ getItem: () => "bad json" }, "signals"), []);

console.log("All app-core tests passed.");
