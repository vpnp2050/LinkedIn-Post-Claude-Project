'use strict';

// =========================================
// Provider Configuration
// =========================================
const PROVIDERS = {
  'claude-api': {
    name: 'Claude API',
    label: 'Claude (Anthropic)',
    keyLabel: 'Anthropic API Key',
    keyPlaceholder: 'sk-ant-api...',
    apiLink: 'https://console.anthropic.com/account/keys',
    models: [
      { id: 'claude-opus-4-7', name: 'Claude Opus 4.7 (Most capable)' },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6 (Balanced)' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5 (Fast)' },
    ],
    defaultModel: 'claude-sonnet-4-6',
    needsKey: true,
    isManual: false,
  },
  'claude-manual': {
    name: 'Claude.ai (Manual)',
    label: 'Claude.ai / Pro',
    keyLabel: null,
    keyPlaceholder: null,
    apiLink: 'https://claude.ai',
    models: [],
    defaultModel: null,
    needsKey: false,
    isManual: true,
  },
  'gemini': {
    name: 'Gemini',
    label: 'Google Gemini',
    keyLabel: 'Google AI Studio API Key',
    keyPlaceholder: 'AIza...',
    apiLink: 'https://aistudio.google.com/app/apikey',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Free, Fast)' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Advanced)' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Free, Fast)' },
    ],
    defaultModel: 'gemini-2.0-flash',
    needsKey: true,
    isManual: false,
  },
  'openai': {
    name: 'OpenAI',
    label: 'ChatGPT (OpenAI)',
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-...',
    apiLink: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Most capable)' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & cheap)' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Budget)' },
    ],
    defaultModel: 'gpt-4o-mini',
    needsKey: true,
    isManual: false,
  },
  'mistral': {
    name: 'Mistral',
    label: 'Mistral AI',
    keyLabel: 'Mistral API Key',
    keyPlaceholder: 'Enter Mistral API key...',
    apiLink: 'https://console.mistral.ai/api-keys',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large (Best)' },
      { id: 'mistral-small-latest', name: 'Mistral Small (Fast)' },
      { id: 'open-mistral-7b', name: 'Mistral 7B (Free tier)' },
    ],
    defaultModel: 'mistral-small-latest',
    needsKey: true,
    isManual: false,
  },
  'groq': {
    name: 'Groq',
    label: 'Groq (Ultra-fast)',
    keyLabel: 'Groq API Key',
    keyPlaceholder: 'gsk_...',
    apiLink: 'https://console.groq.com/keys',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Free)' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Fastest)' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Free)' },
    ],
    defaultModel: 'llama-3.3-70b-versatile',
    needsKey: true,
    isManual: false,
  },
};

const LENGTH_MAP = {
  short: 'Short (around 100–150 words)',
  medium: 'Medium (around 250–320 words)',
  long: 'Long (around 450–520 words)',
};

// =========================================
// State
// =========================================
const state = {
  provider: localStorage.getItem('li_provider') || 'claude-manual',
  model: null,
  apiKeys: JSON.parse(localStorage.getItem('li_api_keys') || '{}'),
  tone: 'professional',
  lastPrompt: '',
  generating: false,
};

// =========================================
// Helpers
// =========================================
function saveKeys() {
  localStorage.setItem('li_api_keys', JSON.stringify(state.apiKeys));
}

function saveProvider() {
  localStorage.setItem('li_provider', state.provider);
}

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => { t.className = 'toast hidden'; }, 2800);
}

function setHidden(el, hidden) {
  if (hidden) el.classList.add('hidden');
  else el.classList.remove('hidden');
}

function setGenerating(on) {
  state.generating = on;
  const btn = document.getElementById('generateBtn');
  const txt = document.getElementById('generateBtnText');
  const icon = document.getElementById('generateIcon');
  const spinner = document.getElementById('spinner');
  btn.disabled = on;
  setHidden(icon, on);
  setHidden(spinner, !on);
  txt.textContent = on ? 'Generating…' : currentProviderIsManual() ? 'Build Prompt' : 'Generate LinkedIn Post';
}

