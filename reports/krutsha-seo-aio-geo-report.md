# Krutsha (krutsha.app): SEO, AIO and GEO Report

**Prepared:** 26 September 2026  |  **Site:** https://krutsha.app/  |  **Frameworks used:** Technical SEO Audit, 3 Ranking Laws Auditor, Content Brief and Draft, Data PR and Outreach

**Terms used in this report**
- **SEO** is classic search: getting krutsha.app ranked in Google's blue links.
- **AIO** is AI Overviews: the AI summaries Google now shows above the results.
- **GEO** (Generative Engine Optimisation) is getting cited and recommended by ChatGPT, Gemini, Perplexity, Claude and similar AI assistants.

---

## Read this first: how this report was built

**The site itself could not be crawled from the audit environment.** The network policy on the machine running this audit blocked krutsha.app (and ireava.com). So this report was built from **what Google and other sources can see about Krutsha from the outside**: live search results, Google's indexed title for the site, third-party pages, and the parent company's public footprint.

That outside view happens to be exactly what matters for AIO and GEO. AI engines build their picture of a brand from the open web, not from your CMS. But it means:

- Every **technical SEO** finding below is based on search index evidence, not a crawl. The full technical audit needs a crawl export (see Section 2).
- Anything I could not verify is marked **[NOT VERIFIED]**, and I have not invented any figures.

**What the open web currently says Krutsha is** (from search results):
- Google-indexed title: **"Krutsha | AI Powered Self Study Partner"**
- Described as a 24/7 AI study partner that runs **on WhatsApp**, aligned to the **CBSE curriculum**, with a `/notes` command for structured topic notes, quizzes, and "AI Insights" for spotting weak areas.
- Appears to be a product of **Ireava** (an Indian school ERP company), which lists "Krutsha AI" among its offerings and has a blog post about Krutsha: "The 11 PM Homework Panic: Why Indian Students Get..." on ireava.com.

---

## 1. Executive summary

