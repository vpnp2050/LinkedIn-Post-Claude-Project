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
  'stability': {
    name: 'Stability AI',
    label: 'Stable Diffusion',
    keyLabel: 'Stability AI API Key',
    keyPlaceholder: 'sk-...',
    apiLink: 'https://platform.stability.ai/account/keys',
    needsKey: true,
    imageSize: '1024x576',
    samplingSteps: 30,
  },
  'openai-images': {
    name: 'DALL-E (OpenAI)',
    label: 'DALL-E',
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-...',
    apiLink: 'https://platform.openai.com/account/api-keys',
    needsKey: true,
    imageSize: '1024x1024',
  },
  'replicate': {
    name: 'Replicate',
    label: 'Replicate',
    keyLabel: 'Replicate API Key',
    keyPlaceholder: 'r8_...',
    apiLink: 'https://replicate.com/account/api-tokens',
    needsKey: true,
    model: 'stability-ai/sdxl',
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

async function generateWithStabilityAI(prompt, apiKey) {
  const engineId = 'stable-diffusion-xl-1024-v1-0';
  const url = `https://api.stability.ai/v1/generate/${engineId}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt, weight: 1 }],
      cfg_scale: 7,
      height: 576,
      width: 1024,
      samples: 1,
      steps: 30,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Stability AI error (${res.status})`);
  if (data.artifacts?.[0]?.base64) {
    return `data:image/png;base64,${data.artifacts[0].base64}`;
  }
  throw new Error('No image generated');
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

async function generateWithReplicate(prompt, apiKey) {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      version: 'a1c99cb771e0730651f53b2b8092582890123d2249a6ba63b142512ea9a3649c',
      input: {
        prompt,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        width: 1024,
        height: 576,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail?.[0]?.msg || `Replicate error (${res.status})`);

  const predictionId = data.id;

  for (let i = 0; i < 60; i++) {
    const checkRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const checkData = await checkRes.json();

    if (checkData.status === 'succeeded') {
      if (checkData.output?.[0]) return checkData.output[0];
      throw new Error('No image in response');
    }
    if (checkData.status === 'failed') throw new Error('Image generation failed');

    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Image generation timed out');
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
    case 'stability': return generateWithStabilityAI(prompt, apiKey);
    case 'openai-images': return generateWithDALLE(prompt, apiKey);
    case 'replicate': return generateWithReplicate(prompt, apiKey);
    default: throw new Error('Unknown image provider.');
  }
}

// =========================================
// UI: Output rendering
// =========================================
function renderOutput(text) {
  const clean = text.trim();
  state.lastPost = clean;
  document.getElementById('editablePost').value = clean;
  updatePreview(clean);
  setHidden(document.getElementById('outputCard'), false);
  setHidden(document.getElementById('manualCard'), true);

  // Always show the image section once a post is generated
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

  // Highlight active image provider card
  document.querySelectorAll('[data-image-provider]').forEach(c => {
    c.classList.toggle('active', c.dataset.imageProvider === imgProvider);
  });

  // API key section
  const imgKeySect = document.getElementById('imageKeySection');
  if (imgCfg.needsKey && imgProvider !== 'none') {
    setHidden(imgKeySect, false);
    document.getElementById('imageKeyLabel').textContent = imgCfg.keyLabel;
    const keyInput = document.getElementById('imageKeyInput');
    keyInput.placeholder = imgCfg.keyPlaceholder;
    keyInput.value = state.imageKeys[imgProvider] || '';

    const link = document.getElementById('imageApiLink');
    link.href = imgCfg.apiLink;

    const ks = document.getElementById('imageKeyStatus');
    if (state.imageKeys[imgProvider]) {
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
  refreshImageSettingsUI();

  // Restore model if saved
  const cfg = PROVIDERS[state.provider];
  if (cfg) state.model = cfg.defaultModel;
}

document.addEventListener('DOMContentLoaded', init);