function currentProviderIsManual() {
  return PROVIDERS[state.provider]?.isManual;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// =========================================
// Prompt Builder
// =========================================
function buildPrompt(data) {
  const { topic, tone, length, audience, hashtags, emojis, cta, hook, custom } = data;

  const rules = [
    'Write a powerful hook as the FIRST 1–2 lines. This is what appears before "see more" — make it irresistible.',
    'Use short paragraphs (1–3 sentences max). Separate every paragraph with a blank line.',
    'Never use markdown: no **, no ##, no *, no bullet dashes. Use plain text and line breaks only.',
    `Length: ${LENGTH_MAP[length] || LENGTH_MAP.medium}.`,
    audience ? `Write specifically for this audience: ${audience}.` : '',
    hook ? 'Open with a surprising stat, bold claim, or thought-provoking question.' : '',
    emojis ? 'Sprinkle relevant emojis naturally — do not overdo it (3–6 max).' : 'Do NOT use any emojis.',
    hashtags ? 'Add 3–5 relevant hashtags at the very END of the post on their own line.' : 'Do NOT include hashtags.',
    cta ? 'Close with an engaging question or a clear call-to-action that invites comments.' : '',
    'Keep total length under 3,000 characters (LinkedIn limit).',
    'Sound authentic and human — avoid corporate fluff.',
    custom ? `Additional instructions: ${custom}` : '',
  ].filter(Boolean);

  return `You are an expert LinkedIn content creator who writes posts that get thousands of reactions.

Create a LinkedIn post with the following details:

TOPIC / CONTENT:
${topic}

TONE: ${tone.charAt(0).toUpperCase() + tone.slice(1)}

RULES TO FOLLOW:
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Output ONLY the final LinkedIn post text. Do not include any explanation, label, or commentary — just the post itself.`;
}

// =========================================
// API Calls
// =========================================
async function callClaudeAPI(prompt, apiKey, model) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Claude API error (${res.status})`);
  return data.content[0].text;
}

async function callGeminiAPI(prompt, apiKey, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.9 },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Gemini API error (${res.status})`);
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  throw new Error('Gemini returned no content. Check your API key or model.');
}

async function callOpenAIAPI(prompt, apiKey, model) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0.9,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `OpenAI API error (${res.status})`);
  return data.choices[0].message.content;
}

async function callMistralAPI(prompt, apiKey, model) {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0.9,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Mistral API error (${res.status})`);
  return data.choices[0].message.content;
}

async function callGroqAPI(prompt, apiKey, model) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0.9,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Groq API error (${res.status})`);
  return data.choices[0].message.content;
}

async function generatePost(prompt) {
  const p = state.provider;
  const cfg = PROVIDERS[p];
  const apiKey = state.apiKeys[p] || '';
  const model = state.model || cfg.defaultModel;

  if (cfg.needsKey && !apiKey) {
    throw new Error(`No API key saved for ${cfg.name}. Open AI Settings to add your key.`);
  }

  switch (p) {
    case 'claude-api': return callClaudeAPI(prompt, apiKey, model);
    case 'gemini':     return callGeminiAPI(prompt, apiKey, model);
    case 'openai':     return callOpenAIAPI(prompt, apiKey, model);
    case 'mistral':    return callMistralAPI(prompt, apiKey, model);
    case 'groq':       return callGroqAPI(prompt, apiKey, model);
    default: throw new Error('Unknown provider.');
  }
}

