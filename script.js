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
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Free, Recommended)' },
      { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite (Free, Fastest)' },
      { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Free, Fast)' },
      { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Advanced)' },
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

const IMAGE_PROVIDERS = {
  'none': {
    name: 'Disabled',
    label: 'No Images',
    needsKey: false,
    apiLink: '#',
  },
  'pollinations': {
    name: 'Pollinations.ai',
    label: 'Pollinations (Free)',
    keyLabel: null,
    keyPlaceholder: null,
    apiLink: 'https://pollinations.ai',
    needsKey: false,
  },
  'deepai': {
    name: 'DeepAI',
    label: 'DeepAI',
    keyLabel: 'DeepAI API Key',
    keyPlaceholder: 'Enter DeepAI key...',
    apiLink: 'https://deepai.org/dashboard#api-key',
    needsKey: true,
  },
  'freepik': {
    name: 'Freepik',
    label: 'Freepik AI',
    keyLabel: 'Freepik API Key',
    keyPlaceholder: 'FPSX...',
    apiLink: 'https://www.freepik.com/api/subscriptions',
    needsKey: true,
  },
  'openai-images': {
    name: 'DALL-E 3',
    label: 'DALL-E (OpenAI)',
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-...',
    apiLink: 'https://platform.openai.com/account/api-keys',
    needsKey: true,
  },
  'huggingface': {
    name: 'Hugging Face',
    label: 'Hugging Face (Free)',
    keyLabel: 'Hugging Face Token',
    keyPlaceholder: 'hf_...',
    apiLink: 'https://huggingface.co/settings/tokens',
    needsKey: true,
  },
};

// =========================================
// State
// =========================================
const state = {
  provider: localStorage.getItem('li_provider') || 'claude-manual',
  model: null,
  apiKeys: JSON.parse(localStorage.getItem('li_api_keys') || '{}'),
  imageProvider: localStorage.getItem('li_image_provider') || 'none',
  imageKeys: JSON.parse(localStorage.getItem('li_image_keys') || '{}'),
  tone: 'professional',
  lastPrompt: '',
  lastPost: '',
  posts: [],
  activePostIndex: 0,
  postCount: 1,
  generating: false,
  generatingImage: false,
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

function saveImageKeys() {
  localStorage.setItem('li_image_keys', JSON.stringify(state.imageKeys));
}

function saveImageProvider() {
  localStorage.setItem('li_image_provider', state.imageProvider);
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
  const { topic, tone, length, audience, hashtags, emojis, cta, hook, custom,
          inspirationUrl, inspirationText, inspirationMode } = data;

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

  const hasInspiration = inspirationText.length > 0;
  let inspirationSection = '';
  if (hasInspiration) {
    if (inspirationMode === 'rewrite') {
      inspirationSection = `
REWRITE TASK:
The user wants you to rewrite the following post adapted to their own topic and context.
Study its structure, opening hook, paragraph flow, and call-to-action style — then produce
a fresh post that feels like a natural evolution of that style but is 100% original content.
${inspirationUrl ? `Source URL (for context only): ${inspirationUrl}` : ''}

REFERENCE POST TO REWRITE:
"""
${inspirationText}
"""
`;
    } else {
      inspirationSection = `
INSPIRATION REFERENCE:
Study the structure, tone, hook style, and flow of the post below. Write a NEW, completely
original post on the user's topic that FEELS SIMILAR in style and energy — same kind of
opening, similar paragraph rhythm, comparable emotional resonance.
${inspirationUrl ? `Source URL (for context only): ${inspirationUrl}` : ''}

REFERENCE POST:
"""
${inspirationText}
"""
`;
    }
  }

  return `You are an expert LinkedIn content creator who writes posts that get thousands of reactions.
${inspirationSection}
Create a LinkedIn post with the following details:

TOPIC / CONTENT:
${topic}

TONE: ${tone.charAt(0).toUpperCase() + tone.slice(1)}

RULES TO FOLLOW:
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

IMPORTANT: Output ONLY the final LinkedIn post text. No preamble, no explanation, no "Here is your post:" label — start directly with the post hook.`;
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
      systemInstruction: {
        parts: [{ text: 'You are an expert LinkedIn content creator. Output ONLY the final LinkedIn post text — no introduction, no explanation, no "Here is your post:", no labels. Just the raw post text itself.' }],
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.9 },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Gemini API error (${res.status})`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no content. Check your API key or try a different model.');
  return text;
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
// Image Generation
// =========================================
function buildImagePrompt(postText) {
  const lines = postText.split('\n').filter(l => l.trim());
  const firstLine = lines[0] || '';

  const themes = {
    'marketing': 'professional marketing presentation, charts, growth metrics, modern design',
    'business': 'corporate, professional teamwork, office, success, leadership',
    'technology': 'tech innovation, futuristic, digital transformation, modern tech',
    'leadership': 'confident leader, mentorship, professional development, growth',
    'motivation': 'inspiring, uplifting, achievement, success, breakthrough',
    'learning': 'education, learning, knowledge, growth, development',
    'career': 'career growth, professional development, success, opportunity',
    'social': 'community, connection, teamwork, collaboration, networking',
    'personal': 'personal achievement, milestone, celebration, success',
  };

  let theme = 'professional business';
  for (const [key, desc] of Object.entries(themes)) {
    if (firstLine.toLowerCase().includes(key)) {
      theme = desc;
      break;
    }
  }

  return `A professional LinkedIn-style image for this post: "${firstLine}". Style: modern, clean, corporate, ${theme}. High quality, suitable for professional networking. No text overlay.`;
}

async function generateWithPollinations(prompt) {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=576&nologo=true&seed=${seed}&model=flux`;

  const maxRetries = 4;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const wait = attempt * 3000;
      document.getElementById('imageLoading').querySelector('p').textContent =
        `Rate limited — retrying in ${wait / 1000}s... (attempt ${attempt + 1}/${maxRetries})`;
      await new Promise(r => setTimeout(r, wait));
    }

    const res = await fetch(url);

    if (res.status === 429) {
      if (attempt === maxRetries - 1) {
        throw new Error('Pollinations rate limit reached. Wait 30 seconds and try again, or switch to DALL-E / Hugging Face.');
      }
      continue;
    }

    if (!res.ok) throw new Error(`Pollinations error (${res.status})`);

    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read image data'));
      reader.readAsDataURL(blob);
    });
  }
}

