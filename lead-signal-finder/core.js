(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SignalAppCore = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const discoveryPacks = {
    presentations: {
      label: "Presentations and executive communication",
      en: ["presenting in English executive audience"],
      es: ["presentar en inglés equipo directivo"],
      ca: ["presentar en anglès equip directiu"]
    },
    international: {
      label: "International team communication",
      en: ["international team communication challenge"],
      es: ["equipos internacionales reto comunicación"],
      ca: ["equips internacionals repte comunicació"]
    },
    conversations: {
      label: "Difficult conversations and feedback",
      en: ["difficult conversations managers feedback challenge"],
      es: ["conversaciones difíciles managers feedback reto"],
      ca: ["converses difícils managers feedback repte"]
    },
    meetings: {
      label: "Meetings and facilitation",
      en: ["meetings low participation facilitation challenge"],
      es: ["reuniones poca participación reto facilitación"],
      ca: ["reunions poca participació repte facilitació"]
    },
    influence: {
      label: "Stakeholders, influencing and change",
      en: ["stakeholder communication buy-in challenge"],
      es: ["comunicación stakeholders conseguir apoyo reto"],
      ca: ["comunicació stakeholders aconseguir suport repte"]
    },
    learning: {
      label: "Communication development need",
      en: ["looking for communication training partner"],
      es: ["buscamos proveedor formación comunicación"],
      ca: ["busquem proveïdor formació comunicació"]
    }
  };

  const audienceTerms = {
    direct: { en: "HR director founder manager", es: "dirección personas fundador manager", ca: "direcció persones fundador manager" },
    learning: { en: "learning development talent", es: "formación desarrollo talento", ca: "formació desenvolupament talent" },
    operations: { en: "operations team lead manager", es: "operaciones responsable equipo", ca: "operacions responsable equip" },
    partners: { en: "training provider consultancy FUNDAE", es: "proveedor formación consultoría FUNDAE", ca: "proveïdor formació consultoria FUNDAE" }
  };

  function languagesFor(value) {
    return value === "both" ? ["en", "es"] : [value];
  }

  function buildSearches(options) {
    const audience = audienceTerms[options.audience] ? options.audience : "direct";
    const location = String(options.location || "Barcelona").trim() || "Barcelona";
    const packKeys = options.topic === "all" ? Object.keys(discoveryPacks) : [options.topic];
    const rows = [];

    packKeys.filter(key => discoveryPacks[key]).forEach(key => {
      const pack = discoveryPacks[key];
      languagesFor(options.language || "both").filter(lang => pack[lang]).forEach(lang => {
        const query = `${location} ${pack[lang][0]} ${audienceTerms[audience][lang]}`.trim();
        rows.push({
          label: pack.label,
          lang: lang.toUpperCase(),
          query,
          linkedIn: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(query)}`,
          google: `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/posts ${query}`)}`
        });
      });
    });
    return rows;
  }

  function safeUrl(value) {
    try {
      const parsed = new URL(String(value || ""));
      return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
    } catch {
      return "";
    }
  }

  function csvCell(value) {
    const text = String(value == null ? "" : value);
    return `"${text.replace(/"/g, '""')}"`;
  }

  function shortlistToCsv(shortlist) {
    const header = ["score", "signal", "author", "role_company", "location", "published_date", "pain_area", "recommended_action", "engagement_angle", "url", "post_text"];
    const rows = [...shortlist].sort((a, b) => b.result.score - a.result.score).map(item => [
      item.result.score, item.result.label, item.author, item.roleCompany, item.location, item.publishedDate,
      item.result.areaLabel, item.result.action, item.result.angle, item.url, item.text
    ]);
    return [header, ...rows].map(row => row.map(csvCell).join(",")).join("\n");
  }

  function loadStoredList(storage, key) {
    try { return JSON.parse(storage.getItem(key)) || []; }
    catch { return []; }
  }

  function persistList(storage, key, list) {
    try {
      storage.setItem(key, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  }

  return { buildSearches, safeUrl, shortlistToCsv, loadStoredList, persistList, discoveryPacks };
});