// =========================================
// UI: Output rendering
// =========================================
function renderOutput(text) {
  const clean = text.trim();
  document.getElementById('editablePost').value = clean;
  updatePreview(clean);
  setHidden(document.getElementById('outputCard'), false);
  setHidden(document.getElementById('manualCard'), true);
  document.getElementById('outputCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updatePreview(text) {
  const preview = document.getElementById('lpContent');
  preview.textContent = text;
  updateCharCount(text);
}

function updateCharCount(text) {
  const len = text.length;
  const el = document.getElementById('charCount');
  el.textContent = `${len.toLocaleString()} / 3,000`;
  if (len > 3000) el.classList.add('over');
  else el.classList.remove('over');
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  setHidden(el, false);
}

function clearError() {
  const el = document.getElementById('errorMsg');
  setHidden(el, true);
  el.textContent = '';
}

// =========================================
// UI: Settings Panel
// =========================================
function openSettings() {
  setHidden(document.getElementById('settingsPanel'), false);
  setHidden(document.getElementById('settingsOverlay'), false);
  document.body.style.overflow = 'hidden';
  refreshSettingsUI();
}

function closeSettings() {
  setHidden(document.getElementById('settingsPanel'), true);
  setHidden(document.getElementById('settingsOverlay'), true);
  document.body.style.overflow = '';
}

function refreshSettingsUI() {
  const p = state.provider;
  const cfg = PROVIDERS[p];

  // Highlight active provider card
  document.querySelectorAll('.provider-card').forEach(c => {
    c.classList.toggle('active', c.dataset.provider === p);
  });

  // API key section
  const apiSect = document.getElementById('apiKeySection');
  const manualInfo = document.getElementById('manualInfo');
  const modelSect = document.getElementById('modelSection');

  if (cfg.isManual) {
    setHidden(apiSect, true);
    setHidden(manualInfo, false);
    setHidden(modelSect, true);
  } else {
    setHidden(apiSect, false);
    setHidden(manualInfo, true);
    setHidden(modelSect, cfg.models.length === 0);

    document.getElementById('apiKeyLabel').textContent = cfg.keyLabel;
    const keyInput = document.getElementById('apiKeyInput');
    keyInput.placeholder = cfg.keyPlaceholder;
    keyInput.value = state.apiKeys[p] || '';

    // API link
    const link = document.getElementById('apiLink');
    link.href = cfg.apiLink;
    link.textContent = 'Get API Key →';

    // Key status
    const ks = document.getElementById('keyStatus');
    if (state.apiKeys[p]) {
      ks.className = 'key-status ok';
      ks.textContent = '✓ API key is saved';
    } else {
      ks.className = 'key-status';
      ks.textContent = '';
    }

    // Models
    const sel = document.getElementById('modelSelect');
    sel.innerHTML = cfg.models.map(m =>
      `<option value="${m.id}"${m.id === (state.model || cfg.defaultModel) ? ' selected' : ''}>${m.name}</option>`
    ).join('');
  }
}

function applySettings() {
  const p = state.provider;
  const cfg = PROVIDERS[p];

  if (!cfg.isManual) {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (key) {
      state.apiKeys[p] = key;
      saveKeys();
    }
    const sel = document.getElementById('modelSelect');
    state.model = sel.value || cfg.defaultModel;
  }

  saveProvider();
  updateProviderBadge();
  updateGenerateButtonLabel();
  closeSettings();
  showToast(`Provider set to ${cfg.name}`, 'success');
}

function updateProviderBadge() {
  const cfg = PROVIDERS[state.provider];
  const dot = document.getElementById('providerDot');
  const label = document.getElementById('providerLabel');
  label.textContent = cfg.label;
  const hasKey = cfg.needsKey ? !!state.apiKeys[state.provider] : true;
  dot.classList.toggle('active', hasKey);
}

function updateGenerateButtonLabel() {
  const txt = document.getElementById('generateBtnText');
  if (!state.generating) {
    txt.textContent = currentProviderIsManual() ? 'Build Prompt' : 'Generate LinkedIn Post';
  }
}

// =========================================
// Data collection
// =========================================
function collectFormData() {
  return {
    topic: document.getElementById('topicInput').value.trim(),
    tone: state.tone,
    length: document.getElementById('lengthSelect').value,
    audience: document.getElementById('audienceInput').value.trim(),
    hashtags: document.getElementById('hashtagToggle').checked,
    emojis: document.getElementById('emojiToggle').checked,
    cta: document.getElementById('ctaToggle').checked,
    hook: document.getElementById('hookToggle').checked,
    custom: document.getElementById('customInstructions').value.trim(),
  };
}

// =========================================
// Event Handlers
// =========================================
async function handleGenerate() {
  clearError();
  const data = collectFormData();

  if (!data.topic) {
    showError('Please describe what you want to post about.');
    document.getElementById('topicInput').focus();
    return;
  }

  if (!state.provider) {
    showError('Please open AI Settings and choose a provider first.');
    return;
  }

  const prompt = buildPrompt(data);
  state.lastPrompt = prompt;

  if (currentProviderIsManual()) {
    // Manual mode: show prompt for copy-paste to claude.ai
    document.getElementById('manualPromptBox').textContent = prompt;
    setHidden(document.getElementById('manualCard'), false);
    setHidden(document.getElementById('outputCard'), true);
    document.getElementById('manualCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  setGenerating(true);
  try {
    const result = await generatePost(prompt);
    renderOutput(result);
    showToast('Post generated!', 'success');
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setGenerating(false);
  }
}

function handleCopy() {
  const text = document.getElementById('editablePost').value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!', 'success');
  });
}

function handleCopyPrompt() {
  const text = document.getElementById('manualPromptBox').textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Prompt copied! Paste it in claude.ai', 'success');
  });
}

