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
    intro: "For buyers who need products, factories or sourcing support in China. Mirror AI starts by clarifying the commercial requirement before any human introduction.",
    steps: ["Product or category", "Quantity and destination", "Budget, timing and next requirement"],
    start: "I need to source a product from China. Product: [product]. Quantity: [quantity]. Destination: [destination]. Budget: [budget].",
    note: "Useful for procurement, samples, supplier coordination and factory visits."
  },
  africa_to_global: {
    no: "02",
    title: "Africa to Global",
    intro: "For African producers looking for international buyers or a clearer export pathway. The first step is to understand the commodity, origin and target market.",
    steps: ["Commodity and origin", "Target market or buyer type", "Volume, specification and timing"],
    start: "We produce [commodity] in [country] and want buyers in [market]. Volume: [volume]. Specification: [specification].",
    note: "Useful for commodities, buyer matching, documentation and import coordination."
  },
  build_in_china: {
    no: "03",
    title: "Build in China",
    intro: "For people and companies exploring a business presence in China. Mirror AI helps turn a broad market-entry idea into a specific local enquiry.",
    steps: ["Business type and purpose", "Preferred city and budget", "Timeline and local support needed"],
    start: "I want to set up a business in China. Business type: [type]. City: [city]. Budget: [budget]. Timeline: [timeline].",
    note: "Useful for company formation, market entry and business-partner coordination."
  },
  travel_in_china: {
    no: "04",
    title: "Travel in China",
    intro: "For visitors who need more than a generic itinerary. Start with the destination, purpose and practical support required on the ground.",
    steps: ["Destination and trip purpose", "Trip length", "Guide, transport or business-visit support"],
    start: "I am travelling to China for [purpose]. Destination: [city]. Trip length: [days]. I need [services].",
    note: "Useful for local guides, transport, factory visits and custom itineraries."
  },
  healthcare_in_china: {
    no: "05",
    title: "Healthcare in China",
    intro: "A non-clinical navigation path for people seeking healthcare support in China. Mirror AI helps organize the administrative and coordination request without making medical decisions.",
    steps: ["City and treatment area", "Preferred timing", "Hospital, translation or appointment support"],
    start: "I need healthcare coordination in China. City: [city]. Treatment area: [treatment]. Timing: [timing]. I need [support].",
    note: "Non-clinical coordination only. Medical decisions remain with qualified healthcare professionals."
  },
  study_in_china: {
    no: "06",
    title: "Study in China",
    intro: "For prospective students who want to turn a study idea into a clear enquiry. Start with destination, study level and subject.",
    steps: ["Destination or preferred city", "Study level", "Subject and intake timing"],
    start: "I want to study in China. Destination: [city]. Study level: [level]. Subject: [subject]. Intake: [timing].",
    note: "Useful for study destinations, applications and local resource coordination."
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
  node.scrollIntoView({behavior:"smooth", block:"nearest"});
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
  card.scrollIntoView({behavior:"smooth", block:"nearest"});
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
  wrapper.scrollIntoView({behavior:"smooth", block:"nearest"});
}

function renderService(key) {
  const data = services[key];
  if (!data) return;

  document.querySelectorAll(".service-card").forEach(card => {
    const active = card.dataset.service === key;
    card.classList.toggle("active", active);
    card.setAttribute("aria-expanded", String(active));
  });

  detail.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "detail-grid";

  const intro = document.createElement("div");
  const kicker = document.createElement("div");
  kicker.className = "detail-kicker";
  kicker.textContent = "Path " + data.no;
  const title = document.createElement("h3");
  title.className = "detail-title";
  title.textContent = data.title;
  const copy = document.createElement("p");
  copy.className = "detail-intro";
  copy.textContent = data.intro;
  intro.append(kicker, title, copy);

  const steps = document.createElement("div");
  const stepLabel = document.createElement("div");
  stepLabel.className = "detail-kicker";
  stepLabel.textContent = "Start with";
  const list = document.createElement("ol");
  list.className = "detail-list";
  data.steps.forEach((step, index) => {
    const li = document.createElement("li");
    const no = document.createElement("span");
    no.textContent = "0" + (index + 1);
    const text = document.createElement("div");
    text.textContent = step;
    li.append(no, text);
    list.appendChild(li);
  });
  steps.append(stepLabel, list);

  const cta = document.createElement("div");
  cta.className = "detail-cta";
  const note = document.createElement("p");
  note.textContent = data.note;
  const button = document.createElement("button");
  button.className = "use-path";
  button.type = "button";
  button.innerHTML = "Use this path <b>↘</b>";
  button.addEventListener("click", () => {
    input.value = data.start;
    document.getElementById("start").scrollIntoView({behavior:"smooth", block:"start"});
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 450);
  });
  cta.append(note, button);

  grid.append(intro, steps, cta);
  detail.appendChild(grid);
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
  card.addEventListener("click", () => renderService(card.dataset.service));
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
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message, history})
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

    history.push({role:"user", content:message});
    history.push({role:"assistant", content:data.answer});
  } catch {
    pending.remove();
    addMessage("The local service is unavailable. Check the running Docker container and try again.", "assistant");
  } finally {
    sendButton.disabled = false;
  }
});

renderService("buy_from_china");
loadMode();