async function generateWithDeepAI(prompt, apiKey) {
  const formData = new FormData();
  formData.append('text', prompt);

  const res = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: { 'api-key': apiKey },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.err || data.status || `DeepAI error (${res.status})`);
  if (data.output_url) return data.output_url;
  throw new Error('No image returned from DeepAI');
}

async function generateWithFreepik(prompt, apiKey) {
  const res = await fetch('https://api.freepik.com/v1/ai/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-freepik-api-key': apiKey,
      'Accept-Language': 'en-US',
    },
    body: JSON.stringify({
      prompt: { positive: prompt },
      image: { size: 'landscape_16_9' },
      styling: { style: 'photo' },
      num_images: 1,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || `Freepik error (${res.status})`);

  if (data.data?.[0]?.base64) {
    return `data:image/jpeg;base64,${data.data[0].base64}`;
  }
  throw new Error('No image returned from Freepik. Check your API plan includes image generation.');
}

async function generateWithHuggingFace(prompt, apiKey) {
  const model = 'stabilityai/stable-diffusion-xl-base-1.0';
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { width: 1024, height: 576 },
    }),
  });

  if (res.status === 503) throw new Error('Model is loading, please try again in 30 seconds');
  if (res.status === 401) throw new Error('Invalid Hugging Face token. Get one at huggingface.co/settings/tokens');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Hugging Face error (${res.status})`);
  }

  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(blob);
  });
}

async function generateWithDALLE(prompt, apiKey) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `DALL-E error (${res.status})`);
  if (data.data?.[0]?.url) {
    return data.data[0].url;
  }
  throw new Error('No image generated');
}


async function generateImage(postText) {
  if (state.imageProvider === 'none') {
    throw new Error('Image generation is disabled. Enable it in AI Settings.');
  }

  const cfg = IMAGE_PROVIDERS[state.imageProvider];
  const apiKey = state.imageKeys[state.imageProvider] || '';

  if (cfg.needsKey && !apiKey) {
    throw new Error(`No API key for ${cfg.name}. Go to AI Settings to add it.`);
  }

  const prompt = buildImagePrompt(postText);

  switch (state.imageProvider) {
    case 'pollinations':  return generateWithPollinations(prompt);
    case 'deepai':        return generateWithDeepAI(prompt, apiKey);
    case 'freepik':       return generateWithFreepik(prompt, apiKey);
    case 'openai-images': return generateWithDALLE(prompt, apiKey);
    case 'huggingface':   return generateWithHuggingFace(prompt, apiKey);
    default: throw new Error('Unknown image provider.');
  }
}

// =========================================
// UI: Output rendering
// =========================================
function renderOutput(text) {
  // Legacy single-post render used by manual paste flow
  const clean = text.trim();
  state.posts = [clean];
  state.activePostIndex = 0;
  state.lastPost = clean;
  document.getElementById('editablePost').value = clean;
  updatePreview(clean);
  setHidden(document.getElementById('postTabs'), true);
  setHidden(document.getElementById('outputCard'), false);
  setHidden(document.getElementById('manualCard'), true);
  setHidden(document.getElementById('imageSection'), false);
  resetImageUI();
  document.getElementById('outputCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetImageUI() {
  setHidden(document.getElementById('imagePlaceholder'), false);
  setHidden(document.getElementById('generatedImage'), true);
  setHidden(document.getElementById('imageLoading'), true);
  setHidden(document.getElementById('imageActions'), true);

  const hint = document.getElementById('imagePlaceholderText');
  if (hint) {
    hint.textContent = state.imageProvider === 'none'
      ? 'Open AI Settings → Image Generation to enable this feature'
      : 'Click "Generate Image" to create a visual for your post';
  }
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

function refreshImageSettingsUI() {
  const imgProvider = state.imageProvider;
  const imgCfg = IMAGE_PROVIDERS[imgProvider];

  // If provider doesn't exist, reset to 'none'
  if (!imgCfg) {
    state.imageProvider = 'none';
    saveImageProvider();
  }

  const safeProvider = state.imageProvider;
  const safeCfg = IMAGE_PROVIDERS[safeProvider] || IMAGE_PROVIDERS['none'];

  // Highlight active image provider card
  document.querySelectorAll('[data-image-provider]').forEach(c => {
    c.classList.toggle('active', c.dataset.imageProvider === safeProvider);
  });

  // API key section
  const imgKeySect = document.getElementById('imageKeySection');
  if (safeCfg.needsKey && safeProvider !== 'none') {
    setHidden(imgKeySect, false);
    document.getElementById('imageKeyLabel').textContent = safeCfg.keyLabel;
    const keyInput = document.getElementById('imageKeyInput');
    keyInput.placeholder = safeCfg.keyPlaceholder;
    keyInput.value = state.imageKeys[safeProvider] || '';

    const link = document.getElementById('imageApiLink');
    link.href = safeCfg.apiLink;

    const ks = document.getElementById('imageKeyStatus');
    if (state.imageKeys[safeProvider]) {
      ks.className = 'key-status ok';
      ks.textContent = '✓ Key saved';
    } else {
      ks.className = 'key-status';
      ks.textContent = '';
    }
  } else {
    setHidden(imgKeySect, true);
  }
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
  try {
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

    // Save image provider settings
    const imgKey = document.getElementById('imageKeyInput')?.value.trim() || '';
    if (imgKey && state.imageProvider !== 'none') {
      state.imageKeys[state.imageProvider] = imgKey;
      saveImageKeys();
    }
    saveImageProvider();

    saveProvider();
    updateProviderBadge();
    updateGenerateButtonLabel();
    closeSettings();
    showToast(`Settings saved`, 'success');
  } catch (e) {
    console.error('Error in applySettings:', e);
    showToast(`Error: ${e.message}`, 'error');
  }
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
    if (currentProviderIsManual()) {
      txt.textContent = 'Build Prompt';
    } else {
      txt.textContent = state.postCount > 1
        ? `Generate ${state.postCount} LinkedIn Posts`
        : 'Generate LinkedIn Post';
    }
  }
}

// =========================================
// Data collection
// =========================================
function collectFormData() {
  const inspirationMode = document.querySelector('input[name="inspirationMode"]:checked')?.value || 'similar';
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
    inspirationUrl: document.getElementById('inspirationUrl').value.trim(),
    inspirationText: document.getElementById('inspirationText').value.trim(),
    inspirationMode,
  };
}

// =========================================
// Image Generation UI Handlers
// =========================================
async function handleGenerateImage() {
  if (!state.lastPost) {
    showToast('Generate a post first', 'error');
    return;
  }

  if (state.imageProvider === 'none') {
    showToast('Select an image provider in AI Settings first', 'error');
    openSettings();
    return;
  }

  setHidden(document.getElementById('imagePlaceholder'), true);
  setHidden(document.getElementById('imageLoading'), false);
  document.getElementById('generateImageBtn').disabled = true;

  try {
    const imageUrl = await generateImage(state.lastPost);

    const img = document.getElementById('generatedImage');
    img.src = imageUrl;
    img.onload = () => {
      setHidden(document.getElementById('imageLoading'), true);
      setHidden(document.getElementById('generatedImage'), false);
      setHidden(document.getElementById('imageActions'), false);
      showToast('Image generated!', 'success');
    };
    img.onerror = () => {
      showError('Failed to load image. Try again.');
      setHidden(document.getElementById('imageLoading'), true);
      setHidden(document.getElementById('imagePlaceholder'), false);
    };
  } catch (err) {
    showError(err.message || 'Image generation failed');
    setHidden(document.getElementById('imageLoading'), true);
    setHidden(document.getElementById('imagePlaceholder'), false);
  } finally {
    document.getElementById('generateImageBtn').disabled = false;
  }
}

function handleDownloadImage() {
  const img = document.getElementById('generatedImage');
  if (!img.src) return;

  const link = document.createElement('a');
  link.href = img.src;
  link.download = `linkedin-post-${Date.now()}.png`;
  link.click();
  showToast('Downloaded!', 'success');
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

  const inspirationOpen = !document.getElementById('inspirationBody').classList.contains('hidden');
  if (inspirationOpen && !data.inspirationText) {
    showError('You opened the Inspiration section but left the post text empty. Paste a reference post or close the section.');
    document.getElementById('inspirationText').focus();
    return;
  }

  if (!state.provider) {
    showError('Please open AI Settings and choose a provider first.');
    return;
  }

  const basePrompt = buildPrompt(data);
  state.lastPrompt = basePrompt;

  if (currentProviderIsManual()) {
    document.getElementById('manualPromptBox').textContent = basePrompt;
    setHidden(document.getElementById('manualCard'), false);
    setHidden(document.getElementById('outputCard'), true);
    document.getElementById('manualCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Reset posts state
  state.posts = new Array(state.postCount).fill(null);
  state.activePostIndex = 0;

  // Pre-render output card with empty tabs
  renderOutputShell();
  setGenerating(true);

  for (let i = 0; i < state.postCount; i++) {
    setTabLoading(i);
    updateGenerateProgress(i + 1, state.postCount);
    const variantPrompt = state.postCount > 1
      ? basePrompt + `\n\nIMPORTANT: This is variation ${i + 1} of ${state.postCount}. Make it distinctly different in opening hook and structure from other variations.`
      : basePrompt;
    try {
      const result = await generatePost(variantPrompt);
      state.posts[i] = result.trim();
      setTabDone(i);
      if (i === 0) showPostAtIndex(0);
    } catch (err) {
      state.posts[i] = `[Error generating post ${i + 1}: ${err.message}]`;
      setTabDone(i, true);
      if (i === 0) showPostAtIndex(0);
    }
  }

  setGenerating(false);
  showToast(state.postCount > 1 ? `${state.postCount} posts generated!` : 'Post generated!', 'success');
}

function renderOutputShell() {
  const count = state.postCount;
  const tabsEl = document.getElementById('postTabs');

  setHidden(document.getElementById('outputCard'), false);
  setHidden(document.getElementById('manualCard'), true);

  // Build tabs
  if (count > 1) {
    tabsEl.innerHTML = Array.from({ length: count }, (_, i) =>
      `<button class="post-tab-btn${i === 0 ? ' active' : ''}" data-tab="${i}">
        Post ${i + 1} <span class="tab-status"></span>
      </button>`
    ).join('');
    setHidden(tabsEl, false);
    tabsEl.querySelectorAll('.post-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => showPostAtIndex(Number(btn.dataset.tab)));
    });
  } else {
    setHidden(tabsEl, true);
  }

  // Reset image section
  resetImageUI();
  setHidden(document.getElementById('imageSection'), false);

  document.getElementById('outputCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showPostAtIndex(index) {
  state.activePostIndex = index;
  const text = state.posts[index] || '';
  state.lastPost = text;
  document.getElementById('editablePost').value = text;
  updatePreview(text);

  // Update title
  document.getElementById('outputTitle').textContent =
    state.postCount > 1 ? `Post ${index + 1} of ${state.postCount}` : 'Your LinkedIn Post';

  // Update tab active state
  document.querySelectorAll('.post-tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}

function setTabLoading(index) {
  const btn = document.querySelector(`.post-tab-btn[data-tab="${index}"]`);
  if (btn) { btn.classList.remove('done'); btn.classList.add('loading'); }
}

function setTabDone(index, isError = false) {
  const btn = document.querySelector(`.post-tab-btn[data-tab="${index}"]`);
  if (btn) {
    btn.classList.remove('loading');
    btn.classList.add('done');
    if (isError) btn.style.color = 'var(--danger)';
  }
}

function updateGenerateProgress(current, total) {
  const txt = document.getElementById('generateBtnText');
  if (!state.generating) return;
  txt.textContent = total > 1 ? `Generating post ${current} of ${total}…` : 'Generating…';
}

// =========================================
// .docx Export
// =========================================
function handleExportDocx() {
  const posts = state.posts.filter(Boolean);
  if (!posts.length) { showToast('No posts to export', 'error'); return; }

  if (typeof htmlDocx === 'undefined') {
    showToast('Export library not loaded — check your internet connection and hard refresh.', 'error');
    return;
  }

  const topic = document.getElementById('topicInput').value.trim() || 'LinkedIn Posts';
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const postSections = posts.map((post, i) => {
    const heading = posts.length > 1 ? `<h2 style="color:#1d2226;font-size:13pt;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:28px">Post ${i + 1}</h2>` : '';
    const lines = post.split('\n').map(line =>
      line.trim() ? `<p style="margin:6px 0;line-height:1.65">${line}</p>` : '<p style="margin:3px 0">&nbsp;</p>'
    ).join('');
    return heading + `<div style="margin-bottom:24px">${lines}</div>`;
  }).join('<br style="page-break-after:always">');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1d2226;margin:40px">
<h1 style="color:#0A66C2;font-size:18pt;margin-bottom:4px">LinkedIn Posts</h1>
<p style="color:#666;font-size:10pt;margin-top:0;margin-bottom:8px">${topic}</p>
<p style="color:#999;font-size:9pt;margin-top:0;margin-bottom:28px">Generated on ${dateStr}</p>
${postSections}
</body></html>`;

  try {
    const blob = htmlDocx.asBlob(html);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-posts-${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded as .docx!', 'success');
  } catch (e) {
    showToast(`Export failed: ${e.message}`, 'error');
  }
}

