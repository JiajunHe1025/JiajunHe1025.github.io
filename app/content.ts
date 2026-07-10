export type Locale = "zh" | "en" | "ja";

type LinkItem = {
  label: string;
  href: string;
};

type ResearchItem = {
  number: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  figure: string;
  figureAlt: string;
  paper: string;
};

type PublicationItem = {
  year: string;
  venue: string;
  code: string;
  title: string;
  note: string;
  href: string;
  authors?: string;
  citations?: number;
};

type JourneyItem = {
  period: string;
  organization: string;
  role: string;
  note?: string;
  current?: boolean;
};

export type SiteContent = {
  htmlLang: string;
  pageTitle: string;
  languageLabel: string;
  nav: { label: string; href: string }[];
  hero: {
    eyebrow: string;
    name: string;
    romanName: string;
    headline: string;
    introduction: string;
    current: string;
    primaryCta: string;
    secondaryCta: string;
    portraitAlt: string;
    availability: string;
  };
  metrics: { value: string; label: string; detail: string }[];
  now: {
    index: string;
    eyebrow: string;
    title: string;
    organization: string;
    period: string;
    description: string;
  };
  research: {
    index: string;
    eyebrow: string;
    title: string;
    introduction: string;
    items: ResearchItem[];
  };
  publications: {
    index: string;
    eyebrow: string;
    title: string;
    introduction: string;
    linkLabel: string;
    scholarLabel: string;
    scholarUrl: string;
    items: PublicationItem[];
  };
  journey: {
    index: string;
    eyebrow: string;
    title: string;
    experienceTitle: string;
    educationTitle: string;
    experience: JourneyItem[];
    education: JourneyItem[];
  };
  recognition: {
    index: string;
    eyebrow: string;
    title: string;
    awards: { year: string; title: string; note: string }[];
    skillsTitle: string;
    skillGroups: { label: string; items: string[] }[];
  };
  hobbies: {
    index: string;
    eyebrow: string;
    title: string;
    introduction: string;
    mapLabel: string;
    visitedLabel: string;
    placeholderTitle: string;
    placeholderBody: string;
  };
  contact: {
    index: string;
    eyebrow: string;
    title: string;
    description: string;
    links: LinkItem[];
    emailLabel: string;
  };
  footer: string;
};