function handleProcessResponse() {
  const text = document.getElementById('pasteResponse').value.trim();
  if (!text) {
    showToast('Please paste the response from Claude first.', 'error');
    return;
  }
  renderOutput(text);
  showToast('Post formatted and ready!', 'success');
}

// =========================================
// LinkedIn Card Generation
// =========================================

// Hardcoded profile info per spec
const CARD_PROFILE = {
  name: 'Saurabh',
  role: 'Fractional CMO',
  headline: 'Early-Stage Startups & SaaS Growth',
};

// Colors from spec
const CC = {
  headerBg: '#0891B2',
  accent: '#B87333',
  headlineTxt: '#7A3B1E',
  mutedHeader: '#BAE6FD',
  body: '#1E293B',
  subtext: '#64748B',
  border: '#E2E8F0',
  alertBg: '#FFF7ED',
  pointsBg: '#F8FAFC',
  footerBg: '#CCEEF5',
  white: '#FFFFFF',
};

let headshotImage = null;

function preloadHeadshot() {
  const img = new Image();
  img.onload = () => { headshotImage = img; };
  img.onerror = () => { headshotImage = null; };
  img.src = './headshot.png';
}

async function extractCardData(postText) {
  const extractPrompt = `You are a data extractor. Given a LinkedIn post, extract the following fields as a JSON object:

{
  "insight": "One punchy sentence capturing the core insight of the post (max 18 words)",
  "col1Label": "Label for column 1 (2-3 UPPERCASE words, topic/theme)",
  "col1Body": "2-sentence body for column 1",
  "col2Label": "Label for column 2 (2-3 UPPERCASE words)",
  "col2Body": "2-sentence body for column 2",
  "col3Label": "Label for column 3 (2-3 UPPERCASE words)",
  "col3Body": "2-sentence body for column 3",
  "point1": "Core argument point 1 (max 15 words)",
  "point2": "Core argument point 2 (max 15 words)",
  "point3": "Core argument point 3 (max 15 words)",
  "quote": "A memorable closing quote or key takeaway (max 20 words)"
}

Return ONLY the raw JSON with no markdown, no explanation.

POST:
${postText}`;

  try {
    let jsonStr = '';
    const p = state.provider;
    const cfg = PROVIDERS[p];

    if (p === 'gemini') {
      const key = state.apiKeys['gemini'];
      if (!key) throw new Error('No Gemini key');
      const model = state.model || cfg.defaultModel;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: extractPrompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.3 },
        }),
      });
      const data = await res.json();
      jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (p === 'claude-api') {
      const key = state.apiKeys['claude-api'];
      if (!key) throw new Error('No Claude key');
      const model = state.model || cfg.defaultModel;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model,
          max_tokens: 600,
          messages: [{ role: 'user', content: extractPrompt }],
        }),
      });
      const data = await res.json();
      jsonStr = data.content?.[0]?.text || '';
    } else if (p === 'openai') {
      const key = state.apiKeys['openai'];
      if (!key) throw new Error('No OpenAI key');
      const model = state.model || cfg.defaultModel;
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model,
          max_tokens: 600,
          temperature: 0.3,
          messages: [{ role: 'user', content: extractPrompt }],
        }),
      });
      const data = await res.json();
      jsonStr = data.choices?.[0]?.message?.content || '';
    } else if (p === 'groq') {
      const key = state.apiKeys['groq'];
      if (!key) throw new Error('No Groq key');
      const model = state.model || cfg.defaultModel;
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model,
          max_tokens: 600,
          temperature: 0.3,
          messages: [{ role: 'user', content: extractPrompt }],
        }),
      });
      const data = await res.json();
      jsonStr = data.choices?.[0]?.message?.content || '';
    } else if (p === 'mistral') {
      const key = state.apiKeys['mistral'];
      if (!key) throw new Error('No Mistral key');
      const model = state.model || cfg.defaultModel;
      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model,
          max_tokens: 600,
          temperature: 0.3,
          messages: [{ role: 'user', content: extractPrompt }],
        }),
      });
      const data = await res.json();
      jsonStr = data.choices?.[0]?.message?.content || '';
    } else {
      throw new Error('Cannot extract card data in manual mode. Please use an API provider.');
    }

    // Strip markdown fences if present
    jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Failed to extract card data: ' + e.message);
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || '').split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY;
}

