/* =============================================
   SCRIPT.JS — AI Demo + Animations
   =============================================
   
   HOW TO EDIT:
   - Change RESTAURANT_INFO to your client's details
   - Change SYSTEM_PROMPT to update what the AI knows
   - The demo uses the real Anthropic API via the page
   ============================================= */

// =============================================
// RESTAURANT INFO — EDIT THIS FOR EACH CLIENT
// =============================================
const RESTAURANT_INFO = {
  name: "Dubai Party Hub Kitchen & Bar",
  location: "JBR Walk, Dubai Marina",
  hours: "12:00 PM – 2:00 AM daily",
  cuisine: "International, Grills, Lebanese, Seafood",
  shisha: "Available from 6:00 PM daily",
  parking: "JBR public parking, walking distance",
  reservations: "WhatsApp or call +971 4 555 5959",
  delivery: "Talabat and Deliveroo",
  happyHour: "4:00 PM – 7:00 PM daily — 50% off selected drinks",
  fridayBrunch: "12 PM – 4 PM, 199 AED per person inclusive",
  liveMusic: "Thursday, Friday, Saturday from 9 PM",
  dressCode: "Smart casual",
  phone: "+971 4 555 5959"
};

// =============================================
// AI SYSTEM PROMPT — EDIT CAREFULLY
// =============================================
const SYSTEM_PROMPT = `You are the friendly AI WhatsApp assistant for "${RESTAURANT_INFO.name}" in Dubai.

Your job: Reply to customer WhatsApp messages in a warm, helpful, and concise way (2–4 sentences max).

RESTAURANT INFORMATION:
- Name: ${RESTAURANT_INFO.name}
- Location: ${RESTAURANT_INFO.location}
- Hours: ${RESTAURANT_INFO.hours}
- Cuisine: ${RESTAURANT_INFO.cuisine}
- Shisha: ${RESTAURANT_INFO.shisha}
- Parking: ${RESTAURANT_INFO.parking}
- Reservations: ${RESTAURANT_INFO.reservations}
- Delivery: ${RESTAURANT_INFO.delivery}
- Happy Hour: ${RESTAURANT_INFO.happyHour}
- Friday Brunch: ${RESTAURANT_INFO.fridayBrunch}
- Live Music: ${RESTAURANT_INFO.liveMusic}
- Dress Code: ${RESTAURANT_INFO.dressCode}

RULES:
1. If asked in Arabic, reply in Arabic
2. Be concise — 2 to 4 sentences maximum
3. Use 1 relevant emoji occasionally
4. If you don't know something, say: "For more details please call us at ${RESTAURANT_INFO.phone}"
5. Never make up information not listed above
6. Stay on topic — only answer restaurant-related questions`;

// =============================================
// DEMO CHAT LOGIC
// =============================================
const demoMessages = document.getElementById('demoMessages');
const demoInput = document.getElementById('demoInput');
const demoStatus = document.getElementById('demoStatus');
let isBusy = false;

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `dm dm-${role === 'user' ? 'out' : 'in'}`;
  div.innerHTML = text.replace(/\n/g, '<br>') + `<span class="dm-time">${getTime()}${role === 'user' ? ' ✓✓' : ''}</span>`;
  demoMessages.appendChild(div);
  demoMessages.scrollTop = demoMessages.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'typing-dots';
  div.id = 'typingDots';
  div.innerHTML = '<span></span><span></span><span></span>';
  demoMessages.appendChild(div);
  demoMessages.scrollTop = demoMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingDots');
  if (t) t.remove();
}

// Send preset question (from sidebar buttons)
function sendPreset(btn, text) {
  document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  demoInput.value = text;
  sendDemoMsg();
  setTimeout(() => btn.classList.remove('active'), 3000);
}

