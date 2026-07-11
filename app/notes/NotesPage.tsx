"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AmbientDock } from "../AmbientDock";
import styles from "./notes.module.css";

type Locale = "zh" | "en" | "ja" | "ko";
type Theme = "classic" | "night" | "film" | "glass" | "pixel" | "cartoon" | "noritake" | "neko" | "shiba";

const locales: Locale[] = ["zh", "en", "ja", "ko"];
const themes: Theme[] = ["classic", "night", "film", "glass", "pixel", "cartoon", "noritake", "neko", "shiba"];

const isLocale = (value: string | null): value is Locale =>
  value !== null && locales.includes(value as Locale);

const isTheme = (value: string | null | undefined): value is Theme =>
  value !== null && value !== undefined && themes.includes(value as Theme);

const copy = {
  zh: {
    htmlLang: "zh-Hans",
    pageTitle: "技术笔记 · Jiajun He",
    skip: "跳到主要内容",
    home: "返回主页",
    label: "学习与交流",
    title: "技术笔记",
    subtitle: "Notes",
    intro: "记录语音、语言与多模态智能中的关键概念，并把研究方法拆成可以复现的实践步骤。这里的内容是导读与教程，不代表新的实验结论。",
    languageLabel: "切换语言",
    themeLabel: "切换主题",
    themeNames: { classic: "经典", night: "暗夜", film: "胶片", glass: "玻璃", pixel: "日系像素", cartoon: "明亮卡通", noritake: "Noritake 线稿", neko: "日系猫咪", shiba: "日系柴犬" },
    read: "展开教程",
    close: "再次点击标题即可收起",
    steps: "实践步骤",
    snippet: "最小实现示意",
    caution: "实践提醒",
    deepDives: {
      eyebrow: "深度技术报告",
      title: "把论文读成可用的技术判断",
      intro: "三篇独立长文从问题定义、模型设计、实验结果与适用边界出发，重新梳理近期音频语言模型工作。内容是基于公开资料的原创理解，并非原文转录。",
      open: "阅读全文",
      metricLabel: "关键指标",
      reports: [
        {
          index: "01",
          kind: "多说话人 ASR",
          topic: "统一音频语言模型",
          title: "MOSS-Transcribe-Diarize：0.9B 模型如何统一转写、说话人和时间戳",
          summary: "从传统级联系统的误差传递讲起，拆解长上下文、结构化生成和合成对话训练，理解它为何能在一次全局建模中回答“谁在何时说了什么”。",
          metric: "128K · 约 90 分钟",
          readTime: "约 18 分钟",
          href: "/notes/moss-transcribe-diarize-0-9b-sats/",
        },
        {
          index: "02",
          kind: "扩散式 ASR",
          topic: "先验引导去噪",
          title: "dLLM-ASR：用 CTC 粗稿把扩散解码变成自适应精修",
          summary: "分析全掩码扩散解码为何反而更慢，以及 CTC 先验、置信度早停、长度裁剪与 KV 缓存如何协同，把昂贵计算集中到真正不确定的词位。",
          metric: "4.44× 推理加速",
          readTime: "约 17 分钟",
          href: "/notes/dllm-asr-prior-guided-adaptive-denoising/",
        },
        {
          index: "03",
          kind: "统一音频智能",
          topic: "理解 · 生成 · 对话",
          title: "Nemotron Labs AUDEX：面向理解、生成与对话的统一音频 LLM",
          summary: "沿着音频输入与音频输出的双向链路，梳理统一模型如何组织声学表示、语言推理和语音生成，并讨论它相对拼装式语音系统的价值与风险。",
          metric: "一套模型 · 双向音频",
          readTime: "约 20 分钟",
          href: "/notes/nemotron-labs-audex-unified-audio-llm/",
        },
      ],
    },
    articles: [
      {
        index: "01",
        kind: "导读 · ASR",
        title: "让上下文真正帮助语音识别",
        summary: "上下文 ASR 不只是把热词表塞进解码器。更可靠的做法，是先区分长期词表、会话级线索和当前轮次提示，再决定它们应当影响编码、解码还是重排序。",
        tags: ["Contextual ASR", "Biasing", "Evaluation"],
        steps: [
          "先建立无上下文基线，并单独统计普通词与目标词的错误，避免热词提升掩盖整体退化。",
          "把线索分层：稳定的专名词表、会话主题，以及上一轮对话；为每层设置独立权重和失效策略。",
          "从浅融合或候选重排序开始，再评估是否需要将上下文编码器接入声学—文本表示。",
          "用正确线索、缺失线索和干扰线索三组条件测试鲁棒性，同时检查非目标词误触发。",
        ],
        code: `context = encode_terms(active_terms)\nnbest = asr.decode(audio, beam_size=8)\nscore = acoustic(nbest) + lm(nbest)\nscore += bias(nbest, context, max_bonus=beta)\nreturn select_best(nbest, score)`,
        caution: "热词命中率不是唯一目标。应同时报告整体识别质量、目标词召回、误触发，以及错误上下文下的退化情况。",
      },
      {
        index: "02",
        kind: "教程 · ASR × LLM",
        title: "多说话人 ASR 与 LLM：先保留证据，再做语言修复",
        summary: "在会议与访谈中，分离、说话人标注、识别和语言修复会相互影响。一个可审计的流程应始终保留原始时间戳与 ASR 假设，让 LLM 只在明确约束下修正文本。",
        tags: ["Speaker Diarization", "LLM", "Traceability"],
        steps: [
          "先进行语音活动检测和说话人分段，并为重叠语音保留独立标记，不强行归到单一说话人。",
          "按时间片运行 ASR，保留词级时间戳、置信信息和 N-best 候选，而不仅是最终句子。",
          "向 LLM 提供受限任务：恢复标点、统一术语或在候选中选择；禁止凭空补充音频中不存在的事实。",
          "输出原文、修订文、修改理由和时间戳；人工抽查说话人切换、数字、专名与低置信片段。",
        ],
        code: `record = {\n  "speaker": segment.speaker,\n  "time": [segment.start, segment.end],\n  "asr": hypotheses,\n  "instruction": "Edit only when supported by ASR evidence"\n}\nrevised = llm.constrained_edit(record)`,
        caution: "LLM 的流畅并不等于忠实。生产系统应允许回看音频证据，并将无法确认的内容显式标为不确定。",
      },
      {
        index: "03",
        kind: "导读 · 多模态",
        title: "多模态情感识别：对齐比堆叠更重要",
        summary: "语音、文本和视觉信号的时间尺度与可靠性不同。与其直接拼接所有特征，不如先定义对齐单位，再显式建模每种模态何时可信、何时缺失。",
        tags: ["Emotion Recognition", "Fusion", "Robustness"],
        steps: [
          "明确预测单位：整段、话轮还是短窗口；标签粒度必须与输入对齐，避免把整段标签机械复制到每一帧。",
          "分别建立单模态基线，检查语音韵律、文本语义和视觉线索各自能解释什么。",
          "统一时间轴并保存缺失掩码；融合层同时接收表示、可靠性估计与掩码。",
          "用模态缺失、噪声干扰和说话人外测试检查泛化，并观察模型是否过度依赖最容易的模态。",
        ],
        code: `features = [audio_emb, text_emb, visual_emb]\nmask = [audio_ok, text_ok, visual_ok]\nweights = reliability_gate(features, mask)\nfused = sum(w * x for w, x in zip(weights, features))\nemotion = classifier(fused)`,
        caution: "情感标签具有主观性和文化差异。记录标注流程与一致性，并避免把模型输出当作对个体心理状态的确定判断。",
      },
    ],
    guestbook: {
      eyebrow: "交流",
      title: "留言与选题建议",
      intro: "访客无需登录。留言会先通过邮件发给我审核，不会立即公开；只有经我确认后才可能出现在下方的已审核留言中。",
      privacy: "表单内容由 FormSubmit 转发到我的邮箱。请不要填写密码、身份证件或其他敏感信息。",
      success: "已收到提交，谢谢！留言进入邮箱审核后，才会考虑公开显示。",
      name: "称呼",
      namePlaceholder: "怎么称呼你",
      email: "邮箱",
      emailHint: "仅用于必要的回复，不会随留言公开。",
      topic: "主题",
      topics: ["技术讨论", "教程建议", "研究交流", "网站反馈"],
      message: "留言",
      messagePlaceholder: "想讨论的问题、希望看到的教程，或任何建议……",
      consent: "我已了解留言需要审核，且不会立即公开。",
      submit: "发送给站长审核",
      approvedTitle: "已审核留言",
      approvedEmpty: "暂无已审核留言。",
    },
    footer: "以清晰、可验证的方式分享技术。",
  },
  en: {
    htmlLang: "en",
    pageTitle: "Technical Notes · Jiajun He",
    skip: "Skip to main content",
    home: "Back home",
    label: "Learning & exchange",
    title: "Technical Notes",
    subtitle: "Notes",
    intro: "Clear guides to speech, language, and multimodal intelligence, with research ideas translated into reproducible steps. These are primers and tutorials—not claims of new experimental results.",
    languageLabel: "Switch language",
    themeLabel: "Switch theme",
    themeNames: { classic: "Classic", night: "Night", film: "Film", glass: "Glass", pixel: "Japanese Pixel", cartoon: "Bright Cartoon", noritake: "Noritake Line", neko: "Japanese Cat", shiba: "Japanese Shiba" },
    read: "Open tutorial",
    close: "Select the heading again to close",
    steps: "Practical steps",
    snippet: "Minimal implementation sketch",
    caution: "Practice note",
    deepDives: {
      eyebrow: "Research deep dives",
      title: "Turning papers into usable technical judgment",
      intro: "Three standalone essays revisit recent audio-language research through its problem framing, model design, evidence, and limits. Each is an original interpretation of public material—not a transcription of the source.",
      open: "Read full report",
      metricLabel: "Key signal",
      reports: [
        {
          index: "01",
          kind: "Multi-speaker ASR",
          topic: "Unified audio language model",
          title: "MOSS-Transcribe-Diarize: how a 0.9B model unifies text, speakers, and timestamps",
          summary: "Starting from error propagation in cascaded systems, this report unpacks long-context modeling, structured generation, and synthetic dialogue training to explain how one model answers who said what, and when.",
          metric: "128K · ≈ 90 minutes",
          readTime: "18 min read",
          href: "/notes/moss-transcribe-diarize-0-9b-sats/",
        },
        {
          index: "02",
          kind: "Diffusion ASR",
          topic: "Prior-guided denoising",
          title: "dLLM-ASR: turning diffusion decoding into adaptive refinement with a CTC draft",
          summary: "Why can all-mask diffusion be slower than autoregression? The answer connects a CTC prior, confidence-based early exit, length pruning, and KV caching so expensive work targets only uncertain positions.",
          metric: "4.44× faster inference",
          readTime: "17 min read",
          href: "/notes/dllm-asr-prior-guided-adaptive-denoising/",
        },
        {
          index: "03",
          kind: "Unified audio intelligence",
          topic: "Understand · Generate · Converse",
          title: "Nemotron Labs AUDEX: one audio LLM for understanding, generation, and dialogue",
          summary: "Following the two-way path from audio input to audio output, this report maps acoustic representation, language reasoning, and speech generation—and weighs a unified model against assembled speech pipelines.",
          metric: "One model · Audio I/O",
          readTime: "20 min read",
          href: "/notes/nemotron-labs-audex-unified-audio-llm/",
        },
      ],
    },
    articles: [
      {
        index: "01",
        kind: "Primer · ASR",
        title: "Making context genuinely useful for ASR",
        summary: "Contextual ASR is more than inserting a hotword list into a decoder. A dependable design separates durable vocabulary, session clues, and turn-level prompts, then decides whether each should affect encoding, decoding, or reranking.",
        tags: ["Contextual ASR", "Biasing", "Evaluation"],
        steps: [
          "Establish a context-free baseline and measure ordinary words and target terms separately, so hotword gains do not hide overall regressions.",
          "Layer the evidence: stable names, session topic, and prior-turn context; give each layer its own weight and expiry policy.",
          "Begin with shallow fusion or candidate reranking before deciding whether a context encoder belongs inside the speech–text representation.",
          "Test relevant, missing, and misleading context, and measure false biasing on non-target words.",
        ],
        code: `context = encode_terms(active_terms)\nnbest = asr.decode(audio, beam_size=8)\nscore = acoustic(nbest) + lm(nbest)\nscore += bias(nbest, context, max_bonus=beta)\nreturn select_best(nbest, score)`,
        caution: "Hotword recall is not the only goal. Track general recognition quality, target recall, false triggers, and degradation under incorrect context.",
      },
      {
        index: "02",
        kind: "Tutorial · ASR × LLM",
        title: "Multi-speaker ASR with LLMs: preserve evidence before editing",
        summary: "Separation, diarization, recognition, and language repair interact in meetings and interviews. An auditable pipeline keeps timestamps and ASR hypotheses, allowing an LLM to edit only under explicit constraints.",
        tags: ["Speaker Diarization", "LLM", "Traceability"],
        steps: [
          "Run speech activity detection and diarization first; retain overlap as its own state instead of forcing it onto one speaker.",
          "Recognize time-aligned segments and keep word timestamps, confidence information, and N-best alternatives—not only the final sentence.",
          "Give the LLM a bounded job such as punctuation recovery, terminology normalization, or candidate selection; forbid unsupported additions.",
          "Return the source, revision, edit rationale, and timestamps, then review speaker changes, numbers, names, and low-confidence spans.",
        ],
        code: `record = {\n  "speaker": segment.speaker,\n  "time": [segment.start, segment.end],\n  "asr": hypotheses,\n  "instruction": "Edit only when supported by ASR evidence"\n}\nrevised = llm.constrained_edit(record)`,
        caution: "Fluency is not fidelity. A production workflow should retain a path back to the audio and mark unresolved content as uncertain.",
      },
      {
        index: "03",
        kind: "Primer · Multimodal",
        title: "Multimodal emotion recognition: align before you fuse",
        summary: "Speech, text, and visual signals operate on different time scales and with different reliability. Rather than concatenating everything, define the alignment unit first and model when each modality is trustworthy or missing.",
        tags: ["Emotion Recognition", "Fusion", "Robustness"],
        steps: [
          "Choose the prediction unit—recording, turn, or short window—and match label granularity instead of copying one recording label onto every frame.",
          "Build unimodal baselines to learn what prosody, semantics, and visual behavior can each explain.",
          "Place signals on a shared timeline and preserve missing-data masks; give the fusion layer representations, reliability estimates, and masks.",
          "Evaluate modality dropout, noise, and speaker-held-out conditions, checking whether the system over-relies on the easiest signal.",
        ],
        code: `features = [audio_emb, text_emb, visual_emb]\nmask = [audio_ok, text_ok, visual_ok]\nweights = reliability_gate(features, mask)\nfused = sum(w * x for w, x in zip(weights, features))\nemotion = classifier(fused)`,
        caution: "Emotion labels are subjective and culturally situated. Document annotation agreement and do not treat predictions as definitive claims about a person’s mental state.",
      },
    ],
    guestbook: {
      eyebrow: "Exchange",
      title: "Messages & topic requests",
      intro: "No account is required. Messages are emailed to me for review and do not appear publicly right away; only entries I approve may later be shown below.",
      privacy: "Form submissions are relayed to my inbox by FormSubmit. Please do not include passwords, identity documents, or other sensitive information.",
      success: "Submission received—thank you. It will only be considered for publication after email review.",
      name: "Name",
      namePlaceholder: "How should I address you?",
      email: "Email",
      emailHint: "Used only if a reply is needed; it will not be published with your message.",
      topic: "Topic",
      topics: ["Technical discussion", "Tutorial request", "Research exchange", "Website feedback"],
      message: "Message",
      messagePlaceholder: "A question, tutorial idea, or suggestion…",
      consent: "I understand that messages are moderated and will not appear immediately.",
      submit: "Send for review",
      approvedTitle: "Approved messages",
      approvedEmpty: "No approved messages yet.",
    },
    footer: "Sharing technology clearly and verifiably.",
  },
  ja: {
    htmlLang: "ja",
    pageTitle: "技術ノート · Jiajun He",
    skip: "本文へ移動",
    home: "ホームへ戻る",
    label: "学びと交流",
    title: "技術ノート",
    subtitle: "Notes",
    intro: "音声・言語・マルチモーダル知能の要点を整理し、研究の考え方を再現可能な手順へ落とし込みます。掲載内容は入門解説とチュートリアルであり、新たな実験結果を主張するものではありません。",
    languageLabel: "言語を切り替える",
    themeLabel: "テーマを切り替える",
    themeNames: { classic: "クラシック", night: "ナイト", film: "フィルム", glass: "ガラス", pixel: "和風ピクセル", cartoon: "ポップカートゥーン", noritake: "Noritake 線画", neko: "和風ねこ", shiba: "和風柴犬" },
    read: "チュートリアルを開く",
    close: "見出しをもう一度選ぶと閉じます",
    steps: "実践ステップ",
    snippet: "最小実装のイメージ",
    caution: "実践上の注意",
    deepDives: {
      eyebrow: "技術レポート",
      title: "論文を実践的な技術判断へ読み替える",
      intro: "近年の音声言語モデルを、課題設定・モデル設計・実験結果・適用限界から読み直す3本の独立した長文です。公開資料をもとにした独自の解説であり、原文の転載ではありません。",
      open: "レポートを読む",
      metricLabel: "注目ポイント",
      reports: [
        {
          index: "01",
          kind: "複数話者 ASR",
          topic: "統合音声言語モデル",
          title: "MOSS-Transcribe-Diarize：0.9B モデルで文字・話者・時刻を統合する仕組み",
          summary: "カスケード方式の誤差伝播を出発点に、長文脈、構造化生成、合成対話学習を分解し、「誰が・いつ・何を話したか」を一つのモデルで扱う理由を考察します。",
          metric: "128K · 約90分",
          readTime: "約18分",
          href: "/notes/moss-transcribe-diarize-0-9b-sats/",
        },
        {
          index: "02",
          kind: "拡散型 ASR",
          topic: "事前情報付きデノイズ",
          title: "dLLM-ASR：CTC の下書きで拡散復号を適応的な推敲へ変える",
          summary: "全マスクから始める拡散復号が遅くなる理由と、CTC 事前情報、信頼度による早期終了、長さ削減、KV キャッシュが不確かな位置へ計算を集中させる仕組みを解説します。",
          metric: "推論を 4.44× 高速化",
          readTime: "約17分",
          href: "/notes/dllm-asr-prior-guided-adaptive-denoising/",
        },
        {
          index: "03",
          kind: "統合音声知能",
          topic: "理解 · 生成 · 対話",
          title: "Nemotron Labs AUDEX：理解・生成・対話を一つにする音声 LLM",
          summary: "音声入力から音声出力までの双方向経路をたどり、音響表現・言語推論・音声生成の構成を整理し、統合モデルと組み合わせ型音声システムの価値とリスクを比較します。",
          metric: "1モデル · 双方向音声",
          readTime: "約20分",
          href: "/notes/nemotron-labs-audex-unified-audio-llm/",
        },
      ],
    },
    articles: [
      {
        index: "01",
        kind: "入門 · ASR",
        title: "文脈を音声認識に本当に役立てる",
        summary: "文脈依存 ASR は、ホットワード一覧をデコーダへ入れるだけではありません。長期語彙、セッション情報、直前ターンの手掛かりを分け、それぞれを符号化・復号・再ランキングのどこに効かせるかを設計します。",
        tags: ["Contextual ASR", "Biasing", "Evaluation"],
        steps: [
          "文脈なしのベースラインを作り、一般語と対象語を分けて評価し、ホットワード改善の裏にある全体劣化を見逃さないようにします。",
          "固有名詞、セッションの話題、前ターンの文脈を層に分け、層ごとに重みと失効条件を設定します。",
          "まず浅い融合や候補再ランキングから試し、必要に応じて文脈エンコーダを音声・テキスト表現へ接続します。",
          "正しい文脈、文脈なし、誤った文脈で検証し、対象外の語への誤バイアスも確認します。",
        ],
        code: `context = encode_terms(active_terms)\nnbest = asr.decode(audio, beam_size=8)\nscore = acoustic(nbest) + lm(nbest)\nscore += bias(nbest, context, max_bonus=beta)\nreturn select_best(nbest, score)`,
        caution: "ホットワードの再現率だけでなく、全体認識品質、対象語の再現率、誤発火、誤文脈による劣化を併せて確認します。",
      },
      {
        index: "02",
        kind: "チュートリアル · ASR × LLM",
        title: "複数話者 ASR と LLM：修正前に証拠を残す",
        summary: "会議やインタビューでは、音源分離・話者分離・認識・言語修正が互いに影響します。監査可能な処理では、元のタイムスタンプと ASR 仮説を保持し、LLM に明確な制約を与えます。",
        tags: ["Speaker Diarization", "LLM", "Traceability"],
        steps: [
          "音声区間検出と話者分離を先に行い、重なり音声を一人へ強制的に割り当てず、独立した状態として残します。",
          "時間区間ごとに ASR を行い、単語タイムスタンプ、信頼度情報、N-best 候補を保持します。",
          "LLM の役割を句読点復元、用語統一、候補選択などに限定し、音声に根拠のない補完を禁止します。",
          "原文、修正文、変更理由、タイムスタンプを出力し、話者切替、数値、固有名詞、低信頼区間を人が確認します。",
        ],
        code: `record = {\n  "speaker": segment.speaker,\n  "time": [segment.start, segment.end],\n  "asr": hypotheses,\n  "instruction": "Edit only when supported by ASR evidence"\n}\nrevised = llm.constrained_edit(record)`,
        caution: "流暢さは忠実さを保証しません。実運用では音声へ戻れる経路を残し、確認できない内容を「不確実」と明示します。",
      },
      {
        index: "03",
        kind: "入門 · マルチモーダル",
        title: "マルチモーダル感情認識：融合より先に整列する",
        summary: "音声・テキスト・映像は時間粒度と信頼性が異なります。特徴を一括連結する前に整列単位を定義し、各モダリティが信頼できる時と欠損する時を明示的に扱います。",
        tags: ["Emotion Recognition", "Fusion", "Robustness"],
        steps: [
          "予測単位を収録全体、発話ターン、短時間窓から選び、収録単位のラベルを全フレームへ機械的に複製しないようにします。",
          "単一モダリティのベースラインを作り、韻律、意味、視覚情報がそれぞれ何を説明できるか確認します。",
          "共通時間軸へ整列し、欠損マスクを保持します。融合層には表現、信頼度推定、マスクを入力します。",
          "モダリティ欠損、雑音、話者を分けた条件で汎化を確認し、最も容易な信号への過剰依存を調べます。",
        ],
        code: `features = [audio_emb, text_emb, visual_emb]\nmask = [audio_ok, text_ok, visual_ok]\nweights = reliability_gate(features, mask)\nfused = sum(w * x for w, x in zip(weights, features))\nemotion = classifier(fused)`,
        caution: "感情ラベルには主観性と文化差があります。アノテーション手順と一致度を記録し、個人の心理状態を断定する用途には使わないようにします。",
      },
    ],
    guestbook: {
      eyebrow: "交流",
      title: "メッセージとテーマの提案",
      intro: "ログインは不要です。メッセージはメールで私に届き、確認前に公開されることはありません。承認したものだけが後日、下の欄に掲載される場合があります。",
      privacy: "フォーム内容は FormSubmit が私のメールへ転送します。パスワード、身分証明情報などの機密情報は入力しないでください。",
      success: "送信を受け付けました。ありがとうございます。メールで確認した後にのみ、公開を検討します。",
      name: "お名前",
      namePlaceholder: "呼び方を教えてください",
      email: "メール",
      emailHint: "返信が必要な場合だけ使用し、メッセージと一緒に公開しません。",
      topic: "テーマ",
      topics: ["技術ディスカッション", "チュートリアル提案", "研究交流", "サイトへの感想"],
      message: "メッセージ",
      messagePlaceholder: "質問、読みたいチュートリアル、提案など……",
      consent: "メッセージが審査制で、すぐには公開されないことを理解しました。",
      submit: "確認用に送信",
      approvedTitle: "承認済みメッセージ",
      approvedEmpty: "承認済みのメッセージはまだありません。",
    },
    footer: "技術を明確かつ検証可能な形で共有します。",
  },
  ko: {
    htmlLang: "ko",
    pageTitle: "기술 노트 · Jiajun He",
    skip: "본문으로 이동",
    home: "홈으로 돌아가기",
    label: "학습과 교류",
    title: "기술 노트",
    subtitle: "Notes",
    intro: "음성·언어·멀티모달 지능의 핵심 개념을 정리하고, 연구 아이디어를 재현 가능한 실천 단계로 풀어냅니다. 이곳의 글은 입문 해설과 튜토리얼이며 새로운 실험 결과를 주장하지 않습니다.",
    languageLabel: "언어 전환",
    themeLabel: "테마 전환",
    themeNames: { classic: "클래식", night: "나이트", film: "필름", glass: "글라스", pixel: "일본풍 픽셀", cartoon: "밝은 카툰", noritake: "Noritake 라인 아트", neko: "일본풍 고양이", shiba: "일본풍 시바견" },
    read: "튜토리얼 펼치기",
    close: "제목을 다시 누르면 닫힙니다",
    steps: "실습 단계",
    snippet: "최소 구현 예시",
    caution: "실습 시 주의사항",
    deepDives: {
      eyebrow: "심층 기술 보고서",
      title: "논문을 실용적인 기술 판단으로 읽기",
      intro: "최근 오디오 언어 모델 연구를 문제 정의, 모델 설계, 실험 근거와 적용 한계의 관점에서 다시 정리한 세 편의 독립적인 장문입니다. 공개 자료를 바탕으로 한 독자적인 해설이며 원문을 옮긴 글이 아닙니다.",
      open: "전체 보고서 읽기",
      metricLabel: "핵심 지표",
      reports: [
        {
          index: "01",
          kind: "다화자 ASR",
          topic: "통합 오디오 언어 모델",
          title: "MOSS-Transcribe-Diarize: 0.9B 모델이 전사·화자·타임스탬프를 통합하는 방법",
          summary: "기존 연쇄형 시스템의 오류 전파에서 출발해 긴 문맥, 구조화 생성, 합성 대화 학습을 분석하고, 하나의 모델이 ‘누가 언제 무엇을 말했는가’를 다루는 방식을 설명합니다.",
          metric: "128K · 약 90분",
          readTime: "약 18분",
          href: "/notes/moss-transcribe-diarize-0-9b-sats/",
        },
        {
          index: "02",
          kind: "확산형 ASR",
          topic: "사전정보 기반 디노이징",
          title: "dLLM-ASR: CTC 초안으로 확산 디코딩을 적응형 교정으로 바꾸기",
          summary: "전체 마스크에서 시작하는 확산 디코딩이 느려지는 이유와 CTC 사전정보, 신뢰도 기반 조기 종료, 길이 가지치기, KV 캐시가 불확실한 위치에 계산을 집중하는 방식을 살펴봅니다.",
          metric: "추론 4.44× 가속",
          readTime: "약 17분",
          href: "/notes/dllm-asr-prior-guided-adaptive-denoising/",
        },
        {
          index: "03",
          kind: "통합 오디오 지능",
          topic: "이해 · 생성 · 대화",
          title: "Nemotron Labs AUDEX: 이해·생성·대화를 하나로 묶은 오디오 LLM",
          summary: "오디오 입력에서 오디오 출력으로 이어지는 양방향 경로를 따라 음향 표현, 언어 추론, 음성 생성을 정리하고 통합 모델과 조립형 음성 시스템의 가치와 위험을 비교합니다.",
          metric: "하나의 모델 · 양방향 오디오",
          readTime: "약 20분",
          href: "/notes/nemotron-labs-audex-unified-audio-llm/",
        },
      ],
    },
    articles: [
      {
        index: "01",
        kind: "입문 · ASR",
        title: "문맥을 음성 인식에 실제로 활용하기",
        summary: "문맥 기반 ASR은 단순히 핫워드 목록을 디코더에 넣는 일이 아닙니다. 장기 어휘, 세션 단서, 현재 발화의 힌트를 구분하고 각각 인코딩·디코딩·재순위화 중 어디에 영향을 줄지 설계해야 합니다.",
        tags: ["Contextual ASR", "Biasing", "Evaluation"],
        steps: [
          "문맥 없는 기준 모델을 먼저 만들고 일반 단어와 목표 용어의 오류를 따로 측정해, 핫워드 개선이 전체 성능 저하를 가리지 않도록 합니다.",
          "고정된 고유명사, 세션 주제, 이전 발화 문맥을 계층으로 나누고 각 계층에 별도의 가중치와 만료 규칙을 둡니다.",
          "얕은 결합이나 후보 재순위화부터 시작한 뒤 문맥 인코더를 음성·텍스트 표현에 연결할 필요가 있는지 평가합니다.",
          "정확한 문맥, 문맥 없음, 잘못된 문맥 조건을 모두 시험하고 목표가 아닌 단어에서의 오작동도 확인합니다.",
        ],
        code: `context = encode_terms(active_terms)\nnbest = asr.decode(audio, beam_size=8)\nscore = acoustic(nbest) + lm(nbest)\nscore += bias(nbest, context, max_bonus=beta)\nreturn select_best(nbest, score)`,
        caution: "핫워드 재현율만 보지 말고 전체 인식 품질, 목표 용어 재현율, 오작동, 잘못된 문맥에서의 성능 저하를 함께 보고해야 합니다.",
      },
      {
        index: "02",
        kind: "튜토리얼 · ASR × LLM",
        title: "다화자 ASR과 LLM: 언어 교정 전에 근거 보존하기",
        summary: "회의와 인터뷰에서는 분리, 화자 분할, 인식, 언어 교정이 서로 영향을 줍니다. 감사 가능한 흐름은 원래 타임스탬프와 ASR 가설을 보존하고 LLM이 명확한 제약 아래에서만 텍스트를 수정하게 합니다.",
        tags: ["Speaker Diarization", "LLM", "Traceability"],
        steps: [
          "음성 활동 검출과 화자 분할을 먼저 수행하고, 겹친 음성을 한 명에게 억지로 배정하지 말고 별도 상태로 보존합니다.",
          "시간 구간별로 ASR을 실행하며 최종 문장뿐 아니라 단어 타임스탬프, 신뢰도, N-best 후보도 남깁니다.",
          "LLM의 역할을 문장부호 복원, 용어 통일, 후보 선택 등으로 제한하고 오디오에 없는 사실을 추가하지 못하게 합니다.",
          "원문, 수정문, 수정 이유와 타임스탬프를 함께 출력하고 화자 전환, 숫자, 고유명사, 낮은 신뢰도 구간을 사람이 검토합니다.",
        ],
        code: `record = {\n  "speaker": segment.speaker,\n  "time": [segment.start, segment.end],\n  "asr": hypotheses,\n  "instruction": "Edit only when supported by ASR evidence"\n}\nrevised = llm.constrained_edit(record)`,
        caution: "유창함이 충실함을 뜻하지는 않습니다. 실제 운영에서는 오디오 근거로 돌아갈 수 있어야 하며 확인할 수 없는 내용은 불확실하다고 표시해야 합니다.",
      },
      {
        index: "03",
        kind: "입문 · 멀티모달",
        title: "멀티모달 감정 인식: 결합보다 정렬이 먼저",
        summary: "음성, 텍스트, 영상 신호는 시간 단위와 신뢰도가 서로 다릅니다. 모든 특징을 바로 이어 붙이기보다 정렬 단위를 먼저 정의하고 각 모달리티가 언제 신뢰할 수 있거나 누락되는지 명시적으로 모델링해야 합니다.",
        tags: ["Emotion Recognition", "Fusion", "Robustness"],
        steps: [
          "예측 단위를 전체 녹음, 발화 턴, 짧은 창 중에서 정하고 녹음 단위 라벨을 모든 프레임에 기계적으로 복제하지 않습니다.",
          "단일 모달리티 기준 모델을 각각 만들어 운율, 의미, 시각 단서가 무엇을 설명하는지 확인합니다.",
          "공통 시간축에 신호를 정렬하고 누락 마스크를 보존하며, 결합 계층에 표현·신뢰도 추정·마스크를 함께 제공합니다.",
          "모달리티 누락, 잡음, 화자 분리 조건에서 일반화를 평가하고 가장 쉬운 신호에 과도하게 의존하는지 살펴봅니다.",
        ],
        code: `features = [audio_emb, text_emb, visual_emb]\nmask = [audio_ok, text_ok, visual_ok]\nweights = reliability_gate(features, mask)\nfused = sum(w * x for w, x in zip(weights, features))\nemotion = classifier(fused)`,
        caution: "감정 라벨에는 주관성과 문화적 차이가 있습니다. 주석 과정과 일치도를 기록하고 모델 출력을 개인의 심리 상태에 대한 확정적 판단으로 사용하지 마세요.",
      },
    ],
    guestbook: {
      eyebrow: "교류",
      title: "메시지와 주제 제안",
      intro: "로그인 없이 남길 수 있습니다. 메시지는 이메일로 전달되어 먼저 검토되며 즉시 공개되지 않습니다. 승인한 메시지만 이후 아래 목록에 표시될 수 있습니다.",
      privacy: "FormSubmit이 폼 내용을 제 이메일로 전달합니다. 비밀번호, 신분증 정보 또는 기타 민감한 정보는 입력하지 마세요.",
      success: "제출이 접수되었습니다. 감사합니다. 이메일 검토 후에만 공개 여부를 결정합니다.",
      name: "이름",
      namePlaceholder: "어떻게 불러 드릴까요?",
      email: "이메일",
      emailHint: "답변이 필요할 때만 사용하며 메시지와 함께 공개하지 않습니다.",
      topic: "주제",
      topics: ["기술 토론", "튜토리얼 제안", "연구 교류", "웹사이트 의견"],
      message: "메시지",
      messagePlaceholder: "논의하고 싶은 질문, 보고 싶은 튜토리얼 또는 제안을 남겨 주세요…",
      consent: "메시지는 검토 후 공개되며 즉시 표시되지 않는다는 점을 이해했습니다.",
      submit: "검토 요청 보내기",
      approvedTitle: "승인된 메시지",
      approvedEmpty: "아직 승인된 메시지가 없습니다.",
    },
    footer: "기술을 명확하고 검증 가능한 방식으로 공유합니다.",
  },
} satisfies Record<Locale, {
  htmlLang: string;
  pageTitle: string;
  skip: string;
  home: string;
  label: string;
  title: string;
  subtitle: string;
  intro: string;
  languageLabel: string;
  themeLabel: string;
  themeNames: Record<Theme, string>;
  read: string;
  close: string;
  steps: string;
  snippet: string;
  caution: string;
  deepDives: {
    eyebrow: string;
    title: string;
    intro: string;
    open: string;
    metricLabel: string;
    reports: Array<{
      index: string;
      kind: string;
      topic: string;
      title: string;
      summary: string;
      metric: string;
      readTime: string;
      href: string;
    }>;
  };
  articles: Array<{
    index: string;
    kind: string;
    title: string;
    summary: string;
    tags: string[];
    steps: string[];
    code: string;
    caution: string;
  }>;
  guestbook: {
    eyebrow: string;
    title: string;
    intro: string;
    privacy: string;
    success: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailHint: string;
    topic: string;
    topics: string[];
    message: string;
    messagePlaceholder: string;
    consent: string;
    submit: string;
    approvedTitle: string;
    approvedEmpty: string;
  };
  footer: string;
}>;