function wrapTextCenter(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = String(text || '').split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), cx, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), cx, curY);
  return curY;
}

function drawLinkedInCard(canvas, data) {
  const ctx = canvas.getContext('2d');
  const W = 1080, H = 966;
  ctx.clearRect(0, 0, W, H);

  // ---- SECTION 1: Header (bg #0891B2, height ~230px) ----
  const headerH = 230;
  ctx.fillStyle = CC.headerBg;
  ctx.fillRect(0, 0, W, headerH);

  // Avatar column (275px wide)
  const avatarColW = 275;
  const avatarCY = headerH / 2;
  const avatarR = 100;

  // Draw circular headshot or placeholder
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarColW / 2, avatarCY, avatarR, 0, Math.PI * 2);
  ctx.clip();

  if (headshotImage) {
    const img = headshotImage;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const cx = iw / 2;
    const half = Math.min(iw, ih) * 0.36;
    const srcX = cx - half;
    const srcY = 0;
    const srcW = half * 2;
    const srcH = half * 2;
    const destD = avatarR * 2;
    const destX = avatarColW / 2 - avatarR;
    const destY = avatarCY - avatarR;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destD, destD);
  } else {
    // Placeholder gradient circle
    const grad = ctx.createRadialGradient(avatarColW / 2, avatarCY, 0, avatarColW / 2, avatarCY, avatarR);
    grad.addColorStop(0, '#BAE6FD');
    grad.addColorStop(1, '#0e7490');
    ctx.fillStyle = grad;
    ctx.fillRect(avatarColW / 2 - avatarR, avatarCY - avatarR, avatarR * 2, avatarR * 2);
  }
  ctx.restore();

  // Name / role / headline (right of avatar col)
  const textStartX = avatarColW + 30;
  const textAreaW = W - textStartX - 40;

  ctx.fillStyle = CC.white;
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.fillText(CARD_PROFILE.name, textStartX, 75);

  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillStyle = CC.mutedHeader;
  ctx.fillText(CARD_PROFILE.role, textStartX, 122);

  ctx.font = '26px Arial, sans-serif';
  ctx.fillStyle = CC.mutedHeader;
  wrapText(ctx, CARD_PROFILE.headline, textStartX, 162, textAreaW, 34);

  // ---- SECTION 2: Divider 4px #B87333 ----
  const divY = headerH;
  ctx.fillStyle = CC.accent;
  ctx.fillRect(0, divY, W, 4);

  // ---- SECTION 3: Alert box (bg #FFF7ED, 8px left accent #B87333) ----
  let curY = divY + 4;
  const alertH = 90;
  ctx.fillStyle = CC.alertBg;
  ctx.fillRect(0, curY, W, alertH);
  ctx.fillStyle = CC.accent;
  ctx.fillRect(0, curY, 8, alertH);

  ctx.fillStyle = CC.body;
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.textAlign = 'center';
  const alertText = String(data.insight || '');
  wrapTextCenter(ctx, alertText, W / 2, curY + 34, W - 80, 36);
  ctx.textAlign = 'left';

  curY += alertH;

  // ---- SECTION 4: 3-column row (bg #FFFFFF) ----
  const colRowH = 160;
  ctx.fillStyle = CC.white;
  ctx.fillRect(0, curY, W, colRowH);

  const colW = Math.floor(W / 3);
  const cols = [
    { label: data.col1Label, body: data.col1Body },
    { label: data.col2Label, body: data.col2Body },
    { label: data.col3Label, body: data.col3Body },
  ];

  cols.forEach((col, i) => {
    const colX = i * colW;
    // Divider between columns
    if (i > 0) {
      ctx.fillStyle = CC.border;
      ctx.fillRect(colX, curY, 1, colRowH);
    }
    const padX = colX + 28;
    const maxColW = colW - 56;

    ctx.fillStyle = CC.accent;
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText(String(col.label || '').toUpperCase(), padX, curY + 38);

    ctx.fillStyle = CC.body;
    ctx.font = '21px Arial, sans-serif';
    wrapText(ctx, col.body, padX, curY + 68, maxColW, 28);
  });

  curY += colRowH;

  // ---- SECTION 5: 3 numbered points (bg #F8FAFC) ----
  const pointsH = 240;
  ctx.fillStyle = CC.pointsBg;
  ctx.fillRect(0, curY, W, pointsH);

  // Top border
  ctx.fillStyle = CC.border;
  ctx.fillRect(0, curY, W, 1);

  const points = [data.point1, data.point2, data.point3];
  const pointSpacing = Math.floor(W / 3);

  points.forEach((pt, i) => {
    const ptX = i * pointSpacing;
    const cirX = ptX + 50;
    const cirY = curY + 70;
    const cirR = 32;

    // Copper circle
    ctx.beginPath();
    ctx.arc(cirX, cirY, cirR, 0, Math.PI * 2);
    ctx.strokeStyle = CC.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Number
    ctx.fillStyle = CC.accent;
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), cirX, cirY + 10);
    ctx.textAlign = 'left';

    // Point text
    ctx.fillStyle = CC.body;
    ctx.font = '22px Arial, sans-serif';
    wrapText(ctx, pt, ptX + 94, curY + 56, pointSpacing - 114, 30);
  });

  curY += pointsH;

  // ---- SECTION 6: Footer quote (bg #CCEEF5, 3px top border #B87333) ----
  const footerH = H - curY;
  ctx.fillStyle = CC.accent;
  ctx.fillRect(0, curY, W, 3);
  curY += 3;

  ctx.fillStyle = CC.footerBg;
  ctx.fillRect(0, curY, W, footerH - 3);

  ctx.fillStyle = CC.headlineTxt;
  ctx.font = 'italic bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  wrapTextCenter(ctx, `"${data.quote}"`, W / 2, curY + 52, W - 120, 40);
  ctx.textAlign = 'left';
}

