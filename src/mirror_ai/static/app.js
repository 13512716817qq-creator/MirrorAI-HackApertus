const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("message");
const mode = document.getElementById("mode");
const chatMode = document.getElementById("chat-mode");
const detail = document.getElementById("service-detail");
const sendButton = form.querySelector("button");
const history = [];

const services = {
  buy_from_china: {
    no: "01",
    title: "Buy from China",
    short: "Procurement, sourcing, samples and coordination.",
    intro: "A practical sourcing path for overseas buyers who need reliable access to Chinese products and suppliers without managing the entire process alone.",
    fit: "Best for importers, distributors, retailers and first-time buyers.",
    coverage: [
      "Product and supplier sourcing",
      "Factory and trading-company comparison",
      "Sample coordination and requirement clarification",
      "Quality checks, communication and shipping coordination"
    ],
    workflow: [
      "Define the product, specification and target quantity.",
      "Structure the buying brief and identify the right local route.",
      "Hand the qualified enquiry to a human operator for supplier follow-up."
    ],
    ask: [
      "What are you looking to buy?",
      "How much do you need and where will it be delivered?",
      "Do you have a target budget, specification or deadline?"
    ],
    start: "I want to buy from China. Product: [product]. Quantity: [quantity]. Destination: [country/city]. Specification: [specification].",
    note: "Mirror AI does not publish supplier contacts. Qualified enquiries are handled privately by the human operations team."
  },
  africa_to_global: {
    no: "02",
    title: "Africa to Global",
    short: "Commodities, buyer matching and export coordination.",
    intro: "A market-entry path for African producers who want to connect their products with buyers beyond their home market and understand what information a serious buyer needs.",
    fit: "Best for farms, processors, exporters and commodity producers.",
    coverage: [
      "Commodity and supplier profiling",
      "Buyer and market matching",
      "Specification, volume and quotation clarification",
      "Export and China-side coordination"
    ],
    workflow: [
      "Define the commodity, origin, specification and available volume.",
      "Structure the export proposition around the target market.",
      "Route qualified buyer interest to the human team for direct follow-up."
    ],
    ask: [
      "What product do you supply and from which country?",
      "What specification and volume can you offer?",
      "Which market or buyer type are you targeting?"
    ],
    start: "We supply [commodity] from [country]. Specification: [specification]. Available volume: [volume]. Target market: [market].",
    note: "Mirror AI helps clarify the opportunity; commercial terms and final negotiations remain with the parties involved."
  },
  build_in_china: {
    no: "03",
    title: "Build in China",
    short: "Company formation, market entry and local partnerships.",
    intro: "A structured starting point for overseas founders and companies exploring a business presence in China, from an initial idea to a concrete local enquiry.",
    fit: "Best for founders, overseas companies and China market-entry projects.",
    coverage: [
      "Company formation and basic setup guidance",
      "Market-entry and location questions",
      "Local business-partner coordination",
      "Supplier, service and operational resource matching"
    ],
    workflow: [
      "Clarify the business model, ownership and purpose.",
      "Identify the city, operational requirements and key constraints.",
      "Route the structured enquiry to the relevant human operator."
    ],
    ask: [
      "What do you want to establish or operate in China?",
      "Which city or region are you considering?",
      "What is your expected timeline and main support need?"
    ],
    start: "I want to build a business in China. Business type: [type]. City/region: [city]. Ownership: [ownership]. Timeline: [timeline].",
    note: "The platform provides structured coordination, not legal or regulatory guarantees. Final decisions should be verified with qualified professionals."
  },
  travel_in_china: {
    no: "04",
    title: "Travel in China",
    short: "Local resources, business visits and custom itineraries.",
    intro: "A local coordination path for visitors who need a useful trip rather than a generic itinerary, especially when travel includes business, sourcing or on-the-ground appointments.",
    fit: "Best for business visitors, buyers, families and first-time China travellers.",
    coverage: [
      "Custom itinerary planning",
      "Business and factory-visit coordination",
      "Local transport and guide support",
      "Practical destination and appointment coordination"
    ],
    workflow: [
      "Describe the purpose, destination and length of the trip.",
      "Separate essential appointments from optional experiences.",
      "Route the request to a human operator for local coordination."
    ],
    ask: [
      "Where in China are you going?",
      "What is the main purpose of the trip?",
      "What local support, visits or transport do you need?"
    ],
    start: "I am travelling to China for [purpose]. Destination: [city]. Trip length: [days]. I need help with [support/visits/transport].",
    note: "The service is designed around practical local coordination and can be adapted to the actual purpose of the trip."
  },
  healthcare_in_china: {
    no: "05",
    title: "Healthcare in China",
    short: "Hospital coordination, translation and local support.",
    intro: "A non-clinical coordination path for international visitors who need help organizing healthcare-related logistics in China while keeping medical decisions with qualified professionals.",
    fit: "Best for international patients and accompanying family members.",
    coverage: [
      "Hospital and department coordination",
      "Appointment and administrative support",
      "Language and translation assistance",
      "Local logistics for patients and accompanying family"
    ],
    workflow: [
      "Describe the city, treatment area and practical requirement.",
      "Organize the administrative and communication needs.",
      "Route the enquiry to a human operator for local coordination."
    ],
    ask: [
      "Which city are you considering?",
      "What treatment area or hospital service do you need?",
      "Do you need appointment, translation or local logistics support?"
    ],
    start: "I need healthcare coordination in China. City: [city]. Treatment area: [treatment area]. Timing: [timing]. Support needed: [support].",
    note: "Non-clinical support only. Mirror AI does not diagnose, prescribe, select treatment or replace medical professionals."
  },
  study_in_china: {
    no: "06",
    title: "Study in China",
    short: "Study destinations, applications and local resources.",
    intro: "A clear starting point for international students comparing study options in China and preparing the information needed for a focused application enquiry.",
    fit: "Best for prospective students, families and education partners.",
    coverage: [
      "Study destination and programme exploration",
      "Application pathway clarification",
      "Intake, academic background and requirement review",
      "Local education resources and follow-up coordination"
    ],
    workflow: [
      "Clarify the student's background, target level and subject.",
      "Structure the destination, programme and intake requirements.",
      "Route the qualified enquiry to a human education operator."
    ],
    ask: [
      "What level and subject do you want to study?",
      "Which city or type of institution are you considering?",
      "When do you want to start and what is your academic background?"
    ],
    start: "I want to study in China. Study level: [level]. Subject: [subject]. Preferred city: [city]. Intake: [month/year].",
    note: "The platform helps structure the enquiry; admission decisions and final eligibility remain with the relevant institution."
  }
};