export function NotesPage() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [theme, setTheme] = useState<Theme>("glass");
  const [submitted, setSubmitted] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const current = copy[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let savedLocale: string | null = null;
      let savedTheme: string | null = null;
      try {
        savedLocale = window.localStorage.getItem("jiajun-site-language");
        savedTheme = window.localStorage.getItem("jiajun-site-theme");
      } catch {
        // Private browsing restrictions should not prevent the default experience.
      }

      if (isLocale(savedLocale)) {
        setLocale(savedLocale);
      } else if (window.navigator.language.toLowerCase().startsWith("ja")) {
        setLocale("ja");
      } else if (window.navigator.language.toLowerCase().startsWith("ko")) {
        setLocale("ko");
      } else if (!window.navigator.language.toLowerCase().startsWith("zh")) {
        setLocale("en");
      }

      const initialTheme = isTheme(savedTheme) ? savedTheme : "glass";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
      setSubmitted(new URLSearchParams(window.location.search).get("submitted") === "1");
      setPreferencesReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    document.documentElement.lang = current.htmlLang;
    document.title = current.pageTitle;
    try {
      window.localStorage.setItem("jiajun-site-language", locale);
    } catch {
      // Language switching still works when storage is unavailable.
    }
  }, [current.htmlLang, current.pageTitle, locale, preferencesReady]);

  const selectTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      window.localStorage.setItem("jiajun-site-theme", nextTheme);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
  };

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#notes-main">{current.skip}</a>

      <header className={styles.header}>
        <Link className={styles.homeLink} href="/" aria-label={current.home}>
          <span className={styles.mark} aria-hidden="true">HJ</span>
          <span className={styles.backArrow} aria-hidden="true">←</span>
          <span>{current.home}</span>
        </Link>

        <div className={styles.controls}>
          <div className={styles.themeSwitch} role="group" aria-label={current.themeLabel}>
            {themes.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={current.themeNames[option]}
                aria-pressed={theme === option}
                onClick={() => selectTheme(option)}
              >
                <span className={`${styles.themeDot} ${styles[option]}`} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={styles.languageSwitch} role="group" aria-label={current.languageLabel}>
            {locales.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={locale === option}
                onClick={() => setLocale(option)}
              >
                {option === "zh" ? "中" : option === "en" ? "EN" : option === "ja" ? "日" : "한"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="notes-main" className={styles.main}>
        <section className={styles.hero} aria-labelledby="notes-title">
          <span className={`${styles.themeSticker} ${styles.heroSticker}`} aria-hidden="true" />
          <p className={styles.eyebrow}>{current.label}</p>
          <h1 id="notes-title">
            {current.title}
            <span>{current.subtitle}</span>
          </h1>
          <p className={styles.intro}>{current.intro}</p>
          <div className={styles.heroRule} aria-hidden="true">
            <span>ASR</span><span>LLM</span><span>MULTIMODAL</span>
          </div>
          <div className={styles.noritakeVignette} aria-hidden="true" />
        </section>

        <section className={styles.deepDives} aria-labelledby="deep-dives-title">
          <div className={styles.deepDivesHeader}>
            <div>
              <p className={styles.eyebrow}>{current.deepDives.eyebrow}</p>
              <h2 id="deep-dives-title">{current.deepDives.title}</h2>
            </div>
            <p>{current.deepDives.intro}</p>
          </div>

          <div className={styles.reportGrid}>
            {current.deepDives.reports.map((report) => (
              <Link key={report.index} className={styles.reportCard} href={report.href}>
                <div className={styles.reportTopline}>
                  <span className={styles.reportIndex}>{report.index}</span>
                  <span className={styles.reportKind}>{report.kind}</span>
                </div>
                <span className={`${styles.themeSticker} ${styles.cardSticker}`} aria-hidden="true" />
                <p className={styles.reportTopic}>{report.topic}</p>
                <h3>{report.title}</h3>
                <p className={styles.reportSummary}>{report.summary}</p>
                <div className={styles.reportMeta}>
                  <div>
                    <span>{current.deepDives.metricLabel}</span>
                    <strong>{report.metric}</strong>
                  </div>
                  <span className={styles.readTime}>{report.readTime}</span>
                </div>
                <span className={styles.reportCta}>
                  {current.deepDives.open}
                  <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.articleList} aria-label={current.title}>
          {current.articles.map((article) => (
            <article key={article.index} className={styles.article}>
              <div className={styles.articleIndex}>{article.index}</div>
              <div className={styles.articleBody}>
                <span className={`${styles.themeSticker} ${styles.articleSticker}`} aria-hidden="true" />
                <p className={styles.articleKind}>{article.kind}</p>
                <h2>{article.title}</h2>
                <p className={styles.articleSummary}>{article.summary}</p>
                <div className={styles.tags} aria-label="Tags">
                  {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>

                <details className={styles.tutorial}>
                  <summary>
                    <span>{current.read}</span>
                    <span className={styles.summaryHint}>{current.close}</span>
                    <span className={styles.plus} aria-hidden="true">＋</span>
                  </summary>
                  <div className={styles.tutorialContent}>
                    <span className={`${styles.themeSticker} ${styles.tutorialSticker}`} aria-hidden="true" />
                    <section>
                      <h3>{current.steps}</h3>
                      <ol>
                        {article.steps.map((step) => <li key={step}>{step}</li>)}
                      </ol>
                    </section>
                    <section>
                      <h3>{current.snippet}</h3>
                      <pre><code>{article.code}</code></pre>
                    </section>
                    <aside>
                      <strong>{current.caution}</strong>
                      <p>{article.caution}</p>
                    </aside>
                  </div>
                </details>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.guestbook} aria-labelledby="guestbook-title">
          <span className={`${styles.themeSticker} ${styles.guestbookSticker}`} aria-hidden="true" />
          <div className={styles.guestbookIntro}>
            <p className={styles.eyebrow}>{current.guestbook.eyebrow}</p>
            <h2 id="guestbook-title">{current.guestbook.title}</h2>
            <p>{current.guestbook.intro}</p>
            <p className={styles.privacy}>{current.guestbook.privacy}</p>
          </div>

          <div className={styles.formPanel}>
            {submitted ? (
              <div className={styles.success} role="status">{current.guestbook.success}</div>
            ) : null}
            <form method="POST" action="https://formsubmit.co/595057239@qq.com">
              <input type="hidden" name="_subject" value="New moderated website message" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="https://jiajunhe1025.github.io/notes/?submitted=1" />
              <input type="hidden" name="_url" value="https://jiajunhe1025.github.io/notes/" />
              <input className={styles.honeypot} type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className={styles.formRow}>
                <label>
                  <span>{current.guestbook.name}</span>
                  <input name="name" type="text" required maxLength={80} placeholder={current.guestbook.namePlaceholder} />
                </label>
                <label>
                  <span>{current.guestbook.email}</span>
                  <input name="email" type="email" required maxLength={160} aria-describedby="email-hint" />
                  <small id="email-hint">{current.guestbook.emailHint}</small>
                </label>
              </div>

              <label>
                <span>{current.guestbook.topic}</span>
                <select name="topic" required defaultValue="">
                  <option value="" disabled>—</option>
                  {current.guestbook.topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                </select>
              </label>

              <label>
                <span>{current.guestbook.message}</span>
                <textarea name="message" required minLength={10} maxLength={2000} rows={7} placeholder={current.guestbook.messagePlaceholder} />
              </label>

              <label className={styles.consent}>
                <input name="moderation_acknowledged" type="checkbox" value="yes" required />
                <span>{current.guestbook.consent}</span>
              </label>

              <button className={styles.submit} type="submit">{current.guestbook.submit}<span aria-hidden="true">↗</span></button>
            </form>
          </div>

          <section className={styles.approved} aria-labelledby="approved-title">
            <h3 id="approved-title">{current.guestbook.approvedTitle}</h3>
            <p>{current.guestbook.approvedEmpty}</p>
          </section>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Jiajun He</span>
        <span>{current.footer}</span>
      </footer>
      <AmbientDock locale={locale} />
    </div>
  );
}