async function handleGenerateCard() {
  const post = state.lastPost || document.getElementById('editablePost').value.trim();
  if (!post) {
    showToast('Generate a post first, then click Generate Card', 'error');
    return;
  }

  if (currentProviderIsManual()) {
    showToast('Card generation requires an API provider (not manual mode)', 'error');
    return;
  }

  const cardSection = document.getElementById('cardSection');
  const cardLoading = document.getElementById('cardLoading');
  const canvas = document.getElementById('linkedinCard');
  const btn = document.getElementById('generateCardBtn');

  setHidden(cardSection, false);
  setHidden(cardLoading, false);
  canvas.style.display = 'none';
  btn.disabled = true;
  cardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    document.getElementById('cardLoadingText').textContent = 'Extracting insights with AI…';
    const data = await extractCardData(post);

    document.getElementById('cardLoadingText').textContent = 'Drawing card…';
    drawLinkedInCard(canvas, data);

    setHidden(cardLoading, true);
    canvas.style.display = 'block';
    showToast('Card ready! Click Download PNG to save.', 'success');
  } catch (err) {
    setHidden(cardLoading, true);
    canvas.style.display = 'block';
    showToast('Card error: ' + (err.message || 'Unknown error'), 'error');
  } finally {
    btn.disabled = false;
  }
}

