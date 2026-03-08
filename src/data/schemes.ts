export type Language = "en" | "hi" | "ta" | "mr" | "te";

export interface FormField {
  key: string;
  label: string;
  labelHi: string;
  type: "text" | "number" | "select" | "date";
  options?: { value: string; label: string; labelHi: string }[];
  required: boolean;
  placeholder?: string;
}

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  ministry: string;
  ministryHi: string;
  benefit: string;
  benefitHi: string;
  eligibility: string;
  eligibilityHi: string;
  fullEligibility: string[];
  fullEligibilityHi: string[];
  category: string;
  icon: string;
  maxIncome?: number;
  maxLand?: number;
  minLand?: number;
  requiresAadhaar: boolean;
  requiresBankAccount?: boolean;
  forWomen?: boolean;
  forFarmers?: boolean;
  forStudents?: boolean;
  forBPL?: boolean;
  minAge?: number;
  maxAge?: number;
  formFields: FormField[];
  documents: string[];
  documentsHi: string[];
  officialUrl?: string;
  helplineNumber?: string;
}

export const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    nameHi: "पीएम-किसान",
    ministry: "Ministry of Agriculture & Farmers' Welfare",
    ministryHi: "कृषि एवं किसान कल्याण मंत्रालय",
    benefit: "₹6,000/year in 3 equal installments of ₹2,000 each",
    benefitHi: "₹6,000/वर्ष — 3 किस्तों में ₹2,000 प्रत्येक",
    eligibility: "Small & marginal farmers with land < 2 hectares",
    eligibilityHi: "2 हेक्टेयर से कम भूमि वाले किसान",
    fullEligibility: [
      "Must be a farmer with cultivable land",
      "Land holding must be less than 2 hectares",
      "Annual family income must not exceed ₹2 lakh",
      "Must have Aadhaar card linked to bank account",
      "Not a government employee or income tax payer",
      "Must be a citizen of India",
    ],
    fullEligibilityHi: [
      "कृषि योग्य भूमि वाला किसान होना चाहिए",
      "भूमि 2 हेक्टेयर से कम होनी चाहिए",
      "वार्षिक पारिवारिक आय ₹2 लाख से अधिक नहीं होनी चाहिए",
      "बैंक खाते से जुड़ा आधार कार्ड होना चाहिए",
      "सरकारी कर्मचारी या आयकर दाता नहीं होना चाहिए",
      "भारत का नागरिक होना चाहिए",
    ],
    category: "Agriculture",
    icon: "Wheat",
    maxIncome: 200000,
    maxLand: 2,
    requiresAadhaar: true,
    requiresBankAccount: true,
    forFarmers: true,
    formFields: [
      { key: "full_name", label: "Full Name (as per Aadhaar)", labelHi: "पूरा नाम (आधार के अनुसार)", type: "text", required: true, placeholder: "Enter full name" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit mobile number" },
      { key: "land_size", label: "Land Holding (in acres)", labelHi: "भूमि (एकड़ में)", type: "number", required: true, placeholder: "e.g. 1.5" },
      { key: "bank_account", label: "Bank Account Number", labelHi: "बैंक खाता संख्या", type: "text", required: true, placeholder: "Account number" },
      { key: "ifsc", label: "IFSC Code", labelHi: "आईएफएससी कोड", type: "text", required: true, placeholder: "e.g. SBIN0001234" },
      {
        key: "state", label: "State", labelHi: "राज्य", type: "select", required: true, options: [
          { value: "UP", label: "Uttar Pradesh", labelHi: "उत्तर प्रदेश" },
          { value: "MH", label: "Maharashtra", labelHi: "महाराष्ट्र" },
          { value: "RJ", label: "Rajasthan", labelHi: "राजस्थान" },
          { value: "MP", label: "Madhya Pradesh", labelHi: "मध्य प्रदेश" },
          { value: "GJ", label: "Gujarat", labelHi: "गुजरात" },
          { value: "TN", label: "Tamil Nadu", labelHi: "तमिलनाडु" },
          { value: "AP", label: "Andhra Pradesh", labelHi: "आंध्र प्रदेश" },
          { value: "TS", label: "Telangana", labelHi: "तेलंगाना" },
          { value: "KA", label: "Karnataka", labelHi: "कर्नाटक" },
          { value: "OT", label: "Other", labelHi: "अन्य" },
        ]
      },
    ],
    documents: ["Aadhaar Card", "Land Records / Khasra-Khatauni", "Bank Passbook", "Mobile Number linked to Aadhaar"],
    documentsHi: ["आधार कार्ड", "भूमि अभिलेख / खसरा-खतौनी", "बैंक पासबुक", "आधार से जुड़ा मोबाइल नंबर"],
    officialUrl: "https://pmkisan.gov.in",
    helplineNumber: "155261",
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat (PMJAY)",
    nameHi: "आयुष्मान भारत (PMJAY)",
    ministry: "Ministry of Health & Family Welfare",
    ministryHi: "स्वास्थ्य एवं परिवार कल्याण मंत्रालय",
    benefit: "₹5 lakh health insurance per family per year at empanelled hospitals",
    benefitHi: "₹5 लाख स्वास्थ्य बीमा प्रति परिवार प्रति वर्ष",
    eligibility: "BPL families as per SECC 2011 database",
    eligibilityHi: "SECC 2011 सूची में शामिल BPL परिवार",
    fullEligibility: [
      "Family must be listed in SECC 2011 database",
      "Annual household income below ₹3 lakh (BPL)",
      "No private or government health insurance",
      "Must have valid Aadhaar card",
      "SC/ST families automatically included",
      "Kutcha house, manual labour families prioritised",
    ],
    fullEligibilityHi: [
      "SECC 2011 डेटाबेस में परिवार सूचीबद्ध होना चाहिए",
      "वार्षिक आय ₹3 लाख से कम (BPL)",
      "कोई निजी या सरकारी स्वास्थ्य बीमा नहीं",
      "वैध आधार कार्ड होना चाहिए",
      "SC/ST परिवार स्वतः शामिल",
      "कच्चे मकान वाले, मजदूर परिवारों को प्राथमिकता",
    ],
    category: "Health",
    icon: "Heart",
    maxIncome: 300000,
    requiresAadhaar: true,
    requiresBankAccount: false,
    forBPL: true,
    formFields: [
      { key: "full_name", label: "Head of Family Name", labelHi: "परिवार के मुखिया का नाम", type: "text", required: true, placeholder: "Full name as in Aadhaar" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      { key: "family_size", label: "Family Size", labelHi: "परिवार का आकार", type: "number", required: true, placeholder: "Number of members" },
      { key: "ration_card", label: "Ration Card Number", labelHi: "राशन कार्ड संख्या", type: "text", required: false, placeholder: "If available" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
      {
        key: "state", label: "State", labelHi: "राज्य", type: "select", required: true, options: [
          { value: "UP", label: "Uttar Pradesh", labelHi: "उत्तर प्रदेश" },
          { value: "MH", label: "Maharashtra", labelHi: "महाराष्ट्र" },
          { value: "RJ", label: "Rajasthan", labelHi: "राजस्थान" },
          { value: "MP", label: "Madhya Pradesh", labelHi: "मध्य प्रदेश" },
          { value: "GJ", label: "Gujarat", labelHi: "गुजरात" },
          { value: "TN", label: "Tamil Nadu", labelHi: "तमिलनाडु" },
          { value: "AP", label: "Andhra Pradesh", labelHi: "आंध्र प्रदेश" },
          { value: "TS", label: "Telangana", labelHi: "तेलंगाना" },
          { value: "KA", label: "Karnataka", labelHi: "कर्नाटक" },
          { value: "OT", label: "Other", labelHi: "अन्य" },
        ]
      },
    ],
    documents: ["Aadhaar Card (all family members)", "Ration Card", "Income Certificate", "Caste Certificate (if applicable)"],
    documentsHi: ["सभी सदस्यों का आधार कार्ड", "राशन कार्ड", "आय प्रमाण पत्र", "जाति प्रमाण पत्र (यदि लागू हो)"],
    officialUrl: "https://pmjay.gov.in",
    helplineNumber: "14555",
  },
  {
    id: "mgnrega",
    name: "MGNREGA",
    nameHi: "मनरेगा",
    ministry: "Ministry of Rural Development",
    ministryHi: "ग्रामीण विकास मंत्रालय",
    benefit: "100 days of guaranteed wage employment at ₹200–350/day",
    benefitHi: "100 दिन गारंटी रोज़गार ₹200–350/दिन",
    eligibility: "Any rural adult household member willing to do manual work",
    eligibilityHi: "ग्रामीण परिवार का कोई भी वयस्क",
    fullEligibility: [
      "Must reside in rural area",
      "Must be 18 years or above",
      "Must be willing to do unskilled manual work",
      "Must apply for a Job Card at local Gram Panchayat",
      "Any adult member of a rural household can apply",
      "No income limit — open to all rural residents",
    ],
    fullEligibilityHi: [
      "ग्रामीण क्षेत्र में निवास करना चाहिए",
      "18 वर्ष या उससे अधिक आयु",
      "अकुशल शारीरिक कार्य करने की इच्छा",
      "स्थानीय ग्राम पंचायत में जॉब कार्ड के लिए आवेदन करना होगा",
      "ग्रामीण परिवार का कोई भी वयस्क सदस्य आवेदन कर सकता है",
      "कोई आय सीमा नहीं",
    ],
    category: "Employment",
    icon: "Hammer",
    requiresAadhaar: true,
    requiresBankAccount: true,
    minAge: 18,
    formFields: [
      { key: "full_name", label: "Full Name", labelHi: "पूरा नाम", type: "text", required: true, placeholder: "Name as per Aadhaar" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      { key: "age", label: "Age", labelHi: "आयु", type: "number", required: true, placeholder: "Your age" },
      { key: "village", label: "Village / Gram Panchayat", labelHi: "ग्राम / ग्राम पंचायत", type: "text", required: true, placeholder: "Village name" },
      { key: "bank_account", label: "Bank Account Number", labelHi: "बैंक खाता संख्या", type: "text", required: true, placeholder: "Account number" },
      { key: "ifsc", label: "IFSC Code", labelHi: "आईएफएससी कोड", type: "text", required: true, placeholder: "e.g. SBIN0001234" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
    ],
    documents: ["Aadhaar Card", "Bank Passbook", "Residence Proof", "Passport-size Photo"],
    documentsHi: ["आधार कार्ड", "बैंक पासबुक", "निवास प्रमाण", "पासपोर्ट साइज फोटो"],
    officialUrl: "https://nrega.nic.in",
    helplineNumber: "1800-111-555",
  },
  {
    id: "pm-awas",
    name: "PM Awas Yojana (Gramin)",
    nameHi: "पीएम आवास योजना (ग्रामीण)",
    ministry: "Ministry of Rural Development",
    ministryHi: "ग्रामीण विकास मंत्रालय",
    benefit: "₹1.2 lakh (plains) / ₹1.3 lakh (hills) for house construction",
    benefitHi: "₹1.2 लाख (मैदान) / ₹1.3 लाख (पहाड़) घर निर्माण हेतु",
    eligibility: "Houseless or living in kutcha/dilapidated house",
    eligibilityHi: "बेघर या कच्चे/जीर्ण मकान में रहने वाले",
    fullEligibility: [
      "Houseless family or living in kutcha/dilapidated house",
      "Must be listed in SECC 2011 database",
      "Annual household income below ₹3 lakh",
      "Must not own a pucca house anywhere in India",
      "Priority: SC/ST, minorities, disabled persons",
      "Must have Aadhaar and bank account",
    ],
    fullEligibilityHi: [
      "बेघर परिवार या कच्चे/जीर्ण मकान में रहने वाले",
      "SECC 2011 सूची में होना चाहिए",
      "वार्षिक आय ₹3 लाख से कम",
      "भारत में कहीं भी पक्का मकान नहीं होना चाहिए",
      "प्राथमिकता: SC/ST, अल्पसंख्यक, विकलांग",
      "आधार और बैंक खाता होना चाहिए",
    ],
    category: "Housing",
    icon: "Home",
    maxIncome: 300000,
    requiresAadhaar: true,
    requiresBankAccount: true,
    forBPL: true,
    formFields: [
      { key: "full_name", label: "Full Name (as per Aadhaar)", labelHi: "पूरा नाम (आधार के अनुसार)", type: "text", required: true, placeholder: "Full name" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      {
        key: "house_type", label: "Current House Type", labelHi: "वर्तमान घर का प्रकार", type: "select", required: true, options: [
          { value: "homeless", label: "Homeless / No House", labelHi: "बेघर / कोई घर नहीं" },
          { value: "kutcha", label: "Kutcha House", labelHi: "कच्चा मकान" },
          { value: "tatched", label: "Thatched/Semi-dilapidated", labelHi: "अर्ध-जीर्ण मकान" },
        ]
      },
      {
        key: "land_ownership", label: "Do you own land for construction?", labelHi: "क्या आपके पास निर्माण के लिए भूमि है?", type: "select", required: true, options: [
          { value: "yes", label: "Yes", labelHi: "हाँ" },
          { value: "no", label: "No", labelHi: "नहीं" },
        ]
      },
      { key: "bank_account", label: "Bank Account Number", labelHi: "बैंक खाता संख्या", type: "text", required: true, placeholder: "Account number" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
    ],
    documents: ["Aadhaar Card", "BPL Certificate / Ration Card", "Bank Passbook", "Land Documents", "Income Certificate", "Caste Certificate"],
    documentsHi: ["आधार कार्ड", "BPL प्रमाण पत्र / राशन कार्ड", "बैंक पासबुक", "भूमि दस्तावेज", "आय प्रमाण पत्र", "जाति प्रमाण पत्र"],
    officialUrl: "https://pmayg.nic.in",
    helplineNumber: "1800-11-6446",
  },
  {
    id: "ujjwala",
    name: "PM Ujjwala Yojana 2.0",
    nameHi: "पीएम उज्ज्वला योजना 2.0",
    ministry: "Ministry of Petroleum & Natural Gas",
    ministryHi: "पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय",
    benefit: "Free LPG connection + first refill + hotplate free",
    benefitHi: "मुफ्त LPG कनेक्शन + पहला रिफिल + हॉटप्लेट मुफ्त",
    eligibility: "Adult woman from poor household without LPG connection",
    eligibilityHi: "बिना LPG कनेक्शन वाली BPL महिला (18+ वर्ष)",
    fullEligibility: [
      "Applicant must be an adult woman (18 years or above)",
      "Household must not have an existing LPG connection",
      "Must belong to BPL/SC/ST/OBC/PM-KISAN/MGNREGA beneficiary",
      "Annual household income below ₹2 lakh",
      "Must have Aadhaar card",
      "Must have a bank account",
    ],
    fullEligibilityHi: [
      "आवेदक वयस्क महिला होनी चाहिए (18 वर्ष+)",
      "घर में कोई LPG कनेक्शन नहीं होना चाहिए",
      "BPL/SC/ST/OBC/PM-KISAN/MGNREGA लाभार्थी",
      "वार्षिक आय ₹2 लाख से कम",
      "आधार कार्ड होना चाहिए",
      "बैंक खाता होना चाहिए",
    ],
    category: "Welfare",
    icon: "Flame",
    maxIncome: 200000,
    requiresAadhaar: true,
    requiresBankAccount: true,
    forWomen: true,
    forBPL: true,
    minAge: 18,
    formFields: [
      { key: "full_name", label: "Applicant Name (Woman)", labelHi: "आवेदक का नाम (महिला)", type: "text", required: true, placeholder: "Name as per Aadhaar" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      { key: "age", label: "Age", labelHi: "आयु", type: "number", required: true, placeholder: "Must be 18+" },
      {
        key: "caste_category", label: "Caste Category", labelHi: "जाति वर्ग", type: "select", required: true, options: [
          { value: "SC", label: "Scheduled Caste (SC)", labelHi: "अनुसूचित जाति (SC)" },
          { value: "ST", label: "Scheduled Tribe (ST)", labelHi: "अनुसूचित जनजाति (ST)" },
          { value: "OBC", label: "OBC", labelHi: "OBC" },
          { value: "General_BPL", label: "General (BPL)", labelHi: "सामान्य (BPL)" },
        ]
      },
      { key: "bank_account", label: "Bank Account Number", labelHi: "बैंक खाता संख्या", type: "text", required: true, placeholder: "Account number" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
    ],
    documents: ["Aadhaar Card", "BPL/Ration Card", "Bank Passbook", "Caste Certificate", "Passport-size Photo"],
    documentsHi: ["आधार कार्ड", "BPL/राशन कार्ड", "बैंक पासबुक", "जाति प्रमाण पत्र", "पासपोर्ट साइज फोटो"],
    officialUrl: "https://pmuy.gov.in",
    helplineNumber: "1800-266-6696",
  },
  {
    id: "mudra",
    name: "PM Mudra Yojana",
    nameHi: "पीएम मुद्रा योजना",
    ministry: "Ministry of Finance",
    ministryHi: "वित्त मंत्रालय",
    benefit: "Collateral-free loans: Shishu (₹50K), Kishore (₹5L), Tarun (₹10L)",
    benefitHi: "बिना गारंटी ऋण: शिशु (₹50K), किशोर (₹5L), तरुण (₹10L)",
    eligibility: "Non-farm micro/small businesses, artisans, traders",
    eligibilityHi: "गैर-कृषि लघु व्यवसाय, कारीगर, व्यापारी",
    fullEligibility: [
      "Non-corporate, non-farm small/micro business",
      "Age must be 18 years or above",
      "Must not be a defaulter of any bank",
      "Business plan or existing business proof required",
      "No minimum income required for Shishu loans",
      "Good credit history for Kishore/Tarun loans",
    ],
    fullEligibilityHi: [
      "गैर-कॉर्पोरेट, गैर-कृषि लघु/सूक्ष्म व्यवसाय",
      "18 वर्ष या उससे अधिक आयु",
      "किसी भी बैंक का चूककर्ता नहीं होना चाहिए",
      "व्यवसाय योजना या मौजूदा व्यवसाय का प्रमाण",
      "शिशु ऋण के लिए न्यूनतम आय आवश्यक नहीं",
      "किशोर/तरुण के लिए अच्छा क्रेडिट इतिहास",
    ],
    category: "Business",
    icon: "Banknote",
    requiresAadhaar: true,
    requiresBankAccount: true,
    minAge: 18,
    formFields: [
      { key: "full_name", label: "Full Name", labelHi: "पूरा नाम", type: "text", required: true, placeholder: "Name as per Aadhaar" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      {
        key: "business_type", label: "Type of Business", labelHi: "व्यवसाय का प्रकार", type: "select", required: true, options: [
          { value: "existing", label: "Existing Business", labelHi: "मौजूदा व्यवसाय" },
          { value: "new", label: "New Business / Startup", labelHi: "नया व्यवसाय / स्टार्टअप" },
        ]
      },
      {
        key: "loan_category", label: "Loan Category", labelHi: "ऋण श्रेणी", type: "select", required: true, options: [
          { value: "shishu", label: "Shishu (up to ₹50,000)", labelHi: "शिशु (₹50,000 तक)" },
          { value: "kishore", label: "Kishore (₹50K–₹5L)", labelHi: "किशोर (₹50K–₹5L)" },
          { value: "tarun", label: "Tarun (₹5L–₹10L)", labelHi: "तरुण (₹5L–₹10L)" },
        ]
      },
      { key: "loan_amount", label: "Loan Amount Required (₹)", labelHi: "आवश्यक ऋण राशि (₹)", type: "number", required: true, placeholder: "Amount in rupees" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
    ],
    documents: ["Aadhaar Card", "PAN Card", "Business Registration (if any)", "Bank Statement (6 months)", "Passport-size Photo", "IT Returns (for Kishore/Tarun)"],
    documentsHi: ["आधार कार्ड", "पैन कार्ड", "व्यवसाय पंजीकरण (यदि हो)", "बैंक स्टेटमेंट (6 महीने)", "पासपोर्ट साइज फोटो", "आयकर रिटर्न (किशोर/तरुण)"],
    officialUrl: "https://mudra.org.in",
    helplineNumber: "1800-180-1111",
  },
  {
    id: "sukanya",
    name: "Sukanya Samriddhi Yojana",
    nameHi: "सुकन्या समृद्धि योजना",
    ministry: "Ministry of Finance",
    ministryHi: "वित्त मंत्रालय",
    benefit: "8.2% annual interest on savings for girl child education & marriage",
    benefitHi: "बालिका की शिक्षा व विवाह हेतु 8.2% वार्षिक ब्याज",
    eligibility: "Girl child below 10 years of age",
    eligibilityHi: "10 वर्ष से कम आयु की बालिका",
    fullEligibility: [
      "Girl child must be below 10 years of age",
      "Account opened in name of girl, operated by guardian",
      "Only 2 accounts per family (one per girl child)",
      "Annual deposit: minimum ₹250, maximum ₹1.5 lakh",
      "Account matures after 21 years from opening",
      "Withdrawal allowed at 18 years for education/marriage",
    ],
    fullEligibilityHi: [
      "बालिका की आयु 10 वर्ष से कम होनी चाहिए",
      "खाता बालिका के नाम, अभिभावक द्वारा संचालित",
      "एक परिवार में अधिकतम 2 खाते (प्रत्येक बालिका के लिए एक)",
      "वार्षिक जमा: न्यूनतम ₹250, अधिकतम ₹1.5 लाख",
      "खाता खोलने के 21 साल बाद परिपक्व होगा",
      "18 साल बाद शिक्षा/विवाह के लिए निकासी allowed",
    ],
    category: "Women & Child",
    icon: "Baby",
    requiresAadhaar: true,
    forWomen: true,
    maxAge: 10,
    formFields: [
      { key: "girl_name", label: "Girl Child's Full Name", labelHi: "बालिका का पूरा नाम", type: "text", required: true, placeholder: "Name as per birth certificate" },
      { key: "girl_dob", label: "Girl Child's Date of Birth", labelHi: "बालिका की जन्म तिथि", type: "date", required: true },
      { key: "guardian_name", label: "Guardian / Parent Name", labelHi: "अभिभावक / माता-पिता का नाम", type: "text", required: true, placeholder: "Guardian's full name" },
      { key: "guardian_aadhaar", label: "Guardian's Aadhaar Number", labelHi: "अभिभावक का आधार नंबर", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      { key: "annual_deposit", label: "Planned Annual Deposit (₹)", labelHi: "वार्षिक जमा राशि (₹)", type: "number", required: true, placeholder: "Min ₹250, Max ₹1,50,000" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
    ],
    documents: ["Girl Child's Birth Certificate", "Aadhaar Card (Guardian)", "Passport-size Photo (Girl & Guardian)", "Address Proof"],
    documentsHi: ["बालिका का जन्म प्रमाण पत्र", "आधार कार्ड (अभिभावक)", "पासपोर्ट साइज फोटो (बालिका और अभिभावक)", "पता प्रमाण"],
    officialUrl: "https://nsiindia.gov.in",
    helplineNumber: "1800-11-2312",
  },
  {
    id: "fasal-bima",
    name: "PM Fasal Bima Yojana",
    nameHi: "पीएम फसल बीमा योजना",
    ministry: "Ministry of Agriculture & Farmers' Welfare",
    ministryHi: "कृषि एवं किसान कल्याण मंत्रालय",
    benefit: "Crop loss insurance at just 1.5–2% premium for farmers",
    benefitHi: "मात्र 1.5–2% प्रीमियम पर फसल क्षति बीमा",
    eligibility: "All farmers growing notified crops in notified areas",
    eligibilityHi: "अधिसूचित क्षेत्रों में अधिसूचित फसल उगाने वाले सभी किसान",
    fullEligibility: [
      "Must be a farmer (owner or tenant/sharecropper)",
      "Must grow notified crops in notified areas",
      "Kharif crops: premium 2%, Rabi: 1.5%, Commercial: 5%",
      "Must apply before Kharif or Rabi season deadline",
      "Must have Aadhaar and bank account",
      "Loanee farmers automatically enrolled — non-loanee must apply",
    ],
    fullEligibilityHi: [
      "किसान होना चाहिए (मालिक या किरायेदार/बटाईदार)",
      "अधिसूचित क्षेत्रों में अधिसूचित फसलें उगानी चाहिए",
      "खरीफ: 2%, रबी: 1.5%, वाणिज्यिक: 5% प्रीमियम",
      "खरीफ या रबी सीजन की डेडलाइन से पहले आवेदन करें",
      "आधार और बैंक खाता होना चाहिए",
      "ऋणी किसान स्वतः नामांकित — गैर-ऋणी को आवेदन करना होगा",
    ],
    category: "Agriculture",
    icon: "ShieldCheck",
    requiresAadhaar: true,
    requiresBankAccount: true,
    forFarmers: true,
    formFields: [
      { key: "full_name", label: "Farmer's Full Name", labelHi: "किसान का पूरा नाम", type: "text", required: true, placeholder: "Name as per Aadhaar" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      {
        key: "crop_type", label: "Crop Type", labelHi: "फसल का प्रकार", type: "select", required: true, options: [
          { value: "kharif", label: "Kharif (Rice, Cotton, Maize)", labelHi: "खरीफ (धान, कपास, मक्का)" },
          { value: "rabi", label: "Rabi (Wheat, Mustard, Gram)", labelHi: "रबी (गेहूं, सरसों, चना)" },
          { value: "horticulture", label: "Horticulture / Commercial", labelHi: "बागवानी / वाणिज्यिक" },
        ]
      },
      { key: "land_size", label: "Insured Land Area (acres)", labelHi: "बीमित भूमि (एकड़)", type: "number", required: true, placeholder: "Acres of land" },
      { key: "bank_account", label: "Bank Account Number", labelHi: "बैंक खाता संख्या", type: "text", required: true, placeholder: "Account number" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
    ],
    documents: ["Aadhaar Card", "Land Records (Khasra)", "Bank Passbook", "Crop Sowing Certificate"],
    documentsHi: ["आधार कार्ड", "भूमि अभिलेख (खसरा)", "बैंक पासबुक", "फसल बोवाई प्रमाण पत्र"],
    officialUrl: "https://pmfby.gov.in",
    helplineNumber: "1800-200-7710",
  },
  {
    id: "scholarship",
    name: "National Scholarship Portal",
    nameHi: "राष्ट्रीय छात्रवृत्ति पोर्टल",
    ministry: "Ministry of Education",
    ministryHi: "शिक्षा मंत्रालय",
    benefit: "₹12,000–₹50,000/year scholarship for students",
    benefitHi: "₹12,000–₹50,000/वर्ष छात्रवृत्ति",
    eligibility: "Students from EWS/OBC/SC/ST with family income < ₹2.5 lakh",
    eligibilityHi: "EWS/OBC/SC/ST श्रेणी के छात्र, पारिवारिक आय ₹2.5 लाख से कम",
    fullEligibility: [
      "Must be enrolled in Class 1 to PhD level",
      "Family annual income must be below ₹2.5 lakh",
      "Must belong to SC/ST/OBC/EWS/Minority category",
      "Minimum 50% marks in previous class",
      "Must not be availing another scholarship simultaneously",
      "Must have Aadhaar linked to bank account",
    ],
    fullEligibilityHi: [
      "कक्षा 1 से PhD स्तर तक नामांकित होना चाहिए",
      "पारिवारिक वार्षिक आय ₹2.5 लाख से कम",
      "SC/ST/OBC/EWS/अल्पसंख्यक वर्ग से होना चाहिए",
      "पिछली कक्षा में न्यूनतम 50% अंक",
      "एक साथ अन्य छात्रवृत्ति नहीं लेनी चाहिए",
      "बैंक खाते से जुड़ा आधार होना चाहिए",
    ],
    category: "Education",
    icon: "GraduationCap",
    maxIncome: 250000,
    requiresAadhaar: true,
    requiresBankAccount: true,
    forStudents: true,
    formFields: [
      { key: "full_name", label: "Student's Full Name", labelHi: "छात्र का पूरा नाम", type: "text", required: true, placeholder: "Name as per Aadhaar" },
      { key: "aadhaar_number", label: "Aadhaar Number", labelHi: "आधार संख्या", type: "text", required: true, placeholder: "XXXX XXXX XXXX" },
      {
        key: "class_level", label: "Current Class / Level", labelHi: "वर्तमान कक्षा/स्तर", type: "select", required: true, options: [
          { value: "pre_matric", label: "Pre-Matric (Class 1–10)", labelHi: "प्री-मैट्रिक (कक्षा 1–10)" },
          { value: "post_matric", label: "Post-Matric (Class 11–12)", labelHi: "पोस्ट-मैट्रिक (कक्षा 11–12)" },
          { value: "ug", label: "Under Graduate (UG)", labelHi: "स्नातक (UG)" },
          { value: "pg", label: "Post Graduate (PG)", labelHi: "स्नातकोत्तर (PG)" },
          { value: "phd", label: "PhD / Research", labelHi: "PhD / शोध" },
        ]
      },
      {
        key: "caste_category", label: "Category", labelHi: "वर्ग", type: "select", required: true, options: [
          { value: "SC", label: "Scheduled Caste (SC)", labelHi: "अनुसूचित जाति (SC)" },
          { value: "ST", label: "Scheduled Tribe (ST)", labelHi: "अनुसूचित जनजाति (ST)" },
          { value: "OBC", label: "OBC", labelHi: "OBC" },
          { value: "EWS", label: "Economically Weaker Section (EWS)", labelHi: "आर्थिक रूप से कमजोर वर्ग (EWS)" },
          { value: "Minority", label: "Minority", labelHi: "अल्पसंख्यक" },
        ]
      },
      { key: "percentage", label: "Last Exam Percentage (%)", labelHi: "पिछली परीक्षा में प्रतिशत (%)", type: "number", required: true, placeholder: "e.g. 65" },
      { key: "institution", label: "Institution Name", labelHi: "संस्थान का नाम", type: "text", required: true, placeholder: "School/College name" },
      { key: "bank_account", label: "Bank Account Number", labelHi: "बैंक खाता संख्या", type: "text", required: true, placeholder: "Account number" },
    ],
    documents: ["Aadhaar Card", "Income Certificate", "Caste Certificate", "Last Marksheet", "Admission Proof", "Bank Passbook"],
    documentsHi: ["आधार कार्ड", "आय प्रमाण पत्र", "जाति प्रमाण पत्र", "पिछली मार्कशीट", "प्रवेश प्रमाण", "बैंक पासबुक"],
    officialUrl: "https://scholarships.gov.in",
    helplineNumber: "0120-6619540",
  },
  {
    id: "jan-dhan",
    name: "Jan Dhan Yojana (PMJDY)",
    nameHi: "जन धन योजना (PMJDY)",
    ministry: "Ministry of Finance",
    ministryHi: "वित्त मंत्रालय",
    benefit: "Zero-balance bank account + RuPay debit card + ₹1L accident insurance",
    benefitHi: "शून्य-बैलेंस खाता + RuPay डेबिट कार्ड + ₹1L दुर्घटना बीमा",
    eligibility: "Any Indian citizen above 10 years without a bank account",
    eligibilityHi: "बिना बैंक खाते वाला 10+ वर्ष का कोई भी भारतीय नागरिक",
    fullEligibility: [
      "Must be an Indian citizen",
      "Age must be 10 years or above",
      "Should not already have an existing bank account",
      "No minimum deposit required to open account",
      "Overdraft facility of ₹10,000 after 6 months",
      "Aadhaar preferred but not mandatory",
    ],
    fullEligibilityHi: [
      "भारत का नागरिक होना चाहिए",
      "आयु 10 वर्ष या उससे अधिक होनी चाहिए",
      "पहले से बैंक खाता नहीं होना चाहिए",
      "खाता खोलने के लिए न्यूनतम जमा की आवश्यकता नहीं",
      "6 महीने बाद ₹10,000 का ओवरड्राफ्ट",
      "आधार प्रस्तावित लेकिन अनिवार्य नहीं",
    ],
    category: "Financial",
    icon: "Landmark",
    requiresAadhaar: false,
    minAge: 10,
    formFields: [
      { key: "full_name", label: "Full Name", labelHi: "पूरा नाम", type: "text", required: true, placeholder: "Name as per ID proof" },
      { key: "aadhaar_number", label: "Aadhaar Number (preferred)", labelHi: "आधार संख्या (प्रस्तावित)", type: "text", required: false, placeholder: "XXXX XXXX XXXX" },
      { key: "age", label: "Age", labelHi: "आयु", type: "number", required: true, placeholder: "Must be 10+" },
      { key: "mobile", label: "Mobile Number", labelHi: "मोबाइल नंबर", type: "text", required: true, placeholder: "10-digit number" },
      { key: "nominee_name", label: "Nominee Name", labelHi: "नामांकित व्यक्ति का नाम", type: "text", required: true, placeholder: "Nominee full name" },
    ],
    documents: ["Aadhaar Card OR Voter ID / Passport / Driving License", "Passport-size Photo", "Mobile Number"],
    documentsHi: ["आधार कार्ड या मतदाता पहचान पत्र / पासपोर्ट / ड्राइविंग लाइसेंस", "पासपोर्ट साइज फोटो", "मोबाइल नंबर"],
    officialUrl: "https://pmjdy.gov.in",
    helplineNumber: "1800-11-0001",
  },
];

export const categories = [...new Set(schemes.map((s) => s.category))];

// User profile for AI scheme matching
export interface UserProfile {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  state: string;
  annualIncome: number;
  landHolding: number; // hectares
  occupation: "farmer" | "labourer" | "business" | "student" | "unemployed" | "other";
  category: "SC" | "ST" | "OBC" | "General" | "EWS" | "Minority";
  hasBankAccount: boolean;
  hasAadhaar: boolean;
  hasBPLCard: boolean;
  hasLPGConnection: boolean;
  hasGirlChild: boolean;
  girlChildAge?: number;
  isStudent: boolean;
}

export function matchSchemes(profile: UserProfile): { scheme: Scheme; score: number; reasons: string[] }[] {
  const results: { scheme: Scheme; score: number; reasons: string[] }[] = [];

  for (const scheme of schemes) {
    let score = 0;
    const reasons: string[] = [];
    let disqualified = false;

    // Income check
    if (scheme.maxIncome && profile.annualIncome > scheme.maxIncome) {
      disqualified = true;
    }

    // Land check
    if (scheme.maxLand && profile.landHolding > scheme.maxLand * 2.47) {
      disqualified = true; // maxLand is in hectares, convert to acres
    }

    // Age check
    if (scheme.minAge && profile.age < scheme.minAge) {
      disqualified = true;
    }
    if (scheme.maxAge && profile.age > scheme.maxAge) {
      disqualified = true;
    }

    // Women-only
    if (scheme.forWomen && profile.gender !== "female") {
      disqualified = true;
    }

    // Bank account required
    if (scheme.requiresBankAccount && !profile.hasBankAccount) {
      // deduct points but don't disqualify — they can open one
      reasons.push("You'll need to open a bank account first");
    }

    if (disqualified) continue;

    // Positive scoring
    if (scheme.forFarmers && profile.occupation === "farmer") { score += 30; reasons.push("You are a farmer ✓"); }
    if (scheme.forStudents && profile.isStudent) { score += 30; reasons.push("You are a student ✓"); }
    if (scheme.forBPL && profile.hasBPLCard) { score += 25; reasons.push("You have BPL card ✓"); }
    if (scheme.forWomen && profile.gender === "female") { score += 25; reasons.push("Scheme for women ✓"); }

    // Ujjwala — no LPG
    if (scheme.id === "ujjwala" && !profile.hasLPGConnection && profile.gender === "female") { score += 40; reasons.push("No LPG connection — perfect match! ✓"); }
    if (scheme.id === "ujjwala" && profile.hasLPGConnection) { disqualified = true; continue; }

    // Sukanya — girl child
    if (scheme.id === "sukanya" && profile.hasGirlChild && (profile.girlChildAge || 0) < 10) { score += 50; reasons.push("You have a girl child under 10 ✓"); }
    if (scheme.id === "sukanya" && (!profile.hasGirlChild || (profile.girlChildAge || 99) >= 10)) continue;

    // Jan Dhan — no bank account
    if (scheme.id === "jan-dhan") {
      if (!profile.hasBankAccount) { score += 40; reasons.push("No bank account — this is perfect! ✓"); }
      else { score += 10; reasons.push("Already have account, but can check overdraft"); }
    }

    // Income-based scoring
    if (scheme.maxIncome) {
      const incomePct = profile.annualIncome / scheme.maxIncome;
      if (incomePct < 0.5) { score += 20; reasons.push("Income well within limit ✓"); }
      else if (incomePct < 0.85) { score += 10; reasons.push("Income within limit ✓"); }
    } else {
      score += 10; // No income restriction
    }

    // Category bonus
    if (["SC", "ST"].includes(profile.category)) {
      score += 15;
      reasons.push(`${profile.category} category — priority ✓`);
    } else if (profile.category === "OBC" || profile.category === "EWS") {
      score += 8;
    }

    if (score > 0) {
      results.push({ scheme, score, reasons });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
