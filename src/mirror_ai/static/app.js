const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("message");
const mode = document.getElementById("mode");
const chatMode = document.getElementById("chat-mode");
const servicePage = document.getElementById("service-page");
const servicePageContent = document.getElementById("service-page-content");
const sendButton = form.querySelector("button");
const contactForm = document.getElementById("contact-form");
const contactName = document.getElementById("contact-name");
const contactEmail = document.getElementById("contact-email");
const contactPhone = document.getElementById("contact-phone");
const contactCompany = document.getElementById("contact-company");
const contactCountry = document.getElementById("contact-country");
const contactService = document.getElementById("contact-service");
const contactRequirement = document.getElementById("contact-requirement");
const contactPreferred = document.getElementById("contact-preferred");
const contactStatus = document.getElementById("contact-status");
const contactSubmit = contactForm ? contactForm.querySelector("button[type='submit']") : null;
const history = [];

const services = {
  buy_from_china: {
    slug: "buy-from-china",
    no: "01",
    title: "Buy from China",
    accent: "China sourcing",
    intro: "A local sourcing path for international buyers who need Chinese products, suppliers and on-the-ground coordination without having to manage every local step themselves.",
    visual: "SOURCE / COMPARE / CONNECT",
    whatTitle: "A clearer route to the right supplier.",
    whatText: "Mirror AI turns a product request into a structured sourcing brief. The human team can then work from that brief to communicate with suppliers, compare options and coordinate the next practical step.",
    coverage: [
      "Product and supplier sourcing",
      "Factory and trading-company comparison",
      "Sample and specification coordination",
      "Quality-check and order follow-up",
      "China-side logistics and communication support"
    ],
    fit: "International buyers, importers, distributors, retailers and first-time China buyers.",
    steps: [
      ["01","Define","Product, specification, quantity and destination."],
      ["02","Source","Identify and compare relevant Chinese supply options."],
      ["03","Verify","Coordinate samples, requirements and quality information."],
      ["04","Follow through","Keep the China-side conversation moving with a human operator."]
    ],
    ask: [
      "What are you looking to buy?",
      "How much do you need?",
      "Where should the goods be delivered?",
      "Do you have a target specification, budget or deadline?"
    ],
    start: "I want to buy from China. Product: [product]. Quantity: [quantity]. Destination: [country/city]. Specification: [specification].",
    note: "Supplier, quotation, availability and quality decisions are verified with the relevant human parties. Mirror AI does not invent commercial facts."
  },
  africa_to_global: {
    slug: "africa-to-global",
    no: "02",
    title: "Africa to Global",
    accent: "Africa / global trade",
    intro: "A market-entry path for African producers and exporters who want to connect credible supply with international demand, especially where China can become part of the commercial route.",
    visual: "AFRICA / CHINA / GLOBAL",
    whatTitle: "Move supply toward the right market.",
    whatText: "The system structures the commodity, origin, specification, volume and target market before the human team takes the enquiry into buyer or supplier conversations.",
    coverage: [
      "Commodity and supplier profiling",
      "Buyer and market matching",
      "Specification and volume clarification",
      "Quotation and commercial enquiry coordination",
      "China-side and international trade communication"
    ],
    fit: "Farms, processors, exporters, commodity businesses and Africa-focused trade projects.",
    steps: [
      ["01","Profile","Define origin, commodity, specification and available volume."],
      ["02","Position","Clarify the target market and buyer type."],
      ["03","Connect","Route qualified interest toward relevant human contacts."],
      ["04","Coordinate","Support the practical conversation between the parties."]
    ],
    ask: [
      "What product do you supply?",
      "Which country is the product from?",
      "What specification and volume can you offer?",
      "Which market or buyer type are you targeting?"
    ],
    start: "We supply [commodity] from [country]. Specification: [specification]. Available volume: [volume]. Target market: [market].",
    note: "Mirror AI structures the opportunity. Final buyer qualification, pricing, payment and export decisions remain with the parties involved."
  },
  build_in_china: {
    slug: "build-in-china",
    no: "03",
    title: "Build in China",
    accent: "China market entry",
    intro: "A practical starting point for overseas founders and companies exploring a business presence in China, from the first question to a focused local enquiry.",
    visual: "ENTER / BUILD / OPERATE",
    whatTitle: "Turn a China idea into a local path.",
    whatText: "Instead of beginning with a long checklist, Mirror AI first structures the business purpose, ownership, city, timing and support required, then routes the enquiry toward the relevant human resource.",
    coverage: [
      "Company formation and setup coordination",
      "Market-entry and location questions",
      "Local business-partner coordination",
      "Supplier and service-provider matching",
      "Operational resource coordination"
    ],
    fit: "Overseas founders, companies, investors and international business projects entering China.",
    steps: [
      ["01","Clarify","Business model, purpose, ownership and constraints."],
      ["02","Localise","Identify city, operational needs and local dependencies."],
      ["03","Connect","Route the structured enquiry to the right human resource."],
      ["04","Verify","Confirm legal, regulatory and commercial details with qualified parties."]
    ],
    ask: [
      "What do you want to establish or operate in China?",
      "Which city or region are you considering?",
      "Who will own and operate the business?",
      "What is your timeline and main support need?"
    ],
    start: "I want to build a business in China. Business type: [type]. City/region: [city]. Ownership: [ownership]. Timeline: [timeline].",
    note: "The service coordinates a practical starting path. Legal, regulatory and tax conclusions should be verified with qualified professionals."
  },
  travel_in_china: {
    slug: "travel-in-china",
    no: "04",
    title: "Travel in China",
    accent: "China local support",
    intro: "A local coordination path for visitors who need a useful trip rather than a generic itinerary, especially when travel includes business, sourcing or on-the-ground appointments.",
    visual: "VISIT / MEET / MOVE",
    whatTitle: "Make the trip work for the reason you came.",
    whatText: "Tell us why you are coming, where you need to go and what needs to happen on the ground. The system helps separate the essential from the optional before a human operator coordinates the local details.",
    coverage: [
      "Custom itinerary planning",
      "Business and factory-visit coordination",
      "Local transport and guide support",
      "Appointment and destination coordination",
      "Practical on-the-ground assistance"
    ],
    fit: "Business visitors, buyers, families and first-time China travellers.",
    steps: [
      ["01","Purpose","Define the reason, destination and trip length."],
      ["02","Prioritise","Separate essential appointments from optional experiences."],
      ["03","Arrange","Coordinate visits, local resources and practical logistics."],
      ["04","Support","Keep the local plan clear as the trip develops."]
    ],
    ask: [
      "Where in China are you going?",
      "What is the main purpose of the trip?",
      "How long will you stay?",
      "What local support, visits or transport do you need?"
    ],
    start: "I am travelling to China for [purpose]. Destination: [city]. Trip length: [days]. I need help with [support/visits/transport].",
    note: "Travel arrangements depend on the actual destination, timing and local availability and are confirmed by the human team."
  },
  healthcare_in_china: {
    slug: "healthcare-in-china",
    no: "05",
    title: "Healthcare in China",
    accent: "Non-clinical coordination",
    intro: "A non-clinical coordination path for international visitors who need help organising healthcare-related logistics in China while medical decisions stay with qualified professionals.",
    visual: "HOSPITAL / LANGUAGE / SUPPORT",
    whatTitle: "Coordinate the local side of care.",
    whatText: "Mirror AI helps turn a practical healthcare request into a clearer coordination brief. The human team can then assist with administrative, communication and local-support needs.",
    coverage: [
      "Hospital and department coordination",
      "Appointment and administrative support",
      "Language and translation assistance",
      "Local logistics for patients and accompanying family",
      "Communication support around the visit"
    ],
    fit: "International patients and accompanying family members who need non-clinical local support.",
    steps: [
      ["01","Locate","Clarify city, treatment area and practical need."],
      ["02","Coordinate","Organise appointment and administrative requirements."],
      ["03","Translate","Support communication where language assistance is needed."],
      ["04","Support","Coordinate local logistics around the visit."]
    ],
    ask: [
      "Which city are you considering?",
      "What treatment area or hospital service do you need?",
      "When are you planning to travel?",
      "Do you need appointment, translation or local logistics support?"
    ],
    start: "I need healthcare coordination in China. City: [city]. Treatment area: [treatment area]. Timing: [timing]. Support needed: [support].",
    note: "Non-clinical support only. Mirror AI does not diagnose, prescribe, select treatment or replace medical professionals."
  },
  study_in_china: {
    slug: "study-in-china",
    no: "06",
    title: "Study in China",
    accent: "Education coordination",
    intro: "A focused starting point for international students comparing study options in China and preparing the information needed for a useful application enquiry.",
    visual: "STUDY / APPLY / ARRIVE",
    whatTitle: "Make the study path easier to understand.",
    whatText: "The system first structures academic background, target level, subject, destination and intake. The human education side can then work from a cleaner brief instead of starting from scattered messages.",
    coverage: [
      "Study destination and programme exploration",
      "Application pathway clarification",
      "Academic background and requirement review",
      "Intake and planning support",
      "Local education-resource coordination"
    ],
    fit: "Prospective students, families and education partners considering China.",
    steps: [
      ["01","Profile","Academic background, target level and subject."],
      ["02","Explore","Compare destination and programme directions."],
      ["03","Prepare","Clarify the information needed for an application."],
      ["04","Follow up","Route the enquiry to the human education operator."]
    ],
    ask: [
      "What level and subject do you want to study?",
      "Which city or type of institution are you considering?",
      "When do you want to start?",
      "What is your academic background?"
    ],
    start: "I want to study in China. Study level: [level]. Subject: [subject]. Preferred city: [city]. Intake: [month/year].",
    note: "Admission decisions and final eligibility remain with the relevant institution. The service is designed to make the enquiry clearer and more actionable."
  }
};

