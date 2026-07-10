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
};

type PublicationItem = {
  year: string;
  venue: string;
  code: string;
  title: string;
  note: string;
  href: string;
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

const sharedPublications = [
  {
    year: "2025",
    venue: "IEEE TASLP",
    code: "PMF-CEC",
    title:
      "Phoneme-augmented Multimodal Fusion for Context-aware ASR Error Correction with Error-specific Selective Decoding",
    href: "https://ieeexplore.ieee.org/abstract/document/11027557",
  },
  {
    year: "2025",
    venue: "INTERSPEECH",
    code: "CMT-LLM",
    title: "Contextual Multi-Talker ASR Utilizing Large Language Models",
    href: "https://www.isca-archive.org/interspeech_2025/he25_interspeech.pdf",
  },
  {
    year: "2025",
    venue: "IEEE TASLP",
    code: "M4SER",
    title:
      "Multimodal, Multirepresentation, Multitask, and Multistrategy Learning for Speech Emotion Recognition",
    href: "https://ieeexplore.ieee.org/document/11180050",
  },
  {
    year: "2025",
    venue: "INTERSPEECH",
    code: "GIA-MIC",
    title:
      "Multimodal Emotion Recognition with Gated Interactive Attention and Modality-Invariant Learning Constraints",
    href: "https://www.isca-archive.org/interspeech_2025/he25c_interspeech.pdf",
  },
  {
    year: "2024",
    venue: "INTERSPEECH",
    code: "2DP-2MRC",
    title:
      "2-Dimensional Pointer-based Machine Reading Comprehension Method for Multimodal Moment Retrieval",
    href: "https://www.isca-archive.org/interspeech_2024/he24_interspeech.pdf",
  },
  {
    year: "2023",
    venue: "IEEE ASRU",
    code: "ED-CEC",
    title:
      "Improving Rare Word Recognition Using ASR Post-processing Based on Error Detection and Context-aware Error Correction",
    href: "https://ieeexplore.ieee.org/document/10389661",
  },
] as const;

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
      { value: "10", label: "第一作者成果", detail: "会议与期刊" },
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
        },
        {
          number: "R / 02",
          title: "多说话人 ASR × LLM",
          description:
            "结合 WavLM 与 Vicuna，从 5,000+ 候选词中筛选有效上下文，改善会议与重叠语音中的识别。",
          metric: "7.9%",
          metricLabel: "LibriMix WER",
          tags: ["Multi-talker", "LLM", "WavLM"],
        },
        {
          number: "R / 03",
          title: "情感与多模态理解",
          description:
            "融合语音、文本与视频表征，并把 ASR 纠错纳入情感识别链路，让模型理解说了什么，也理解如何说。",
          metric: "+4.1",
          metricLabel: "IEMOCAP 绝对提升 / 百分点",
          tags: ["Speech Emotion", "Multimodal", "Video"],
        },
      ],
    },
    publications: {
      index: "03",
      eyebrow: "代表论文",
      title: "以论文记录方法，也记录问题如何被重新定义。",
      introduction:
        "研究成果发表于 IEEE TASLP、ICASSP、INTERSPEECH 与 ASRU。以下为部分代表工作，论文标题保留英文原文。",
      linkLabel: "阅读论文",
      items: sharedPublications.map((item) => ({
        ...item,
        note:
          item.code === "PMF-CEC"
            ? "面向 ASR 错误位置的音素增强多模态纠错。"
            : item.code === "CMT-LLM"
              ? "提出结合大语言模型的多说话人上下文 ASR。"
              : item.code === "M4SER"
                ? "多表征、多任务与多策略的语音情感识别框架。"
                : item.code === "GIA-MIC"
                  ? "通过门控交互注意力学习模态共享与互补信息。"
                  : item.code === "2DP-2MRC"
                    ? "以二维指针网络定位多模态视频片段。"
                    : "通过错误检测与上下文纠错改善稀有词识别。",
      })),
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
    contact: {
      index: "06",
      eyebrow: "联系",
      title: "如果你也在思考机器如何更好地理解人，我们可以聊聊。",
      description: "欢迎交流语音识别、多模态学习、情感计算与大语言模型相关的研究与合作。",
      emailLabel: "发送邮件",
      links: [
        { label: "jiajun.he@g.sp.m.is.nagoya-u.ac.jp", href: "mailto:jiajun.he@g.sp.m.is.nagoya-u.ac.jp" },
        { label: "GitHub", href: "https://github.com/JiajunHe1025" },
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
      { value: "10", label: "First-author works", detail: "conference + journal" },
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
        },
        {
          number: "R / 02",
          title: "Multi-talker ASR × LLM",
          description:
            "WavLM and Vicuna with two-stage filtering to select useful context from 5,000+ candidates in meetings and overlapping speech.",
          metric: "7.9%",
          metricLabel: "WER on LibriMix",
          tags: ["Multi-talker", "LLM", "WavLM"],
        },
        {
          number: "R / 03",
          title: "Emotion & multimodal understanding",
          description:
            "Fusing speech, text, and video while bringing ASR correction into the recognition loop—understanding both what is said and how.",
          metric: "+4.1",
          metricLabel: "absolute points on IEMOCAP",
          tags: ["Speech Emotion", "Multimodal", "Video"],
        },
      ],
    },
    publications: {
      index: "03",
      eyebrow: "Selected work",
      title: "Papers as records of methods—and of reframed questions.",
      introduction:
        "Published across IEEE TASLP, ICASSP, INTERSPEECH, and ASRU. Here is a compact selection of representative work.",
      linkLabel: "Read paper",
      items: sharedPublications.map((item) => ({
        ...item,
        note:
          item.code === "PMF-CEC"
            ? "Phoneme-augmented multimodal correction focused on likely ASR errors."
            : item.code === "CMT-LLM"
              ? "A new contextual multi-talker ASR task and LLM-powered solution."
              : item.code === "M4SER"
                ? "A multi-representation, multitask, and multi-strategy framework for SER."
                : item.code === "GIA-MIC"
                  ? "Gated interaction for shared and complementary multimodal cues."
                  : item.code === "2DP-2MRC"
                    ? "Two-dimensional pointer reasoning for multimodal moment retrieval."
                    : "Rare-word ASR improved through error detection and contextual correction.",
      })),
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
    contact: {
      index: "06",
      eyebrow: "Contact",
      title: "If you are also thinking about how machines can understand people better, let’s talk.",
      description:
        "Open to conversations around speech recognition, multimodal learning, affective computing, and large language models.",
      emailLabel: "Send an email",
      links: [
        { label: "jiajun.he@g.sp.m.is.nagoya-u.ac.jp", href: "mailto:jiajun.he@g.sp.m.is.nagoya-u.ac.jp" },
        { label: "GitHub", href: "https://github.com/JiajunHe1025" },
      ],
    },
    footer: "Jiajun He · Speech, Language & Multimodal Intelligence",
  },
  ja: {
    htmlLang: "ja",
    pageTitle: "何 嘉俊 | 音声・マルチモーダルAI研究",
    languageLabel: "言語を選択",
    nav: [
      { label: "研究", href: "#research" },
      { label: "論文", href: "#publications" },
      { label: "経歴", href: "#journey" },
      { label: "受賞", href: "#recognition" },
      { label: "連絡", href: "#contact" },
    ],
    hero: {
      eyebrow: "音声 · 言語 · マルチモーダル知能",
      name: "何 嘉俊",
      romanName: "Jiajun He",
      headline: "実環境で言語・話者・感情を理解するAIを研究しています。",
      introduction:
        "文脈音声認識、音声感情理解、複数話者モデリング、大規模言語モデルを横断し、複雑な実環境でも機能する知能システムを探究しています。",
      current: "Alibaba 通義実験室に在籍",
      primaryCta: "研究を見る",
      secondaryCta: "論文を見る",
      portraitAlt: "何嘉俊のポートレート",
      availability: "2026.06 — 現在",
    },
    metrics: [
      { value: "70.42%", label: "最大誤り率削減", detail: "AISHELL-1 · 文脈 ASR" },
      { value: "7.9%", label: "複数話者 ASR の WER", detail: "LibriMix · CMT-LLM" },
      { value: "+4.1", label: "感情認識の向上", detail: "ポイント · IEMOCAP" },
      { value: "10", label: "筆頭著者成果", detail: "国際会議・論文誌" },
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
        },
        {
          number: "R / 02",
          title: "複数話者 ASR × LLM",
          description:
            "WavLM と Vicuna、二段階フィルタリングにより、5,000語超の候補から会議音声に有効な文脈を抽出します。",
          metric: "7.9%",
          metricLabel: "LibriMix における WER",
          tags: ["Multi-talker", "LLM", "WavLM"],
        },
        {
          number: "R / 03",
          title: "感情・マルチモーダル理解",
          description:
            "音声・テキスト・映像を統合し、ASR 誤り訂正も認識過程に組み込むことで、発話内容と話し方の双方を捉えます。",
          metric: "+4.1",
          metricLabel: "IEMOCAP での絶対向上ポイント",
          tags: ["Speech Emotion", "Multimodal", "Video"],
        },
      ],
    },
    publications: {
      index: "03",
      eyebrow: "主要論文",
      title: "手法だけでなく、問いの捉え直しも論文に残す。",
      introduction:
        "IEEE TASLP、ICASSP、INTERSPEECH、ASRU などで成果を発表しています。以下は代表的な研究です。",
      linkLabel: "論文を読む",
      items: sharedPublications.map((item) => ({
        ...item,
        note:
          item.code === "PMF-CEC"
            ? "ASR 誤り位置に着目した音素拡張マルチモーダル訂正。"
            : item.code === "CMT-LLM"
              ? "LLM を用いた文脈依存複数話者 ASR を提案。"
              : item.code === "M4SER"
                ? "多表現・マルチタスク・複数戦略による音声感情認識。"
                : item.code === "GIA-MIC"
                  ? "ゲート付き相互注意によるモダリティ共通・補完情報の学習。"
                  : item.code === "2DP-2MRC"
                    ? "二次元ポインタ推論による映像区間検索。"
                    : "誤り検出と文脈訂正による希少語認識の改善。",
      })),
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
    contact: {
      index: "06",
      eyebrow: "連絡",
      title: "機械が人をより深く理解する方法を考えている方へ。ぜひお話ししましょう。",
      description:
        "音声認識、マルチモーダル学習、感情コンピューティング、大規模言語モデルに関する研究・協働のご相談を歓迎します。",
      emailLabel: "メールを送る",
      links: [
        { label: "jiajun.he@g.sp.m.is.nagoya-u.ac.jp", href: "mailto:jiajun.he@g.sp.m.is.nagoya-u.ac.jp" },
        { label: "GitHub", href: "https://github.com/JiajunHe1025" },
      ],
    },
    footer: "何 嘉俊 · 音声・言語・マルチモーダル知能",
  },
};

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
  ja: "日本語",
};
