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
}

document.addEventListener('DOMContentLoaded', init);
