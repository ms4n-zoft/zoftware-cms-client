export type OutcomeService = {
  title: string;
  description: string;
  icon: string;
  highlights: string[];
};

export type OutcomeStep = {
  title: string;
  description: string;
};

export type OutcomeMetric = {
  value: string;
  label: string;
};

export type OutcomeFaq = {
  question: string;
  answer: string;
};

export type OutcomePage = {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  summary: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroHighlights: string[];
  metrics: OutcomeMetric[];
  services: OutcomeService[];
  process: OutcomeStep[];
  deliverables: string[];
  outcomes: string[];
  engagement: string[];
  trustPoints: string[];
  faqs: OutcomeFaq[];
};

export const outcomePages: OutcomePage[] = [
  {
    slug: "get-more-customers",
    navLabel: "Get More Customers",
    eyebrow: "Acquisition Systems",
    title: "Get More Customers",
    description:
      "Acquisition systems built on WhatsApp, AI qualification, and conversion-focused funnel design, so more of your traffic becomes sales-ready pipeline.",
    intro:
      "More traffic only matters if it turns into conversations your team can close. We design the full acquisition journey, connect the tools, and automate the first layer of qualification, so your pipeline grows without piling more follow-up onto your reps.",
    summary:
      "An acquisition engine that turns traffic into qualified, sales-ready conversations, without adding manual follow-up.",
    primaryCtaLabel: "Book a growth call",
    primaryCtaHref: "/onboarding",
    secondaryCtaLabel: "See the main overview",
    secondaryCtaHref: "/home",
    heroHighlights: [
      "Done-for-you acquisition funnels",
      "AI that qualifies before a rep replies",
      "Live in weeks, not quarters",
    ],
    metrics: [
      { value: "3.4x", label: "More qualified conversations" },
      { value: "<2 min", label: "Average first response time" },
      { value: "40%", label: "Less manual lead triage" },
    ],
    services: [
      {
        title: "WhatsApp Lead Gen",
        description:
          "Turn ads and site visits into live conversations, with click-to-chat entry points, inbound qualification, and routing that sends every buyer down the right path.",
        icon: "chat",
        highlights: ["Click-to-chat entry points everywhere", "Instant routing by buyer intent"],
      },
      {
        title: "AI Lead Qualification",
        description:
          "Let AI score intent, enrich context, and filter the noise, so only high-fit, ready-to-talk prospects ever reach your team.",
        icon: "spark",
        highlights: ["Real-time intent scoring and enrichment", "Only high-fit leads reach sales"],
      },
      {
        title: "CRM Funnel Design",
        description:
          "Give every lead a clear path the moment it lands. We map lifecycle stages, ownership, and conversion checkpoints so acquisition holds up inside your CRM.",
        icon: "funnel",
        highlights: ["Lifecycle stages with clear ownership", "Conversion checkpoints that hold"],
      },
      {
        title: "Conversational Commerce",
        description:
          "Help buyers decide right in the chat. Guided journeys answer questions, compare options, and move people to the next step faster.",
        icon: "cart",
        highlights: ["Guided product discovery in chat", "A faster path to the next step"],
      },
    ],
    process: [
      {
        title: "Map the buyer journey",
        description:
          "We trace how prospects find you today and pinpoint where they drop before becoming a real conversation.",
      },
      {
        title: "Design the funnel",
        description:
          "We blueprint the channels, messaging, and qualification logic around your highest-intent paths.",
      },
      {
        title: "Build and connect",
        description:
          "We implement the automations, routing, and CRM stages so nothing depends on manual effort at launch.",
      },
      {
        title: "Launch and tune",
        description:
          "We go live, watch real performance, and keep iterating on the flows that move the most pipeline.",
      },
    ],
    deliverables: [
      "Acquisition funnel blueprint",
      "Channel and message flow design",
      "Lead scoring and routing logic",
      "CRM stage and lifecycle setup",
    ],
    outcomes: [
      "More qualified leads in the pipeline",
      "Faster first response and follow-up",
      "Cleaner handoff from marketing to sales",
      "Less manual triage for your team",
    ],
    engagement: [
      "Campaign audit and strategy workshop",
      "Automation build and CRM implementation",
      "Channel launch with hands-on QA",
      "Performance review and iteration plan",
    ],
    trustPoints: [
      "Implementation-led, not just advice",
      "Built around your existing CRM and stack",
      "Documented and ready to hand over",
    ],
    faqs: [
      {
        question: "How long until we go live?",
        answer:
          "Most acquisition funnels are live in 3 to 5 weeks, depending on how many channels and how much CRM work is involved.",
      },
      {
        question: "Do you work with our current tools?",
        answer:
          "Yes. We build around your existing CRM, ad channels, and messaging tools instead of replacing them.",
      },
      {
        question: "Who runs it after launch?",
        answer:
          "Your team does. You get documented flows and a tuning plan, with optional ongoing support if you want it.",
      },
    ],
  },
  {
    slug: "convert-more-leads",
    navLabel: "Convert More Leads",
    eyebrow: "Conversion Systems",
    title: "Convert More Leads",
    description:
      "Conversion workflows that move prospects from interest to action with less lag, less manual effort, and more consistency across your team.",
    intro:
      "Most leads are lost in the gap between interest and action. We tighten response times, automate the repetitive follow-up, and build guided journeys that keep deals moving, so your reps spend their energy on the conversations that actually close.",
    summary:
      "A conversion system that shortens response time and automates follow-up, so more leads reach a real sales conversation.",
    primaryCtaLabel: "Improve lead conversion",
    primaryCtaHref: "/onboarding",
    secondaryCtaLabel: "Back to main page",
    secondaryCtaHref: "/home",
    heroHighlights: [
      "Fast, consistent lead response",
      "AI agents that qualify the next step",
      "Fewer deals lost to slow follow-up",
    ],
    metrics: [
      { value: "28%", label: "Higher lead-to-meeting rate" },
      { value: "5x", label: "Faster follow-up cycles" },
      { value: "43%", label: "Fewer stalled deals" },
    ],
    services: [
      {
        title: "AI Sales Agents",
        description:
          "Put an always-on assistant in front of every lead. It answers common questions, captures context, and qualifies the next action before a rep steps in.",
        icon: "agent",
        highlights: ["Answers common questions instantly", "Captures context and qualifies intent"],
      },
      {
        title: "WhatsApp Automation",
        description:
          "Keep conversations warm with reminders, reactivation sequences, and real-time flows that cut drop-off and hand off cleanly to your team.",
        icon: "chat",
        highlights: ["Reminder and reactivation sequences", "Clean real-time handoff to reps"],
      },
      {
        title: "CRM Automation",
        description:
          "Take the busywork off your reps. Status changes, task creation, follow-up timing, and owner assignment all run automatically inside your CRM.",
        icon: "workflow",
        highlights: ["Auto status, tasks, and assignment", "Follow-up timing on autopilot"],
      },
      {
        title: "Lead Nurturing Systems",
        description:
          "Stay top of mind with multi-step journeys that nurture interested-but-not-ready buyers until the timing is finally right.",
        icon: "nurture",
        highlights: ["Multi-step nurture journeys", "Re-engages buyers who are not ready yet"],
      },
    ],
    process: [
      {
        title: "Diagnose the funnel",
        description:
          "We follow every lead from first touch to close and find exactly where momentum is lost.",
      },
      {
        title: "Design the response system",
        description:
          "We define the automation rules, the AI agent scope, and the sequences that keep deals warm.",
      },
      {
        title: "Roll out in your CRM",
        description:
          "We implement the workflows and triggers directly inside your CRM, with no disruption to your reps.",
      },
      {
        title: "Optimize conversion",
        description:
          "We report on funnel leakage and keep tuning the steps that lift conversion.",
      },
    ],
    deliverables: [
      "Lead response workflow map",
      "Sales automation rules and sequences",
      "Lifecycle triggers and nurture logic",
      "Pipeline visibility and conversion checkpoints",
    ],
    outcomes: [
      "Higher lead-to-meeting conversion",
      "Fewer leads lost to slow follow-up",
      "More consistency across every rep",
      "Clear visibility into funnel leakage",
    ],
    engagement: [
      "Funnel diagnosis and benchmarks",
      "Automation and AI agent design",
      "CRM workflow rollout",
      "Conversion reporting and optimization",
    ],
    trustPoints: [
      "Runs inside your CRM, not a silo",
      "Your reps stay in control of every deal",
      "Measured against real conversion data",
    ],
    faqs: [
      {
        question: "Will this replace our sales reps?",
        answer:
          "No. AI handles the repetitive response and qualification so your reps can focus on the deals that are ready to move.",
      },
      {
        question: "Can it fit our sales process?",
        answer:
          "Yes. We map every automation to your existing stages, ownership, and rules of engagement.",
      },
      {
        question: "How do you measure success?",
        answer:
          "By lead-to-meeting and lead-to-close movement, plus response time and follow-up consistency.",
      },
    ],
  },
  {
    slug: "retain-customers",
    navLabel: "Retain Customers",
    eyebrow: "Retention Systems",
    title: "Retain Customers",
    description:
      "Lifecycle, support, and personalization systems that keep customers engaged, supported, and renewing long after the first sale.",
    intro:
      "Retention rarely fails for lack of intent; it fails for lack of a system. We design the post-sale journey so onboarding, engagement, support, and renewal run on rails, instead of resting on a few people remembering to follow up.",
    summary:
      "A retention system that makes onboarding, engagement, support, and renewal repeatable instead of ad hoc.",
    primaryCtaLabel: "Design retention workflows",
    primaryCtaHref: "/onboarding",
    secondaryCtaLabel: "Go to main page",
    secondaryCtaHref: "/home",
    heroHighlights: [
      "Structured post-sale journeys",
      "AI support that lightens the load",
      "Renewal moments that never slip",
    ],
    metrics: [
      { value: "22%", label: "Better onboarding completion" },
      { value: "31%", label: "Lower repetitive support load" },
      { value: "1.4x", label: "Stronger repeat engagement" },
    ],
    services: [
      {
        title: "Lifecycle Automation",
        description:
          "Guide every account from first login to renewal with structured journeys across email, CRM, and messaging.",
        icon: "cycle",
        highlights: ["Onboarding-to-renewal journeys", "Triggered across email, CRM, and chat"],
      },
      {
        title: "Retention Campaigns",
        description:
          "Reach the right account at the right moment with win-back, reminder, and engagement campaigns driven by real signals, not static lists.",
        icon: "megaphone",
        highlights: ["Win-back and engagement plays", "Driven by real account signals"],
      },
      {
        title: "Support AI",
        description:
          "Resolve the common questions in seconds and route the complex ones correctly, so your team spends its time where it counts.",
        icon: "support",
        highlights: ["Instant answers to common questions", "Smart routing for complex cases"],
      },
      {
        title: "Personalization Systems",
        description:
          "Make every message feel relevant, with experiences tuned to segment, account stage, product usage, and intent.",
        icon: "target",
        highlights: ["Messaging by stage and usage", "Experiences tuned to intent"],
      },
    ],
    process: [
      {
        title: "Map the post-sale journey",
        description:
          "We document how onboarding, activation, support, and renewal actually run today.",
      },
      {
        title: "Design lifecycle workflows",
        description:
          "We architect the journeys and the signals that should trigger each engagement.",
      },
      {
        title: "Implement automation and AI",
        description:
          "We build the flows and stand up the support assistant inside your existing stack.",
      },
      {
        title: "Test, tune, and hand off",
        description:
          "We validate the journeys, refine the triggers, and hand over a system your team can run.",
      },
    ],
    deliverables: [
      "Lifecycle journey architecture",
      "Retention campaign calendar",
      "Support automation flows",
      "Segmentation and personalization logic",
    ],
    outcomes: [
      "More customers completing onboarding",
      "Stronger, repeat engagement",
      "Less day-to-day load on support",
      "A structured renewal and expansion motion",
    ],
    engagement: [
      "Lifecycle and support audit",
      "Retention workflow design",
      "AI support assistant setup",
      "Testing, tuning, and handoff",
    ],
    trustPoints: [
      "Signal-based, not static lists",
      "Takes load off your support team",
      "Owned and operable by your team",
    ],
    faqs: [
      {
        question: "Where does this fit after the sale?",
        answer:
          "Across the whole lifecycle: onboarding, activation, support, and renewal, wherever the work is still manual.",
      },
      {
        question: "Does the support AI replace our team?",
        answer:
          "No. It deflects the repetitive questions and routes the hard ones, so your team focuses on high-value support.",
      },
      {
        question: "Can journeys use our product data?",
        answer:
          "Yes. We trigger engagement on account stage, usage, and intent wherever that data is available.",
      },
    ],
  },
  {
    slug: "ai-and-automation",
    navLabel: "AI & Automation",
    eyebrow: "Systems Design",
    title: "AI & Automation",
    description:
      "AI strategy, workflow design, CRM integration, and reporting for teams that want a practical, measurable rollout instead of another experiment.",
    intro:
      "Most teams do not need more AI demos; they need a plan they can run. We define where AI genuinely fits, how it connects to your operations, and how the results get measured, so your rollout earns its place instead of stalling in a pilot.",
    summary:
      "A structured AI and automation rollout, from readiness to measurement, built to operate in production rather than demo in a deck.",
    primaryCtaLabel: "Plan your AI rollout",
    primaryCtaHref: "/onboarding",
    secondaryCtaLabel: "Visit main page",
    secondaryCtaHref: "/home",
    heroHighlights: [
      "A practical, staged rollout path",
      "Workflow design before tooling",
      "Impact you can actually measure",
    ],
    metrics: [
      { value: "60%", label: "Faster time to first AI win" },
      { value: "42%", label: "Less fragmented tooling" },
      { value: "100%", label: "Workflows mapped before any build" },
    ],
    services: [
      {
        title: "AI Readiness Audit",
        description:
          "Know where you stand before you build. We review your workflows, data quality, and team readiness to find where AI will actually land.",
        icon: "audit",
        highlights: ["Workflow and data-quality review", "Clear gaps surfaced before any build"],
      },
      {
        title: "AI Workflow Design",
        description:
          "Decide where AI should assist, where it should automate, and where it should stay out, based on real business risk and value.",
        icon: "workflow",
        highlights: ["Where AI assists vs automates", "Scoped by risk and value"],
      },
      {
        title: "CRM Integration",
        description:
          "Connect AI and automation to your CRM so contact, pipeline, and lifecycle data stay accurate and usable.",
        icon: "link",
        highlights: ["AI connected to live CRM data", "Contact and pipeline stay usable"],
      },
      {
        title: "Reporting Dashboards",
        description:
          "See what is working, with reporting on workflow performance, conversion movement, response time, and operational impact.",
        icon: "chart",
        highlights: ["Performance and impact reporting", "Executive and operator views"],
      },
    ],
    process: [
      {
        title: "Assess readiness",
        description:
          "We review your workflows, data, and team to find where AI will actually land.",
      },
      {
        title: "Select use cases",
        description:
          "We prioritize the highest-value, lowest-risk use cases for the first rollout.",
      },
      {
        title: "Design the system",
        description:
          "We bring workflows, tooling, and CRM integration into one coherent architecture.",
      },
      {
        title: "Plan measurement",
        description:
          "We define the dashboards and metrics that prove impact from day one.",
      },
    ],
    deliverables: [
      "AI readiness assessment",
      "Workflow and tooling architecture",
      "CRM integration map",
      "Executive and operator dashboards",
    ],
    outcomes: [
      "Clear AI implementation priorities",
      "Less fragmented, better-connected tooling",
      "Real measurement of automation impact",
      "A rollout your team can actually operate",
    ],
    engagement: [
      "Readiness review and use-case selection",
      "System and workflow design",
      "Implementation planning",
      "Measurement and reporting setup",
    ],
    trustPoints: [
      "Strategy grounded in implementation",
      "Tool-neutral recommendations",
      "A rollout your team can operate",
    ],
    faqs: [
      {
        question: "We are not sure where AI fits. Is that a problem?",
        answer:
          "Not at all. The readiness audit and use-case selection exist precisely for teams that need structure before they build.",
      },
      {
        question: "Do we need to replace our current tools?",
        answer:
          "Rarely. We design around your stack and suggest changes only where they clearly pay off.",
      },
      {
        question: "How do we know it is working?",
        answer:
          "Dashboards tied to response time, conversion movement, and operational impact, in place from day one.",
      },
    ],
  },
];

export function getOutcomePage(slug: string) {
  return outcomePages.find((page) => page.slug === slug);
}