const sharedPublications: PublicationItem[] = [
  {
    year: "2026",
    venue: "Computer Speech & Language",
    code: "CSL",
    title: "Robust Speech Emotion Recognition under Human Speech Noise",
    authors: "Jinyi Mi · Xiaohan Shi · Ding Ma · Jiajun He · Takuya Fujimura · Tomoki Toda",
    citations: 1,
    note: "",
    href: "https://doi.org/10.1016/j.csl.2026.101987",
  },
  {
    year: "2026",
    venue: "arXiv:2606.01905",
    code: "ELEC-SPEECH",
    title: "Advancing Electrolaryngeal Speech Enhancement Through Speech-Text Representation Learning",
    authors: "Ding Ma · Jinyi Mi · Fengji Li · Lester Phillip Violeta · Jiajun He · et al.",
    citations: 0,
    note: "Preprint",
    href: "https://arxiv.org/abs/2606.01905",
  },
  {
    year: "2026",
    venue: "IEEE TBME",
    code: "IEEE TBME",
    title: "EMBC Special Issue: Advancing Electrolaryngeal Speech Enhancement Through Speech-Text Representation Learning",
    authors: "Ding Ma · Jinyi Mi · Fengji Li · Lester Phillip Violeta · Jiajun He · et al.",
    citations: 0,
    note: "Journal version",
    href: "https://doi.org/10.1109/TBME.2026.3694703",
  },
  {
    year: "2026",
    venue: "PsyArXiv / OSF",
    code: "REVIEW",
    title: "A Comprehensive Review in Unimodal and Multimodal Emotion Recognition",
    authors: "Jiachen Luo · Qu Yang · Jiajun He · et al.",
    citations: 0,
    note: "Review",
    href: "https://doi.org/10.31234/osf.io/pny2b_v1",
  },
  {
    year: "2026",
    venue: "IEEE TASLP",
    code: "NSER",
    title: "A Comprehensive Study on the Effectiveness of ASR Representations for Noise-Robust Speech Emotion Recognition",
    authors: "Xiaohan Shi · Jiajun He · Xingfeng Li · Tomoki Toda",
    citations: 2,
    note: "",
    href: "https://doi.org/10.1109/TASLPRO.2026.3654273",
  },
  {
    year: "2025",
    venue: "IEEE TASLP",
    code: "M4SER",
    title: "M4SER: Multimodal, Multirepresentation, Multitask, and Multistrategy Learning for Speech Emotion Recognition",
    authors: "Jiajun He · Xiaohan Shi · Cheng-Hung Hu · Jinyi Mi · Xingfeng Li · Tomoki Toda",
    citations: 3,
    note: "",
    href: "https://doi.org/10.1109/TASLPRO.2025.3614428",
  },
  {
    year: "2025",
    venue: "IEEE ASRU",
    code: "PARCO",
    title: "PARCO: Phoneme-Augmented Robust Contextual ASR via Contrastive Entity Disambiguation",
    authors: "Jiajun He · Naoki Sawada · Koichi Miyazaki · Tomoki Toda",
    citations: 1,
    note: "",
    href: "https://doi.org/10.1109/ASRU65441.2025.11434772",
  },
  {
    year: "2025",
    venue: "IEEE TASLP",
    code: "PMF-CEC",
    title: "PMF-CEC: Phoneme-Augmented Multimodal Fusion for Context-Aware ASR Error Correction with Error-Specific Selective Decoding",
    authors: "Jiajun He · Tomoki Toda",
    citations: 4,
    note: "",
    href: "https://doi.org/10.1109/TASLPRO.2025.3577356",
  },
  {
    year: "2025",
    venue: "INTERSPEECH",
    code: "GIA-MIC",
    title: "GIA-MIC: Multimodal Emotion Recognition with Gated Interactive Attention and Modality-Invariant Learning Constraints",
    authors: "Jiajun He · Jinyi Mi · Tomoki Toda",
    citations: 5,
    note: "",
    href: "https://www.isca-archive.org/interspeech_2025/he25c_interspeech.html",
  },
  {
    year: "2025",
    venue: "INTERSPEECH",
    code: "CMT-LLM",
    title: "CMT-LLM: Contextual Multi-Talker ASR Utilizing Large Language Models",
    authors: "Jiajun He · Naoki Sawada · Koichi Miyazaki · Tomoki Toda",
    citations: 4,
    note: "",
    href: "https://www.isca-archive.org/interspeech_2025/he25_interspeech.html",
  },
  {
    year: "2024",
    venue: "APSIPA ASC",
    code: "TSE-SER",
    title: "Two-Stage Framework for Robust Speech Emotion Recognition Using Target Speaker Extraction in Human Speech Noise Conditions",
    authors: "Jinyi Mi · Xiaohan Shi · Ding Ma · Jiajun He · Takuya Fujimura · Tomoki Toda",
    citations: 8,
    note: "",
    href: "https://doi.org/10.1109/APSIPAASC63619.2025.10848943",
  },
  {
    year: "2024",
    venue: "INTERSPEECH",
    code: "2DP-2MRC",
    title: "2DP-2MRC: 2-Dimensional Pointer-Based Machine Reading Comprehension Method for Multimodal Moment Retrieval",
    authors: "Jiajun He · Tomoki Toda",
    citations: 3,
    note: "",
    href: "https://www.isca-archive.org/interspeech_2024/he24_interspeech.html",
  },
  {
    year: "2024",
    venue: "IEEE ICASSP",
    code: "MF-AED-AEC",
    title: "MF-AED-AEC: Speech Emotion Recognition by Leveraging Multimodal Fusion, ASR Error Detection, and ASR Error Correction",
    authors: "Jiajun He · Xiaohan Shi · Xingfeng Li · Tomoki Toda",
    citations: 41,
    note: "",
    href: "https://doi.org/10.1109/ICASSP48485.2024.10446548",
  },
  {
    year: "2024",
    venue: "APSIPA ASC",
    code: "VIDEO-SUM",
    title: "Multi-Modal Video Summarization Based on Two-Stage Fusion of Audio, Visual, and Recognized Text Information",
    authors: "Zekun Yang · Jiajun He · Tomoki Toda",
    citations: 7,
    note: "",
    href: "https://doi.org/10.1109/APSIPAASC63619.2025.10849046",
  },
  {
    year: "2024",
    venue: "APSIPA ASC",
    code: "LAYER-ADAPTER",
    title: "A Study on Multimodal Fusion and Layer Adapter in Emotion Recognition",
    authors: "Xiaohan Shi · Yuan Gao · Jiajun He · Jinyi Mi · Xingfeng Li · Tomoki Toda",
    citations: 7,
    note: "",
    href: "https://doi.org/10.1109/APSIPAASC63619.2025.10848773",
  },
  {
    year: "2023",
    venue: "IEEE ASRU",
    code: "ED-CEC",
    title: "ED-CEC: Improving Rare Word Recognition Using ASR Postprocessing Based on Error Detection and Context-Aware Error Correction",
    authors: "Jiajun He · Zekun Yang · Tomoki Toda",
    citations: 8,
    note: "",
    href: "https://doi.org/10.1109/ASRU57964.2023.10389661",
  },
  {
    year: "2023",
    venue: "IEICE Technical Report",
    code: "IEICE",
    title: "Enhancing Recognition of Rare Words in ASR Through Error Detection and Context-Aware Error Correction",
    authors: "Jiajun He · Zekun Yang · Tomoki Toda",
    citations: 4,
    note: "",
    href: "https://ken.ieice.org/ken/paper/20231203gCzJ/eng/",
  },
  {
    year: "2023",
    venue: "arXiv:2311.07093",
    code: "NOISY-SER",
    title: "On the Effectiveness of ASR Representations in Real-World Noisy Speech Emotion Recognition",
    authors: "Xiaohan Shi · Jiajun He · Xingfeng Li · Tomoki Toda",
    citations: 6,
    note: "Preprint",
    href: "https://arxiv.org/abs/2311.07093",
  },
  {
    year: "2023",
    venue: "MoRE",
    code: "MER 2023",
    title: "Semi-Supervised Multimodal Emotion Recognition with Consensus Decision-Making and Label Correction",
    authors: "Jingguang Tian · Desheng Hu · Xiaohan Shi · Jiajun He · et al.",
    citations: 19,
    note: "",
    href: "https://doi.org/10.1145/3607865.3613182",
  },
  {
    year: "2022",
    venue: "JACMP",
    code: "ULTRASOUND",
    title: "Deep Learning for Emergency Ascites Diagnosis Using Ultrasonography Images",
    authors: "Zhanye Lin · Zhengyi Li · Peng Cao · Yingying Lin · Fengting Liang · Jiajun He · Libing Huang",
    citations: 30,
    note: "",
    href: "https://doi.org/10.1002/acm2.13695",
  },
  {
    year: "2021",
    venue: "arXiv:2108.06444",
    code: "MRC-NER",
    title: "A New Entity Extraction Method Based on Machine Reading Comprehension",
    authors: "Xiaobo Jiang · Kun He · Jiajun He · Guangyu Yan",
    citations: 8,
    note: "Preprint",
    href: "https://arxiv.org/abs/2108.06444",
  },
  {
    year: "2020",
    venue: "IEEE ICCT",
    code: "LDPC",
    title: "A Deep Learning-Aided Post-Processing Scheme to Lower the Error Floor of LDPC Codes",
    authors: "Jiajun He",
    citations: 5,
    note: "",
    href: "https://doi.org/10.1109/ICCT50939.2020.9295784",
  },
];

