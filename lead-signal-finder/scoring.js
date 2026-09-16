(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SignalScoring = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const areas = {
    presentations: {
      label: "Presentations and executive communication",
      terms: ["presentation", "presenting", "presentacion", "presentación", "pitch", "keynote", "board update", "executive communication", "comunicacion ejecutiva", "comunicación ejecutiva", "public speaking", "hablar en publico", "hablar en público"],
      angle: "Respond to the specific audience or presentation challenge. Offer one practical distinction, question or example rather than a general speaking tip."
    },
    international: {
      label: "International team communication",
      terms: ["international team", "global team", "multicultural", "cross-cultural", "cross cultural", "language barrier", "working across cultures", "equipo internacional", "equipos internacionales", "equipo global", "intercultural", "barrera idiomatica", "barrera idiomática", "equip internacional", "equips internacionals"],
      angle: "Explore what is making communication harder across languages, cultures or locations. Avoid reducing the issue to English level alone."
    },
    conversations: {
      label: "Difficult conversations and feedback",
      terms: ["difficult conversation", "hard conversation", "feedback", "conflict", "accountability", "psychological safety", "challenging conversation", "conversacion dificil", "conversación difícil", "conversaciones dificiles", "conversaciones difíciles", "retroalimentacion", "retroalimentación", "conflicto", "conversa difícil"],
      angle: "Acknowledge the human difficulty and ask about the conversation they need to make possible. Do not rush into a script or formula."
    },
    meetings: {
      label: "Meetings and facilitation",
      terms: ["meeting", "meetings", "facilitation", "workshop", "participation", "too many meetings", "silent room", "reunion", "reunión", "reuniones", "facilitacion", "facilitación", "taller", "participacion", "participación", "reunions", "facilitació"],
      angle: "Comment on the meeting behaviour or decision process, not merely the agenda. One useful question about participation can open a genuine conversation."
    },
    influence: {
      label: "Stakeholders, influencing and change",
      terms: ["stakeholder", "influencing", "influence without authority", "change communication", "leadership communication", "buy-in", "buy in", "stakeholders", "influencia", "comunicacion del cambio", "comunicación del cambio", "comunicacion de liderazgo", "comunicación de liderazgo", "lideratge", "parts interessades"],
      angle: "Focus on the stakeholder tension, competing priorities or missing buy-in. Add a thoughtful question before offering a solution."
    },
    learning: {
      label: "Communication development need",
      terms: ["communication training", "communication workshop", "leadership programme", "leadership program", "learning partner", "training provider", "soft skills", "coaching support", "programa de comunicacion", "programa de comunicación", "taller de comunicacion", "taller de comunicación", "proveedor de formacion", "proveedor de formación", "habilidades comunicativas", "formació", "habilitats comunicatives"],
      angle: "Clarify the business outcome and participant context before discussing a programme. This is the strongest place to move from a comment to a later conversation."
    }
  };

  const needTerms = [
    "looking for", "seeking", "need help", "need support", "need a partner", "can anyone recommend", "recommend a", "recommend someone", "we need", "our challenge", "struggling", "not working", "hard to", "difficult to", "how do we", "what would you do",
    "buscamos", "necesitamos", "necesitamos ayuda", "necesitamos apoyo", "alguien recomienda", "podeis recomendar", "podéis recomendar", "nos cuesta", "nuestro reto", "nuestro desafio", "nuestro desafío", "no funciona", "como podemos", "cómo podemos",
    "busquem", "necessitem", "ens costa", "el nostre repte", "com podem"
  ];

  const problemTerms = [
    "miscommunication", "misunderstanding", "unclear", "confusing", "friction", "breakdown", "low participation", "not heard", "not understood", "lack of confidence", "communication gap", "pain point", "challenge", "problem",
    "malentendido", "poca participacion", "poca participación", "falta de claridad", "confusion", "confusión", "friccion", "fricción", "falta de confianza", "brecha de comunicacion", "brecha de comunicación", "problema", "reto", "desafio", "desafío",
    "malentès", "poca participació", "manca de claredat", "confusió", "fricció", "problema", "repte"
  ];

  const openTerms = [
    "recommend", "referral", "introduction", "dm me", "message me", "open to ideas", "would love to hear", "any suggestions", "provider", "partner", "workshop", "programme", "program",
    "recomendais", "recomendáis", "recomendacion", "recomendación", "contactadme", "enviadme", "abierto a ideas", "abierta a ideas", "sugerencias", "proveedor", "colaborador", "taller", "programa",
    "recomaneu", "contacteu-me", "obert a idees", "oberta a idees", "suggeriments", "proveïdor", "taller", "programa"
  ];

  const roleTerms = [
    "chief people", "people director", "people & culture", "people and culture", "hr director", "head of hr", "human resources", "learning and development", "head of learning", "l&d", "talent development", "talent manager", "operations director", "head of operations", "operations manager", "team lead", "country manager", "general manager", "managing director", "founder", "co-founder", "ceo", "department head",
    "director de personas", "directora de personas", "recursos humanos", "responsable de formacion", "responsable de formación", "desarrollo de talento", "director de operaciones", "directora de operaciones", "jefe de equipo", "jefa de equipo", "fundador", "fundadora", "director general", "directora general",
    "director de persones", "directora de persones", "recursos humans", "responsable de formació", "desenvolupament de talent", "director d'operacions", "directora d'operacions", "cap d'equip"
  ];

  const irrelevantTerms = [
    "thrilled to announce", "delighted to announce", "excited to announce", "new role", "started a new position", "hiring now", "job opportunity", "vacancy", "apply now", "congratulations to", "award ceremony",
    "encantado de anunciar", "encantada de anunciar", "nuevo puesto", "nueva posicion", "nueva posición", "oferta de empleo", "estamos contratando", "enhorabuena a",
    "encantat d'anunciar", "encantada d'anunciar", "nova posició", "oferta de feina", "estem contractant"
  ];

  const internationalTerms = ["international", "global", "cross-cultural", "cross cultural", "multicultural", "distributed team", "remote team", "english", "second language", "across countries", "internacional", "global", "intercultural", "multicultural", "equipo remoto", "equip remot", "ingles", "inglés", "anglès"];
  const locationTerms = ["barcelona", "catalonia", "catalunya", "cataluna", "cataluña", "barcelones", "barcelonès", "sant cugat", "hospitalet", "l'hospitalet"];

  function normalize(value) {
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function hits(text, terms) {
    const value = normalize(text);
    return [...new Set(terms.filter(term => value.includes(normalize(term))))];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function recencyScore(dateValue, todayValue) {
    if (!dateValue) return 0;
    const published = new Date(`${dateValue}T00:00:00`);
    const today = todayValue ? new Date(`${todayValue}T00:00:00`) : new Date();
    if (Number.isNaN(published.getTime()) || Number.isNaN(today.getTime())) return 0;
    const age = Math.floor((today - published) / 86400000);
    if (age < 0) return 0;
    if (age <= 7) return 10;
    if (age <= 30) return 7;
    if (age <= 90) return 3;
    return 0;
  }

  function detectArea(text) {
    const ranking = Object.entries(areas).map(([key, area]) => ({ key, count: hits(text, area.terms).length }));
    ranking.sort((a, b) => b.count - a.count);
    return ranking[0].count > 0 ? ranking[0].key : "learning";
  }

  function evidenceSentences(text, matchedTerms) {
    const sentences = String(text || "").split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean);
    const ranked = sentences.map(sentence => ({
      sentence,
      count: hits(sentence, matchedTerms).length
    })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
    return ranked.slice(0, 3).map(item => item.sentence.length > 240 ? `${item.sentence.slice(0, 237)}...` : item.sentence);
  }

  function qualify(candidate, todayValue) {
    const postText = candidate.text || "";
    const combined = [postText, candidate.roleCompany, candidate.location].filter(Boolean).join(" ");
    const needHits = hits(postText, needTerms);
    const problemHits = hits(postText, problemTerms);
    const openHits = hits(postText, openTerms);
    const buyerHits = hits(candidate.roleCompany || postText, roleTerms);
    const intlHits = hits(combined, internationalTerms);
    const placeHits = hits(combined, locationTerms);
    const irrelevantHits = hits(postText, irrelevantTerms);

    const areaMatches = {};
    Object.entries(areas).forEach(([key, area]) => { areaMatches[key] = hits(postText, area.terms); });
    const matchedAreaTerms = Object.values(areaMatches).flat();
    const areaKey = detectArea(postText);

    const need = clamp((needHits.length * 7) + (problemHits.length * 4), 0, 30);
    const fit = clamp((new Set(matchedAreaTerms).size * 5) + (intlHits.length ? 3 : 0), 0, 25);
    const buyer = clamp(buyerHits.length * 8, 0, 15);
    const location = placeHits.length ? 10 : 0;
    const recency = recencyScore(candidate.publishedDate, todayValue);
    const openness = clamp(openHits.length * 5, 0, 10);
    const penalty = clamp(irrelevantHits.length * 6, 0, 18);
    const score = clamp(need + fit + buyer + location + recency + openness - penalty, 0, 100);

    let level = "weak";
    let label = "Weak signal";
    if (score >= 70 && need >= 12 && fit >= 10) {
      level = "strong";
      label = "Strong buyer signal";
    } else if (score >= 48 && fit >= 8) {
      level = "possible";
      label = need >= 8 ? "Possible conversation signal" : "Relevant topic, no clear need yet";
    }

    let action = "Ignore for business development. The post may be interesting, but it does not contain enough evidence of a relevant need.";
    if (level === "strong") action = "Open the original post and verify the context. Add one useful, non-sales comment. If there is a natural response or follow-up, connect later.";
    else if (level === "possible" && need >= 8) action = "Open and consider a thoughtful comment or follow. Do not pitch. Look for more evidence before connecting.";
    else if (level === "possible") action = "Use this for insight or visibility. Follow or comment only if you have something genuinely useful to add.";

    const allMatched = [...needHits, ...problemHits, ...openHits, ...matchedAreaTerms];
    const evidence = evidenceSentences(postText, allMatched);
    if (!evidence.length && postText.trim()) evidence.push(postText.trim().slice(0, 240));

    return {
      score,
      level,
      label,
      areaKey,
      areaLabel: areas[areaKey].label,
      angle: areas[areaKey].angle,
      action,
      evidence,
      breakdown: { need, fit, buyer, location, recency, openness, penalty },
      matched: { needHits, problemHits, openHits, buyerHits, intlHits, placeHits, irrelevantHits, areaMatches }
    };
  }

  return { qualify, normalize, recencyScore, areas };
});
