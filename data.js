/* ===========================================================
   DATA SECTION — Easy to extend. Add new courses here.
   =========================================================== */

const CAT = {
  "compulsory":      { label: "Common Compulsory",    cls: "bg-red-100 text-red-900 border-red-300" },
  "compulsory-mat":  { label: "APP MATHS Core",        cls: "bg-blue-100 text-blue-900 border-blue-400" },
  "compulsory-fin":  { label: "Finance Core",          cls: "bg-emerald-100 text-emerald-900 border-emerald-400" },
  "compulsory-isfa": { label: "ISFA Core",             cls: "bg-teal-100 text-teal-900 border-teal-400" },
  "compulsory-qft":  { label: "QF&FinTech Core",       cls: "bg-cyan-100 text-cyan-900 border-cyan-400" },
  "compulsory-aida": { label: "AIDA Secondary Major",  cls: "bg-rose-100 text-rose-900 border-rose-400" },
  "capstone":        { label: "Capstone",              cls: "bg-amber-100 text-amber-900 border-amber-400" },
  "elective-mat":    { label: "APP MATHS Elective",    cls: "bg-blue-50 text-blue-800 border-blue-200" },
  "elective-fin":    { label: "Finance Elective",      cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  "elective-qft":    { label: "FinTech Elective",      cls: "bg-cyan-50 text-cyan-800 border-cyan-200" },
  "elective-aida":   { label: "AIDA Elective",         cls: "bg-rose-50 text-rose-800 border-rose-200" },
  "elective":        { label: "Elective",              cls: "bg-slate-50 text-slate-700 border-slate-200" },
  "programming":     { label: "Programming Tool",      cls: "bg-indigo-100 text-indigo-900 border-indigo-300" },
  "prof":            { label: "Professional Dev",      cls: "bg-violet-100 text-violet-900 border-violet-300" },
  "gur-aida":        { label: "GUR · AIDA",            cls: "bg-pink-100 text-pink-900 border-pink-300" },
  "gur-ie":          { label: "GUR · IE",              cls: "bg-pink-100 text-pink-900 border-pink-300" },
  "gur-lead":        { label: "GUR · LEAD",            cls: "bg-pink-100 text-pink-900 border-pink-300" },
  "gur-lang":        { label: "GUR · Language",        cls: "bg-pink-100 text-pink-900 border-pink-300" },
  "gur-car":         { label: "GUR · CAR",             cls: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300" },
  "gur-sl":          { label: "GUR · Service Learning",cls: "bg-pink-100 text-pink-900 border-pink-300" },
  "gur-hl":          { label: "GUR · Healthy Lifestyle",cls: "bg-pink-50 text-pink-800 border-pink-200" },
  "free":            { label: "Free Elective",         cls: "bg-purple-100 text-purple-900 border-purple-300" },
  "wie":             { label: "WIE Training",          cls: "bg-orange-100 text-orange-900 border-orange-300" }
};

// Majors: MAT, ISFA, QFT, MAT_AIDA, ISFA_AIDA
const COURSES = {
  // ===== Common Scheme Subjects =====
  "AMA1702": { n:"Calculus", c:3, p:[], ex:["AMA1007","AMA1110","AMA1130","AMA1131","AMA1500"], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA1751": { n:"Linear Algebra", c:3, p:[], ex:["AMA1007","AMA1120"], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA2634": { n:"Introduction to Statistics", c:3, p:["DSAI1103"], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA2702": { n:"Multivariable Calculus", c:3, p:["AMA1702"], ex:["AMA2703"], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA3602": { n:"Applied Linear Models", c:3, p:["AMA1751","AMA2634"], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA3640": { n:"Statistical Inference", c:3, p:["AMA1702","DSAI1103"], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA3820": { n:"Operations Research Methods", c:3, p:["AMA1751"], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "CMS1000": { n:"Computer & Math Sciences Professionals in Society", c:1, p:[], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "COMP1010":{ n:"Computational Thinking & Problem Solving", c:3, p:[], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "COMP1011":{ n:"Programming Fundamentals", c:3, p:[], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "DSAI1103":{ n:"Principles of Data Science", c:3, p:[], cat:"compulsory", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA2201": { n:"Introduction to Bloomberg", c:1, p:[], cat:"programming", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"], group:"prog" },
  "AMA2202": { n:"Introduction to MATLAB", c:1, p:[], cat:"programming", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"], group:"prog" },
  "AMA2203": { n:"Introduction to R", c:1, p:[], cat:"programming", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"], group:"prog" },
  "AMA3300": { n:"Professionalism & Ethics in Finance Analytics", c:2, p:[], cat:"prof", for:["ISFA","QFT","ISFA_AIDA"], group:"profdev" },
  "AMA3700": { n:"Professional & Research Skills in Math Science", c:2, p:[], cat:"prof", for:["MAT","MAT_AIDA"], group:"profdev" },

  // ===== APP MATHS Core =====
  "AMA2200": { n:"Discrete Mathematics", c:3, p:[], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "AMA2751": { n:"Linear Algebra II", c:3, p:["AMA1751"], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "AMA3201": { n:"Computational Methods", c:3, p:["AMA2702"], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "AMA3410": { n:"Differential Equations", c:3, p:["AMA2702"], ex:["AMA2112"], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "AMA3707": { n:"Real Analysis", c:3, p:[], ex:["AMA3007"], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "AMA3730": { n:"Complex Variables", c:3, p:["AMA2702"], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "AMA4420": { n:"Partial Differential Equations", c:3, p:["AMA3410"], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "AMA4450": { n:"Mathematical Modelling", c:3, p:["AMA3410"], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },
  "DSAI2201":{ n:"Data Structures & Algorithms", c:3, p:["COMP1011","AMA1751","AMA2634"], ex:["COMP2013"], cat:"compulsory-mat", for:["MAT","QFT","MAT_AIDA","ISFA_AIDA"] },
  "ELC3124": { n:"Professional English for Data Science", c:2, p:[], cat:"compulsory-mat", for:["MAT","MAT_AIDA"] },

  // ===== Finance Core (ISFA & QFT) =====
  "AF1605":  { n:"Introduction to Economics", c:3, p:[], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AF2111":  { n:"Accounting for Decision Making", c:3, p:[], ex:["AF2108","AF2110"], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AF3313":  { n:"Business Finance", c:3, p:["AF2111"], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AF3316":  { n:"Investments", c:3, p:["AF3313"], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AMA3304": { n:"Theory of Interest & Portfolio Analysis", c:3, p:["AMA1751","DSAI1103"], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AMA3724": { n:"Further Mathematical Methods", c:3, p:["AMA1751","AMA2702"], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AMA4325": { n:"Derivative Pricing", c:3, p:["AMA3724","DSAI1103"], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "COMP2411":{ n:"Database Systems", c:3, p:["COMP1011"], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "ELC3122": { n:"English for Financial Management Professionals", c:2, p:[], cat:"compulsory-fin", for:["ISFA","QFT","ISFA_AIDA"] },

  // ===== ISFA Only =====
  "AF4320":  { n:"Corporate Finance", c:3, p:["AF3313"], cat:"compulsory-isfa", for:["ISFA","ISFA_AIDA"] },
  "AMA4381": { n:"Econometrics", c:3, p:["AMA3602"], cat:"compulsory-isfa", for:["ISFA","ISFA_AIDA"] },
  "AMA4602": { n:"High Dimensional Data Analysis", c:3, p:["AMA3602","AMA3724"], cat:"compulsory-isfa", for:["ISFA","ISFA_AIDA"] },

  // ===== QF & FinTech Only =====
  "AMA3340": { n:"Introduction to Blockchain & Cyber Security", c:3, p:[], cat:"compulsory-qft", for:["QFT"] },
  "AMA4390": { n:"Quantitative Finance & Financial Technology", c:3, p:["AMA4325"], cat:"compulsory-qft", for:["QFT"] },
  "COMP3334":{ n:"Computer Systems Security", c:3, p:[], cat:"compulsory-qft", for:["QFT"] },
  "DSAI4203":{ n:"Machine Learning", c:3, p:[], ex:["COMP4432"], cat:"compulsory-qft", for:["QFT"] },

  // ===== Capstone =====
  "AMA4951": { n:"Capstone Project (Year-long)", c:6, p:[], cat:"capstone", for:["MAT","ISFA","QFT"] },
  "AMA4953": { n:"Integrated Capstone Project (AIDA)", c:6, p:[], cat:"capstone", for:["MAT_AIDA","ISFA_AIDA"] },

  // ===== AIDA Secondary Major Subjects =====
  "AMA2233": { n:"Data Analytics & Visualization", c:3, p:[], cat:"compulsory-aida", for:["MAT_AIDA","ISFA_AIDA"] },
  "AMA4680": { n:"Statistical Machine Learning", c:3, p:["AMA3602","AMA3724","COMP1011"], cat:"elective-fin", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "COMP4431":{ n:"Artificial Intelligence", c:3, p:["DSAI2201"], cat:"elective", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AIDA-E1": { n:"AIDA Elective 1", c:3, p:[], cat:"elective-aida", for:["MAT_AIDA","ISFA_AIDA"] },
  "AIDA-E2": { n:"AIDA Elective 2", c:3, p:[], cat:"elective-aida", for:["MAT_AIDA","ISFA_AIDA"] },

  // ===== APP MATHS Electives =====
  "AMA3250": { n:"Graph Theory & Network", c:3, p:["AMA1751"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA3710": { n:"Abstract Algebra", c:3, p:[], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA4430": { n:"Numerical Solution of PDEs", c:3, p:["AMA3201","AMA3410"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA4440": { n:"Dynamical Systems", c:3, p:["AMA3410"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA4670": { n:"Modelling of Epidemic & Pandemic", c:3, p:["AMA2702","DSAI1103"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA4707": { n:"Real Analysis II", c:3, p:["AMA3707"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA4750": { n:"Applied Functional Analysis", c:3, p:["AMA1751","AMA3707"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA4801": { n:"Compressed Sensing", c:3, p:["AMA3820"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },
  "AMA4850": { n:"Optimization Methods", c:3, p:["AMA3410"], cat:"elective-mat", for:["MAT","MAT_AIDA"] },

  // ===== Finance Electives =====
  "AF3317":  { n:"Risk Management", c:3, p:["AF3313"], cat:"elective-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AF3620":  { n:"Intermediate Microeconomics", c:3, p:["AF1605"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "AF4317":  { n:"Derivative Securities", c:3, p:["AF3313"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "AF4322":  { n:"Management of Financial Institutions", c:3, p:["AF3313"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "AF4323":  { n:"International Finance", c:3, p:["AF3313"], ex:["AF4334"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "AF4326":  { n:"Fixed Income Securities", c:3, p:["AF3316"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "AF4615":  { n:"Financial Economics", c:3, p:["AF1605"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "AMA3654": { n:"Survey Sampling", c:3, p:["AMA2634"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "AMA3659": { n:"Stochastic Processes", c:3, p:["AMA1702","DSAI1103"], cat:"elective-fin", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA4300": { n:"Seminars in Investment Science & Finance Analytics", c:3, p:[], cat:"elective-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AMA4330": { n:"Applications of AI in Finance Industry", c:3, p:[], cat:"elective-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AMA4363": { n:"Loss Models", c:3, p:["AMA3640"], cat:"elective-fin", for:["MAT","ISFA","MAT_AIDA","ISFA_AIDA"] },
  "AMA4370": { n:"Applied Algorithmic Trading Strategies", c:3, p:[], cat:"elective-fin", for:["ISFA","QFT","ISFA_AIDA"] },
  "AMA4380": { n:"Algorithmic & High Frequency Trading", c:3, p:["AMA3724"], cat:"elective-fin", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA4650": { n:"Forecasting & Applied Time Series Analysis", c:3, p:["AMA3602"], cat:"elective-fin", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA4688": { n:"Simulation", c:3, p:["AMA2634"], cat:"elective-fin", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "AMA4840": { n:"Decision Analysis", c:3, p:["DSAI1103"], cat:"elective-fin", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },

  // ===== Computing/FinTech Electives =====
  "COMP3134":{ n:"Business Intelligence & CRM", c:3, p:[], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "COMP3423":{ n:"Human Computer Interaction", c:3, p:["COMP1011"], ex:["COMP2222"], cat:"elective-qft", for:["QFT"] },
  "COMP4121":{ n:"E-commerce Technology & Applications", c:3, p:["COMP2411"], cat:"elective-qft", for:["QFT"] },
  "COMP4442":{ n:"Service & Cloud Computing", c:3, p:[], cat:"elective-qft", for:["QFT"] },
  "DSAI4202":{ n:"E-Payment & Cryptocurrency", c:3, p:["COMP3334"], cat:"elective-qft", for:["QFT"] },
  "DSAI4204":{ n:"Data Mining & Data Warehousing", c:3, p:["COMP2411"], cat:"elective-fin", for:["ISFA","ISFA_AIDA"] },
  "DSAI4205":{ n:"Big Data Analytics", c:3, p:["DSAI2201"], ex:["COMP4434"], cat:"elective", for:["MAT","ISFA","MAT_AIDA","ISFA_AIDA"] },
  "DSAI4206":{ n:"Emerging Topics in FinTech", c:3, p:[], ex:["COMP4531"], cat:"elective-qft", for:["QFT"] },

  // ===== GUR =====
  "APSS1L01":{ n:"Tomorrow's Leaders", c:3, p:[], cat:"gur-lead", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "COMP1004":{ n:"Introduction to AI & Data Analytics", c:2, p:[], cat:"gur-aida", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "MM1031":  { n:"Introduction to Innovation & Entrepreneurship", c:1, p:[], cat:"gur-ie", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "LCR-ENG1":{ n:"English Language I (LCR)", c:3, p:[], cat:"gur-lang", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "LCR-ENG2":{ n:"English Language II (LCR)", c:3, p:["LCR-ENG1"], cat:"gur-lang", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "LCR-CHI": { n:"Chinese Language (LCR)", c:3, p:[], cat:"gur-lang", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "CAR-A":   { n:"CAR-A · Human Nature, Relations & Development", c:3, p:[], cat:"gur-car", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "CAR-M":   { n:"CAR-M · Chinese History & Culture", c:3, p:[], cat:"gur-car", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "CAR-N":   { n:"CAR-N · Cultures, Organizations, Societies & Globalisation", c:3, p:[], cat:"gur-car", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "SL":      { n:"Service-Learning Subject", c:3, p:[], cat:"gur-sl", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "HL":      { n:"Healthy Lifestyle", c:0, p:[], cat:"gur-hl", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },

  // ===== Free Electives =====
  "FREE-1":  { n:"Free Elective 1", c:3, p:[], cat:"free", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] },
  "FREE-2":  { n:"Free Elective 2", c:3, p:[], cat:"free", for:["MAT","ISFA","QFT","MAT_AIDA"] },
  "FREE-3":  { n:"Free Elective 3", c:3, p:[], cat:"free", for:["MAT","MAT_AIDA"] },
  "FREE-4":  { n:"Free Elective 4", c:3, p:[], cat:"free", for:["MAT"] },

  // ===== WIE =====
  "AMA2940": { n:"Work-Integrated Education (2 training credits)", c:2, p:[], cat:"wie", for:["MAT","ISFA","QFT","MAT_AIDA","ISFA_AIDA"] }
};

/* ===========================================================
   PROGRAMME STRUCTURES — Suggested study patterns
   =========================================================== */

const PROGRAMMES = {
  "MAT": {
    name: "BSc (Hons) in Applied Mathematics",
    code: "63430-MAT",
    fullName: "Applied Mathematics",
    accent: "blue",
    description: "Trains future mathematics professionals with solid knowledge in differential equations, statistical analysis, computational methods, mathematical modelling, optimisation and operations research.",
    targetCredits: { major: 81, gur: 27, free: 12, total: 120 },
    overview: {
      Y1S1: ["AMA1702","CMS1000","COMP1004","COMP1010","APSS1L01","LCR-ENG1","HL"],
      Y1S2: ["DSAI1103","AMA1751","COMP1011","MM1031","FREE-1","LCR-ENG2"],
      Y2S1: ["AMA2200","AMA2634","AMA2702","AMA2202","FREE-2","CAR-A"],
      Y2S2: ["AMA2751","AMA3410","AMA3602","DSAI2201","LCR-CHI"],
      Y3S1: ["AMA3201","AMA3640","AMA3707","AMA3820","AMA3700"],
      Y3S2: ["AMA3730","AMA4420","AMA4450","ELC3124","CAR-M"],
      Y4S1: ["AMA4951","AMA4430","AMA4440","FREE-3","CAR-N"],
      Y4S2: ["AMA4951","AMA4707","AMA4850","FREE-4","SL"]
    }
  },
  "ISFA": {
    name: "BSc (Hons) in Investment Science and Finance Analytics",
    code: "63430-IFA",
    fullName: "Investment Science & Finance Analytics",
    accent: "emerald",
    description: "Cultivates investment and finance professionals with strong quantitative analysis, critical thinking and communication skills for careers in investment banking, fund management, risk management and product pricing.",
    targetCredits: { major: 87, gur: 27, free: 6, total: 120 },
    overview: {
      Y1S1: ["AMA1702","CMS1000","COMP1004","COMP1010","APSS1L01","LCR-ENG1","HL"],
      Y1S2: ["DSAI1103","AF1605","COMP1011","MM1031","LCR-ENG2"],
      Y2S1: ["AF2111","AMA2634","AMA2702","COMP2411","AMA2201","AMA1751"],
      Y2S2: ["AF3313","AMA3602","AMA3724","AMA3820","LCR-CHI"],
      Y3S1: ["AF4320","AMA3304","AMA3640","AMA3300","CAR-A"],
      Y3S2: ["AF3316","AMA4325","AMA4381","ELC3122","AF3317"],
      Y4S1: ["AMA4951","AMA4602","AF4317","FREE-1","CAR-M"],
      Y4S2: ["AMA4951","AF4326","AMA4680","FREE-2","SL"]
    }
  },
  "QFT": {
    name: "BSc (Hons) in Quantitative Finance and FinTech",
    code: "63430-QFT",
    fullName: "Quantitative Finance & FinTech",
    accent: "cyan",
    description: "Develops finance analytics and FinTech professionals with solid mathematical, statistical, finance and computing techniques, with emphasis on digital finance applications.",
    targetCredits: { major: 87, gur: 27, free: 6, total: 120 },
    overview: {
      Y1S1: ["AMA1702","CMS1000","COMP1004","COMP1010","APSS1L01","LCR-ENG1","HL"],
      Y1S2: ["DSAI1103","AF1605","COMP1011","MM1031","LCR-ENG2"],
      Y2S1: ["AF2111","AMA2634","AMA2702","COMP2411","AMA2201","AMA1751"],
      Y2S2: ["AF3313","AMA3602","AMA3724","DSAI2201","LCR-CHI"],
      Y3S1: ["AMA3304","AMA3340","AMA3640","AMA3820","AMA3300"],
      Y3S2: ["AF3316","AMA4325","COMP3334","ELC3122","CAR-A"],
      Y4S1: ["AMA4951","AMA4390","DSAI4203","AMA4370","CAR-M"],
      Y4S2: ["AMA4951","AMA4380","FREE-1","CAR-N","SL"]
    }
  },
  "MAT_AIDA": {
    name: "BSc (Hons) in Applied Mathematics + Secondary Major in AIDA",
    code: "63430-MAT-AIDA",
    fullName: "App Maths + AIDA Secondary Major",
    accent: "rose",
    description: "Applied Mathematics major with a Secondary Major in Artificial Intelligence & Data Analytics. AMA4953 Integrated Capstone replaces AMA4951. Total 132 credits with 12 double-counted.",
    targetCredits: { major: 81, gur: 27, free: 6, secondary: 18, total: 132 },
    overview: {
      Y1S1: ["AMA1702","CMS1000","COMP1004","COMP1010","APSS1L01","LCR-ENG1","HL"],
      Y1S2: ["DSAI1103","AMA1751","COMP1011","MM1031","LCR-ENG2"],
      Y2S1: ["AMA2200","AMA2634","AMA2702","AMA2202","CAR-A","SL"],
      Y2S2: ["AMA2751","AMA3410","AMA3602","AMA2233","DSAI2201","LCR-CHI"],
      Y2SS: ["CAR-M"],
      Y3S1: ["AMA3201","AMA3640","AMA3707","AMA3820","AMA4680","AMA3700"],
      Y3S2: ["AMA3730","AMA4420","AMA4450","ELC3124","AMA4707","AIDA-E1"],
      Y4S1: ["AMA4953","AMA4602","COMP4431","AMA4440","AMA4850"],
      Y4S2: ["AMA4953","AMA4430","AIDA-E2","FREE-1","CAR-N"]
    }
  },
  "ISFA_AIDA": {
    name: "BSc (Hons) in Investment Science & Finance Analytics + Secondary Major in AIDA",
    code: "63430-IFA-AIDA",
    fullName: "ISFA + AIDA Secondary Major",
    accent: "rose",
    description: "ISFA major with a Secondary Major in Artificial Intelligence & Data Analytics. AMA4953 Integrated Capstone replaces AMA4951. Total 132 credits with 12 double-counted.",
    targetCredits: { major: 87, gur: 27, free: 0, secondary: 18, total: 132 },
    overview: {
      Y1S1: ["AMA1702","CMS1000","COMP1004","COMP1010","APSS1L01","LCR-ENG1","HL"],
      Y1S2: ["DSAI1103","AF1605","COMP1011","MM1031","LCR-ENG2"],
      Y2S1: ["AF2111","AMA2634","AMA2702","COMP2411","AMA2201","AMA1751"],
      Y2S2: ["AF3313","AMA3602","AMA3724","AMA2233","DSAI2201","LCR-CHI"],
      Y2SS: ["CAR-A"],
      Y3S1: ["AF4320","AMA3304","AMA3820","AMA3640","AMA4680","AMA3300"],
      Y3S2: ["AF3316","AMA4325","AMA4381","ELC3122","AF3317","AIDA-E1"],
      Y4S1: ["AMA4953","AMA4602","COMP4431","AF4317","CAR-M"],
      Y4S2: ["AMA4953","AF4326","AIDA-E2","SL","CAR-N"]
    }
  }
};