function addMessage(content, role) {
  const node = document.createElement("div");
  node.className = "message " + role;

  if (role === "assistant") {
    const label = document.createElement("span");
    label.className = "message-label";
    label.textContent = "MIRROR AI";
    node.appendChild(label);
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = content;
  node.appendChild(paragraph);

  chat.appendChild(node);
  node.scrollIntoView({ behavior: "smooth", block: "nearest" });
  return node;
}

function addAnalysis(data) {
  const card = document.createElement("div");
  card.className = "analysis-card";

  const top = document.createElement("div");
  top.className = "analysis-top";
  const intent = document.createElement("span");
  intent.textContent = (data.intent || "request").replaceAll("_", " ");
  const confidence = document.createElement("span");
  confidence.textContent = "routing confidence " + Math.round((data.confidence || 0) * 100) + "%";
  top.append(intent, confidence);

  const body = document.createElement("div");
  body.className = "analysis-body";

  const fields = data.fields || {};
  const fieldEntries = Object.entries(fields);
  if (fieldEntries.length) {
    fieldEntries.forEach(([key, value]) => {
      const row = document.createElement("div");
      row.className = "analysis-row";
      const label = document.createElement("span");
      label.textContent = key;
      const valueNode = document.createElement("strong");
      valueNode.textContent = value;
      row.append(label, valueNode);
      body.appendChild(row);
    });
  }

  const missing = data.missing_fields || [];
  if (missing.length) {
    const row = document.createElement("div");
    row.className = "analysis-row";
    const label = document.createElement("span");
    label.textContent = "still needed";
    const valueNode = document.createElement("strong");
    valueNode.textContent = missing.join(" · ");
    row.append(label, valueNode);
    body.appendChild(row);
  }

  card.append(top, body);
  chat.appendChild(card);
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function addResources(resources) {
  if (!resources || !resources.length) return;

  const wrapper = document.createElement("div");
  wrapper.className = "analysis-card";

  resources.forEach(resource => {
    const item = document.createElement("div");
    item.className = "resource";

    const name = document.createElement("strong");
    name.textContent = resource.name;

    const meta = document.createElement("small");
    meta.textContent = resource.location + " · " + resource.description;

    item.append(name, meta);
    wrapper.appendChild(item);
  });

  chat.appendChild(wrapper);
  wrapper.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function makeDetailList(items, className) {
  const list = document.createElement("ul");
  list.className = className;

  items.forEach((item, index) => {
    const li = document.createElement("li");
    const no = document.createElement("span");
    no.textContent = String(index + 1).padStart(2, "0");
    const text = document.createElement("div");
    text.textContent = item;
    li.append(no, text);
    list.appendChild(li);
  });

  return list;
}

function makeDetailColumn(label, items) {
  const column = document.createElement("div");
  column.className = "detail-column";

  const heading = document.createElement("div");
  heading.className = "detail-kicker";
  heading.textContent = label;

  column.append(heading, makeDetailList(items, "detail-list"));
  return column;
}

function renderService(key, shouldScroll = false) {
  const data = services[key];
  if (!data) return;

  document.querySelectorAll(".service-card").forEach(card => {
    const active = card.dataset.service === key;
    card.classList.toggle("active", active);
    card.setAttribute("aria-expanded", String(active));
  });

  detail.innerHTML = "";

  const panel = document.createElement("div");
  panel.className = "detail-panel";

  const head = document.createElement("div");
  head.className = "detail-panel-head";

  const titleBlock = document.createElement("div");
  titleBlock.className = "detail-title-block";

  const kicker = document.createElement("div");
  kicker.className = "detail-kicker";
  kicker.textContent = "SERVICE PATH " + data.no;

  const title = document.createElement("h3");
  title.className = "detail-title";
  title.textContent = data.title;

  const intro = document.createElement("p");
  intro.className = "detail-intro";
  intro.textContent = data.intro;

  titleBlock.append(kicker, title, intro);

  const fit = document.createElement("div");
  fit.className = "detail-fit";
  const fitLabel = document.createElement("span");
  fitLabel.textContent = "WHO IT IS FOR";
  const fitText = document.createElement("strong");
  fitText.textContent = data.fit;
  fit.append(fitLabel, fitText);

  head.append(titleBlock, fit);

  const body = document.createElement("div");
  body.className = "detail-body";
  body.append(
    makeDetailColumn("WHAT WE CAN HELP WITH", data.coverage),
    makeDetailColumn("HOW THE PATH WORKS", data.workflow),
    makeDetailColumn("START WITH THESE FACTS", data.ask)
  );

  const footer = document.createElement("div");
  footer.className = "detail-panel-footer";

  const note = document.createElement("p");
  note.className = "detail-note";
  note.textContent = data.note;

  const action = document.createElement("button");
  action.className = "use-path";
  action.type = "button";
  action.innerHTML = "Start with this path <b>↘</b>";
  action.addEventListener("click", () => {
    input.value = data.start;
    document.getElementById("start").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 450);
  });

  footer.append(note, action);
  panel.append(head, body, footer);
  detail.appendChild(panel);

  if (shouldScroll) {
    detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

async function loadMode() {
  try {
    const response = await fetch("/api/mode");
    const data = await response.json();

    if (data.live_apertus) {
      mode.textContent = "Live inference · " + data.model;
      chatMode.textContent = "Apertus 1.5 · live";
    } else {
      mode.textContent = "Local deterministic routing · demo";
      chatMode.textContent = "Structured demo · local";
    }
  } catch {
    mode.textContent = "Local interface";
    chatMode.textContent = "Local interface";
  }
}

document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => renderService(card.dataset.service, true));
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message || sendButton.disabled) return;

  addMessage(message, "user");
  input.value = "";
  sendButton.disabled = true;

  const pending = addMessage("Structuring your request…", "assistant");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });

    const data = await response.json();
    pending.remove();

    if (!response.ok) {
      addMessage(data.detail || "The request could not be processed.", "assistant");
      return;
    }

    addMessage(data.answer, "assistant");
    addAnalysis(data);
    addResources(data.resources);

    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: data.answer });
  } catch {
    pending.remove();
    addMessage("The local service is unavailable. Check the running Docker container and try again.", "assistant");
  } finally {
    sendButton.disabled = false;
  }
});

renderService("buy_from_china");
loadMode();