| Area | Verdict | One-line reason |
|---|---|---|
| Indexing | **Mostly clean, but thin** | Homepage is indexed. A `site:krutsha.app` search surfaces only the homepage, so Google appears to know of one page. |
| Brand search (SEO) | **Critical** | Searching "Krutsha app" returns Krutrim / Kruti (Ola's AI assistant) and Krushi farmer apps above or around Krutsha. The brand does not own its own name yet. |
| Topic search (SEO) | **Critical** | Krutsha does not appear for the searches its buyers make ("CBSE doubt solving AI", "AI homework help WhatsApp", "best AI study app CBSE"). Competitors like YoLearn.ai, DoubtSolver.ai, CBSEDoubts, Doubttify and TeachBetter.ai hold those spots. |
| AIO (AI Overviews) | **Not present** | No evidence of Krutsha in AI summaries for category searches. AI Overviews pull from pages that already rank, so this follows the SEO gap. |
| GEO (AI assistants) | **Weak entity** | Only two sources describe Krutsha (its own homepage and one Ireava blog post). No app store listing, no reviews, no "best apps" roundups, no social profile found. AI engines had to guess, and one search engine's AI confused it with Krutrim and Kruti. |
| Entity / NAP consistency | **Needs work** | Parent company Ireava shows a Kochi, Kerala registered address, a Rajkot, Gujarat Justdial listing and a Coimbatore landing page. Krutsha's own legal owner and contact details are not visible anywhere I could find. |
| Unique positioning | **Strong, and under-used** | "CBSE homework help inside WhatsApp, no app to download" is a real differentiator. Almost none of the competitors ranking lead with it. |

**Bottom line:** Krutsha has a genuinely differentiated product and almost no web footprint. The fastest wins are (1) turn the one-page site into a small, focused set of pages built around what CBSE parents and students actually search, (2) make it unmistakable to Google and AI engines who Krutsha is and who owns it, and (3) use Krutsha's own usage data (the "11 PM homework panic" is the story) to earn press coverage and mentions.

---

## 2. Technical SEO audit (search-index view)

> **What this could and could not do.** A proper technical audit reads a crawl of the site (every URL, status code, title, canonical, redirect). This environment could not reach krutsha.app, so no crawl was run. What follows is what can be seen from Google's index. **A clean section here does not mean a clean site.** Nobody has yet checked mobile layout, pop-ups, WhatsApp button behaviour on iPhone and Android, or page speed in a browser.

### Health snapshot

| Check | Result |
|---|---|
| Homepage indexed | Yes |
| Pages Google appears to know about | 1 (homepage only surfaced in `site:` search) |
| Redirect chains / loops | Not checked (needs crawl) |
| Duplicate titles / metas | Not checked (needs crawl) |
| Indexing blocks (noindex, canonicals, robots.txt) | Not checked (needs crawl) |
| Broken internal links | Not checked (needs crawl) |
| Orphan pages | Not checked (needs crawl plus sitemap) |
| **Overall verdict** | **Needs work** (the main issue is how little there is to index, not errors) |

### Findings from the index

1. **One indexed page is a structural ceiling (High).** A single homepage can only rank for a handful of phrases. Competitors ranking for CBSE AI help have dozens of pages: class-by-class, subject-by-subject, "how it works", pricing, FAQs, comparison posts. Google cannot rank a page that does not exist.
2. **The title tag spends its words on the brand, not the search (High).** "Krutsha | AI Powered Self Study Partner" leads with a name nobody searches yet, and "self study partner" is not a phrase CBSE parents type. Suggested homepage title: **"CBSE Homework Help on WhatsApp, 24/7 AI Study Partner | Krutsha"**.
3. **Likely JavaScript-built site [NOT VERIFIED].** Many `.app` launch sites are built with React/Next/Framer. If krutsha.app renders content with JavaScript, Google sees less than a visitor does, and several AI crawlers (which often do not run JavaScript) may see almost nothing. Check this first (instructions below).
4. **No `llms.txt`, schema or sitemap could be confirmed [NOT VERIFIED].** These need checking once the site can be reached.

### To complete the technical audit

Run Screaming Frog (free up to 500 URLs) on https://krutsha.app/ **twice**: once with JavaScript rendering off and once with it on (Configuration > Spider > Rendering > JavaScript). Export `internal_all.csv` from both, plus the XML sitemap and a Google Search Console "Pages" export. Compare word counts between the two crawls: if the "off" crawl shows near-zero words, the site needs server-side rendering or pre-rendering for AI visibility.

Also check directly in a browser:
- `https://krutsha.app/robots.txt`: make sure it does not block `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` or `Googlebot` (unless that is a deliberate choice).
- `https://krutsha.app/sitemap.xml` exists and is submitted in Search Console.
- View source (Ctrl+U) on the homepage: is the headline and feature copy in the raw HTML?
- Mobile: does the "Chat on WhatsApp" button open WhatsApp correctly on iPhone and Android? This is the conversion moment and no crawler can test it.

---

## 3. Google's 3 Ranking Laws audit

The 3 Ranking Laws come from Google's own patents and the May 2024 Google Search API leak. They cover how Google measures **people** (clicks and brand identity), **content** (focus and originality) and **site** (domain-level authority). Normally one mode runs per pass. Because this is a full-picture report, all four are summarised here, starting with the most urgent. Each needs your own inputs to be completed properly; those are listed.

### 3.1 AUDIT: NAP and Entity Consistency (Law 1: How Google measures people)

WHAT I CHECKED: public listings for Krutsha and its apparent parent, Ireava, found through search. NAP means Name, Address, Phone. Google uses it to confirm that every mention of a business refers to the same entity.

FINDINGS

1. **The brand name collides with bigger entities.** "Krutsha" sits one or two letters away from **Krutrim / Kruti** (Ola's well-funded AI assistant) and several **Krushi** farming apps. In search, one AI summary even attributed Krutrim's details to a "Krutsha" query. For a new brand this is the single biggest identity risk: Google and AI engines need extra signals to separate you.
2. **The owner of Krutsha is not stated anywhere I could find.** The link to Ireava only shows up through Ireava's own pages. If krutsha.app does not say "Krutsha is built by Ireava Services LLP", engines cannot inherit Ireava's existing trust (125+ institutions) and cannot confirm who is behind a product aimed at children. That matters for trust.
3. **Parent company NAP is inconsistent across the web:**

| Source | What it shows |
|---|---|
| Company registry (IndiaFilings / Tracxn) | Ireava Services LLP (LLP AAM-5123), registered office 33/217 A, M K K Nair Road, Palarivattom, Kochi, Ernakulam, Kerala 682025 |
| Justdial | "Ireava Services", Yagnik Road / University Road, Rajkot, Gujarat |
| ireava.com | "Ireava"; a landing page targets Coimbatore |
| Third-party contact listing | Phone +91-7015097673, business@ireava.com |
| Similar-name listing (dial4trade) | "Ireva Technologies" (different spelling) |

Name variants found: *Ireava*, *Ireava Services*, *Ireava Services LLP*, *Ireava Technologies*, *Ireva Technologies*. Two different cities are listed as addresses. [NOT VERIFIED: which address is current; please confirm.]

THE FIX THIS WEEK (smallest effort first)
1. Add a footer line to krutsha.app: **"Krutsha is a product of Ireava Services LLP"** with the confirmed canonical address, phone and a support email, plus links to the privacy policy and terms.
2. Pick one canonical NAP block and use it everywhere:
   ```
   Ireava Services LLP
   [Confirmed street address]
   [City], [State] [PIN], India
   +91 [confirmed number]
   [support@krutsha.app or equivalent]
   ```
3. Fix or claim the Justdial listing and ask dial4trade to correct "Ireva".
4. Add `Organization` schema on krutsha.app with `parentOrganization` set to Ireava, and `sameAs` links to every official profile (see GEO section).
5. Create a Krutsha page on ireava.com (product page, not just a blog post) that links to krutsha.app, and link back from krutsha.app.

Expected movement: 2 to 12 weeks for entity signals to settle.

**Input needed to finish this audit:** paste the exact NAP from your website footer, Google Business Profile, and 3 directory listings.

### 3.2 AUDIT: First 100 Words Promise Check (Law 1)

NavBoost (May 2024 API leak; Google Patent US 8,595,225) tracks what happens after the click. A searcher who stays counts as a good click. A searcher who bounces back to Google counts against you.

WHAT I CHECKED: only the indexed title, since the page body could not be read.

- **What the title promises:** an AI-powered study partner for self-study.
- **What a CBSE parent or student searching at 11 PM wants in the first screen:** "Can this answer my child's homework question, right now, for my class and board, and how do I start?"
- **Likely gap [NOT VERIFIED]:** if the first 100 words lead with "AI-powered" or "self-study partner" language instead of "Message a question on WhatsApp, get a CBSE-style answer in seconds", visitors from search will bounce.

**Suggested first 100 words (to test against your current copy):**

> **CBSE homework help, right inside WhatsApp.** Stuck on a question at 11 PM? Send it to Krutsha on WhatsApp and get a clear, step-by-step answer written the way CBSE examiners expect. No app to download, no login, no waiting for a tutor. Type `/notes` for a full chapter summary, or ask for a quiz to check you have really understood it. Krutsha then shows you which topics you are weakest in, so revision time goes where it counts. Built for Classes [X to Y] by Ireava, the school software team trusted by 125+ institutions.
>
> **[Chat with Krutsha on WhatsApp]**

(Replace [X to Y] with the actual classes covered. Confirm the 125+ figure is current before publishing.)

**Input needed:** paste your title, meta description and the first 200 words from the homepage for a scored audit.

### 3.3 AUDIT: Topical Focus and Information Gain (Law 2: How Google measures content)

`siteFocusScore` (May 2024 leak) scores how tightly a site's pages cluster around its core topic. Information Gain (Google Patent US 11,354,342) rewards pages that add something new beyond what the searcher has already seen.

FINDINGS
1. **Focus is not the problem; volume is.** With one page, Krutsha is perfectly on-topic but has almost nothing for Google to measure focus on.
2. **The only long-form content about Krutsha lives on ireava.com**, a school ERP site. That page builds Ireava's topic (school management), not Krutsha's (student study help). Topical authority is being split across two domains.
3. **Competitor content is mostly generic.** The ranking pages for "CBSE doubt solving AI" are listicles and feature pages saying the same thing. That is an opening: Krutsha has something none of them publish, which is real data on when, what and how CBSE students ask for help.

30-DAY CONTENT PLAN (Krutsha domain)

| Priority | Page | Purpose |
|---|---|---|
| 1 | Homepage (rewrite title, H1, first 100 words) | Win "CBSE homework help WhatsApp" |
| 2 | /how-it-works | Show the WhatsApp flow with real screenshots (strong Information Gain) |
| 3 | /cbse-homework-help-whatsapp (brief and draft in Section 5) | Main commercial landing page |
| 4 | /class-10, /class-12 (then other classes) | Match class-specific searches; board exam years first |
| 5 | /for-parents | Safety, privacy, how it helps without doing homework for them |
| 6 | /faq | Feeds AI Overviews and assistants direct answers |
| 7 | /krutsha-vs-chatgpt | Captures comparison searches; honest take on CBSE-specific answers vs a general chatbot |
| 8 | /research/11pm-homework-panic | Data study (Section 6) |

Move or canonicalise the Krutsha blog post from ireava.com to krutsha.app, or keep it and add a clear link across.

Expected movement: 8 to 16 weeks.

**Input needed:** your one-sentence niche and the list of any pages already live, so each can be scored.

### 3.4 AUDIT: Domain Authority Compounding Plan (Law 3: How Google measures your site)

The May 2024 leak shows a site-wide quality modifier (alongside `siteAuthority`) that lifts every page on a trusted domain at once. A new `.app` domain starts with very little. Authority comes from other credible sites mentioning and linking to you.

**Five original research ideas using data Krutsha already has** (these are questions to test, not findings):
1. **The 11 PM Homework Panic Index:** what share of questions arrive between 9 PM and midnight, and does that change during board-exam season?
2. **The subjects Indian students secretly struggle with:** which CBSE subject and chapter gets the most questions, by class.
3. **Sunday-night surge:** do questions spike on the night before school?
4. **The `/notes` revision curve:** how far ahead of exams students start asking for chapter notes (days before the first board paper).
5. **Weak-spot map:** from quiz results, the five CBSE topics with the lowest first-attempt scores.

**Three highest-leverage PR angles:**
1. Board-exam season (February to March): "When Class 10 and 12 students actually study" stories.
2. Parenting and screen-time angle: "Students are learning at midnight on WhatsApp. What should parents do?"
3. EdTech-after-the-boom angle: a lean, WhatsApp-first model vs heavy app-based EdTech.

**Linkable asset structure:** one permanent research hub on krutsha.app (`/research`) with a yearly-updated "State of CBSE Self-Study" report, downloadable charts, an embeddable graphic, and a methodology note. Each new data cut becomes a fresh pitch pointing back to the same hub, so links compound on one URL instead of scattering.

**90-day roadmap:**
- Days 1 to 30: pull the data (Section 6), publish the research hub, fix NAP and entity basics.
- Days 31 to 60: pitch education desks and EdTech trade outlets (see publication types in Section 6), submit to "best AI apps for Indian students" roundups (the SyncStudy, Medium and YoLearn style lists currently ranking), and get parents' and teachers' reviews.
- Days 61 to 90: second data cut timed to pre-board revision season, school partnerships through Ireava's existing 125+ institutions (each school website mention is a trusted, relevant link).

Expected movement: 12 to 26 weeks.

**Input needed:** 2 to 3 internal data points you can actually export (for example, message timestamps, subject tags, quiz scores), and confirmation of what is allowed under your privacy policy.

---

## 4. AIO and GEO: getting into AI Overviews and AI assistants

AI Overviews and assistants like ChatGPT, Gemini, Perplexity and Claude answer questions such as "best AI app for CBSE homework" by summarising sources they trust. To be named, Krutsha needs to be (a) easy for machines to read, (b) described consistently in several independent places, and (c) the clearest answer to specific questions.

### Current AI visibility (from search tests)

| Query tested | Krutsha present? | Who is |
|---|---|---|
| "Krutsha app" | Homepage appears, but engines mixed in Krutrim/Kruti and Krushi apps | Krutrim, Kruti, Krushi |
| "AI doubt solving on WhatsApp for CBSE students" | No | YoLearn.ai, CBSEDoubts, Doubttify, DoubtSolver.ai, Doubtnut, Edudrona |
| "best AI study partner app for CBSE students on WhatsApp 2026" | No | CBSE AI Buddy, TeachBetter.ai, DoubtSolver.ai, ChatGPT Study Mode, Quizlet |
| Krutsha on Google Play / App Store | No listing found | n/a (WhatsApp-only is likely deliberate, but it removes a major trust source) |

Notable: the AI summary for the "best... on WhatsApp" query said none of the listed apps clearly offered WhatsApp. **That is the gap Krutsha fills, and nobody is claiming it.**

### GEO action plan

**A. Make the site machine-readable (week 1 to 2)**
- Make sure all key copy is in the raw HTML (server-rendered), not built only by JavaScript.
- Allow AI crawlers in `robots.txt` (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`).
- Publish `/llms.txt`: a short plain-text summary of what Krutsha is, who it is for, the boards and classes covered, how to start, pricing, and links to key pages.
- Add schema (structured data):
  - `Organization` (Krutsha, `parentOrganization`: Ireava Services LLP, logo, `sameAs` profiles)
  - `SoftwareApplication` (`applicationCategory`: EducationalApplication, `operatingSystem`: WhatsApp, offers/price, `audience`: CBSE students)
  - `FAQPage` on the FAQ page
  - `HowTo` on /how-it-works

**B. Write one consistent "entity sentence" and repeat it everywhere**
> "Krutsha is a 24/7 AI study partner on WhatsApp for CBSE students, built by Ireava. Students message a question and get exam-style answers, chapter notes with /notes, quizzes and weak-topic insights."

Use it word for word on the homepage, ireava.com, LinkedIn, Instagram, YouTube, Crunchbase/Tracxn, any directory, and press releases. AI engines trust facts they see repeated across independent sources.

**C. Answer-first pages built for AI extraction**
- Each page opens with a 40 to 60 word direct answer, then detail.
- Question-style H2s that match what people ask assistants: "Is there a CBSE homework helper on WhatsApp?", "Is Krutsha free?", "Does Krutsha just give answers or help students learn?", "Is Krutsha safe for my child?", "Krutsha vs ChatGPT for CBSE".
- Tables AI can lift: classes and subjects covered, features vs alternatives, pricing.

**D. Get cited by the sources AI engines already trust**
- Pitch the "best AI apps for Indian students 2026" roundups currently ranking (SyncStudy, Medium's "15 Free AI Tools Every Indian Student Should Know", YoLearn's guide, Arihant Academy's list, TeachBetter's list). One mention in each is worth more to GEO than ten new pages of your own.
- Create profiles: LinkedIn company page, YouTube (short WhatsApp demo videos), Instagram, Crunchbase, Product Hunt, and education directories. Link them all via `sameAs`.
- Get genuine reviews from parents and teachers (Google Business Profile for Ireava, and quotes on the site with permission).
- Consider a Google Play "lite" listing or a WhatsApp Business verified profile: both are strong third-party proofs of existence.

**E. Separate from Krutrim/Kruti**
- Always pair the name with the category: "Krutsha, the CBSE study partner on WhatsApp".
- Add a pronunciation/meaning line on the About page ("Krutsha means... ").
- Use the same logo and description across every profile so engines cluster them correctly.

**F. Measure monthly**
Ask ChatGPT, Gemini, Perplexity and Google (AI Mode) the same 10 questions each month (for example "best AI homework help on WhatsApp for CBSE") and log whether Krutsha is named, cited, or linked. Track brand search volume and WhatsApp chats started from search in Search Console and analytics.

---

## 5. Content brief and first draft: "CBSE homework help on WhatsApp"

**Business:** Krutsha (by Ireava), AI study partner on WhatsApp  |  **Audience:** CBSE students (and their parents) who get stuck on homework outside school hours  |  **Target length:** 900 to 1,300 words  |  **Suggested URL:** /cbse-homework-help-whatsapp

### Search intent
The searcher is stuck right now, or a parent is looking for a trustworthy way to get their child unstuck without paying for a tutor. They want to know if it works for their class and subject, whether it is safe and honest (not just copying answers), what it costs, and how to start in under a minute. The intent is **ready to try**, with some comparison.

This brief is based on a live look at the pages currently ranking for related searches (YoLearn.ai, DoubtSolver.ai, CBSEDoubts, Doubttify, TeachBetter.ai and "best AI apps for students" roundups), not on a crawl of krutsha.app.

### Page structure
- **H1:** CBSE Homework Help on WhatsApp, Any Time You Get Stuck
- H2: How it works in 30 seconds
- H2: Answers written the way CBSE examiners mark
- H2: More than answers: notes, quizzes and your weak spots
  - H3: `/notes` for full chapter summaries
  - H3: Quick quizzes to check you have really got it
  - H3: AI Insights: see which topics need work
- H2: Which classes and subjects are covered
- H2: For parents: is it safe, and does it help or just hand out answers?
- H2: Krutsha vs searching Google or asking ChatGPT
- H2: What it costs
- H2: Frequently asked questions
- CTA: Start on WhatsApp

### Entities to cover
CBSE, NCERT textbooks and exemplar, Class 10 and Class 12 board exams, marking scheme, sample papers, previous-year questions, step-by-step working, subjects (Maths, Science, Physics, Chemistry, Biology, Social Science, English), WhatsApp, `/notes`, quizzes, AI Insights, weak topics, revision, doubt solving, parents, data privacy, Ireava.

### Internal links to add
1. **/how-it-works:** readers who want the full walkthrough with screenshots.
2. **/for-parents:** the safety and learning questions parents raise before saying yes.
3. **/class-10** and **/class-12:** board-year students want to see their class covered specifically.
4. **/research/11pm-homework-panic:** proof that late-night stuck moments are common, and a link magnet.
5. **/pricing** (or the pricing section on the homepage).

### Where your expertise matters most
1. "Answers written the way CBSE examiners mark": only you know how Krutsha was trained or tuned for CBSE answer style.
2. "For parents": your approach to learning vs copying, and your privacy practice.
3. "Krutsha vs ChatGPT": the real examples where a general chatbot gets a CBSE answer wrong or in the wrong format.

---

### First draft

# CBSE Homework Help on WhatsApp, Any Time You Get Stuck

It is late, the chapter made sense in class, and now question 7 does not. Your teacher is offline, tuition is two days away, and scrolling through search results is eating your evening.

Krutsha fixes that from the app you already have open. Send your question to Krutsha on WhatsApp and get a clear, step-by-step answer written for the CBSE syllabus, in seconds. No new app, no login, no waiting.

**[Start on WhatsApp]**

## How it works in 30 seconds

1. Save the Krutsha number, or tap "Start on WhatsApp" on this page.
2. Type your question, or send a photo of it.
3. Get the answer with the working shown, in the format your exam expects.
4. Not clear? Reply "explain simpler" or ask a follow-up, just like messaging a friend who happens to be very good at Chemistry.

> **[EXPERTISE GAP: Does Krutsha accept photos of questions, voice notes, or Hindi/regional-language questions today? List exactly what input types work so this section is accurate.]**

## Answers written the way CBSE examiners mark

A correct answer and a full-marks answer are not always the same thing. CBSE marking schemes reward the right steps, the right keywords and the right structure. A general search result will often give you the answer from a different syllabus or skip the working.

Krutsha is built around the CBSE curriculum and NCERT textbooks, so answers follow the structure that scores: definition first where it is expected, each step of working shown, units and diagrams mentioned where marks depend on them.

> **[EXPERTISE GAP: How exactly is Krutsha aligned to CBSE? For example, was it tuned on NCERT content, reviewed by CBSE teachers, or checked against previous-year marking schemes? Give one concrete example of a question where Krutsha's answer follows the marking scheme and a typical web answer does not.]**

## More than answers: notes, quizzes and your weak spots

Getting unstuck tonight is the first job. Not getting stuck on the same thing in the exam is the real one.

### `/notes` for full chapter summaries
Type `/notes` followed by a topic and Krutsha sends a structured summary of the whole topic: key definitions, formulas, and the points that usually carry marks. Useful the night before a unit test.

### Quick quizzes to check you have really got it
Ask for a quiz on any chapter. A few questions in, you will know whether you understand it or have just memorised it.

### AI Insights: see which topics need work
As you use Krutsha, it builds a picture of where you are strong and where you keep slipping, so revision time goes to the chapters that need it.

## Which classes and subjects are covered

> **[EXPERTISE GAP: Which classes (for example Class 6 to 12) and which subjects are supported today, and which are coming next? Add them as a simple table. Be honest about any subject where Krutsha is weaker, parents trust that.]**

## For parents: is it safe, and does it help or just hand out answers?

Every parent asks this, and they should.

Krutsha runs inside WhatsApp, so there is no new app, no ads, and no social feed to get distracted by. It is built by Ireava, the team behind school management software used by institutions across India.

On learning: Krutsha shows the working, explains the concept behind the step, and can quiz your child afterwards. The aim is that the next similar question gets solved without help.

> **[EXPERTISE GAP: What does Krutsha do if a student simply pastes a whole homework sheet and asks for all the answers? Describe your actual approach to learning vs copying, and what data you store, for how long, and who can see it.]**

## Krutsha vs searching Google or asking ChatGPT

| | Searching the web | General AI chatbot | Krutsha |
|---|---|---|---|
| Where it lives | Browser | Separate app or website | WhatsApp |
| Syllabus fit | Mixed boards and levels | General, depends on the prompt | CBSE-focused |
| Chapter notes on demand | Hunt for them | Possible with the right prompt | `/notes` |
| Tracks your weak topics | No | No | AI Insights |

> **[EXPERTISE GAP: Share one real (anonymised) example where a student asked the same question to a general chatbot and to Krutsha, and what was different about the answer.]**

## What it costs

> **[EXPERTISE GAP: Is Krutsha free, freemium or paid? State the exact price, what the free tier includes, and whether schools can buy it for students through Ireava.]**

## Frequently asked questions

**Do I need to download an app?**
No. Krutsha works inside WhatsApp.

**Is it available at night and on weekends?**
Yes. Krutsha is available 24/7.

**Does it work for board exam revision?**
Yes. Use `/notes` for chapter summaries and ask for quizzes to test yourself, then check AI Insights to see which topics to revise first.

**Who makes Krutsha?**
Krutsha is built by Ireava, an Indian education technology company that makes school management software.

**[Start on WhatsApp]**

---

### Self-interview questions (record the answers on your phone, paste the transcript back)

You do not need to be a good writer. You need to be good at your job. Talk; the writing gets handled.

1. Tell me about the moment you decided Krutsha had to live on WhatsApp instead of being an app. *(Feeds: intro, "How it works")*
2. What do students get wrong most often when they use a general chatbot for CBSE homework? *(Feeds: "Krutsha vs ChatGPT")*
3. Walk me through how you made answers match CBSE marking. What did you test, and what failed first? *(Feeds: "Answers written the way CBSE examiners mark")*
4. What is the most common question a parent asks you before letting their child use Krutsha, and what do you tell them? *(Feeds: "For parents")*
5. What is one thing you noticed in the usage that surprised you: a time of day, a subject, a class? *(Feeds: intro and the research page)*
6. Tell me about one student or school whose results or habits changed after using Krutsha. *(Feeds: "For parents" and social proof)*
7. What will Krutsha deliberately not do, and why? *(Feeds: "For parents")*

If you paste your transcript or written answers back, they can be woven into the draft in your voice and the matching gaps removed.

### Information gain checklist (add at least two before publishing)
- [ ] A real screenshot of a WhatsApp conversation with Krutsha (anonymised) showing a CBSE-style answer
- [ ] One internal data point, for example the share of questions sent after 9 PM
- [ ] A side-by-side example: Krutsha's answer vs a general chatbot's answer to the same NCERT question
- [ ] A short quote from a CBSE teacher or school (via Ireava's partner schools) on how students use it
- [ ] Something you tried that did not work (for example an early feature students ignored) and what you changed

---

## 6. Data PR and outreach plan

> **No data was provided, so there are no numbers in this section.** Every angle below is a question to test, with the exact data cut to pull. Nothing here should be pitched until the numbers are real.

### Newsworthy angles to test

| # | Working headline (once proven) | Data cut to pull | Strength (now) |
|---|---|---|---|
| 1 | "[X]% of CBSE homework questions sent to Krutsha arrive after 9 PM" | Message timestamps (IST), by hour, by class, date range, total messages | Needs data |
| 2 | "Maths isn't the hardest subject: [Subject] tops Krutsha students' late-night questions" | Question subject tags, by class | Needs data |
| 3 | "Questions spike [X]% on Sunday nights" | Messages by weekday | Needs data |
| 4 | "Class 10 students start board revision [X] days before the first paper" | `/notes` requests by date vs 2026 board timetable | Needs data |
| 5 | "The 5 CBSE topics students get wrong first time" | Quiz first-attempt scores by topic, with minimum sample per topic | Needs data |

When reporting any of these, always say whose data it is: "Krutsha users" not "Indian students", with the date range and sample size.

### The story to lead with
**#1, the "11 PM Homework Panic".** You already have the phrase (it is the Ireava blog title), it is visual, it hits parents and education desks, and it can be refreshed every exam season.

### Study concept
- **Working title:** The 11 PM Homework Panic: When CBSE Students Really Study (Krutsha Self-Study Report 2026)
- **Summary:** An analysis of [N] anonymised homework questions sent to Krutsha by CBSE students between [dates], showing when students get stuck, which subjects cause it, and how that shifts in the run-up to board exams.
- **Key stat:** share of questions sent after 9 PM [to be calculated].
- **Why readers care:** parents learn when their child actually needs help; schools learn where the syllabus causes the most trouble.
- **Methodology note:** [N] questions from [N] Krutsha users, Classes [X to Y], [date range], timestamps in IST, subjects tagged by [method].
- **Would be stronger with:** a parent survey (for example 500 parents on who helps with homework at night), and a CBSE teacher's commentary.

### Campaign angles to brainstorm from
1. The midnight study map of India (by state, if the data allows and groups stay large enough to be anonymous)
2. "Board exam countdown": how question volume climbs week by week
3. Which chapter causes the most panic in each class
4. Science vs Maths: the real hardest subject
5. Do students study more on WhatsApp than on EdTech apps?
6. The Sunday-night scramble
7. What students ask that textbooks do not explain (most repeated "why" questions)
8. Festival season dip: Diwali week study patterns
9. Parents' guide: the three hours when your child needs help most
10. Teachers' take: the topics to re-teach, based on student questions
11. One year of Krutsha: numbers from the first [N] questions
12. The rise of "study on chat": WhatsApp-first learning in India

### Outreach framework (journalists not yet named)
No journalist names have been invented. Target publication types:
- **Trade:** EdTech and education business outlets (for example Inc42, YourStory, EdexLive, The Economic Times Education section)
- **National:** education desks at major English and Hindi dailies
- **Local / niche:** Kerala and South India city editions (Ireava's home base), parenting sites and school newsletters

**Email skeleton (not ready to send until slots are filled with checked names and articles):**

> **Subject:** [X]% of CBSE homework questions arrive after 9 PM
>
> Hi [JOURNALIST NAME],
>
> Your piece on [THEIR RECENT ARTICLE AND WHAT IT WAS ABOUT] stuck with me, particularly [SPECIFIC POINT].
>
> We looked at [N] homework questions CBSE students sent our WhatsApp study assistant, Krutsha, between [dates]. [X]% arrived after 9 PM, and [SUBJECT] drove the most late-night questions, not Maths. [WHY THIS DATA CONNECTS TO THEIR ARTICLE.]
>
> Happy to share the full dataset, charts, and a quote from [SPOKESPERSON, TITLE].
>
> [Name]
> Krutsha, by Ireava

**Research checklist:** search each outlet for "CBSE", "board exams", "EdTech" in the last 90 days; note the byline; read the article; confirm the journalist still writes for that outlet (LinkedIn or X profile); log in a sheet with the one specific point you will reference.

### Follow-up email (under 50 words)
> Hi [NAME], quick nudge on this: [X]% of CBSE homework questions reach us after 9 PM, with [SUBJECT] leading. Board exams are [N] weeks away, so the timing may suit. Full data and charts ready if useful. [Name]

### Data story one-pager (template)
- **Headline:** [X]% of CBSE homework questions sent to Krutsha arrive after 9 PM
- **Supporting stats:** peak hour [ ]; top late-night subject [ ]; Sunday vs weekday uplift [ ]; revision starts [ ] days before boards
- **Methodology:** as above
- **Quotable line:** "Students are not studying less, they are studying later, and they are doing it on WhatsApp."

Use aggregated, de-identified figures only. Check your privacy policy and WhatsApp Business terms allow this use, and make sure no child can be identified, especially in small groups (one school, one town).

### What this could not do for you
- **The weird, brilliant angle.** This gives you strong, logical stories. The strange, culture-catching idea that makes a campaign fly still needs a human.
- **The relationship.** A great cold email helps. A journalist who already knows and trusts you helps far more. That part is on you.

---

## 7. Prioritised 30 / 60 / 90 day action list

| # | Action | Area | Severity | Impact | Effort |
|---|---|---|---|---|---|
| 1 | Rewrite homepage title, H1 and first 100 words around "CBSE homework help on WhatsApp" | SEO / Law 1 | Critical | High | Easy |
| 2 | Add "A product of Ireava Services LLP" + canonical NAP + Organization and SoftwareApplication schema | Entity / GEO | Critical | High | Easy |
| 3 | Confirm robots.txt allows search and AI crawlers, add sitemap.xml and llms.txt, check content is in raw HTML | Technical / GEO | High | High | Easy to Medium |
| 4 | Run the two Screaming Frog crawls (JS on and off) and share the exports to complete the technical audit | Technical | High | Medium | Easy |
| 5 | Build pages: /cbse-homework-help-whatsapp, /how-it-works, /for-parents, /faq, /class-10, /class-12 | SEO / AIO | High | High | Medium |
| 6 | Create and cross-link profiles (LinkedIn, YouTube, Instagram, Crunchbase, Product Hunt) with the same entity sentence | GEO | High | Medium | Easy |
| 7 | Pitch the "best AI apps for Indian students" roundups currently ranking | GEO / Authority | High | High | Medium |
| 8 | Clean up Ireava NAP across Justdial, dial4trade, registry listings | Law 1 | Medium | Medium | Easy |
| 9 | Pull usage data and publish the "11 PM Homework Panic" study, then pitch | Law 3 / PR | Medium | High | Hard |
| 10 | Monthly AI visibility log (10 prompts across 4 engines) | GEO | Medium | Medium | Easy |

**Days 1 to 30:** actions 1 to 4, 6, 8. **Days 31 to 60:** actions 5, 7, 10. **Days 61 to 90:** action 9, timed before CBSE pre-board season.

---

## 8. What this report could not check

- **The live site.** No crawl, no page source, no robots.txt, sitemap, schema or llms.txt check, because krutsha.app was blocked from the audit environment. All on-page findings are marked [NOT VERIFIED].
- **The visual layer.** Mobile layout, pop-ups, the WhatsApp button on real phones, page speed, images. A human needs to test the top pages in a browser on iPhone and Android.
- **Search Console and analytics.** No impressions, clicks or traffic data. No traffic or ranking gains are forecast here because the data does not support a number.
- **Real usage data.** All PR numbers are placeholders until the data is pulled.

## 9. What is working well

- **The homepage is indexed** and Google shows a clear brand title, so the foundation is there.
- **A genuinely differentiated product.** CBSE-aligned help inside WhatsApp, with `/notes`, quizzes and weak-topic insights, is a clearer promise than most competitors ranking today, and the "best apps" AI summaries note that WhatsApp support is missing from the others.
- **A credible parent company.** Ireava's existing school relationships are a ready-made source of trusted mentions, reviews and links.
- **A ready-made story.** "The 11 PM Homework Panic" is already written and is a strong hook for press and for AI engines.

## 10. Bottom line

**Tell Google and AI engines exactly who Krutsha is, who is behind it and what it does ("CBSE homework help on WhatsApp, by Ireava"), consistently across a handful of focused pages and independent sources.** That single fix unlocks brand search, AI Overview eligibility and AI assistant recommendations at the same time.

---

### Sources consulted
- [Krutsha | AI Powered Self Study Partner (krutsha.app, Google index listing)](https://krutsha.app/)
- [Ireava blog: The 11 PM Homework Panic](https://www.ireava.com/blog/homework-panic-solution/)
- [Ireava homepage](https://www.ireava.com/) and [contact page](https://www.ireava.com/contact)
- [Ireava Services LLP: IndiaFilings](https://www.indiafilings.com/search/ireava-services-llp-AAM-5123), [Tracxn](https://tracxn.com/d/legal-entities/india/ireava-services-llp/__A70RgBZPjU74ETBi9xFWsInANZEFOmFYomUeMMdWfMY), [Justdial Rajkot](https://www.justdial.com/Rajkot/Ireava-Services-University-Road-Near-Panchayat-Chowk-Yagnik-Road/0281PX281-X281-180101221010-U3I9_BZDET), [dial4trade](https://www.dial4trade.com/ireva-technologies/contact-us.htm)
- Competitor and roundup pages: [YoLearn.ai](https://www.yolearn.ai/blog/cbse-doubt-solving-ai-tutor), [DoubtSolver.ai](https://doubtsolver.ai/), [CBSEDoubts](https://www.cbsedoubts.in/), [Doubttify](https://www.doubttify.in/), [TeachBetter.ai](https://teachbetter.ai/top-10-best-ai-platforms-for-students-2026/), [SyncStudy](https://www.syncstudy.in/blog/best-app-for-students-india), [Medium: 15 Free AI Tools Every Indian Student Should Know in 2026](https://medium.com/age-of-awareness/15-free-ai-tools-every-indian-student-should-know-in-2026-118b9bfd3c70), [Arihant Academy](https://arihantacademy.com/blog/ai-tools-every-cbse-student-should-be-using/), [CBSE AI Buddy (Google Play)](https://play.google.com/store/apps/details?id=com.trt.cbseaibuddy&hl=en_IN)
- Brand collision: [Inc42 on Krutrim](https://inc42.com/buzz/bhavish-aggarwal-led-krutrim-ai-launches-its-android-app/), [Kruti (Google Play)](https://play.google.com/store/apps/details?id=com.app.krutrim.prod&hl=en-US)
- Framework sources: Google Patent US 8,595,225; Google Patent US 11,354,342 (Information Gain); May 2024 Google Search API leak (NavBoost, siteFocusScore, originalContentScore, siteAuthority).