function slugToKey(slug) {
  return Object.keys(services).find(function(key) {
    return services[key].slug === slug;
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

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
  node.scrollIntoView({behavior:"smooth",block:"nearest"});
  return node;
}

function addAnalysis(data) {
  const card = document.createElement("div");
  card.className = "analysis-card";

  const top = document.createElement("div");
  top.className = "analysis-top";

  const intent = document.createElement("span");
  intent.textContent = (data.intent || "request").replaceAll("_"," ");

  const confidence = document.createElement("span");
  confidence.textContent = "routing confidence " + Math.round((data.confidence || 0) * 100) + "%";

  top.append(intent,confidence);

  const body = document.createElement("div");
  body.className = "analysis-body";

  const fields = data.fields || {};
  const entries = Object.entries(fields);

  entries.forEach(function(entry) {
    const row = document.createElement("div");
    row.className = "analysis-row";

    const label = document.createElement("span");
    label.textContent = entry[0];

    const value = document.createElement("strong");
    value.textContent = entry[1];

    row.append(label,value);
    body.appendChild(row);
  });

  const missing = data.missing_fields || [];
  if (missing.length) {
    const row = document.createElement("div");
    row.className = "analysis-row";

    const label = document.createElement("span");
    label.textContent = "still needed";

    const value = document.createElement("strong");
    value.textContent = missing.join(" · ");

    row.append(label,value);
    body.appendChild(row);
  }

  card.append(top,body);
  chat.appendChild(card);
  card.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function addResources(resources) {
  if (!resources || !resources.length) return;

  const wrapper = document.createElement("div");
  wrapper.className = "analysis-card";

  resources.forEach(function(resource) {
    const item = document.createElement("div");
    item.className = "resource";

    const name = document.createElement("strong");
    name.textContent = resource.name;

    const meta = document.createElement("small");
    meta.textContent = resource.location + " · " + resource.description;

    item.append(name,meta);
    wrapper.appendChild(item);
  });

  chat.appendChild(wrapper);
  wrapper.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function renderServicePage(key) {
  const data = services[key];
  if (!data) return;

  const coverage = data.coverage.map(function(item,index) {
    return "<li><span>" + String(index + 1).padStart(2,"0") + "</span><div>" + escapeHTML(item) + "</div></li>";
  }).join("");

  const ask = data.ask.map(function(item,index) {
    return "<li><span>" + String(index + 1).padStart(2,"0") + "</span><div>" + escapeHTML(item) + "</div></li>";
  }).join("");

  const steps = data.steps.map(function(item) {
    return "<article class='process-item'>" +
      "<span>" + escapeHTML(item[0]) + "</span>" +
      "<h3>" + escapeHTML(item[1]) + "</h3>" +
      "<p>" + escapeHTML(item[2]) + "</p>" +
    "</article>";
  }).join("");

  servicePageContent.innerHTML =
    "<section class='service-hero'>" +
      "<div>" +
        "<div class='eyebrow'>" + escapeHTML(data.no) + " / " + escapeHTML(data.accent) + "</div>" +
        "<h1>" + escapeHTML(data.title).replace(" from "," from ").replace(" in "," in ") + "</h1>" +
      "</div>" +
      "<p class='service-hero-intro'>" + escapeHTML(data.intro) + "</p>" +
    "</section>" +

    "<div class='service-visual-card'>" +
      "<div class='service-visual-label'>" + escapeHTML(data.visual) + "</div>" +
    "</div>" +

    "<section class='service-content'>" +
      "<div class='service-column'>" +
        "<div class='service-kicker'>What we coordinate</div>" +
        "<h2>" + escapeHTML(data.whatTitle) + "</h2>" +
        "<p>" + escapeHTML(data.whatText) + "</p>" +
        "<ul class='service-list'>" + coverage + "</ul>" +
      "</div>" +
      "<div class='service-column'>" +
        "<div class='service-kicker'>Start with these facts</div>" +
        "<h2>Give us enough to make the next step useful.</h2>" +
        "<p>Do not worry about knowing the perfect terminology. Describe the situation clearly and the system will help structure it.</p>" +
        "<ul class='service-list'>" + ask + "</ul>" +
      "</div>" +
    "</section>" +

    "<section class='service-process'>" +
      "<div class='service-kicker'>The path</div>" +
      "<h2>From first message<br>to human follow-up.</h2>" +
      "<div class='process-grid'>" + steps + "</div>" +
    "</section>" +

    "<section class='service-cta'>" +
      "<div>" +
        "<h2>Ready to start this path?</h2>" +
        "<p>" + escapeHTML(data.note) + "</p>" +
      "</div>" +
      "<button class='button button-primary service-start' type='button' data-key='" + escapeHTML(key) + "'>Start with this path <span>↗</span></button>" +
    "</section>";

  servicePage.classList.add("open");
  servicePage.setAttribute("aria-hidden","false");
  document.body.classList.add("service-open");

  const start = servicePageContent.querySelector(".service-start");
  start.addEventListener("click",function() {
    input.value = data.start;
    if (contactService) contactService.value = key;
    if (contactRequirement) contactRequirement.value = data.start;
    servicePage.classList.remove("open");
    servicePage.setAttribute("aria-hidden","true");
    document.body.classList.remove("service-open");
    window.location.hash = "contact";
    setTimeout(function() {
      if (contactName && !contactName.value.trim()) contactName.focus();
      else if (contactRequirement) contactRequirement.focus();
    },350);
  });

  window.scrollTo(0,0);
}

function closeServicePage() {
  servicePage.classList.remove("open");
  servicePage.setAttribute("aria-hidden","true");
  document.body.classList.remove("service-open");
}

function route() {
  const hash = window.location.hash.replace(/^#/,"");

  if (hash.indexOf("service/") === 0) {
    const slug = hash.split("/")[1];
    const key = slugToKey(slug);
    if (key) {
      renderServicePage(key);
      return;
    }
  }

  closeServicePage();

  if (hash === "enquiry" || hash === "services" || hash === "how-it-works" || hash === "people" || hash === "contact") {
    const target = document.getElementById(hash);
    if (target) {
      setTimeout(function() {
        target.scrollIntoView({behavior:"smooth",block:"start"});
      },0);
    }
  } else {
    window.scrollTo(0,0);
  }
}

async function loadMode() {
  try {
    const response = await fetch("/api/mode");
    const data = await response.json();

    if (data.live_apertus) {
      mode.textContent = "Apertus 1.5 · live";
      chatMode.textContent = "Apertus 1.5 · live";
    } else {
      mode.textContent = "Demo routing";
      chatMode.textContent = "Structured demo · local";
    }
  } catch {
    mode.textContent = "Local interface";
    chatMode.textContent = "Local interface";
  }
}

document.querySelectorAll(".quick-prompts button").forEach(function(button) {
  button.addEventListener("click",function() {
    input.value = button.dataset.prompt || "";
    input.focus();
  });
});


if (contactForm) {
  contactForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    if (contactSubmit.disabled) return;

    const payload = {
      name: contactName.value.trim(),
      email: contactEmail.value.trim(),
      phone: contactPhone.value.trim(),
      company: contactCompany.value.trim(),
      country: contactCountry.value.trim(),
      service: contactService.value,
      requirement: contactRequirement.value.trim(),
      preferred_contact: contactPreferred.value
    };

    contactStatus.textContent = "";
    contactStatus.className = "contact-status";
    contactSubmit.disabled = true;
    contactSubmit.querySelector("span").textContent = "Sending...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "We could not submit the enquiry.");
      }

      contactStatus.textContent = "Enquiry received. Thank you.";
      contactStatus.className = "contact-status success";
      contactForm.reset();
      contactPreferred.value = "Either";
      setTimeout(function() {
        contactStatus.textContent = "The Mirror Global team can now review the brief.";
      }, 1200);
    } catch (error) {
      contactStatus.textContent = error.message || "Please try again.";
      contactStatus.className = "contact-status error";
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.querySelector("span").textContent = "↗";
    }
  });
}

form.addEventListener("submit",async function(event) {
  event.preventDefault();

  const message = input.value.trim();
  if (!message || sendButton.disabled) return;

  addMessage(message,"user");
  input.value = "";
  sendButton.disabled = true;

  const pending = addMessage("Structuring your request...","assistant");

  try {
    const response = await fetch("/api/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:message,history:history})
    });

    const data = await response.json();
    pending.remove();

    if (!response.ok) {
      addMessage(data.detail || "The request could not be processed.","assistant");
      return;
    }

    addMessage(data.answer,"assistant");
    addAnalysis(data);
    addResources(data.resources);

    history.push({role:"user",content:message});
    history.push({role:"assistant",content:data.answer});
  } catch {
    pending.remove();
    addMessage("The local service is unavailable. Check the running container and try again.","assistant");
  } finally {
    sendButton.disabled = false;
  }
});

window.addEventListener("hashchange",route);
document.addEventListener("keydown",function(event) {
  if (event.key === "Escape" && servicePage.classList.contains("open")) {
    window.location.hash = "services";
  }
});

loadMode();
route();