export const content: Record<Locale, SiteContent> = {
  zh: {
    htmlLang: "zh-Hans",
    pageTitle: "何嘉俊 | 语音与多模态智能研究",
    languageLabel: "选择语言",
    nav: [
      { label: "研究", href: "#research" },
      { label: "论文", href: "#publications" },
      { label: "经历", href: "#journey" },
      { label: "荣誉", href: "#recognition" },
      { label: "爱好", href: "#hobbies" },
      { label: "笔记", href: "/notes/" },
      { label: "联系", href: "#contact" },
    ],
    hero: {
      eyebrow: "语音 · 语言 · 多模态智能",
      name: "何嘉俊",
      romanName: "Jiajun He",
      headline: "让机器在真实世界中，更准确地听懂语言、说话人与情绪。",
      introduction:
        "我的研究横跨上下文语音识别、语音情感计算、多说话人建模与大语言模型，关注能够真正进入复杂场景的智能系统。",
      current: "现于阿里巴巴通义实验室",
      primaryCta: "查看研究",
      secondaryCta: "浏览论文",
      portraitAlt: "何嘉俊的个人照片",
      availability: "2026.06 — 至今",
    },
    metrics: [
      { value: "70.42%", label: "最高错误率降幅", detail: "AISHELL-1 · Contextual ASR" },
      { value: "7.9%", label: "多说话人识别 WER", detail: "LibriMix · CMT-LLM" },
      { value: "+4.1", label: "情感识别提升", detail: "百分点 · IEMOCAP" },
      { value: "22", label: "Google Scholar 记录", detail: "截至 2026.07" },
    ],
    now: {
      index: "01",
      eyebrow: "现在",
      title: "从研究问题，走向真实世界的智能系统。",
      organization: "阿里巴巴 · 通义实验室",
      period: "2026 年 6 月 — 至今",
      description:
        "自 2026 年 6 月起在阿里巴巴通义实验室工作，延续对语音、语言与多模态智能的长期探索。",
    },
    research: {
      index: "02",
      eyebrow: "研究",
      title: "围绕“听懂”这件事，拆解真实场景中的难题。",
      introduction:
        "从稀有词与实体识别，到重叠语音和情绪理解，我关注的不只是基准分数，而是模型面对噪声、上下文与多模态线索时的可靠性。",
      items: [
        {
          number: "R / 01",
          title: "上下文语音识别",
          description:
            "用音素增强、实体级目标与上下文偏置，让模型在品牌名、人名和专业术语等稀有词上更准确。",
          metric: "−70.42%",
          metricLabel: "AISHELL-1 最高 CER 降幅",
          tags: ["Contextual ASR", "Rare Words", "Error Correction"],
          figure: "/research/contextual-asr.png",
          figureAlt: "上下文语音识别模型结构图",
          paper: "PMF-CEC / PARCO",
        },
        {
          number: "R / 02",
          title: "多说话人 ASR × LLM",
          description:
            "结合 WavLM 与 Vicuna，从 5,000+ 候选词中筛选有效上下文，改善会议与重叠语音中的识别。",
          metric: "7.9%",
          metricLabel: "LibriMix WER",
          tags: ["Multi-talker", "LLM", "WavLM"],
          figure: "/research/multitalker-llm.png",
          figureAlt: "结合大语言模型的多说话人语音识别框架图",
          paper: "CMT-LLM · INTERSPEECH 2025",
        },
        {
          number: "R / 03",
          title: "情感与多模态理解",
          description:
            "融合语音、文本与视频表征，并把 ASR 纠错纳入情感识别链路，让模型理解说了什么，也理解如何说。",
          metric: "+4.1",
          metricLabel: "IEMOCAP 绝对提升 / 百分点",
          tags: ["Speech Emotion", "Multimodal", "Video"],
          figure: "/research/multimodal-emotion.png",
          figureAlt: "多模态语音情感识别方法图",
          paper: "M4SER / GIA-MIC",
        },
      ],
    },
    publications: {
      index: "03",
      eyebrow: "全部论文",
      title: "从 2020 到 2026，完整记录研究轨迹。",
      introduction:
        "以下收录 Google Scholar 当前全部 22 条记录，包含期刊、会议、预印本及同一工作的不同版本；链接优先指向 DOI、arXiv 或官方论文页面。",
      linkLabel: "阅读论文",
      scholarLabel: "在 Google Scholar 查看完整档案",
      scholarUrl: "https://scholar.google.com/citations?hl=en&user=4mIKAZwAAAAJ&view_op=list_works&sortby=pubdate",
      items: sharedPublications,
    },
    journey: {
      index: "04",
      eyebrow: "经历",
      title: "在产业、实验室与跨学科项目之间持续迭代。",
      experienceTitle: "工作与研究",
      educationTitle: "教育",
      experience: [
        {
          period: "2026.06 — 至今",
          organization: "阿里巴巴 · 通义实验室",
          role: "现职",
          current: true,
        },
        {
          period: "2025.10 — 2026",
          organization: "名古屋大学 · 信息基础中心 / 户田研究室",
          role: "研究员",
        },
        {
          period: "2024.08 — 2025.09",
          organization: "CyberAgent · AI Lab Audio Group",
          role: "算法工程师实习生",
          note: "东京 · 上下文 ASR 与多说话人 ASR",
        },
      ],
      education: [
        {
          period: "2021.10 — 2026.03",
          organization: "名古屋大学",
          role: "计算机科学与技术 · 博士",
          note: "户田研究室 · GPA A",
        },
        {
          period: "2018.09 — 2021.06",
          organization: "华南理工大学",
          role: "微电子学与固体电子学 · 硕士",
          note: "GPA 86.71 / 100",
        },
        {
          period: "2014.09 — 2018.06",
          organization: "华南理工大学",
          role: "电子科学与技术 · 学士",
          note: "GPA 85 / 100",
        },
      ],
    },
    recognition: {
      index: "05",
      eyebrow: "荣誉与能力",
      title: "研究之外，重视清晰表达、开放协作与长期积累。",
      awards: [
        { year: "2025", title: "INTERSPEECH 学生奖学金", note: "国际语音领域会议" },
        { year: "2024", title: "INTERSPEECH 最佳学生论文入围", note: "2DP-2MRC" },
        { year: "2024", title: "IEEE 名古屋支部会议发表奖", note: "ASR 纠错研究" },
        { year: "2024", title: "Odyssey 多模态情感识别挑战赛第 5 名", note: "多模态融合" },
        { year: "2023", title: "MER 多模态情感识别挑战赛第 4 名", note: "半监督学习" },
      ],
      skillsTitle: "方法与工具",
      skillGroups: [
        {
          label: "研究",
          items: ["ASR", "Speech Emotion", "Multimodal Learning", "LLM", "Signal Processing"],
        },
        {
          label: "工程",
          items: ["Python / PyTorch", "ESPnet", "Hugging Face", "Shell", "C++"],
        },
        {
          label: "语言",
          items: ["中文", "English · TOEFL 112", "日本語 · JLPT N2"],
        },
      ],
    },
    hobbies: {
      index: "06",
      eyebrow: "爱好 · 旅行与摄影",
      title: "用旅行打开世界，也用摄影把它留住。",
      introduction:
        "地图记录已经抵达的地方，照片记录当时的光线、街道与偶然。点击高亮地点即可进入对应照片画廊。",
      mapLabel: "何嘉俊到访地点世界地图",
      visitedLabel: "个到访地点",
      placeholderTitle: "照片稍后上传",
      placeholderBody: "这里已经为你的实拍照片预留位置；上传后会按地点组成可浏览的摄影画廊。",
    },
    contact: {
      index: "07",
      eyebrow: "联系",
      title: "如果你也在思考机器如何更好地理解人，我们可以聊聊。",
      description: "欢迎交流语音识别、多模态学习、情感计算与大语言模型相关的研究与合作。",
      emailLabel: "发送邮件",
      links: [
        { label: "jiajun.he@g.sp.m.is.nagoya-u.ac.jp", href: "mailto:jiajun.he@g.sp.m.is.nagoya-u.ac.jp" },
        { label: "GitHub", href: "https://github.com/JiajunHe1025" },
        {
          label: "Google Scholar",
          href: "https://scholar.google.com/citations?hl=en&user=4mIKAZwAAAAJ&view_op=list_works&sortby=pubdate",
        },
      ],
    },
    footer: "何嘉俊 · 语音、语言与多模态智能",
  },
  en: {
    htmlLang: "en",
    pageTitle: "Jiajun He | Speech & Multimodal AI",
    languageLabel: "Choose language",
    nav: [
      { label: "Research", href: "#research" },
      { label: "Papers", href: "#publications" },
      { label: "Journey", href: "#journey" },
      { label: "Recognition", href: "#recognition" },
      { label: "Hobbies", href: "#hobbies" },
      { label: "Notes", href: "/notes/" },
      { label: "Contact", href: "#contact" },
    ],
    hero: {
      eyebrow: "Speech · Language · Multimodal Intelligence",
      name: "Jiajun He",
      romanName: "何嘉俊",
      headline:
        "Building AI that understands language, speakers, and emotion in the real world.",
      introduction:
        "My work spans contextual speech recognition, speech emotion understanding, multi-talker modeling, and large language models—with a focus on systems that hold up beyond clean benchmarks.",
      current: "Now at Alibaba Tongyi Lab",
      primaryCta: "Explore research",
      secondaryCta: "Selected papers",
      portraitAlt: "Portrait of Jiajun He",
      availability: "Jun 2026 — Present",
    },
    metrics: [
      { value: "70.42%", label: "Max. error reduction", detail: "AISHELL-1 · Contextual ASR" },
      { value: "7.9%", label: "Multi-talker ASR WER", detail: "LibriMix · CMT-LLM" },
      { value: "+4.1", label: "Emotion recognition gain", detail: "percentage points · IEMOCAP" },
      { value: "22", label: "Google Scholar records", detail: "as of Jul 2026" },
    ],
    now: {
      index: "01",
      eyebrow: "Now",
      title: "Turning research questions into systems for the real world.",
      organization: "Alibaba · Tongyi Lab",
      period: "June 2026 — Present",
      description:
        "Jiajun joined Alibaba Tongyi Lab in June 2026, continuing a long-term focus on speech, language, and multimodal intelligence.",
    },
    research: {
      index: "02",
      eyebrow: "Research",
      title: "Breaking down what it really takes for machines to listen.",
      introduction:
        "From rare entities to overlapping speech and emotion, I study how models can use context and multimodal evidence reliably—not only how they score on a benchmark.",
      items: [
        {
          number: "R / 01",
          title: "Context-aware ASR",
          description:
            "Phoneme augmentation, entity-aware objectives, and contextual biasing for more accurate names, brands, and specialized terms.",
          metric: "−70.42%",
          metricLabel: "maximum CER reduction on AISHELL-1",
          tags: ["Contextual ASR", "Rare Words", "Error Correction"],
          figure: "/research/contextual-asr.png",
          figureAlt: "Architecture for contextual speech recognition",
          paper: "PMF-CEC / PARCO",
        },
        {
          number: "R / 02",
          title: "Multi-talker ASR × LLM",
          description:
            "WavLM and Vicuna with two-stage filtering to select useful context from 5,000+ candidates in meetings and overlapping speech.",
          metric: "7.9%",
          metricLabel: "WER on LibriMix",
          tags: ["Multi-talker", "LLM", "WavLM"],
          figure: "/research/multitalker-llm.png",
          figureAlt: "Multi-talker speech recognition framework powered by a large language model",
          paper: "CMT-LLM · INTERSPEECH 2025",
        },
        {
          number: "R / 03",
          title: "Emotion & multimodal understanding",
          description:
            "Fusing speech, text, and video while bringing ASR correction into the recognition loop—understanding both what is said and how.",
          metric: "+4.1",
          metricLabel: "absolute points on IEMOCAP",
          tags: ["Speech Emotion", "Multimodal", "Video"],
          figure: "/research/multimodal-emotion.png",
          figureAlt: "Multimodal speech emotion recognition method",
          paper: "M4SER / GIA-MIC",
        },
      ],
    },
    publications: {
      index: "03",
      eyebrow: "Complete publication record",
      title: "A research trail from 2020 to 2026, in full.",
      introduction:
        "All 22 records currently listed on Google Scholar are included below, covering journals, conferences, preprints, and separate versions of the same work. Links favor the DOI or official paper page.",
      linkLabel: "Read paper",
      scholarLabel: "View the complete profile on Google Scholar",
      scholarUrl: "https://scholar.google.com/citations?hl=en&user=4mIKAZwAAAAJ&view_op=list_works&sortby=pubdate",
      items: sharedPublications,
    },
    journey: {
      index: "04",
      eyebrow: "Journey",
      title: "Iterating across industry, research labs, and disciplines.",
      experienceTitle: "Research & experience",
      educationTitle: "Education",
      experience: [
        {
          period: "Jun 2026 — Present",
          organization: "Alibaba · Tongyi Lab",
          role: "Current",
          current: true,
        },
        {
          period: "Oct 2025 — 2026",
          organization: "Nagoya University · Information Technology Center / Toda Lab",
          role: "Researcher",
        },
        {
          period: "Aug 2024 — Sep 2025",
          organization: "CyberAgent · AI Lab Audio Group",
          role: "Algorithm Engineering Intern",
          note: "Tokyo · Contextual and multi-talker ASR",
        },
      ],
      education: [
        {
          period: "Oct 2021 — Mar 2026",
          organization: "Nagoya University",
          role: "Ph.D. in Computer Science",
          note: "Toda Lab · GPA A",
        },
        {
          period: "Sep 2018 — Jun 2021",
          organization: "South China University of Technology",
          role: "M.Eng. in Microelectronics & Solid-State Electronics",
          note: "GPA 86.71 / 100",
        },
        {
          period: "Sep 2014 — Jun 2018",
          organization: "South China University of Technology",
          role: "B.Eng. in Electronic Science & Technology",
          note: "GPA 85 / 100",
        },
      ],
    },
    recognition: {
      index: "05",
      eyebrow: "Recognition & craft",
      title: "Beyond research: clarity, collaboration, and compounding practice.",
      awards: [
        { year: "2025", title: "INTERSPEECH Student Grant", note: "International speech conference" },
        { year: "2024", title: "INTERSPEECH Best Student Paper Finalist", note: "2DP-2MRC" },
        { year: "2024", title: "IEEE Nagoya Section Best Presentation Award", note: "ASR error correction" },
        { year: "2024", title: "5th place · Odyssey Multimodal Emotion Challenge", note: "Multimodal fusion" },
        { year: "2023", title: "4th place · MER Multimodal Emotion Challenge", note: "Semi-supervised learning" },
      ],
      skillsTitle: "Methods & tools",
      skillGroups: [
        {
          label: "Research",
          items: ["ASR", "Speech Emotion", "Multimodal Learning", "LLM", "Signal Processing"],
        },
        {
          label: "Engineering",
          items: ["Python / PyTorch", "ESPnet", "Hugging Face", "Shell", "C++"],
        },
        {
          label: "Languages",
          items: ["Chinese", "English · TOEFL 112", "Japanese · JLPT N2"],
        },
      ],
    },
    hobbies: {
      index: "06",
      eyebrow: "Hobbies · Travel & photography",
      title: "Travel opens the world; photography keeps a piece of it.",
      introduction:
        "The map traces places already visited, while photographs preserve their light, streets, and chance encounters. Select a highlighted place to open its gallery.",
      mapLabel: "World map of places visited by Jiajun He",
      visitedLabel: "places visited",
      placeholderTitle: "Photos coming soon",
      placeholderBody: "This space is ready for your own photographs. Once uploaded, they will form a browsable gallery for each place.",
    },
    contact: {
      index: "07",
      eyebrow: "Contact",
      title: "If you are also thinking about how machines can understand people better, let’s talk.",
      description:
        "Open to conversations around speech recognition, multimodal learning, affective computing, and large language models.",
      emailLabel: "Send an email",
      links: [
        { label: "jiajun.he@g.sp.m.is.nagoya-u.ac.jp", href: "mailto:jiajun.he@g.sp.m.is.nagoya-u.ac.jp" },
        { label: "GitHub", href: "https://github.com/JiajunHe1025" },
        {
          label: "Google Scholar",
          href: "https://scholar.google.com/citations?hl=en&user=4mIKAZwAAAAJ&view_op=list_works&sortby=pubdate",
        },
      ],
    },
    footer: "Jiajun He · Speech, Language & Multimodal Intelligence",
  },
  ja: {
    htmlLang: "ja",
    pageTitle: "カカシュン | 音声・マルチモーダルAI研究",
    languageLabel: "言語を選択",
    nav: [
      { label: "研究", href: "#research" },
      { label: "論文", href: "#publications" },
      { label: "経歴", href: "#journey" },
      { label: "受賞", href: "#recognition" },
      { label: "趣味", href: "#hobbies" },
      { label: "ノート", href: "/notes/" },
      { label: "連絡", href: "#contact" },
    ],
    hero: {
      eyebrow: "音声 · 言語 · マルチモーダル知能",
      name: "カカシュン",
      romanName: "Jiajun He / 何嘉俊",
      headline: "実環境で言語・話者・感情を理解するAIを研究しています。",
      introduction:
        "文脈音声認識、音声感情理解、複数話者モデリング、大規模言語モデルを横断し、複雑な実環境でも機能する知能システムを探究しています。",
      current: "Alibaba 通義実験室に在籍",
      primaryCta: "研究を見る",
      secondaryCta: "論文を見る",
      portraitAlt: "カカシュンのポートレート",
      availability: "2026.06 — 現在",
    },
    metrics: [
      { value: "70.42%", label: "最大誤り率削減", detail: "AISHELL-1 · 文脈 ASR" },
      { value: "7.9%", label: "複数話者 ASR の WER", detail: "LibriMix · CMT-LLM" },
      { value: "+4.1", label: "感情認識の向上", detail: "ポイント · IEMOCAP" },
      { value: "22", label: "Google Scholar 登録", detail: "2026年7月現在" },
    ],
    now: {
      index: "01",
      eyebrow: "現在",
      title: "研究課題を、実世界で動く知能システムへ。",
      organization: "Alibaba · 通義実験室",
      period: "2026年6月 — 現在",
      description:
        "2026年6月より Alibaba 通義実験室に勤務し、音声・言語・マルチモーダル知能に関する探究を続けています。",
    },
    research: {
      index: "02",
      eyebrow: "研究",
      title: "機械が本当に「聴き取る」ために必要な課題を分解する。",
      introduction:
        "固有表現、重複音声、感情理解まで、ベンチマークの数値だけでなく、文脈と複数モダリティを信頼して使えるモデルを目指します。",
      items: [
        {
          number: "R / 01",
          title: "文脈依存音声認識",
          description:
            "音素拡張、エンティティ指向の目的関数、文脈バイアスにより、人名・ブランド名・専門用語の認識精度を高めます。",
          metric: "−70.42%",
          metricLabel: "AISHELL-1 における最大 CER 削減",
          tags: ["Contextual ASR", "Rare Words", "Error Correction"],
          figure: "/research/contextual-asr.png",
          figureAlt: "文脈依存音声認識モデルの構成図",
          paper: "PMF-CEC / PARCO",
        },
        {
          number: "R / 02",
          title: "複数話者 ASR × LLM",
          description:
            "WavLM と Vicuna、二段階フィルタリングにより、5,000語超の候補から会議音声に有効な文脈を抽出します。",
          metric: "7.9%",
          metricLabel: "LibriMix における WER",
          tags: ["Multi-talker", "LLM", "WavLM"],
          figure: "/research/multitalker-llm.png",
          figureAlt: "大規模言語モデルを用いた複数話者音声認識の構成図",
          paper: "CMT-LLM · INTERSPEECH 2025",
        },
        {
          number: "R / 03",
          title: "感情・マルチモーダル理解",
          description:
            "音声・テキスト・映像を統合し、ASR 誤り訂正も認識過程に組み込むことで、発話内容と話し方の双方を捉えます。",
          metric: "+4.1",
          metricLabel: "IEMOCAP での絶対向上ポイント",
          tags: ["Speech Emotion", "Multimodal", "Video"],
          figure: "/research/multimodal-emotion.png",
          figureAlt: "マルチモーダル音声感情認識手法の構成図",
          paper: "M4SER / GIA-MIC",
        },
      ],
    },
    publications: {
      index: "03",
      eyebrow: "全論文",
      title: "2020年から2026年までの研究軌跡を一覧に。",
      introduction:
        "Google Scholar に掲載されている全22件を収録しています。論文誌、国際会議、プレプリント、同一研究の別版を含み、DOI または公式ページへのリンクを優先しています。",
      linkLabel: "論文を読む",
      scholarLabel: "Google Scholar で全業績を見る",
      scholarUrl: "https://scholar.google.com/citations?hl=en&user=4mIKAZwAAAAJ&view_op=list_works&sortby=pubdate",
      items: sharedPublications,
    },
    journey: {
      index: "04",
      eyebrow: "経歴",
      title: "産業・研究室・分野の境界を越えて、研究を磨く。",
      experienceTitle: "研究・職歴",
      educationTitle: "学歴",
      experience: [
        {
          period: "2026.06 — 現在",
          organization: "Alibaba · 通義実験室",
          role: "現職",
          current: true,
        },
        {
          period: "2025.10 — 2026",
          organization: "名古屋大学 · 情報基盤センター / 戸田研究室",
          role: "研究員",
        },
        {
          period: "2024.08 — 2025.09",
          organization: "CyberAgent · AI Lab Audio Group",
          role: "アルゴリズムエンジニア・インターン",
          note: "東京 · 文脈 ASR / 複数話者 ASR",
        },
      ],
      education: [
        {
          period: "2021.10 — 2026.03",
          organization: "名古屋大学",
          role: "コンピュータ科学 · 博士",
          note: "戸田研究室 · GPA A",
        },
        {
          period: "2018.09 — 2021.06",
          organization: "華南理工大学",
          role: "マイクロエレクトロニクス・固体電子工学 · 修士",
          note: "GPA 86.71 / 100",
        },
        {
          period: "2014.09 — 2018.06",
          organization: "華南理工大学",
          role: "電子科学技術 · 学士",
          note: "GPA 85 / 100",
        },
      ],
    },
    recognition: {
      index: "05",
      eyebrow: "受賞・スキル",
      title: "研究に加え、明快な表現・協働・継続的な蓄積を大切にする。",
      awards: [
        { year: "2025", title: "INTERSPEECH Student Grant", note: "音声分野の国際会議" },
        { year: "2024", title: "INTERSPEECH Best Student Paper Finalist", note: "2DP-2MRC" },
        { year: "2024", title: "IEEE 名古屋支部 優秀発表賞", note: "ASR 誤り訂正" },
        { year: "2024", title: "Odyssey マルチモーダル感情認識チャレンジ 5位", note: "マルチモーダル融合" },
        { year: "2023", title: "MER マルチモーダル感情認識チャレンジ 4位", note: "半教師あり学習" },
      ],
      skillsTitle: "手法・ツール",
      skillGroups: [
        {
          label: "研究",
          items: ["ASR", "Speech Emotion", "Multimodal Learning", "LLM", "Signal Processing"],
        },
        {
          label: "開発",
          items: ["Python / PyTorch", "ESPnet", "Hugging Face", "Shell", "C++"],
        },
        {
          label: "言語",
          items: ["中国語", "英語 · TOEFL 112", "日本語 · JLPT N2"],
        },
      ],
    },
    hobbies: {
      index: "06",
      eyebrow: "趣味 · 旅と写真",
      title: "旅で世界に触れ、写真でその瞬間を残す。",
      introduction:
        "地図は訪れた場所を、写真はその土地の光や街並み、偶然の出会いを記録します。ハイライトされた場所を選ぶと、写真ギャラリーが開きます。",
      mapLabel: "カカシュンが訪れた場所の世界地図",
      visitedLabel: "の訪問先",
      placeholderTitle: "写真は後日追加予定",
      placeholderBody: "ご自身で撮影した写真を追加するためのスペースです。アップロード後、場所ごとのギャラリーとして閲覧できます。",
    },
    contact: {
      index: "07",
      eyebrow: "連絡",
      title: "機械が人をより深く理解する方法を考えている方へ。ぜひお話ししましょう。",
      description:
        "音声認識、マルチモーダル学習、感情コンピューティング、大規模言語モデルに関する研究・協働のご相談を歓迎します。",
      emailLabel: "メールを送る",
      links: [
        { label: "jiajun.he@g.sp.m.is.nagoya-u.ac.jp", href: "mailto:jiajun.he@g.sp.m.is.nagoya-u.ac.jp" },
        { label: "GitHub", href: "https://github.com/JiajunHe1025" },
        {
          label: "Google Scholar",
          href: "https://scholar.google.com/citations?hl=en&user=4mIKAZwAAAAJ&view_op=list_works&sortby=pubdate",
        },
      ],
    },
    footer: "カカシュン · 音声・言語・マルチモーダル知能",
  },
};

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
  ja: "日本語",
};
