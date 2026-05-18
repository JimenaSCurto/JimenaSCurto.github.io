/**
 * ============================================================
 *  PORTFOLIO CONTENT — Edit everything here
 *  No touching HTML or CSS needed for content updates
 * ============================================================
 */

const CONTENT = {

  /* ── PERSONAL INFO ─────────────────────────────────────── */
  hero: {
    name: "Jimena Sánchez Curto",
    tagline: "Data Scientist · Political Analyst · Consultant",
    description:
      "5th-year student of PPLE + DBA at IE University. Data Consultant at Gad3, where I apply quantitative and qualitative methods to political and social research.",
    links: [
      { label: "GitHub",   icon: "github",   url: "https://github.com/" },
      { label: "LinkedIn", icon: "linkedin",  url: "https://linkedin.com/in/" },
      { label: "Email",    icon: "mail",      url: "mailto:your@email.com" },
    ],
  },

  /* ── NOTEWORTHY PROJECTS ───────────────────────────────── */
  /*  Add or remove objects to change the featured gallery   */
  noteworthy: [
    {
      id: "proj-001",
      title: "Electoral Sentiment Mapping",
      summary: "NLP analysis of 2.3 M tweets across the 2023 Spanish general election.",
      tags: ["NLP", "Python", "Electoral Studies"],
      link: "#",                    // URL or '#' for no link
      collectionId: "col-elections", // optional: ties to a collection
    },
    {
      id: "proj-002",
      title: "Municipal Budget Clustering",
      summary: "K-means and hierarchical clustering of 8 000 Spanish municipalities by expenditure patterns.",
      tags: ["Clustering", "R", "Public Finance"],
      link: "#",
      collectionId: "col-public-policy",
    },
    {
      id: "proj-003",
      title: "Migration Flows Visualisation",
      summary: "Interactive Sankey diagrams for intra-EU migration 2010–2023 using D3.js.",
      tags: ["D3.js", "Data Vis", "Migration"],
      link: "#",
      collectionId: "col-social",
    },
  ],

  /* ── COLLECTIONS ───────────────────────────────────────── */
  /*  Each collection groups related projects                 */
  collections: [
    {
      id: "col-elections",
      title: "Electoral & Political Analysis",
      description:
        "Research combining survey methodology, social media analysis, and electoral modelling to study voting behaviour and political communication.",
      color: "#004c00",             // accent override (optional)
      projects: [
        {
          id: "col-elections-01",
          title: "Electoral Sentiment Mapping",
          description:
            "NLP pipeline built with spaCy and Transformers to classify sentiment and topic in 2.3 M tweets during the 2023 Spanish general election. Produced constituency-level sentiment indices correlated with final vote shares.",
          tags: ["NLP", "Python", "spaCy", "Twitter API", "Electoral Studies"],
          link: "#",
          year: 2023,
        },
        {
          id: "col-elections-02",
          title: "Voting Intention Survey Design",
          description:
            "End-to-end design of a stratified random-sample telephone survey (n = 1 200) for regional elections, including questionnaire design, weighting, and reporting.",
          tags: ["Survey Design", "Stata", "Weighting", "Fieldwork"],
          link: "#",
          year: 2024,
        },
      ],
    },
    {
      id: "col-public-policy",
      title: "Public Policy & Governance",
      description:
        "Quantitative evaluation of public policies, budget allocation, and institutional performance using administrative data.",
      color: "#004c00",
      projects: [
        {
          id: "col-policy-01",
          title: "Municipal Budget Clustering",
          description:
            "Applied K-means and Ward hierarchical clustering to the Spanish Ministry of Finance's municipal budget microdata, identifying eight distinct fiscal profiles across 8 000+ municipalities.",
          tags: ["Clustering", "R", "ggplot2", "Public Finance"],
          link: "#",
          year: 2023,
        },
        {
          id: "col-policy-02",
          title: "Education Spending Impact Study",
          description:
            "Difference-in-differences estimation of the effect of the 2012 austerity cuts on secondary-school dropout rates in Spain, using regional panel data from Eurostat.",
          tags: ["DiD", "Panel Data", "Education Policy", "R"],
          link: "#",
          year: 2024,
        },
      ],
    },
    {
      id: "col-social",
      title: "Social Sciences & Inequality",
      description:
        "Data-driven exploration of migration, gender gaps, and socioeconomic stratification using survey and administrative microdata.",
      color: "#004c00",
      projects: [
        {
          id: "col-social-01",
          title: "Migration Flows Visualisation",
          description:
            "Interactive Sankey and chord diagrams for intra-EU migration 2010–2023 using D3.js, sourced from Eurostat microdata. Highlights corridor concentration and net-flow asymmetries.",
          tags: ["D3.js", "Data Vis", "Migration", "JavaScript"],
          link: "#",
          year: 2023,
        },
        {
          id: "col-social-02",
          title: "Gender Pay Gap Decomposition",
          description:
            "Oaxaca-Blinder decomposition of the gender pay gap in the Spanish labour market using EPA microdata, isolating explained vs unexplained components.",
          tags: ["Labour Economics", "R", "Oaxaca-Blinder", "Stata"],
          link: "#",
          year: 2024,
        },
      ],
    },
  ],

  /* ── SKILLS IN CONTEXT ─────────────────────────────────── */
  /*  Each skill maps to specific project IDs                 */
  skills: [
    {
      category: "Languages & Tools",
      items: [
        { name: "Python",     projectIds: ["proj-001", "col-elections-01"] },
        { name: "R",          projectIds: ["proj-002", "col-policy-01", "col-policy-02", "col-social-02"] },
        { name: "Stata",      projectIds: ["col-elections-02", "col-social-02"] },
        { name: "SQL",        projectIds: [] },
        { name: "D3.js",      projectIds: ["proj-003", "col-social-01"] },
        { name: "JavaScript", projectIds: ["proj-003", "col-social-01"] },
      ],
    },
    {
      category: "Methods",
      items: [
        { name: "NLP & Text Analysis",        projectIds: ["proj-001", "col-elections-01"] },
        { name: "Survey Design & Weighting",  projectIds: ["col-elections-02"] },
        { name: "Clustering",                 projectIds: ["proj-002", "col-policy-01"] },
        { name: "Causal Inference (DiD, IV)", projectIds: ["col-policy-02"] },
        { name: "Decomposition Methods",      projectIds: ["col-social-02"] },
        { name: "Data Visualisation",         projectIds: ["proj-003", "col-social-01"] },
      ],
    },
    {
      category: "Domains",
      items: [
        { name: "Electoral Studies",  projectIds: ["proj-001", "col-elections-01", "col-elections-02"] },
        { name: "Public Finance",     projectIds: ["proj-002", "col-policy-01"] },
        { name: "Education Policy",   projectIds: ["col-policy-02"] },
        { name: "Migration Studies",  projectIds: ["proj-003", "col-social-01"] },
        { name: "Labour Economics",   projectIds: ["col-social-02"] },
      ],
    },
  ],

  /* ── FEATURED INSIGHTS ─────────────────────────────────── */
  /*  Mini case-studies / blog posts                         */
  insights: [
    {
      id: "ins-001",
      title: "When Sentiment Scores Lie: Lessons from Analysing Political Twitter",
      category: "Methodology",
      date: "2024-03",
      readTime: "6 min",
      summary:
        "Pre-trained sentiment models trained on product reviews fail systematically on political discourse. Here is what I learned retraining on domain-specific data.",
      body: `
        <p>When I first applied a standard VADER sentiment analyser to a corpus of political tweets, the accuracy looked reasonable—until I checked the errors. The model consistently rated aggressive political rhetoric as neutral and labelled ironic criticism as positive. The problem was not the model; it was the training data.</p>
        <h3>The domain mismatch problem</h3>
        <p>Most off-the-shelf sentiment models are trained on Amazon product reviews or IMDB ratings. Political discourse has a fundamentally different lexicon: words like <em>austeridad</em>, <em>recortes</em>, or a politician's surname carry strong valence that a product-review model has never seen in a polarised context.</p>
        <h3>What I did instead</h3>
        <p>I fine-tuned a multilingual BERT model (bert-base-multilingual-cased) on 4 000 manually annotated political tweets. Annotation used a three-person team with Cohen's κ = 0.74 before adjudication. The fine-tuned model improved macro-F1 from 0.48 to 0.81 on the held-out test set.</p>
        <h3>Key takeaway</h3>
        <p>Domain adaptation matters more than model size. A fine-tuned BERT-base outperformed GPT-3.5 zero-shot on this task by 12 percentage points, at a fraction of the cost.</p>
      `,
    },
    {
      id: "ins-002",
      title: "The Hidden Assumption in Municipal Clustering Studies",
      category: "Methods",
      date: "2024-06",
      readTime: "4 min",
      summary:
        "Most fiscal clustering studies normalise by population, inadvertently encoding size as a clustering dimension. Here is a reproducible fix.",
      body: `
        <p>A common step when clustering municipal budgets is to express all expenditure items per capita. The intuition is sound—larger municipalities spend more in absolute terms—but per-capita normalisation introduces a subtle problem: it encodes <em>population size</em> as a latent feature, because per-capita figures vary systematically with economies of scale.</p>
        <h3>The reproducible fix</h3>
        <p>I used compositional normalisation instead: expressing each budget line as a share of total expenditure. This removes the size dimension entirely and focuses clustering on the <em>structure</em> of spending priorities rather than the level. The resulting clusters were more interpretable and aligned better with theoretical typologies in the fiscal federalism literature.</p>
        <h3>Validation</h3>
        <p>Silhouette scores improved from 0.31 (per-capita) to 0.47 (compositional) for the same K. The instability index (variation of information across 50 bootstrap samples) fell by 40%, indicating more stable cluster assignments.</p>
      `,
    },
    {
      id: "ins-003",
      title: "Three Things I Would Do Differently in My First Survey",
      category: "Fieldwork",
      date: "2024-09",
      readTime: "5 min",
      summary:
        "A candid post-mortem on a 1 200-respondent telephone survey: what broke, what we fixed mid-field, and what I would change from the start.",
      body: `
        <p>Running a large telephone survey for the first time surfaces problems that no methodology textbook prepares you for. Here are the three most consequential mistakes and how I corrected them.</p>
        <h3>1. Underestimating the incidence rate</h3>
        <p>We modelled a 20% incidence rate for the target subgroup (employed voters aged 35–55 in mid-sized cities). The real rate was 12%. This blew the fieldwork budget and forced a quota adjustment mid-field that introduced comparability issues between early and late interviews.</p>
        <h3>2. Ambiguous filter questions</h3>
        <p>A filter question asked respondents whether they had "participated in any elections in the last two years." Interviewers interpreted this inconsistently—some included local referenda, others did not. We caught the discrepancy on day three of fieldwork and retrained all interviewers, but 180 interviews were flagged and reweighted.</p>
        <h3>3. Not piloting the weighting scheme in advance</h3>
        <p>We designed the weighting variables (age × sex × region) without checking that the population marginals from the census were consistent with the achieved sample. Two cells were empty in the sample, requiring ex-post cell collapsing that reduced the precision of estimates for those groups.</p>
      `,
    },
  ],

};

// Make available globally
if (typeof module !== "undefined") module.exports = CONTENT;