// =========================================
// Google Docs Export
// =========================================
function handleExportToGoogleDocs() {
  const posts = state.posts.filter(Boolean);
  if (!posts.length) { showToast('No posts to export', 'error'); return; }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const topic = document.getElementById('topicInput').value.trim() || 'LinkedIn Posts';

  let content = `LinkedIn Posts — ${topic}\nGenerated on ${dateStr}\n`;
  content += '='.repeat(50) + '\n\n';

  posts.forEach((post, i) => {
    if (posts.length > 1) content += `POST ${i + 1}\n${'—'.repeat(30)}\n`;
    content += post + '\n\n';
    if (posts.length > 1) content += '\n';
  });

  // Copy to clipboard
  navigator.clipboard.writeText(content).then(() => {
    // Open a new Google Doc
    window.open('https://docs.new', '_blank');
    showToast('Copied! Paste into the new Google Doc (Ctrl+V)', 'success');
  }).catch(() => {
    // Fallback: download as .txt
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-posts-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded as .txt — upload to Google Drive and open with Google Docs', '');
  });
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

const CARD_PROFILE = {
  name: 'Saurabh',
  role: 'Fractional CMO',
  headline: 'Early-Stage Startups & SaaS Growth',
};

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
      if (!key) throw new Error('No Gemini key saved');
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
      if (!key) throw new Error('No Claude API key saved');
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
      if (!key) throw new Error('No OpenAI key saved');
      const model = state.model || cfg.defaultModel;
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model, max_tokens: 600, temperature: 0.3,
          messages: [{ role: 'user', content: extractPrompt }],
        }),
      });
      const data = await res.json();
      jsonStr = data.choices?.[0]?.message?.content || '';
    } else if (p === 'groq') {
      const key = state.apiKeys['groq'];
      if (!key) throw new Error('No Groq key saved');
      const model = state.model || cfg.defaultModel;
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model, max_tokens: 600, temperature: 0.3,
          messages: [{ role: 'user', content: extractPrompt }],
        }),
      });
      const data = await res.json();
      jsonStr = data.choices?.[0]?.message?.content || '';
    } else if (p === 'mistral') {
      const key = state.apiKeys['mistral'];
      if (!key) throw new Error('No Mistral key saved');
      const model = state.model || cfg.defaultModel;
      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model, max_tokens: 600, temperature: 0.3,
          messages: [{ role: 'user', content: extractPrompt }],
        }),
      });
      const data = await res.json();
      jsonStr = data.choices?.[0]?.message?.content || '';
    } else {
      throw new Error('Card generation requires an API provider (not manual mode).');
    }

    jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Failed to extract card data: ' + e.message);
  }
}

function cardWrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || '').split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
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

function cardWrapCenter(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = String(text || '').split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
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

  // Section 1: Header
  const headerH = 230;
  ctx.fillStyle = CC.headerBg;
  ctx.fillRect(0, 0, W, headerH);

  const avatarColW = 275;
  const avatarCY = headerH / 2;
  const avatarR = 100;

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
    ctx.drawImage(img, cx - half, 0, half * 2, half * 2,
      avatarColW / 2 - avatarR, avatarCY - avatarR, avatarR * 2, avatarR * 2);
  } else {
    const grad = ctx.createRadialGradient(avatarColW / 2, avatarCY, 0, avatarColW / 2, avatarCY, avatarR);
    grad.addColorStop(0, '#BAE6FD');
    grad.addColorStop(1, '#0e7490');
    ctx.fillStyle = grad;
    ctx.fillRect(avatarColW / 2 - avatarR, avatarCY - avatarR, avatarR * 2, avatarR * 2);
  }
  ctx.restore();

  const textStartX = avatarColW + 30;
  const textAreaW = W - textStartX - 40;
  ctx.fillStyle = CC.white;
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.fillText(CARD_PROFILE.name, textStartX, 75);
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillStyle = CC.mutedHeader;
  ctx.fillText(CARD_PROFILE.role, textStartX, 122);
  ctx.font = '26px Arial, sans-serif';
  cardWrapText(ctx, CARD_PROFILE.headline, textStartX, 162, textAreaW, 34);

  // Section 2: Copper divider
  let curY = headerH;
  ctx.fillStyle = CC.accent;
  ctx.fillRect(0, curY, W, 4);

  // Section 3: Alert box
  curY += 4;
  const alertH = 90;
  ctx.fillStyle = CC.alertBg;
  ctx.fillRect(0, curY, W, alertH);
  ctx.fillStyle = CC.accent;
  ctx.fillRect(0, curY, 8, alertH);
  ctx.fillStyle = CC.body;
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.textAlign = 'center';
  cardWrapCenter(ctx, String(data.insight || ''), W / 2, curY + 34, W - 80, 36);
  ctx.textAlign = 'left';
  curY += alertH;

  // Section 4: 3-column row
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
    if (i > 0) { ctx.fillStyle = CC.border; ctx.fillRect(colX, curY, 1, colRowH); }
    const padX = colX + 28;
    const maxColW = colW - 56;
    ctx.fillStyle = CC.accent;
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText(String(col.label || '').toUpperCase(), padX, curY + 38);
    ctx.fillStyle = CC.body;
    ctx.font = '21px Arial, sans-serif';
    cardWrapText(ctx, col.body, padX, curY + 68, maxColW, 28);
  });
  curY += colRowH;

  // Section 5: 3 numbered points
  const pointsH = 240;
  ctx.fillStyle = CC.pointsBg;
  ctx.fillRect(0, curY, W, pointsH);
  ctx.fillStyle = CC.border;
  ctx.fillRect(0, curY, W, 1);
  const points = [data.point1, data.point2, data.point3];
  const ptSpacing = Math.floor(W / 3);
  points.forEach((pt, i) => {
    const ptX = i * ptSpacing;
    const cirX = ptX + 50;
    const cirY = curY + 70;
    ctx.beginPath();
    ctx.arc(cirX, cirY, 32, 0, Math.PI * 2);
    ctx.strokeStyle = CC.accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = CC.accent;
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), cirX, cirY + 10);
    ctx.textAlign = 'left';
    ctx.fillStyle = CC.body;
    ctx.font = '22px Arial, sans-serif';
    cardWrapText(ctx, pt, ptX + 94, curY + 56, ptSpacing - 114, 30);
  });
  curY += pointsH;

  // Section 6: Footer quote
  const footerH = H - curY;
  ctx.fillStyle = CC.accent;
  ctx.fillRect(0, curY, W, 3);
  curY += 3;
  ctx.fillStyle = CC.footerBg;
  ctx.fillRect(0, curY, W, footerH - 3);
  ctx.fillStyle = CC.headlineTxt;
  ctx.font = 'italic bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  cardWrapCenter(ctx, `"${data.quote}"`, W / 2, curY + 52, W - 120, 40);
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

  const applyBtn = document.getElementById('applySettings');
  if (applyBtn) {
    applyBtn.addEventListener('click', applySettings);
  } else {
    console.warn('applySettings button not found');
  }

  // Provider card selection (text/AI providers only)
  document.querySelectorAll('.provider-card[data-provider]').forEach(card => {
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

  // Inspiration box toggle
  document.getElementById('inspirationToggle').addEventListener('click', () => {
    const body = document.getElementById('inspirationBody');
    const icon = document.getElementById('inspirationToggleIcon');
    const isOpen = !body.classList.contains('hidden');
    setHidden(body, isOpen);
    icon.textContent = isOpen ? '＋' : '－';
    icon.classList.toggle('open', !isOpen);
    if (isOpen) {
      document.getElementById('inspirationUrl').value = '';
      document.getElementById('inspirationText').value = '';
      setHidden(document.getElementById('clearUrlBtn'), true);
    }
  });

  // URL clear button
  document.getElementById('inspirationUrl').addEventListener('input', e => {
    setHidden(document.getElementById('clearUrlBtn'), !e.target.value);
  });
  document.getElementById('clearUrlBtn').addEventListener('click', () => {
    document.getElementById('inspirationUrl').value = '';
    setHidden(document.getElementById('clearUrlBtn'), true);
  });

  // Post count selector
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.postCount = Number(btn.dataset.count);
      updateGenerateButtonLabel();
    });
  });

  // Google Docs export
  document.getElementById('exportDocsBtn').addEventListener('click', handleExportToGoogleDocs);
  document.getElementById('exportDocxBtn').addEventListener('click', handleExportDocx);

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
    const val = e.target.value;
    state.posts[state.activePostIndex] = val;
    state.lastPost = val;
    updatePreview(val);
  });

  // Initial UI
  updateProviderBadge();
  updateGenerateButtonLabel();
  refreshImageSettingsUI();

  // Restore model if saved
  const cfg = PROVIDERS[state.provider];
  if (cfg) state.model = cfg.defaultModel;

  // Preload headshot for card generation
  preloadHeadshot();
}

document.addEventListener('DOMContentLoaded', init);
