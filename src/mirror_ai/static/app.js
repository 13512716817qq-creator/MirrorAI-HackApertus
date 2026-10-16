const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("message");
const mode = document.getElementById("mode");
const history = [];

function addMessage(text, role) {
  const node = document.createElement("div");
  node.className = "message " + role;
  node.textContent = text;
  chat.appendChild(node);
  node.scrollIntoView({behavior:"smooth", block:"nearest"});
}

function addResources(resources) {
  if (!resources || !resources.length) return;
  resources.forEach(resource => {
    const node = document.createElement("div");
    node.className = "resource";
    node.innerHTML = "<strong></strong><small></small>";
    node.querySelector("strong").textContent = resource.name;
    node.querySelector("small").textContent = resource.location + " · " + resource.description;
    chat.appendChild(node);
  });
}

async function loadMode() {
  try {
    const response = await fetch("/api/mode");
    const data = await response.json();
    mode.textContent = data.live_apertus
      ? "Mode: live Apertus · " + data.model
      : "Mode: demo · local deterministic routing · not live Apertus";
  } catch {
    mode.textContent = "Mode: local";
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const pending = document.createElement("div");
  pending.className = "message assistant";
  pending.textContent = "Structuring your request…";
  chat.appendChild(pending);

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
    addResources(data.resources);

    history.push({role:"user", content:message});
    history.push({role:"assistant", content:data.answer});
  } catch {
    pending.remove();
    addMessage("The local service is unavailable. Check Docker and try again.", "assistant");
  }
});

loadMode();