function handleDownloadCard() {
  const canvas = document.getElementById('linkedinCard');
  const link = document.createElement('a');
  link.download = `linkedin-card-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Card downloaded!', 'success');
}

// =========================================
// Init
// =========================================
function init() {
  // Settings toggle
  document.getElementById('settingsToggle').addEventListener('click', openSettings);
  document.getElementById('settingsClose').addEventListener('click', closeSettings);
  document.getElementById('settingsOverlay').addEventListener('click', closeSettings);
  document.getElementById('applySettings').addEventListener('click', applySettings);

  // Provider card selection
  document.querySelectorAll('.provider-card').forEach(card => {
    card.addEventListener('click', () => {
      state.provider = card.dataset.provider;
      const cfg = PROVIDERS[state.provider];
      state.model = cfg.defaultModel;
      refreshSettingsUI();
    });
  });

  // Save / clear key buttons
  document.getElementById('saveKeyBtn').addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) { showToast('Please enter an API key first.', 'error'); return; }
    state.apiKeys[state.provider] = key;
    saveKeys();
    const ks = document.getElementById('keyStatus');
    ks.className = 'key-status ok';
    ks.textContent = '✓ Key saved';
    showToast('API key saved locally.', 'success');
  });

  document.getElementById('clearKeyBtn').addEventListener('click', () => {
    delete state.apiKeys[state.provider];
    saveKeys();
    document.getElementById('apiKeyInput').value = '';
    const ks = document.getElementById('keyStatus');
    ks.className = 'key-status';
    ks.textContent = 'Key cleared.';
    showToast('API key removed.', '');
  });

  // Toggle key visibility
  document.getElementById('toggleKeyVisibility').addEventListener('click', () => {
    const inp = document.getElementById('apiKeyInput');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  // Tone buttons
  document.querySelectorAll('.tone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.tone = btn.dataset.tone;
    });
  });

  // Generate
  document.getElementById('generateBtn').addEventListener('click', handleGenerate);

  // Regenerate
  document.getElementById('regenerateBtn').addEventListener('click', () => {
    document.getElementById('outputCard').scrollIntoView({ behavior: 'smooth' });
    handleGenerate();
  });

  // Copy
  document.getElementById('copyBtn').addEventListener('click', handleCopy);

  // Image generation
  document.getElementById('generateImageBtn').addEventListener('click', handleGenerateImage);
  document.getElementById('regenerateImageBtn').addEventListener('click', handleGenerateImage);
  document.getElementById('downloadImageBtn').addEventListener('click', handleDownloadImage);

  // Card generation
  document.getElementById('generateCardBtn').addEventListener('click', handleGenerateCard);
  document.getElementById('downloadCardBtn').addEventListener('click', handleDownloadCard);

  // Image provider cards
  document.querySelectorAll('[data-image-provider]').forEach(card => {
    card.addEventListener('click', () => {
      state.imageProvider = card.dataset.imageProvider;
      refreshImageSettingsUI();
    });
  });

  // Image key handlers
  document.getElementById('saveImageKeyBtn').addEventListener('click', () => {
    const key = document.getElementById('imageKeyInput').value.trim();
    if (!key) { showToast('Please enter an API key.', 'error'); return; }
    state.imageKeys[state.imageProvider] = key;
    saveImageKeys();
    const ks = document.getElementById('imageKeyStatus');
    ks.className = 'key-status ok';
    ks.textContent = '✓ Key saved';
    showToast('Image API key saved.', 'success');
  });

  document.getElementById('clearImageKeyBtn').addEventListener('click', () => {
    delete state.imageKeys[state.imageProvider];
    saveImageKeys();
    document.getElementById('imageKeyInput').value = '';
    const ks = document.getElementById('imageKeyStatus');
    ks.className = 'key-status';
    ks.textContent = 'Key cleared.';
    showToast('Image API key removed.', '');
  });

  document.getElementById('toggleImageKeyVisibility').addEventListener('click', () => {
    const inp = document.getElementById('imageKeyInput');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });
  // Manual mode
  document.getElementById('copyPromptBtn').addEventListener('click', handleCopyPrompt);
  document.getElementById('processResponseBtn').addEventListener('click', handleProcessResponse);

  // Live preview sync from editable textarea
  document.getElementById('editablePost').addEventListener('input', e => {
    updatePreview(e.target.value);
  });

  // Initial UI
  updateProviderBadge();
  updateGenerateButtonLabel();

  // Restore model if saved
  const cfg = PROVIDERS[state.provider];
  if (cfg) state.model = cfg.defaultModel;

  // Preload headshot for card generation
  preloadHeadshot();
}

document.addEventListener('DOMContentLoaded', init);