// Send message from input box
async function sendDemoMsg() {
  const text = demoInput.value.trim();
  if (!text || isBusy) return;

  demoInput.value = '';
  isBusy = true;

  addMessage(text, 'user');
  demoStatus.textContent = '● typing...';
  showTyping();

  // MOCK LOGIC: For demo purposes, we provide quick answers if no backend is set up
  const useMock = true; // Set to false when you have a backend proxy

  if (useMock) {
    setTimeout(() => {
      removeTyping();
      let reply = "";
      const lower = text.toLowerCase();

      if (lower.includes("open") || lower.includes("مفتوحون")) {
        if (lower.includes("مفتوحون")) {
          reply = "نفتح أبوابنا يوميًا من الساعة 12:00 ظهرًا حتى 2:00 صباحًا! هل ترغب بحجز طاولة؟ 🍽️";
        } else {
          reply = `We're open daily from ${RESTAURANT_INFO.hours}! Would you like to book a table? 🍽️`;
        }
      }
      else if (lower.includes("shisha")) reply = `Yes! We serve shisha starting from 6 PM every day. ${RESTAURANT_INFO.shisha} 💨`;
      else if (lower.includes("location") || lower.includes("where")) reply = `We're located at ${RESTAURANT_INFO.location}. You can't miss us! 📍`;
      else if (lower.includes("book") || lower.includes("reserve")) {
        if (lower.includes("4") && lower.includes("friday")) {
          reply = "Of course! I'm booking a table for 4 people this Friday night for you. What time would you like to arrive? 👥";
        } else {
          reply = `I can help with that! I'll start the booking process for you. You can also reach us at ${RESTAURANT_INFO.reservations} to confirm immediately. 📅`;
        }
      }
      else if (lower.includes("menu") || lower.includes("food")) reply = `We serve ${RESTAURANT_INFO.cuisine}. Would you like me to send you our latest menu? 📖`;
      else if (lower.includes("happy hour")) reply = `Yes! Our Happy Hour is ${RESTAURANT_INFO.happyHour}. Hope to see you then! 🍹`;
      else if (lower.includes("parking")) reply = `${RESTAURANT_INFO.parking}. 🚗`;
      else if (lower.includes("brunch")) reply = `Our Friday Brunch is legendary! It's ${RESTAURANT_INFO.fridayBrunch}. 🥂`;
      else reply = `That's a great question! For specific details on that, please call us at ${RESTAURANT_INFO.phone} — our team is happy to help! 😊`;

      addMessage(reply, 'ai');
      demoStatus.textContent = '● Online — replies instantly';
      isBusy = false;
    }, 1500);
    return;
  }

  try {
    // NOTE: This call will likely fail due to CORS if called directly from browser.
    // Use a backend proxy for production.
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE', // MUST BE MOVED TO BACKEND
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: text }]
      })
    });

    const data = await response.json();
    removeTyping();

    if (data.content && data.content[0] && data.content[0].text) {
      addMessage(data.content[0].text, 'ai');
    } else {
      addMessage("Sorry, something went wrong. Please try again. 🙏", 'ai');
    }

  } catch (err) {
    removeTyping();
    addMessage("Connection issue. Please try again in a moment.", 'ai');
    console.error('API Error:', err);
  }

  demoStatus.textContent = '● Online — replies instantly';
  isBusy = false;
}

// =============================================
// ROI BAR ANIMATION
// =============================================
function animateBars(container) {
  const fills = container.querySelectorAll('.roi-fill');
  fills.forEach(fill => {
    const targetWidth = fill.style.width;
    fill.style.width = '0';
    setTimeout(() => { fill.style.width = targetWidth; }, 200);
  });
}

// =============================================
// SCROLL REVEAL
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section, .demo-box, .plans, .obj-grid').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ROI section — no bars to animate in new design

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) {
    nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
  } else {
    nav.style.borderBottomColor = 'rgba(255,255,255,0.08)';
  }
});

// =============================================
// HERO PHONE — AUTO CHAT ANIMATION
// =============================================
// The hero phone bubbles are static HTML — 
// edit them directly in index.html inside .wa-body
