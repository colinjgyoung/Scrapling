(function () {
  "use strict";

  const STORAGE_KEY = "colin-communication-signal-shortlist-v1";
  const today = new Date().toISOString().slice(0, 10);
  const $ = id => document.getElementById(id);

  let latestCandidate = null;
  let shortlist = loadShortlist();

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function loadShortlist() {
    return SignalAppCore.loadStoredList(localStorage, STORAGE_KEY);
  }

  function saveShortlist() {
    SignalAppCore.persistList(localStorage, STORAGE_KEY, shortlist);
    renderShortlist();
  }

  function generateSearches() {
    const audience = $("audience").value;
    const topic = $("topic").value;
    const language = $("language").value;
    const location = $("search-location").value.trim() || "Barcelona";
    const rows = SignalAppCore.buildSearches({ audience, topic, language, location });

    $("search-results").innerHTML = rows.map(row => `
      <article class="search-card">
        <h3>${escapeHtml(row.label)} <span class="muted">${row.lang}</span></h3>
        <code>${escapeHtml(row.query)}</code>
        <div class="search-card__links">
          <a class="button button--secondary button--small" href="${row.linkedIn}" target="_blank" rel="noopener noreferrer">Open LinkedIn search</a>
          <a class="button button--quiet button--small" href="${row.google}" target="_blank" rel="noopener noreferrer">Open public web search</a>
        </div>
      </article>
    `).join("");
  }

  function readCandidate() {
    return {
      id: (globalThis.crypto && globalThis.crypto.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
      url: $("post-url").value.trim(),
      author: $("author").value.trim(),
      roleCompany: $("role-company").value.trim(),
      location: $("candidate-location").value.trim(),
      publishedDate: $("published-date").value,
      text: $("post-text").value.trim(),
      analysedAt: new Date().toISOString()
    };
  }

  function renderAnalysis(candidate, result) {
    const badgeClass = `score--${result.level}`;
    const originalUrl = SignalAppCore.safeUrl(candidate.url);
    const evidence = result.evidence.map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const b = result.breakdown;
    $("analysis-result").innerHTML = `
      <article class="score-card">
        <div class="score-card__head">
          <div class="score-number ${badgeClass}">${result.score}</div>
          <div>
            <h3>${escapeHtml(result.label)}</h3>
            <p>${escapeHtml(result.areaLabel)}</p>
          </div>
        </div>
        <div class="score-card__body">
          <div class="breakdown">
            <div><strong>${b.need}/30</strong><span>Need or pain</span></div>
            <div><strong>${b.fit}/25</strong><span>Service fit</span></div>
            <div><strong>${b.buyer}/15</strong><span>Buyer role</span></div>
            <div><strong>${b.location}/10</strong><span>Barcelona</span></div>
            <div><strong>${b.recency}/10</strong><span>Recency</span></div>
            <div><strong>${b.openness}/10</strong><span>Openness</span></div>
          </div>
          <strong>Evidence in the post</strong>
          <ul class="evidence-list">${evidence || "<li>No clear evidence phrase found.</li>"}</ul>
          <p class="recommendation"><strong>Recommended next action:</strong> ${escapeHtml(result.action)}</p>
          <p><strong>Useful engagement angle:</strong> ${escapeHtml(result.angle)}</p>
          ${b.penalty ? `<p class="muted">Irrelevance penalty: -${b.penalty}. Check whether this is merely an announcement, vacancy or celebration.</p>` : ""}
          <div class="actions">
            <button id="save-result" class="button button--primary" type="button">Save to shortlist</button>
            ${originalUrl ? `<a class="button button--secondary" href="${escapeHtml(originalUrl)}" target="_blank" rel="noopener noreferrer">Open original post</a>` : ""}
          </div>
        </div>
      </article>
    `;
    $("save-result").addEventListener("click", saveLatestResult);
  }

  function analyseCandidate(event) {
    event.preventDefault();
    const candidate = readCandidate();
    const result = SignalScoring.qualify(candidate, today);
    latestCandidate = { ...candidate, result };
    renderAnalysis(candidate, result);
  }

  function saveLatestResult() {
    if (!latestCandidate) return;
    const existing = latestCandidate.url ? shortlist.findIndex(item => item.url === latestCandidate.url) : -1;
    if (existing >= 0) shortlist[existing] = latestCandidate;
    else shortlist.push(latestCandidate);
    saveShortlist();
    $("save-result").textContent = "Saved";
  }

  function clearCandidate() {
    $("candidate-form").reset();
    $("candidate-location").value = "Barcelona";
    $("published-date").value = today;
    $("analysis-result").innerHTML = "";
    latestCandidate = null;
  }

  function copyNote(item) {
    if (!item) return;
    const note = [
      `${item.result.label}: ${item.result.score}/100`,
      item.author ? `Author: ${item.author}` : "",
      item.roleCompany ? `Role/company: ${item.roleCompany}` : "",
      `Area: ${item.result.areaLabel}`,
      `Next action: ${item.result.action}`,
      `Angle: ${item.result.angle}`,
      item.url || ""
    ].filter(Boolean).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(note).catch(() => window.prompt("Copy this note:", note));
    } else {
      window.prompt("Copy this note:", note);
    }
  }

  function renderShortlist() {
    const sorted = [...shortlist].sort((a, b) => b.result.score - a.result.score);
    $("shortlist-count").textContent = `${sorted.length} saved signal${sorted.length === 1 ? "" : "s"}`;
    if (!sorted.length) {
      $("shortlist-body").innerHTML = '<tr><td class="empty-row" colspan="6">No saved signals yet.</td></tr>';
      return;
    }
    $("shortlist-body").innerHTML = sorted.map(item => {
      const originalUrl = SignalAppCore.safeUrl(item.url);
      return `
        <tr>
          <td><strong>${item.result.score}</strong></td>
          <td><span class="badge score--${item.result.level}">${escapeHtml(item.result.label)}</span></td>
          <td>${escapeHtml(item.author || "Unknown")}<br><span class="muted">${escapeHtml(item.roleCompany)}</span></td>
          <td>${escapeHtml(item.result.areaLabel)}</td>
          <td>${escapeHtml(item.result.action)}</td>
          <td>
            <div class="controls">
              ${originalUrl ? `<a class="button button--secondary button--small" href="${escapeHtml(originalUrl)}" target="_blank" rel="noopener noreferrer">Open</a>` : ""}
              <button class="button button--quiet button--small" type="button" data-copy="${item.id}">Copy note</button>
              <button class="button button--quiet button--small" type="button" data-delete="${item.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
    document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", () => copyNote(shortlist.find(item => item.id === button.dataset.copy))));
    document.querySelectorAll("[data-delete]").forEach(button => button.addEventListener("click", () => {
      shortlist = shortlist.filter(item => item.id !== button.dataset.delete);
      saveShortlist();
    }));
  }

  function exportCsv() {
    if (!shortlist.length) return;
    const csv = SignalAppCore.shortlistToCsv(shortlist);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `communication-signals-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  $("generate-searches").addEventListener("click", generateSearches);
  $("candidate-form").addEventListener("submit", analyseCandidate);
  $("clear-candidate").addEventListener("click", clearCandidate);
  $("export-csv").addEventListener("click", exportCsv);
  $("clear-shortlist").addEventListener("click", () => {
    if (shortlist.length && window.confirm("Clear every saved signal from this browser?")) {
      shortlist = [];
      saveShortlist();
    }
  });

  $("published-date").value = today;
  generateSearches();
  renderShortlist();
})();
