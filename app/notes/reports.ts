export type Locale = "zh" | "en" | "ja" | "ko";

export type Localized = Record<Locale, string>;

export type ReportFact = {
  label: Localized;
  value: Localized;
  detail: Localized;
};

export type ReportBullet = {
  title: Localized;
  text: Localized;
};

export type ReportCallout = {
  label: Localized;
  text: Localized;
};

export type ReportTable = {
  caption: Localized;
  headers: Localized[];
  rows: Array<{ cells: Localized[] }>;
  note?: Localized;
};

export type ReportSection = {
  id: string;
  kicker: Localized;
  heading: Localized;
  paragraphs: Localized[];
  bullets?: ReportBullet[];
  callout?: ReportCallout;
  table?: ReportTable;
};

export type ReportGlossaryItem = {
  term: string;
  definition: Localized;
};

export type ReportSource = {
  label: Localized;
  kind: "article" | "paper" | "repository" | "model";
  url: string;
};

export type Report = {
  index: string;
  slug: string;
  published: string;
  readingTime: Localized;
  category: Localized;
  title: Localized;
  summary: Localized;
  thesis: Localized;
  tags: string[];
  facts: ReportFact[];
  sections: ReportSection[];
  glossary: ReportGlossaryItem[];
  sources: ReportSource[];
};

// Korean falls back to the English source unless a Korean rendering is supplied.
// This keeps every technical claim and citation intact while Korean coverage grows.
const l = (zh: string, en: string, ja: string, ko: string = en): Localized => ({ zh, en, ja, ko });

export const reports: Report[] = [
  {
    index: "01",
    slug: "moss-transcribe-diarize-0-9b-sats",
    published: "2026-07-09",
    readingTime: l("约 18 分钟", "About 18 min", "約18分", "약 18분"),
    category: l("深度报告 · 多说话人语音识别", "Deep report · Multi-speaker ASR", "詳細レポート · 複数話者ASR", "심층 보고서 · 다화자 음성 인식"),
    title: l(
      "0.9B 模型怎样一次整理清楚“谁在何时说了什么”？",
      "How can a 0.9B model organize who said what, and when?",
      "0.9Bモデルは「誰が・いつ・何を話したか」をどう一度に整理するのか",
      "0.9B 모델은 ‘누가 언제 무엇을 말했는가’를 어떻게 한 번에 정리할까?"
    ),
    summary: l(
      "MOSS-Transcribe-Diarize 把转写、匿名说话人标签和时间边界放进同一条自回归输出序列，并利用长上下文维持整场会议中的说话人一致性。这篇笔记拆解它真正统一了什么、实验数字应当怎样读，以及离可靠生产系统还缺哪些证据。",
      "MOSS-Transcribe-Diarize emits transcription, anonymous speaker labels, and time boundaries in one autoregressive sequence, using long context to keep speakers consistent across a meeting. This note explains what is genuinely unified, how to read the reported numbers, and what evidence is still missing for production use.",
      "MOSS-Transcribe-Diarizeは、文字起こし・匿名話者ラベル・時間境界を一つの自己回帰系列として出力し、長い文脈で会議全体の話者整合性を保ちます。本稿では、何が統合されたのか、数値をどう読むべきか、実運用までに不足する検証を整理します。",
      "MOSS-Transcribe-Diarize는 전사, 익명 화자 라벨, 시간 경계를 하나의 자기회귀 출력으로 생성하고 긴 문맥으로 회의 전체의 화자 일관성을 유지합니다. 이 글은 무엇이 실제로 통합되었는지, 실험 수치를 어떻게 읽어야 하는지, 안정적인 운영에 어떤 근거가 더 필요한지 설명합니다."
    ),
    thesis: l(
      "这项工作的关键不只是“小模型能转长音频”，而是把原本彼此传递误差的多个模块改写为一个带结构约束的序列预测问题；长上下文的主要价值，是让说话人归属拥有全局参照。",
      "The central contribution is not merely long-audio transcription with a small model. It recasts several error-propagating modules as one structured sequence-prediction problem, while long context supplies a global reference for speaker attribution.",
      "重要なのは小型モデルで長音声を扱えることだけではありません。誤差を受け渡していた複数モジュールを構造化系列予測へまとめ、長文脈を話者帰属の全体的な手掛かりとして使う点です。",
      "핵심은 작은 모델이 긴 오디오를 처리한다는 데만 있지 않습니다. 서로 오류를 전달하던 여러 모듈을 구조화된 시퀀스 예측 문제로 바꾸고, 긴 문맥을 화자 귀속의 전역 기준으로 활용합니다."
    ),
    tags: ["SATS", "Speaker Diarization", "Long-context ASR", "MOSS", "0.9B"],
    facts: [
      {
        label: l("模型规模", "Model size", "モデル規模", "모델 규모"),
        value: l("约 0.9B 参数", "About 0.9B parameters", "約0.9Bパラメータ", "약 0.9B 파라미터"),
        detail: l("模型卡给出的 BF16 权重体积约 1.82 GB；显存还要计入音频表示、KV 缓存与运行时开销。", "The model card lists roughly 1.82 GB of BF16 weights; audio states, KV cache, and runtime overhead require additional memory.", "モデルカード上のBF16重みは約1.82GBですが、音声表現、KVキャッシュ、ランタイム分のメモリは別途必要です。"),
      },
      {
        label: l("上下文窗口", "Context window", "コンテキスト長", "문맥 창"),
        value: l("128K token", "128K tokens", "128Kトークン", "128K 토큰"),
        detail: l("项目将其对应到约 90 分钟音频，但可用时长还会受输出长度、采样方式和推理后端影响。", "The project maps this to roughly 90 minutes of audio, although usable duration also depends on output length, sampling, and the inference backend.", "プロジェクトでは約90分の音声に相当するとしますが、実際の長さは出力長やサンプリング、推論基盤にも左右されます。"),
      },
      {
        label: l("统一输出", "Unified output", "統合出力", "통합 출력"),
        value: l("文字 + 时间 + 匿名话者", "Text + time + anonymous speaker", "文字＋時刻＋匿名話者", "텍스트 + 시간 + 익명 화자"),
        detail: l("[S01] 一类标签只在当前文件内部区分说话人，不等同于真实身份识别，也不能自动跨会议关联同一个人。", "Labels such as [S01] distinguish speakers only within a file; they are neither identity recognition nor automatic cross-recording linkage.", "[S01]のようなラベルは一つのファイル内で話者を区別するだけで、本人確認や録音をまたぐ同一人物の照合ではありません。"),
      },
      {
        label: l("开放方式", "Release", "公開形態", "공개 방식"),
        value: l("Apache-2.0", "Apache-2.0", "Apache-2.0"),
        detail: l("权重、模型卡与推理工具已公开；具体使用仍应核查依赖组件、输入数据和部署环境的许可。", "Weights, model card, and inference tools are public; downstream dependencies, input data, and deployment conditions still need license review.", "重み、モデルカード、推論ツールは公開されていますが、依存物・入力データ・運用条件のライセンス確認は必要です。"),
      },
    ],
    sections: [
      {
        id: "problem",
        kicker: l("01 · 问题重构", "01 · Reframing the task", "01 · 問題の捉え直し", "01 · 문제 다시 정의하기"),
        heading: l("会议记录不是“先转写，再贴姓名”这么简单", "Meeting transcription is not just ASR followed by names", "会議記録は文字起こし後に名前を貼るだけではない", "회의 기록은 ‘전사한 뒤 이름을 붙이는’ 단순한 문제가 아니다"),
        paragraphs: [
          l("普通 ASR 只回答内容，而会议纪要还必须回答发言者和时间。经典流水线通常先检测语音，再切分说话人、运行识别，最后做时间对齐。每个模块单独可用，却可能在交界处放大错误：切分边界偏移会截断词语，识别错误又会让后续的说话人合并更难。", "Conventional ASR answers what was said, while meeting records also need speaker and timing. A cascade usually detects speech, segments speakers, recognizes text, and aligns timestamps. Each part may work in isolation, yet boundary errors can clip words and recognition errors can make later speaker merging harder.", "通常のASRが答えるのは発話内容ですが、会議記録には話者と時刻も必要です。従来のパイプラインは音声検出、話者分割、認識、時刻合わせを順に行い、境界のずれが単語を切り、認識誤りが話者統合をさらに難しくします。"),
          l("MOSS-Transcribe-Diarize 把任务定义为 speaker-attributed transcription with timestamps：模型直接生成一条可解析的记录。这样做没有让困难消失，而是让文字、说话人和时间在训练时共同承担误差，模型可以利用词义、音色变化与对话轮换的联合线索。", "MOSS-Transcribe-Diarize formulates the task as speaker-attributed transcription with timestamps and directly generates a parseable record. The difficulty does not disappear; instead, text, speaker, and time share the training objective so lexical meaning, voice changes, and turn-taking can be considered jointly.", "MOSS-Transcribe-Diarizeは、話者付き文字起こしと時刻推定を一つの解析可能な記録生成として定式化します。難しさが消えるのではなく、文字・話者・時刻が同じ学習目標を共有し、意味、声質変化、ターン交替を同時に利用できます。"),
        ],
        bullets: [
          { title: l("流水线风险", "Cascade risk", "パイプラインのリスク"), text: l("上游的漏检、错切与重叠处理会成为下游无法恢复的信息损失。", "Missed speech, bad cuts, and overlap handling upstream can become information loss that downstream stages cannot recover.", "上流の未検出、誤分割、重なり処理は、下流で復元できない情報損失になります。") },
          { title: l("统一模型收益", "Unified-model benefit", "統合モデルの利点"), text: l("语言内容可以帮助判断轮次，声学变化也能约束文字应该归到哪位匿名说话人。", "Linguistic content can clarify turn boundaries, while acoustic changes constrain which anonymous speaker should receive the words.", "言語内容はターン境界を助け、音響変化は文字をどの匿名話者へ割り当てるかを制約します。") },
        ],
        callout: { label: l("阅读重点", "Reading lens", "読むポイント"), text: l("“一次完成”指一次统一请求与一条联合输出，不代表整个模型只做一次矩阵计算。它仍然按 token 自回归生成。", "“One pass” means one unified request and one joint output, not a single matrix operation; generation is still autoregressive over tokens.", "「一度で完了」とは一つの統合リクエストと共同出力を指し、行列計算が一回だけという意味ではありません。生成自体は自己回帰的です。") },
      },
      {
        id: "structured-output",
        kicker: l("02 · 输出设计", "02 · Output design", "02 · 出力設計", "02 · 출력 설계"),
        heading: l("把一段发言压成“起点—话者—文字—终点”", "Encoding each turn as start–speaker–text–end", "一つの発話を「開始—話者—文字—終了」で表す", "한 발화를 ‘시작–화자–텍스트–종료’로 표현하기"),
        paragraphs: [
          l("模型将时间 token、说话人 token 和文字放在同一词表空间内，典型片段由起始时间、[Sxx] 标签、转写内容和结束时间组成。输出格式本身就是监督信号：模型不仅学哪句话最可能，还要学它在记录结构中的位置。", "Time tokens, speaker tokens, and text share one vocabulary space. A typical segment contains a start time, an [Sxx] label, the transcript, and an end time. The format is itself supervision: the model learns not only likely words but where they belong in the record structure.", "時刻トークン、話者トークン、文字を同じ語彙空間へ置き、開始時刻、[Sxx]、文字列、終了時刻を一つの区間として生成します。形式そのものが教師信号となり、語だけでなく記録構造上の位置も学習します。"),
          l("这一设计便于直接生成字幕或会议条目，但也带来一个产品层面的边界：标签是“本次录音里的第几位声源”，不是姓名。若要显示真实姓名，还需要征得同意的声纹注册、座次信息或人工映射，并明确处理隐私。", "The representation is convenient for subtitles and meeting entries, but it has a product boundary: labels denote sources within the current recording, not names. Real identities require consented enrollment, seating metadata, or manual mapping, with explicit privacy controls.", "字幕や会議項目には便利ですが、ラベルは今回の録音内の音源番号であり氏名ではありません。実名表示には同意済みの声紋登録、座席情報、手動対応などと明確なプライバシー管理が必要です。"),
        ],
        bullets: [
          { title: l("可解析", "Parseable", "解析可能"), text: l("结构 token 让后处理器能稳定恢复段落、说话人和时间范围，而不用从自然语言猜格式。", "Structure tokens let post-processing recover segments, speakers, and time spans without guessing a natural-language layout.", "構造トークンにより、自然言語の書式を推測せず区間・話者・時刻を復元できます。") },
          { title: l("匿名而非识别", "Anonymous, not identified", "匿名であって本人特定ではない"), text: l("同一个 [S01] 的含义只在当前输入中成立，跨文件不能默认对应同一人。", "The meaning of [S01] is scoped to the current input and cannot be assumed to identify the same person across files.", "[S01]の意味は現在の入力内だけで成立し、別ファイルで同じ人物とは仮定できません。") },
        ],
      },
      {
        id: "architecture",
        kicker: l("03 · 模型结构", "03 · Architecture", "03 · アーキテクチャ", "03 · 모델 구조"),
        heading: l("30 秒前端窗口与 128K 全局上下文并不矛盾", "Thirty-second front-end windows can still feed a 128K global context", "30秒の前処理窓と128Kの全体文脈は両立する", "30초 프런트엔드 창과 128K 전역 문맥은 함께 사용할 수 있다"),
        paragraphs: [
          l("输入被转换为 16 kHz、80 维 Mel 特征，音频编码器以约 30 秒为前端处理单位。随后四倍时间合并和 MLP 适配器压缩声学序列，再交给基于 Qwen3-0.6B 风格的 28 层因果解码器。前端分窗是为了编码效率，不等于每窗独立转写后再拼接。", "Input is represented as 16 kHz, 80-bin Mel features. A Whisper-Medium-like encoder processes roughly 30-second front-end windows, followed by 4× temporal merging and an MLP adapter before a 28-layer Qwen3-0.6B-style causal decoder. Front-end windowing improves encoding efficiency; it is not independent transcription followed by stitching.", "入力は16kHz・80次元Mel特徴となり、Whisper-Medium系エンコーダが約30秒単位で処理します。4倍の時間統合とMLPアダプタを経て、Qwen3-0.6B系の28層因果デコーダへ渡ります。前処理の窓分割は効率のためで、窓ごとの独立認識を連結する方式ではありません。"),
          l("各窗口的表示会被放进同一次长上下文建模，模型因此可以回看更早的声音与对话模式。其主要意义不是让 90 分钟录音“免费”运行，而是减少分块系统中 [S01] 在不同窗口被重新编号的漂移；代价则是更长的预填充、KV 缓存和输出序列。", "Representations from the windows enter one long-context model, allowing later predictions to refer to earlier voices and dialogue patterns. The benefit is not free 90-minute inference, but less speaker-label drift than chunk-wise systems that reassign [S01]. Costs remain in prefill, KV cache, and output length.", "各窓の表現は同じ長文脈モデルに入り、後半から前半の声や対話パターンを参照できます。利点は90分推論が無料になることではなく、チャンクごとに[S01]を振り直す方式より話者ラベルの漂流を抑えることです。プリフィル、KVキャッシュ、出力長のコストは残ります。"),
        ],
        bullets: [
          { title: l("编码侧", "Encoder side", "エンコーダ側"), text: l("短窗口负责提取局部声学特征，时间合并降低传给语言模型的序列长度。", "Short windows extract local acoustics, and temporal merging reduces the sequence passed to the language model.", "短い窓で局所音響を抽出し、時間統合で言語モデルへ渡す系列を短くします。") },
          { title: l("解码侧", "Decoder side", "デコーダ側"), text: l("长上下文联合预测文字、时间与话者标签，让全局一致性进入同一个条件概率。", "Long context jointly predicts words, time, and speaker labels so global consistency participates in one conditional distribution.", "長文脈で文字・時刻・話者を共同予測し、全体整合性を同じ条件付き確率へ含めます。") },
        ],
        callout: { label: l("容量不等于速度", "Capacity is not speed", "容量は速度ではない"), text: l("128K 表示模型能接收的上下文上限，不保证任意硬件都能以交互速度处理满窗口。评估部署时必须同时测峰值显存、首 token 延迟和整段完成时间。", "A 128K limit describes capacity, not guaranteed interactive speed on every device. Deployment tests should measure peak memory, time to first token, and full-recording completion time.", "128Kは受け入れ可能な上限であり、どの機器でも対話速度が出る保証ではありません。最大メモリ、最初のトークンまでの時間、全体完了時間を測る必要があります。") },
      },
      {
        id: "training",
        kicker: l("04 · 数据引擎", "04 · Data engine", "04 · データ設計", "04 · 데이터 엔진"),
        heading: l("真正稀缺的是带重叠、轮换与一致标签的长对话", "The scarce resource is long dialogue with overlap, turns, and consistent labels", "希少なのは重なり・交替・一貫ラベルを備えた長対話", "희소한 것은 중첩·턴 전환·일관된 라벨을 갖춘 긴 대화다"),
        paragraphs: [
          l("公开语音语料往往更像单人朗读，无法覆盖会议中的抢话、短回应、房间混响与远场噪声。该工作把真实材料与合成会话结合：从 2 到 12 位说话人采样轮换关系，允许重叠，并通过混响、噪声和交叉淡化让拼接边界更接近实际录音。", "Public speech corpora often resemble single-speaker reading and underrepresent interruptions, short backchannels, reverberation, and far-field noise. The project mixes real and synthetic conversations, sampling 2–12 speakers, overlap, reverberation, noise, and crossfades to create more realistic transitions.", "公開音声は単独朗読に偏り、割り込み、相づち、残響、遠距離雑音を十分に含みません。本研究は実音声と合成会話を組み合わせ、2〜12話者、重なり、残響、雑音、クロスフェードを用いて実環境に近い遷移を作ります。"),
          l("合成器允许重叠区间达到较短发言的一定比例，并在低能量边缘调整拼接点。这能规模化制造监督信号，却不能替代真实互动：合成的轮换规则、音色组合与噪声分布一旦过于规则，模型可能学会生成器的习惯，而不是人的对话习惯。", "The synthesizer permits substantial overlap relative to the shorter utterance and adjusts boundaries around low-energy regions. This scales supervision but does not replace real interaction: overly regular turn rules, speaker combinations, or noise distributions can teach generator artifacts rather than human conversation.", "合成器は短い発話に対して大きな重なりを許し、低エネルギー付近へ接合点を調整します。教師データは増えますが実対話の代わりではなく、規則的すぎる交替や音色、雑音分布は人間ではなく生成器の癖を学習させます。"),
        ],
        bullets: [
          { title: l("合成的优势", "Why synthesize", "合成する理由"), text: l("可以精确保留每位说话人的时间与文字真值，并主动覆盖少见的高重叠场景。", "It preserves exact speaker, timing, and transcript labels while deliberately covering rare high-overlap cases.", "話者・時刻・文字の正解を正確に保持し、珍しい高重なり条件を意図的に増やせます。") },
          { title: l("合成的盲点", "Synthetic blind spot", "合成の盲点"), text: l("真实会议中的犹豫、多人同时笑声、设备失真和语码切换，未必能由规则混音充分模拟。", "Hesitation, group laughter, device distortion, and code-switching in real meetings may not be captured by rule-based mixing.", "実会議のためらい、複数人の笑い、機器歪み、コードスイッチは規則的な混音では十分再現できない場合があります。") },
        ],
        callout: { label: l("数据声明要分层", "Separate project claims from reproducible detail", "主張と再現条件を分ける"), text: l("“百万小时”属于项目侧规模描述；技术报告未给出可逐项核查的数据构成与许可清单，因此不应把它写成已经独立复现的训练条件。", "“Millions of hours” is a project-level scale claim. The report does not provide an itemized, independently checkable data and license inventory, so it should not be treated as a reproduced training recipe.", "「100万時間規模」はプロジェクト側の説明です。報告には項目別に検証できるデータ構成・ライセンス一覧がなく、独立再現済みの学習条件として扱うべきではありません。") },
      },
      {
        id: "evaluation",
        kicker: l("05 · 指标解读", "05 · Reading the metrics", "05 · 指標の読み方", "05 · 지표 읽기"),
        heading: l("CER 好不代表“谁说的”也一定对", "A good CER does not guarantee correct speaker attribution", "CERが良くても話者帰属が正しいとは限らない", "CER이 좋아도 화자 귀속까지 정확하다는 뜻은 아니다"),
        paragraphs: [
          l("CER 只计算文字层面的编辑距离；cpCER 会先寻找参考说话人与预测说话人的最佳排列，再计算归属后的字符错误。两者之差 Δcp 可以粗略观察话者归属带来的额外损失，但它不是标准 diarization error rate，也无法单独描述漏检、误检与混淆时间。", "CER measures character edits only. cpCER first finds the best permutation between reference and predicted speakers, then scores speaker-attributed text. Their difference, Δcp, roughly exposes attribution cost, but it is not diarization error rate and does not separately measure missed, false-alarm, or confused time.", "CERは文字編集距離だけを測ります。cpCERは参照話者と予測話者の最良対応を求めてから話者付き文字を評価します。差分Δcpは帰属コストの目安ですが、DERではなく、未検出・誤検出・混同時間を個別には示しません。"),
          l("因此应同时观察基础文字质量与说话人归属增量。电影场景中 CER 尚可但 Δcp 较高，说明重叠、背景声或快速切换仍会破坏归属；AliMeeting 出现负 Δcp 也不是数学错误，而是排列式汇总与整体 CER 的分段方式可能带来这种结果。", "Both text quality and attribution increment matter. In movies, reasonable CER with a larger Δcp suggests overlap, background audio, or rapid turns still hurt attribution. A negative Δcp on AliMeeting is not necessarily a calculation error; permutation-based aggregation and segmentation can produce it.", "文字品質と話者帰属の増分を併記すべきです。映画ではCERが比較的良くてもΔcpが大きく、重なりや背景音、速い交替が帰属を壊すことが分かります。AliMeetingの負のΔcpも必ずしも誤りではなく、順列評価と集計方法で起こり得ます。"),
        ],
        table: {
          caption: l("技术报告 v6 / 模型卡中的 0.9B 结果（数值越低越好）", "0.9B results in technical report v6 / model card (lower is better)", "技術報告v6／モデルカードの0.9B結果（低いほど良い）"),
          headers: [l("数据集", "Dataset", "データセット"), l("CER", "CER", "CER"), l("cpCER", "cpCER", "cpCER"), l("Δcp", "Δcp", "Δcp")],
          rows: [
            { cells: [l("AISHELL-4", "AISHELL-4", "AISHELL-4"), l("14.84", "14.84", "14.84"), l("15.83", "15.83", "15.83"), l("0.99", "0.99", "0.99")] },
            { cells: [l("Podcast", "Podcast", "Podcast"), l("5.97", "5.97", "5.97"), l("7.37", "7.37", "7.37"), l("1.40", "1.40", "1.40")] },
            { cells: [l("Movies", "Movies", "Movies"), l("6.36", "6.36", "6.36"), l("12.76", "12.76", "12.76"), l("6.40", "6.40", "6.40")] },
            { cells: [l("AliMeeting", "AliMeeting", "AliMeeting"), l("24.86", "24.86", "24.86"), l("22.17", "22.17", "22.17"), l("-2.69", "-2.69", "-2.69")] },
          ],
          note: l("Podcast 与 Movies 为自建测试集，当前公开材料不足以让第三方完整复核其采样与标注。", "Podcast and Movies are in-house test sets; public material is not yet sufficient to reproduce their sampling and annotation fully.", "PodcastとMoviesは独自テストセットで、公開情報だけではサンプリングと注釈を完全再現できません。"),
        },
        callout: { label: l("不要混用指标", "Do not substitute metrics", "指標を混同しない"), text: l("如果产品关心“每位参会者说了多久”，还应报告 DER、重叠语音表现和时间戳误差；cpCER 只能回答归属后的文字是否正确。", "If a product needs speaking-time accounting, it should also report DER, overlap behavior, and timestamp error. cpCER answers whether attributed text is correct, not all diarization questions.", "発話時間の集計が必要ならDER、重なり音声、時刻誤差も報告すべきです。cpCERは帰属後の文字精度を示すだけです。") },
      },
      {
        id: "claims",
        kicker: l("06 · 结果纠偏", "06 · Calibrating the claims", "06 · 主張の補正", "06 · 주장 보정하기"),
        heading: l("亮眼数字成立的范围，比标题更重要", "The scope of a strong number matters more than the headline", "目立つ数値は適用範囲まで読んで初めて意味を持つ", "인상적인 수치보다 그 수치가 성립하는 범위가 더 중요하다"),
        paragraphs: [
          l("AISHELL-4 上，相对一个 cpCER 24.99 的公开基线，15.83 约等于 36.7% 的相对下降；对 27.86 的另一系统则约为 43.2%。这是有意义的改善，但它只针对特定数据集、指标和版本，不能自动外推到所有语言、麦克风和会议形态。", "On AISHELL-4, 15.83 cpCER is about a 36.7% relative reduction from a 24.99 baseline and about 43.2% from a 27.86 system. This is meaningful, but it is scoped to a dataset, metric, and version; it does not automatically generalize to every language, microphone, or meeting style.", "AISHELL-4ではcpCER 15.83は24.99の基準から約36.7%、27.86の別システムから約43.2%の相対低下です。有意な改善ですが、特定データ・指標・版に限られ、全言語や全マイク、全会議形式へ自動的に一般化できません。"),
          l("微信介绍与最新版报告在个别 AISHELL 数值上存在差异，模型卡与 v6 报告给出的 15.83 / 0.99 应作为当前参考。电影数据上“最优 Δcp”的文字描述也与表格中若干闭源系统的数值非常接近甚至略有冲突，所以更稳妥的结论是其表现具有竞争力，而不是宣称所有维度绝对第一。", "The WeChat article and the latest report differ on some AISHELL figures; 15.83 / 0.99 from the model card and v6 report is the current reference. The movie-set “best Δcp” wording is also extremely close to, or slightly conflicts with, some closed-system table values. “Competitive” is safer than an absolute across-the-board first place.", "微信記事と最新版報告ではAISHELLの一部数値が異なり、現時点ではモデルカード／v6の15.83・0.99を参照すべきです。映画セットの「最良Δcp」も表中の閉鎖系と僅差または軽い不整合があるため、全指標で絶対一位より「競争力がある」が妥当です。"),
        ],
        bullets: [
          { title: l("版本优先级", "Version priority", "版の優先順位"), text: l("动态宣传页可能早于论文修订；引用实验时应标明报告版本与访问日期。", "Promotional pages may predate paper revisions; cite the report version and access date with experimental claims.", "紹介ページは論文改訂より古いことがあるため、実験値には報告版と参照日を添えます。") },
          { title: l("速度条件", "Speed conditions", "速度条件"), text: l("4090 的 100 token/s 与 H100 服务端 RTF 来自不同设置，不能直接互换，也不能替代端到端延迟测试。", "A 4090 token-rate claim and H100 server-side RTF come from different settings; they are not interchangeable and do not replace end-to-end latency tests.", "4090のtoken/sとH100サーバーのRTFは条件が異なり、互換ではなく、エンドツーエンド遅延測定の代わりにもなりません。") },
        ],
      },
      {
        id: "deployment",
        kicker: l("07 · 应用路径", "07 · Deployment path", "07 · 活用への道筋", "07 · 적용 경로"),
        heading: l("最适合先做可审计的离线转写，而不是无人值守定稿", "Start with auditable offline transcription, not unattended final copy", "まず監査可能なオフライン文字起こしから始める", "무인 최종본보다 감사 가능한 오프라인 전사부터 시작하기"),
        paragraphs: [
          l("会议、访谈、呼叫中心质检和字幕草稿是自然场景：统一输出能减少工程模块，长上下文有助于保持整场记录的一致编号。模型还支持在提示中加入术语或热词，但公开材料没有提供系统性的热词消融，因此上线前要测试普通词误触发与错误提示下的退化。", "Meetings, interviews, call-center review, and subtitle drafts are natural uses. Unified output reduces pipeline glue, and long context helps consistent numbering. Prompts can include terminology or hotwords, but there is no systematic public hotword ablation, so false triggers and misleading prompts must be tested before launch.", "会議、インタビュー、コールセンター監査、字幕草稿が自然な用途です。統合出力は接着処理を減らし、長文脈は番号整合性を助けます。専門語やホットワードを提示できますが、体系的な公開アブレーションがないため、誤誘発と誤った提示での劣化を事前検証すべきです。"),
          l("可靠流程应保留原始音频、模型版本、结构化输出和人工修改记录；对数字、姓名、法律或医疗术语设低置信复核规则。真实姓名映射放在独立权限层，避免把匿名聚类结果误当身份事实。", "A dependable workflow retains source audio, model version, structured output, and human edits, with review rules for numbers, names, and legal or medical terms. Identity mapping belongs in a separately permissioned layer so anonymous clustering is not mistaken for an identity fact.", "信頼できる運用では元音声、モデル版、構造化出力、人手修正を保存し、数字・氏名・法律医療用語に確認規則を設けます。実名対応は別権限層へ置き、匿名クラスタを本人情報と誤認しないようにします。"),
        ],
        bullets: [
          { title: l("先影子运行", "Shadow first", "まずシャドー運用"), text: l("与现有系统并行记录数周，按房间、设备、语言和重叠比例切分错误。", "Run alongside the current system for several weeks and slice errors by room, device, language, and overlap ratio.", "現行系と数週間並走し、部屋・機器・言語・重なり率別に誤りを分析します。") },
          { title: l("再定义人工界面", "Design the review UI", "確認画面を設計"), text: l("让编辑者能从每个文字片段一键回听对应音频，并快速合并或拆分匿名说话人。", "Let reviewers replay the matching audio for each text span and quickly merge or split anonymous speakers.", "各文字区間から対応音声を再生し、匿名話者を素早く統合・分割できる画面が必要です。") },
        ],
      },
      {
        id: "limits",
        kicker: l("08 · 尚未回答", "08 · Open questions", "08 · 未解決点", "08 · 남은 질문"),
        heading: l("缺少的不是演示，而是可复核的边界证据", "What is missing is reproducible boundary evidence, not another demo", "不足しているのはデモではなく再検証できる限界証拠", "더 필요한 것은 또 다른 데모가 아니라 재현 가능한 한계 근거다"),
        paragraphs: [
          l("当前结果没有系统报告时间戳偏差、标准 DER、置信区间或关键组件消融；自建 Podcast 与 Movies 也缺少足够公开细节。我们因此无法判断改进主要来自长上下文、合成数据、结构 token，还是更强的基础编码器。", "Current results do not systematically report timestamp error, standard DER, confidence intervals, or component ablations, and the in-house Podcast and Movies sets lack sufficient public detail. We therefore cannot isolate whether gains come mainly from long context, synthetic data, structure tokens, or the stronger encoder.", "現結果には時刻誤差、標準DER、信頼区間、主要要素のアブレーションが体系的に示されず、独自Podcast・Moviesの詳細も不足します。改善が長文脈、合成データ、構造トークン、強いエンコーダのどれに由来するか切り分けられません。"),
          l("此外它仍是离线、匿名的记录生成器。高重叠多人讨论、陌生语言、极长录音中的显存压力，以及输出格式失配都需要按目标场景实测。把它称为有前景的开放基线是合理的，把它称为已经解决所有多说话人转写则过早。", "It remains an offline, anonymous record generator. Heavy overlap, unseen languages, memory pressure on very long audio, and format failures all require task-specific testing. Calling it a promising open baseline is reasonable; calling multi-speaker transcription solved is premature.", "これは依然としてオフラインかつ匿名の記録生成器です。高重なり、未知言語、超長音声のメモリ、書式崩れを用途別に試す必要があります。有望な公開基準とは言えますが、複数話者文字起こしが解決済みとは言えません。"),
        ],
        bullets: [
          { title: l("希望补充", "Useful additions", "望まれる追加"), text: l("公开测试集构成、DER/时间戳指标、长短上下文消融，以及不同并发与硬件下的完整延迟曲线。", "Public test-set construction, DER/timestamp metrics, long-vs-short-context ablations, and full latency curves across hardware and concurrency.", "テストセット構成、DER・時刻指標、長短文脈アブレーション、機器・同時実行数別の完全な遅延曲線が望まれます。") },
          { title: l("当前结论", "Current conclusion", "現時点の結論"), text: l("结构统一与全局话者建模值得借鉴；精度、速度和身份能力必须分别验证。", "Unified structure and global speaker modeling are valuable ideas; accuracy, speed, and identity capability must be validated separately.", "構造統合と全体話者モデリングは有用ですが、精度・速度・本人識別能力は別々に検証すべきです。") },
        ],
        callout: { label: l("独立导读声明", "Independent interpretation", "独立解説"), text: l("本文基于技术报告、模型卡与项目页面重新组织观点，不是原文翻译，也不构成对未公开数据或宣传结论的背书。", "This note reorganizes the technical report, model card, and project materials in the author's own analysis. It is neither a translation nor an endorsement of undisclosed data or promotional conclusions.", "本稿は技術報告・モデルカード・プロジェクト資料を独自に再構成したもので、翻訳でも、非公開データや宣伝上の結論への保証でもありません。") },
      },
    ],
    glossary: [
      { term: "ASR", definition: l("自动语音识别，把音频内容转为文字。", "Automatic speech recognition: converting speech audio into text.", "自動音声認識。音声内容を文字へ変換します。") },
      { term: "SATS", definition: l("带说话人归属和时间信息的转写任务，目标是同时回答谁、何时、说了什么。", "Speaker-attributed transcription with timestamps: who said what and when.", "話者帰属と時刻を備え、誰がいつ何を話したかを求める文字起こしです。") },
      { term: "Diarization", definition: l("根据音频将发言片段聚类到不同匿名说话人的过程。", "The process of clustering speech regions by anonymous speaker.", "音声区間を匿名話者ごとにまとめる処理です。") },
      { term: "CER", definition: l("字符错误率，以替换、删除和插入数衡量文字转写误差。", "Character error rate based on substitutions, deletions, and insertions.", "置換・削除・挿入で測る文字誤り率です。") },
      { term: "cpCER", definition: l("先寻找说话人标签的最佳排列，再统计各说话人文字错误的指标。", "Permutation-aware character error rate for speaker-attributed transcripts.", "話者ラベルの最適対応後に文字誤りを測る指標です。") },
      { term: "DER", definition: l("说话人日志错误率，统计漏检、误检和话者混淆所占时间。", "Diarization error rate, covering missed, false-alarm, and confused speaker time.", "未検出・誤検出・話者混同時間を測る話者ダイアライゼーション誤り率です。") },
      { term: "RTF", definition: l("实时因子；处理时间除以音频时长，小于 1 表示平均速度快于实时。", "Real-time factor: processing time divided by audio duration.", "処理時間を音声長で割るリアルタイム係数です。") },
      { term: "KV cache", definition: l("自回归推理中缓存的注意力键值，能减少重复计算，但会随上下文增长占用显存。", "Cached attention keys and values that save repeated computation but grow with context.", "自己回帰推論で再計算を減らす注意機構のキャッシュで、文脈とともにメモリを消費します。") },
    ],
    sources: [
      { label: l("微信原文", "WeChat article", "WeChat記事", "WeChat 원문"), kind: "article", url: "https://mp.weixin.qq.com/s/EGLtIthM19PU8h8t31O5Qw" },
      { label: l("技术报告（arXiv）", "Technical report (arXiv)", "技術報告（arXiv）", "기술 보고서(arXiv)"), kind: "paper", url: "https://arxiv.org/abs/2601.01554" },
      { label: l("官方 GitHub", "Official GitHub", "公式GitHub", "공식 GitHub"), kind: "repository", url: "https://github.com/OpenMOSS/MOSS-Transcribe-Diarize" },
      { label: l("官方模型卡", "Official model card", "公式モデルカード", "공식 모델 카드"), kind: "model", url: "https://huggingface.co/OpenMOSS-Team/MOSS-Transcribe-Diarize" },
    ],
  },
  {
    index: "02",
    slug: "dllm-asr-prior-guided-adaptive-denoising",
    published: "2026-06-29",
    readingTime: l("约 17 分钟", "About 17 min", "約17分", "약 17분"),
    category: l("深度报告 · 扩散语言模型 ASR", "Deep report · Diffusion-LM ASR", "詳細レポート · 拡散言語モデルASR", "심층 보고서 · 확산 언어 모델 ASR"),
    title: l(
      "扩散式 ASR 为什么先写一份粗稿，反而能快 4.44 倍？",
      "Why can a diffusion ASR system run 4.44× faster by drafting first?",
      "拡散型ASRは、なぜ先に下書きを作ると4.44倍速くなるのか",
      "확산형 ASR은 왜 초안을 먼저 쓰면 4.44배 빨라질까?"
    ),
    summary: l(
      "dLLM-ASR 不让 8B 扩散语言模型从全掩码序列开始盲目恢复文本，而是由轻量 CTC 分支先提供长度和粗略转写，再按置信度只修补不确定位置。它展示的不是“扩散天然更快”，而是一套把昂贵计算集中到难 token 的推理工程。",
      "dLLM-ASR does not ask an 8B diffusion language model to reconstruct text from an entirely masked sequence. A lightweight CTC branch supplies length and a draft, then confidence-guided denoising focuses on uncertain positions. The lesson is not that diffusion is inherently faster, but that expensive computation can be allocated to difficult tokens.",
      "dLLM-ASRは8Bの拡散言語モデルに全マスク列から文字を当てさせず、軽量CTCが長さと下書きを与え、確信度に応じて不確かな位置だけを修正します。拡散が本質的に速いのではなく、高価な計算を難しいトークンへ集中する設計です。",
      "dLLM-ASR은 8B 확산 언어 모델이 전체 마스크 시퀀스에서 무작정 텍스트를 복원하게 하지 않습니다. 가벼운 CTC 분기가 길이와 초안을 제공하고 신뢰도 기반 디노이징이 불확실한 위치에 집중합니다. 핵심은 확산이 본질적으로 빠르다는 것이 아니라 비싼 계산을 어려운 토큰에 배분하는 방식입니다."
    ),
    thesis: l(
      "这篇工作的价值在于把扩散解码从“固定轮数、固定长度、全位置反复计算”改造成“有声学先验的自适应校对”；4.44 倍是相对指定自回归基线、在特定硬件和测试流程下的结果，不能脱离条件引用。",
      "The contribution turns diffusion decoding from fixed rounds over a padded, fully uncertain sequence into adaptive proofreading with an acoustic prior. The 4.44× number is relative to a specified autoregressive baseline under a particular evaluation setup, not a hardware-independent constant.",
      "本研究は、固定長・固定反復で全位置を再計算する拡散復号を、音響事前分布付きの適応的校正へ変えます。4.44倍は特定の自己回帰基準、機器、評価条件に対する値で、普遍定数ではありません。",
      "이 연구는 고정 길이·고정 반복으로 모든 위치를 재계산하던 확산 디코딩을 음향 사전정보가 있는 적응형 교정으로 바꿉니다. 4.44배는 특정 자기회귀 기준 모델과 하드웨어·평가 조건에서 얻은 값이며 보편적인 상수가 아닙니다."
    ),
    tags: ["dLLM", "ASR", "CTC", "Adaptive denoising", "KV cache"],
    facts: [
      {
        label: l("平均 WER", "Average WER", "平均WER", "평균 WER"),
        value: l("6.34", "6.34", "6.34"),
        detail: l("在论文汇总的英语测试集上略低于自回归 Whisper-LLaMA3 的 6.54，但并非每个子集都更好。", "Across the paper's aggregated English test sets, this is slightly below Whisper-LLaMA3's 6.54, but not every subset improves.", "論文の英語テスト平均ではWhisper-LLaMA3の6.54を僅かに下回りますが、全サブセットで優位ではありません。"),
      },
      {
        label: l("实时因子", "Real-time factor", "リアルタイム係数", "실시간 계수"),
        value: l("0.063", "0.063", "0.063"),
        detail: l("同一论文中自回归基线为 0.280，由此得到约 4.44 倍加速；RTF 会随 GPU、批量和实现改变。", "The paper's autoregressive baseline is 0.280, yielding roughly 4.44×; RTF changes with GPU, batching, and implementation.", "同論文の自己回帰基準0.280に対して約4.44倍ですが、RTFはGPU、バッチ、実装で変わります。"),
      },
      {
        label: l("解码器", "Decoder", "デコーダ", "디코더"),
        value: l("LLaDA-8B-Instruct", "LLaDA-8B-Instruct", "LLaDA-8B-Instruct"),
        detail: l("语音编码器来自冻结的 Whisper-large-v3；适配器与 LoRA 分阶段训练，而不是从头训练整套 8B 模型。", "A frozen Whisper-large-v3 supplies speech features; the adapter and LoRA are trained in stages rather than retraining the full 8B model from scratch.", "音声特徴は凍結Whisper-large-v3から得て、8B全体をゼロから学習せず、アダプタとLoRAを段階的に訓練します。"),
      },
      {
        label: l("训练语音", "Training speech", "学習音声", "학습 음성"),
        value: l("约 13,900 小时英语", "About 13,900 hours of English", "約13,900時間の英語", "영어 약 13,900시간"),
        detail: l("数据来自 LibriSpeech、Common Voice 22 英语部分和 GigaSpeech；论文未证明相同策略可直接迁移到多语或语码切换。", "Data comes from LibriSpeech, English Common Voice 22, and GigaSpeech; the paper does not establish direct transfer to multilingual or code-switched speech.", "LibriSpeech、Common Voice 22英語、GigaSpeechを使用し、多言語やコードスイッチへの直接移行は未検証です。"),
      },
    ],
    sections: [
      {
        id: "motivation",
        kicker: l("01 · 速度悖论", "01 · The speed paradox", "01 · 速度の逆説", "01 · 속도의 역설"),
        heading: l("能并行改词，不代表整套系统就会更快", "Parallel token updates do not automatically make a faster system", "並列に単語を直せても、システム全体が速いとは限らない", "토큰을 병렬로 고쳐도 전체 시스템이 자동으로 빨라지지는 않는다"),
        paragraphs: [
          l("自回归 ASR 必须一个 token 接一个 token 生成，后一个词等待前一个词，看起来天然串行。扩散语言模型可以在一轮中同时更新多个位置，理论上更有并行潜力；但每一轮都要经过完整的 8B Transformer，如果轮数很多，单轮并行的优势会被反复计算吞掉。", "Autoregressive ASR emits one token after another, so later words wait for earlier ones. A diffusion language model can update many positions in each round, which offers parallelism, but every round still traverses an 8B Transformer. Too many rounds can erase the advantage.", "自己回帰ASRは一語ずつ生成し、後続語は前語を待ちます。拡散言語モデルは一回で複数位置を更新できますが、各ラウンドで8B Transformer全体を通るため、反復が多いと並列性の利点が消えます。"),
          l("论文中的朴素 Whisper-LLaDA 正是反例：LibriSpeech test-clean 上 RTF 约 1.678，明显慢于自回归 Whisper-LLaMA3 的 0.317。换言之，算法类别不会自动决定速度；初始化、输出长度、停止策略和缓存才决定实际算了多少次。", "The naïve Whisper-LLaDA baseline illustrates the problem: on LibriSpeech test-clean its RTF is about 1.678, much slower than 0.317 for autoregressive Whisper-LLaMA3. Model family alone does not determine speed; initialization, length, stopping, and caching determine how much work is done.", "朴素なWhisper-LLaDAはその反例で、LibriSpeech test-cleanのRTFは約1.678、自己回帰Whisper-LLaMA3は0.317です。方式名ではなく、初期化、長さ、停止、キャッシュが実計算量を決めます。"),
        ],
        bullets: [
          { title: l("串行瓶颈", "Serial bottleneck", "直列ボトルネック"), text: l("自回归的时间步数接近输出 token 数，但每步只决定一个新位置。", "Autoregressive step count tracks output length, with one new position committed per step.", "自己回帰は出力長に近い回数を要し、一ステップで一位置を確定します。") },
          { title: l("扩散瓶颈", "Diffusion bottleneck", "拡散のボトルネック"), text: l("扩散每轮可改多个位置，却可能在已经正确的 token 和纯填充位上重复浪费计算。", "Diffusion can revise many positions but may repeatedly spend compute on already-correct tokens and padding.", "拡散は複数位置を直せますが、既に正しいトークンやパディングへ計算を浪費しがちです。") },
        ],
        callout: { label: l("先看朴素基线", "Inspect the naïve baseline", "まず朴素基準を見る"), text: l("只有先承认原始扩散 ASR 比自回归更慢，后续 4.44 倍才容易被正确理解：这是优化后系统相对特定基线的端到端比较，而不是扩散对自回归的理论常数。", "The initial diffusion system being slower is essential context. The later 4.44× is an end-to-end comparison after optimization against a specific baseline, not a theoretical diffusion-to-AR constant.", "初期の拡散ASRが遅い事実が重要です。4.44倍は最適化後の特定基準との比較であり、拡散対自己回帰の理論定数ではありません。") },
      },
      {
        id: "mismatches",
        kicker: l("02 · 三种浪费", "02 · Three mismatches", "02 · 三つの無駄", "02 · 세 가지 낭비"),
        heading: l("全空白起步、固定长度、固定轮数都忽略了语音的难易差异", "All-mask starts, fixed length, and fixed rounds ignore speech difficulty", "全マスク開始・固定長・固定反復は音声の難易度差を無視する", "전체 마스크 시작·고정 길이·고정 반복은 음성의 난이도 차이를 무시한다"),
        paragraphs: [
          l("第一种浪费是从全 [MASK] 开始：模型明明已经接收声学表示，却没有一份离散文字草稿来缩小搜索空间。第二种是用固定最大长度覆盖大多数句子，短句后面的大量位置仍参与注意力。第三种是每条样本运行相同去噪轮数，简单、清晰的词也和含糊词一样反复送入大模型。", "First, an all-[MASK] sequence discards the chance to narrow the discrete search space with a textual draft. Second, a fixed maximum length keeps many positions active after short utterances. Third, a fixed number of denoising rounds sends easy, clear tokens through the large model as often as ambiguous ones.", "第一に全[MASK]から始めると、文字下書きで離散探索を狭める機会を捨てます。第二に最大長固定では短い発話の後ろも計算します。第三に反復回数固定では、明瞭な語も曖昧な語と同じだけ大モデルを通ります。"),
          l("dLLM-ASR 的核心判断是：语音识别不是从无到有的自由生成，而是存在强声学约束的序列恢复。轻量模型先把容易部分确定下来，昂贵模型只需要解决同音词、边界和语言一致性等难点。", "dLLM-ASR treats recognition as sequence recovery under strong acoustic constraints, not unconstrained generation. A cheap model commits the easy structure first, leaving homophones, boundaries, and linguistic consistency to the expensive model.", "dLLM-ASRは音声認識を自由生成ではなく、強い音響制約下の系列復元とみなします。軽量モデルが容易な構造を先に決め、高価なモデルは同音語、境界、言語整合性へ集中します。"),
        ],
        bullets: [
          { title: l("位置不等价", "Positions are unequal", "位置は等価ではない"), text: l("静音后的填充位、清晰常用词和噪声中的专名不应该获得相同计算预算。", "Padding after silence, a clear common word, and a noisy proper name should not receive the same compute budget.", "無音後のパディング、明瞭な一般語、雑音中の固有名詞へ同じ計算量を割くべきではありません。") },
          { title: l("轮数不等价", "Examples are unequal", "発話も等価ではない"), text: l("短而清晰的句子可以早停，长句和低置信位置则保留更多修订机会。", "Short clear utterances can stop early, while long or uncertain spans retain more revision opportunities.", "短く明瞭な文は早期終了し、長文や低確信部分には修正機会を残します。") },
        ],
      },
      {
        id: "architecture",
        kicker: l("03 · 声学到文字", "03 · From acoustics to text", "03 · 音響から文字へ", "03 · 음향에서 텍스트로"),
        heading: l("冻结语音编码器，把训练重点放在跨模态接口", "Freeze the speech encoder and train the modality bridge", "音声エンコーダを凍結し、モダリティ橋を学習する", "음성 인코더를 고정하고 모달리티 연결부를 학습한다"),
        paragraphs: [
          l("系统使用冻结的 Whisper-large-v3 编码器提取 25 Hz 特征，再以步长为 2 的一维卷积降至 12.5 Hz，并通过线性层把 1280 维声学表示投影到 LLaDA 的 4096 维空间。这样保留成熟声学前端，同时让扩散语言模型在熟悉的隐藏维度接收语音条件。", "A frozen Whisper-large-v3 encoder produces 25 Hz features. A stride-2 Conv1d reduces them to 12.5 Hz, and a linear layer projects 1280-dimensional acoustics into LLaDA's 4096-dimensional space. The design retains a mature acoustic front end while conditioning the diffusion LM in its native hidden dimension.", "凍結Whisper-large-v3が25Hz特徴を作り、stride 2のConv1dで12.5Hzへ落とし、線形層で1280次元からLLaDAの4096次元へ射影します。成熟した音響前段を保ち、拡散LMへ馴染みの表現空間で条件を渡します。"),
          l("训练分两步：先只训练适配器，避免一开始扰动语言模型；再联合适配器与 LoRA，让解码器学习语音条件下的文字恢复。离散掩码扩散按时间 t 随机遮住目标 token，并用与 1/t 相关的权重学习恢复；约 20% 样本使用完全遮蔽，以保留从零恢复的能力。", "Training first updates only the adapter, then jointly updates the adapter and LoRA so the decoder learns speech-conditioned reconstruction. Discrete masked diffusion hides target tokens according to time t and uses a 1/t-related weighting; about 20% of examples are fully masked to preserve full reconstruction ability.", "学習はまずアダプタのみ、次にアダプタとLoRAを更新します。離散マスク拡散は時刻tに応じて正解トークンを隠し、1/tに関係する重みで復元を学びます。約20%は全マスクで、完全復元能力も維持します。"),
        ],
        bullets: [
          { title: l("冻结的意义", "Why freeze", "凍結の意味"), text: l("减少训练成本并保护已有声学表征，但也限制了前端针对扩散目标共同适配的空间。", "It reduces training cost and protects acoustic representations, but limits end-to-end adaptation to the diffusion objective.", "学習コストと既存音響表現を守る一方、拡散目標への前段共同適応を制限します。") },
          { title: l("提示模板", "Prompt template", "プロンプト形式"), text: l("聊天式指令并非装饰；去掉后 test-clean / other WER 从 2.28 / 5.17 退化到 2.87 / 5.76。", "The chat instruction is functional, not cosmetic: removing it worsens clean/other WER from 2.28/5.17 to 2.87/5.76.", "チャット指示は装飾ではなく、削除するとclean/other WERが2.28/5.17から2.87/5.76へ悪化します。") },
        ],
      },
      {
        id: "inference",
        kicker: l("04 · 四个加速器", "04 · Four accelerators", "04 · 四つの高速化", "04 · 네 가지 가속 장치"),
        heading: l("先验、早停、裁长和缓存是一套联动系统", "Prior, early exit, pruning, and caching work as a system", "事前分布・早期確定・長さ削減・キャッシュは連動する", "사전정보·조기 종료·길이 가지치기·캐시는 하나의 시스템으로 작동한다"),
        paragraphs: [
          l("轻量 CTC 分支先生成粗稿与长度提示，使扩散过程从“有根据的候选”而不是全空白开始。每轮去噪后，置信度超过阈值的 token 可以固定，剩余计算集中到不确定位置；实现还保证每轮至少确认最高置信的一个位置，避免完全停滞。", "A lightweight CTC branch provides a draft and length hint, so diffusion starts from an informed candidate rather than blanks. After each round, tokens above a confidence threshold can be committed, concentrating later compute on uncertainty; at least the top-confidence position is finalized each round to guarantee progress.", "軽量CTCが下書きと長さを与え、拡散は空白ではなく根拠ある候補から始まります。各ラウンドで閾値以上のトークンを確定し、不確かな位置へ計算を集中します。停止を避けるため最低一位置は必ず確定します。"),
          l("自适应长度裁剪会尽早移除预测为结束或填充的尾部位置；语音条件在各轮不变，因此它的注意力键值可以缓存，无需重复编码。这四项并非彼此独立：若 CTC 粗稿很差，过早固定错误 token 反而让语言模型失去纠正机会。", "Adaptive length pruning removes likely end/padding positions early. Because speech conditioning is invariant across rounds, its attention keys and values can be cached. The four techniques are interdependent: a poor CTC draft combined with aggressive commitment can freeze errors before the LM corrects them.", "適応的長さ削減は終端・パディング候補を早く除きます。音声条件は反復間で不変なので注意K/Vをキャッシュできます。ただしCTC下書きが悪い状態で早く確定すると、LMが誤りを直せなくなります。"),
        ],
        bullets: [
          { title: l("CTC 先验", "CTC prior", "CTC事前分布"), text: l("提供 token 内容与有效长度的低成本起点。", "Provides a low-cost starting point for token content and valid length.", "トークン内容と有効長の安価な出発点を与えます。") },
          { title: l("置信早停", "Confidence exit", "確信度による確定"), text: l("阈值 τ=0.9 用于让稳定位置退出后续去噪。", "A threshold of τ=0.9 lets stable positions leave subsequent denoising.", "閾値τ=0.9で安定位置を後続の去ノイズから外します。") },
          { title: l("动态裁长", "Length pruning", "動的長さ削減"), text: l("不让短句持续为固定 128 位输出支付注意力成本。", "Avoids paying attention cost for a fixed 128-position output on short speech.", "短い発話に固定128位置分の注意計算を払わないようにします。") },
          { title: l("语音 KV 缓存", "Speech KV cache", "音声KVキャッシュ"), text: l("跨去噪轮复用不变的声学条件，减少大模型重复工作。", "Reuses invariant acoustic conditioning across denoising rounds.", "反復間で不変な音響条件を再利用します。") },
        ],
        callout: { label: l("协同而非堆功能", "Synergy, not a checklist", "機能の羅列ではなく相乗効果"), text: l("早停单独就能大幅降 RTF，却会把 test-clean WER 从约 2.34 拉高到 2.98；可靠先验负责让“早”不等于“草率”。", "Early exit alone sharply lowers RTF but raises test-clean WER from roughly 2.34 to 2.98. A reliable prior is what prevents “early” from becoming “reckless.”", "早期確定だけならRTFは大きく下がりますが、test-clean WERは約2.34から2.98へ悪化します。信頼できる事前分布が、早さを拙速にしない鍵です。") },
      },
      {
        id: "results",
        kicker: l("05 · 结果对照", "05 · Results in context", "05 · 結果の比較", "05 · 결과 비교"),
        heading: l("4.44 倍来自 0.280 ÷ 0.063，而“精度不掉”需要更细地说", "4.44× is 0.280 ÷ 0.063, while “no accuracy loss” needs nuance", "4.44倍は0.280÷0.063、「精度低下なし」には補足が要る", "4.44배는 0.280÷0.063의 결과이며 ‘정확도 손실 없음’에는 설명이 더 필요하다"),
        paragraphs: [
          l("论文汇总 LibriSpeech、Common Voice 和未见过的 VoxPopuli 英语测试，dLLM-ASR 平均 WER 6.34、RTF 0.063；自回归 Whisper-LLaMA3 为 6.54 和 0.280。平均指标上，扩散系统略准且约快 4.44 倍。", "Across LibriSpeech, Common Voice, and unseen English VoxPopuli tests, dLLM-ASR reports 6.34 average WER at 0.063 RTF, versus 6.54 and 0.280 for Whisper-LLaMA3. On the aggregate, it is slightly more accurate and about 4.44× faster.", "LibriSpeech、Common Voice、未学習の英語VoxPopuliを集計すると、dLLM-ASRは平均WER 6.34・RTF 0.063、Whisper-LLaMA3は6.54・0.280です。平均では僅かに高精度で約4.44倍高速です。"),
          l("但 test-clean 子集上 dLLM-ASR 的 2.28 仍略差于自回归基线的 2.15。因此更准确的说法是“平均 WER 没有回退并略有改善”，而不是所有条件都不掉点。朴素扩散版本 RTF 1.736 到 0.063 的约 27.6 倍下降，也说明大部分加速来自推理策略，而非只换模型类别。", "On test-clean, however, dLLM-ASR's 2.28 is slightly worse than the autoregressive baseline's 2.15. The accurate claim is that aggregate WER does not regress and slightly improves, not that every condition is lossless. The roughly 27.6× reduction from naïve diffusion RTF 1.736 to 0.063 also shows that inference design drives most of the gain.", "ただしtest-cleanではdLLM-ASRの2.28が自己回帰基準2.15より僅かに悪化します。正確には平均WERが退化せず少し改善したのであり、全条件で無損失ではありません。朴素拡散RTF 1.736から0.063への約27.6倍低下は、推論設計が主な高速化要因だと示します。"),
        ],
        table: {
          caption: l("论文汇总对照（越低越好）", "Paper-level aggregate comparison (lower is better)", "論文の集計比較（低いほど良い）"),
          headers: [l("系统", "System", "システム"), l("平均 WER", "Average WER", "平均WER"), l("RTF", "RTF", "RTF"), l("相对解读", "Interpretation", "相対的な読み方")],
          rows: [
            { cells: [l("Whisper-LLaMA3（自回归）", "Whisper-LLaMA3 (AR)", "Whisper-LLaMA3（自己回帰）"), l("6.54", "6.54", "6.54"), l("0.280", "0.280", "0.280"), l("速度比较基线", "Speed reference", "速度比較の基準")] },
            { cells: [l("Whisper-LLaDA（朴素扩散）", "Whisper-LLaDA (naïve diffusion)", "Whisper-LLaDA（朴素拡散）"), l("论文各表设置略有差异", "Varies by table setup", "表の条件で異なる"), l("1.736", "1.736", "1.736"), l("证明扩散并非天然快", "Diffusion is not inherently fast", "拡散が自動的に速いわけではない")] },
            { cells: [l("dLLM-ASR（完整系统）", "dLLM-ASR (full)", "dLLM-ASR（完全系）"), l("6.34", "6.34", "6.34"), l("0.063", "0.063", "0.063"), l("约为自回归基线 4.44 倍", "About 4.44× the AR baseline", "自己回帰基準の約4.44倍")] },
          ],
          note: l("RTF 是特定实现与硬件上的测量，不应换算为任意设备的固定速度。", "RTF is implementation- and hardware-specific and should not be treated as a fixed speed on arbitrary devices.", "RTFは実装・機器依存で、任意の装置に共通する固定速度ではありません。"),
        },
      },
      {
        id: "ablation",
        kicker: l("06 · 消融告诉了什么", "06 · What the ablations reveal", "06 · アブレーションが示すこと", "06 · 어블레이션이 보여 주는 것"),
        heading: l("最小 RTF 不等于最佳系统，质量—速度要联合调参", "Minimum RTF is not the best system; quality and speed are co-tuned", "最小RTFが最良システムとは限らず、品質と速度を同時調整する", "최소 RTF가 최선의 시스템은 아니며 품질과 속도를 함께 조정해야 한다"),
        paragraphs: [
          l("从消融看，移除 CTC 先验或长度裁剪会让 test-clean RTF 从约 0.057 上升至 0.069 / 0.071，WER 变化相对小。这说明二者主要减少冗余计算；而置信早停直接改变哪些 token 还能被修正，对精度更敏感。", "Ablations show that removing the CTC prior or length pruning raises test-clean RTF from about 0.057 to 0.069/0.071 with comparatively small WER changes. These components primarily remove redundant work, while confidence exit changes which tokens remain editable and is more accuracy-sensitive.", "CTC事前分布または長さ削減を外すとtest-clean RTFは約0.057から0.069/0.071へ上がり、WER変化は比較的小さいため、主に冗長計算を削っています。一方、確信度による確定は修正可能な位置を変えるため精度に敏感です。"),
          l("阈值 τ=0.9 是在论文条件下的折中，不是部署默认真理。口音、噪声和领域专名会改变置信校准；如果 CTC 对某类语音过度自信，错误可能被提前锁死。生产环境需要按风险分组画出 WER—延迟曲线，而不是只选择一个全局阈值。", "The τ=0.9 threshold is a paper-specific compromise, not a universal deployment default. Accent, noise, and domain names change confidence calibration; an overconfident CTC branch can freeze errors. Production tuning should plot WER–latency curves by risk slice instead of selecting one global threshold.", "τ=0.9は論文条件の折衷で、普遍的な既定値ではありません。アクセント、雑音、専門固有名詞で確信度校正は変わり、CTCの過信は誤りを固定します。運用ではリスク別のWER–遅延曲線が必要です。"),
        ],
        bullets: [
          { title: l("校准优先", "Calibrate first", "校正を優先"), text: l("在开发集上检查置信区间与真实正确率是否匹配，再决定早停阈值。", "Check whether confidence bins match empirical correctness before choosing the exit threshold.", "確信度区間と実正解率が一致するか確認してから確定閾値を選びます。") },
          { title: l("错误可逆", "Keep errors reversible", "誤りを可逆に"), text: l("低置信专名、数字和否定词可以延迟固定，给语言模型更多修订轮次。", "Delay commitment for low-confidence names, numbers, and negations so the LM gets more revision rounds.", "低確信の固有名詞、数字、否定語は確定を遅らせ、LMに修正回数を与えます。") },
        ],
      },
      {
        id: "deployment",
        kicker: l("07 · 工程迁移", "07 · Engineering transfer", "07 · 工学的な応用", "07 · 엔지니어링 전이"),
        heading: l("“便宜草稿 + 昂贵校对”是一条比模型名称更通用的原则", "Cheap draft plus expensive refinement is the transferable principle", "安い下書き＋高価な校正こそ応用可能な原則", "‘저렴한 초안 + 비싼 교정’이 모델 이름보다 더 일반적인 원칙이다"),
        paragraphs: [
          l("即使不用扩散 LLM，这套思路也可迁移到其他系统：小模型给出候选和不确定性，大模型仅检查难片段；对所有轮次不变的声学条件做缓存；按实际长度裁掉无效位置。它本质上是预算分配，而不是某个架构的专利。", "The pattern transfers beyond diffusion LMs: a small model proposes candidates and uncertainty, a large model examines hard spans, invariant acoustic conditions are cached, and invalid tail positions are pruned. This is compute-budget allocation rather than an architecture-specific trick.", "この考え方は拡散LM以外にも移せます。小モデルが候補と不確かさを出し、大モデルは難所だけを確認し、不変の音響条件をキャッシュし、無効な末尾を削ります。本質は計算予算配分です。"),
          l("若要做流式识别，还需额外解决音频分块、稳定前缀、有限回看与增量 KV 缓存。论文系统按完整语句离线去噪，不能只凭低 RTF 就称为实时流式；首字延迟和用户看到的反复改写次数同样重要。", "Streaming requires additional chunking, stable-prefix rules, bounded lookback, and incremental KV caching. The paper denoises complete utterances offline, so low RTF alone does not establish streaming behavior; first-token latency and visible revision churn also matter.", "ストリーミングにはチャンク化、安定接頭辞、有限の振り返り、増分KVキャッシュが必要です。論文は完全発話をオフラインで処理するため、低RTFだけでリアルタイム流式とは言えず、初文字遅延と表示の書き換え回数も重要です。"),
        ],
        bullets: [
          { title: l("离线批处理", "Offline batch", "オフライン処理"), text: l("适合先验证吞吐、平均 WER 与显存占用，最接近论文设置。", "Best for first validating throughput, average WER, and memory under paper-like conditions.", "論文条件に近く、スループット、平均WER、メモリを最初に検証しやすい用途です。") },
          { title: l("交互式场景", "Interactive use", "対話用途"), text: l("还需单独报告首字时间、尾部确认延迟和每秒改写次数。", "Requires separate reporting of first-token time, finalization lag, and revisions per second.", "初文字時間、確定遅延、秒当たりの書き換え回数を別に測る必要があります。") },
        ],
        callout: { label: l("8B 仍然是 8B", "An 8B model is still an 8B model", "8Bは依然として8B"), text: l("RTF 很低不代表部署成本很低。权重、KV 缓存、批处理效率和所需 GPU 都应与一个更小的自回归或 CTC 系统做总拥有成本比较。", "A low RTF does not imply low deployment cost. Weights, KV cache, batch efficiency, and GPU requirements should be compared against smaller AR or CTC systems on total cost of ownership.", "RTFが低くても運用費が低いとは限りません。重み、KVキャッシュ、バッチ効率、GPU要件を小型AR・CTC系と総保有コストで比較すべきです。") },
      },
      {
        id: "limits",
        kicker: l("08 · 证据边界", "08 · Evidence boundary", "08 · 証拠の境界", "08 · 근거의 경계"),
        heading: l("英语离线实验很有启发，但距离通用语音接口仍有多道门槛", "The English offline result is instructive, not yet a universal speech interface", "英語オフライン結果は有益だが、汎用音声インターフェースではない", "영어 오프라인 결과는 유익하지만 아직 범용 음성 인터페이스는 아니다"),
        paragraphs: [
          l("训练与主测试集中在英语，尚缺多语、语码切换、强口音、远场噪声和专业术语的系统分析。VoxPopuli 的未见测试提供一定域外证据，但不能覆盖真实产品的长尾。论文还是预印本，当前也没有完整官方实现可用于独立复现全部速度数字。", "Training and main evaluation focus on English, without systematic multilingual, code-switching, strong-accent, far-field-noise, or terminology analysis. Unseen VoxPopuli provides some out-of-domain evidence but not production long tails. The work is a preprint, and a complete official implementation for reproducing every speed result is not currently available.", "学習と主要評価は英語中心で、多言語、コードスイッチ、強いアクセント、遠距離雑音、専門語の体系評価がありません。未見VoxPopuliは域外証拠の一部ですが実運用の長尾を覆わず、プレプリントで完全な公式再現実装も現時点ではありません。"),
          l("最值得保留的结论不是“扩散已经取代自回归”，而是三个工程原则：用廉价先验缩小问题、让计算随不确定性变化、缓存跨轮次不变的条件。它们需要在目标硬件和数据上重新验证，尤其要防止早停把偏差固化。", "The durable conclusion is not that diffusion has replaced autoregression. It is three engineering principles: narrow the problem with a cheap prior, allocate compute by uncertainty, and cache round-invariant conditions. Each must be revalidated on target data and hardware, especially against bias being frozen by early exit.", "残る結論は拡散が自己回帰を置き換えたことではありません。安い事前分布で問題を狭め、不確かさで計算を配分し、反復間で不変の条件をキャッシュする三原則です。対象データ・機器で再検証し、早期確定による偏り固定を防ぐ必要があります。"),
        ],
        bullets: [
          { title: l("未报告", "Not established", "未確立"), text: l("多语泛化、真正流式体验、噪声下置信校准与消费级硬件成本。", "Multilingual transfer, true streaming UX, noisy confidence calibration, and consumer-hardware cost.", "多言語移行、真の流式体験、雑音下の確信度校正、民生機器コストです。") },
          { title: l("已展示", "What is shown", "示されたこと"), text: l("在指定英语基准上，先验引导的自适应去噪可以同时保住平均 WER 并显著减少推理工作。", "On the specified English benchmarks, prior-guided adaptive denoising can preserve aggregate WER while sharply reducing inference work.", "指定英語ベンチでは、事前分布付き適応去ノイズが平均WERを保ちながら推論計算を大きく減らせることです。") },
        ],
        callout: { label: l("独立导读声明", "Independent interpretation", "独立解説"), text: l("本文按照论文证据重新解释方法与数字，不复述宣传文案；“快”与“精度不掉”均限定在论文给出的比较对象和汇总方式。", "This note independently interprets the paper rather than reproducing promotional copy. “Faster” and “no accuracy loss” are bounded by the paper's baselines and aggregation.", "本稿は宣伝文を写し直すのではなく論文証拠を独自に解釈し、「高速」「精度低下なし」を論文の比較対象と集計条件に限定します。") },
      },
    ],
    glossary: [
      { term: "AR / NAR", definition: l("自回归逐 token 生成；非自回归方法可在一次迭代中并行更新多个位置。", "Autoregressive generation commits tokens sequentially; non-autoregressive methods can update multiple positions per iteration.", "自己回帰は逐次生成し、非自己回帰は一反復で複数位置を更新できます。") },
      { term: "dLLM", definition: l("离散扩散语言模型，通过多轮遮蔽与恢复在 token 空间生成序列。", "A discrete diffusion language model that generates by iterative masking and reconstruction.", "トークン空間でマスクと復元を反復する離散拡散言語モデルです。") },
      { term: "CTC", definition: l("连接时序分类，一种无需逐帧对齐标注即可学习音频到文字映射的目标。", "Connectionist temporal classification, an objective for speech-to-text without frame-level alignments.", "フレーム単位の対応ラベルなしで音声から文字を学ぶConnectionist Temporal Classificationです。") },
      { term: "WER", definition: l("词错误率，以替换、删除与插入的词数除以参考词数。", "Word error rate: word substitutions, deletions, and insertions divided by reference words.", "単語の置換・削除・挿入を参照語数で割る単語誤り率です。") },
      { term: "RTF", definition: l("处理耗时与音频时长之比，依赖硬件、批量和实现。", "Processing time divided by audio duration; hardware- and implementation-dependent.", "処理時間を音声長で割り、機器・実装に依存する指標です。") },
      { term: "LoRA", definition: l("用低秩增量矩阵微调大模型部分权重的参数高效方法。", "A parameter-efficient method that fine-tunes low-rank weight updates.", "低ランクの重み差分を学習する効率的な微調整手法です。") },
      { term: "Early exit", definition: l("当某位置置信度足够高时，提前停止对它的后续计算。", "Stopping further computation for a position once confidence is high enough.", "位置の確信度が十分高い時点で後続計算を止めることです。") },
      { term: "KV cache", definition: l("复用注意力键值表示，避免每轮对不变条件重复计算。", "Reusing attention key/value states to avoid recomputing invariant context.", "不変文脈の再計算を避ける注意K/V状態の再利用です。") },
    ],
    sources: [
      { label: l("微信原文", "WeChat article", "WeChat記事", "WeChat 원문"), kind: "article", url: "https://mp.weixin.qq.com/s/BV4TV9PACl4RYIKvCzwNUA" },
      { label: l("论文摘要（arXiv）", "Paper abstract (arXiv)", "論文概要（arXiv）", "논문 초록(arXiv)"), kind: "paper", url: "https://arxiv.org/abs/2601.17902" },
      { label: l("论文网页版", "Paper HTML", "論文HTML", "논문 HTML"), kind: "paper", url: "https://arxiv.org/html/2601.17902" },
      { label: l("LLaDA 官方仓库（解码器基础）", "Official LLaDA repository (decoder foundation)", "LLaDA公式リポジトリ（デコーダ基盤）", "LLaDA 공식 저장소(디코더 기반)"), kind: "repository", url: "https://github.com/ML-GSAI/LLaDA" },
    ],
  },
  {
    index: "03",
    slug: "nemotron-labs-audex-unified-audio-llm",
    published: "2026-07-11",
    readingTime: l("约 20 分钟", "About 20 min", "約20分", "약 20분"),
    category: l("深度报告 · 统一音频语言模型", "Deep report · Unified audio-language model", "詳細レポート · 統合音声言語モデル", "심층 보고서 · 통합 오디오 언어 모델"),
    title: l(
      "给大语言模型装上耳朵和嘴，怎样才能不忘掉原来的文字能力？",
      "How do you give an LLM ears and a voice without erasing its text intelligence?",
      "LLMに耳と声を与えながら、元のテキスト能力を忘れさせないには",
      "LLM에 귀와 목소리를 더하면서 기존 텍스트 능력을 잊지 않게 하려면?"
    ),
    summary: l(
      "Nemotron-Labs-Audex 用一个解码器同时处理文本、语音和环境声音，并通过冻结文字嵌入、分阶段开放参数和持续文字回放，缓解音频训练对推理、指令遵循与长上下文能力的侵蚀。它的核心贡献是“如何扩展而不遗忘”，而不只是又做了一个能听能说的模型。",
      "Nemotron-Labs-Audex uses one decoder for text, speech, and general audio. Frozen text embeddings, staged parameter unfreezing, and sustained text replay reduce the damage that audio training can cause to reasoning, instruction following, and long-context skills. Its key question is how to expand a language model without making it forget.",
      "Nemotron-Labs-Audexは一つのデコーダで文字、音声、環境音を扱います。文字埋め込みの凍結、段階的なパラメータ解放、継続的な文字リプレイで、音声学習による推論・指示追従・長文脈能力の損失を抑えます。主題は「聞いて話す」以上に「拡張しても忘れない」ことです。",
      "Nemotron-Labs-Audex는 하나의 디코더로 텍스트, 음성, 환경음을 처리합니다. 텍스트 임베딩 고정, 단계적 파라미터 해제, 지속적인 텍스트 리플레이를 통해 오디오 학습이 추론·지시 이행·긴 문맥 능력을 훼손하는 문제를 줄입니다. 핵심은 단순히 듣고 말하는 모델이 아니라 ‘확장하면서도 잊지 않는’ 방법입니다."
    ),
    thesis: l(
      "统一模态最难的不是把音频 token 塞进词表，而是让巨量新梯度不覆盖已有文字行为。Audex 的消融显示，训练阶段设计和文字数据比例会决定长上下文与数学能力是否保留下来；因此“同一 checkpoint”不等于“所有能力无代价共存”。",
      "The hard part of unification is not inserting audio tokens into a vocabulary; it is preventing new gradients from overwriting established text behavior. Audex ablations show that staging and text-data ratio determine whether long-context and reasoning survive. One checkpoint therefore does not imply cost-free coexistence of every capability.",
      "統合の難所は音声トークンを語彙へ足すことではなく、新しい勾配が既存の文字行動を上書きしないようにすることです。Audexの消融では段階設計と文字比率が長文脈・推論保持を左右し、一つのcheckpointでも全能力が無償で共存するとは限りません。",
      "통합의 어려움은 오디오 토큰을 어휘에 넣는 데 있지 않고, 대규모의 새로운 그래디언트가 기존 텍스트 행동을 덮어쓰지 않게 하는 데 있습니다. Audex의 어블레이션은 학습 단계와 텍스트 비율이 긴 문맥·추론 능력의 유지 여부를 좌우함을 보여 줍니다. 하나의 체크포인트라고 해서 모든 능력이 비용 없이 공존하는 것은 아닙니다."
    ),
    tags: ["Audio LLM", "Nemotron", "Multimodal training", "TTS", "Long context"],
    facts: [
      {
        label: l("公开版本", "Released variants", "公開版", "공개 버전"),
        value: l("2B 与 30B-A3B", "2B and 30B-A3B", "2Bと30B-A3B"),
        detail: l("30B 是 MoE 总参数规模，A3B 表示单个 token 约激活 3B 参数；它不表示完整权重只有 3B。", "The 30B model is a mixture of experts; A3B means roughly 3B parameters are active per token, not that the complete checkpoint contains only 3B.", "30BはMoEの総パラメータで、A3Bは一トークンあたり約3Bが活性化する意味です。全checkpointが3Bだけではありません。"),
      },
      {
        label: l("训练规模", "Training scale", "学習規模", "학습 규모"),
        value: l("394M 样本 / 1.092M 小时", "394M samples / 1.092M hours", "394Mサンプル／1.092M時間"),
        detail: l("报告还统计 157.4B 音频 token 与 320.5B 文字 token；但未公开逐项数据集与许可清单。", "The report also lists 157.4B audio tokens and 320.5B text tokens, without an itemized public dataset and license inventory.", "報告は157.4B音声トークンと320.5B文字トークンも示しますが、項目別データ・ライセンス一覧は未公開です。"),
      },
      {
        label: l("训练上下文", "Training context", "学習コンテキスト", "학습 문맥"),
        value: l("262,144 token", "262,144 tokens", "262,144トークン"),
        detail: l("在 512 张 H100 上以 BF16 训练；模型卡支持更长上下文并不意味着单机能低成本复现训练或满长推理。", "Training used 512 H100 GPUs in BF16. Longer supported context does not imply low-cost single-machine reproduction of training or full-length inference.", "512枚のH100でBF16学習されました。長文脈対応は単機で安価に学習や最大長推論を再現できる意味ではありません。"),
      },
      {
        label: l("许可", "License", "ライセンス", "라이선스"),
        value: l("NVIDIA OneWay Noncommercial", "NVIDIA OneWay Noncommercial", "NVIDIA OneWay Noncommercial"),
        detail: l("属于面向研究的非商业发布，不应仅凭“权重开放”推断可直接用于商业产品。", "This is a research-oriented noncommercial release; open weights should not be interpreted as automatic permission for commercial deployment.", "研究向け非商用公開で、重みが入手可能でも商用利用が自動許可されるわけではありません。"),
      },
    ],
    sections: [
      {
        id: "unification",
        kicker: l("01 · 统一目标", "01 · The unification goal", "01 · 統合の目標", "01 · 통합의 목표"),
        heading: l("不是把 ASR、聊天和 TTS 接成管道，而是让同一解码器学会多种序列", "One decoder learns multiple sequence types instead of wiring ASR, chat, and TTS", "ASR・会話・TTSの接続ではなく、一つのデコーダが複数系列を学ぶ", "ASR·대화·TTS를 파이프라인으로 잇는 대신 하나의 디코더가 여러 시퀀스를 학습한다"),
        paragraphs: [
          l("常见语音助手先把声音转成文字，再让 LLM 推理，最后由 TTS 合成语音。Audex 仍可能按任务顺序执行这些步骤，但核心参数和 token 空间由同一个 Transformer 解码器共享：输入可以是文字或音频表示，输出可以是文字、离散语音 token 或一般声音 token。", "A conventional voice assistant runs ASR, text reasoning, and TTS as separate models. Audex may still execute these logical stages in sequence, but one Transformer decoder shares the parameters and token space: inputs can be text or encoded audio, while outputs can be text, discrete speech tokens, or general-audio tokens.", "一般的な音声助手はASR、文字推論、TTSを別モデルで行います。Audexも論理的には順に処理する場合がありますが、一つのTransformerデコーダがパラメータとトークン空間を共有し、文字・音声入力から文字・離散音声・一般音トークンを出力できます。"),
          l("共享的好处是音频理解可以直接借用语言模型的知识与推理，语音生成也能受同一上下文控制；风险则是不同任务竞争参数。音频 token 数量巨大、梯度密集，如果不做保护，模型可能为了学发声而忘记原来如何做数学、遵循格式或在长文档中找证据。", "Sharing lets audio understanding reuse linguistic knowledge and reasoning, while generation follows the same context. The risk is parameter competition: abundant audio tokens can overwrite mathematical reasoning, formatting, or long-document retrieval while the model learns to listen and speak.", "共有により音声理解は言語知識と推論を利用し、生成も同じ文脈に従えます。一方、大量の音声トークンの勾配が競合し、聞いて話す学習の過程で数学、書式、長文検索を忘れる危険があります。"),
        ],
        bullets: [
          { title: l("统一的收益", "Benefit", "統合の利点"), text: l("模态间不必只通过最终文字传递信息，语调、声音事件与语言语义可在共享表示中交互。", "Modalities need not communicate only through final text; prosody, sound events, and semantics can interact in shared representations.", "モダリティ間の情報が最終文字だけに限定されず、韻律、音イベント、意味が共有表現で相互作用します。") },
          { title: l("统一的代价", "Cost", "統合の代償"), text: l("训练分布、采样比例和参数开放顺序变成能力保持的关键超参数。", "Training distribution, sampling ratios, and unfreezing order become core hyperparameters for capability retention.", "学習分布、サンプリング比、パラメータ解放順序が能力保持の主要ハイパーパラメータになります。") },
        ],
        callout: { label: l("统一不等于同时", "Unified is not simultaneous", "統合は同時処理を意味しない"), text: l("同一 checkpoint 能做语音到语音，不代表它已经实现原生全双工对话。公开示例仍可按 ASR → 文字推理 → TTS 的阶段顺序完成。", "A single checkpoint that performs speech-to-speech does not establish native full-duplex dialogue. Public examples can still run ASR → text reasoning → TTS sequentially.", "一つのcheckpointで音声対音声ができても、原生全二重対話を意味しません。公開例はASR→文字推論→TTSを順に実行できます。") },
      },
      {
        id: "interfaces",
        kicker: l("02 · 音频接口", "02 · Audio interfaces", "02 · 音声インターフェース", "02 · 오디오 인터페이스"),
        heading: l("输入是连续表示，输出则按声音类型使用不同离散码", "Inputs are continuous states; outputs use task-specific discrete audio codes", "入力は連続表現、出力は音種別の離散コード", "입력은 연속 표현이고 출력은 소리 유형별 이산 코드를 사용한다"),
        paragraphs: [
          l("音频输入先经过 AF-Whisper：16 kHz 波形以约 30 秒窗口编码为 25 Hz、1280 维表示，再投影到文字嵌入空间。这样理解任务无需先把音频硬转成文字，环境音、韵律和非语言线索可以直接进入解码器条件。", "Audio input passes through AF-Whisper: 16 kHz waveforms are encoded in roughly 30-second windows into 25 Hz, 1280-dimensional states and projected into the text embedding space. Understanding tasks need not force audio through transcription first, so sound events and prosody can condition the decoder directly.", "音声入力はAF-Whisperを通り、16kHz波形を約30秒窓で25Hz・1280次元表現へ符号化し、文字埋め込み空間へ射影します。理解タスクでは必ずしも文字起こしを経ず、環境音や韻律を直接条件にできます。"),
          l("生成侧把文字词表扩展到音频码。语音使用 X-Codec2，速率约 50 token/s、码本 65,536；一般音频使用 X-Codec 的前四层，合计约 200 token/s。扩展后词表约 204,805 项，并为计算效率补齐到 205,312。不同 token 率意味着一段声音会比同长度文字产生更长序列。", "For generation, the vocabulary is extended with audio codes. Speech uses X-Codec2 at roughly 50 tokens/s with a 65,536-entry codebook; general audio uses the first four X-Codec levels at about 200 tokens/s. The vocabulary reaches about 204,805 entries and is padded to 205,312 for efficiency. Audio therefore creates much longer sequences than comparable text.", "生成側では語彙へ音声コードを追加します。音声はX-Codec2（約50 token/s、65,536コード）、一般音はX-Codecの先頭4層（計約200 token/s）を使います。語彙は約204,805項で計算効率のため205,312へ揃えられ、音声は同時間の文字より長い系列になります。"),
        ],
        bullets: [
          { title: l("理解路径", "Understanding path", "理解経路"), text: l("连续音频表示保留声学细节，投影层负责与语言模型隐藏空间对接。", "Continuous audio states retain acoustic detail; a projector connects them to the LM hidden space.", "連続音声表現が音響詳細を保ち、プロジェクタがLM隠れ空間へ接続します。") },
          { title: l("生成路径", "Generation path", "生成経路"), text: l("离散音频 token 允许使用标准 next-token 训练与推理工具，但会放大序列长度和带宽压力。", "Discrete audio tokens reuse standard next-token tooling but increase sequence length and bandwidth pressure.", "離散音声トークンは標準next-token基盤を使える一方、系列長と帯域負荷を増やします。") },
        ],
        callout: { label: l("码率决定成本", "Token rate drives cost", "トークン率がコストを決める"), text: l("通用音频约 200 token/s，十秒就可能带来约两千个音频 token；评估生成速度时应同时报告音频时长、token 率和实时因子。", "General audio at about 200 tokens/s can create roughly two thousand tokens for ten seconds. Generation reports should include audio duration, token rate, and real-time factor together.", "一般音は約200 token/sなので10秒で約2,000トークンになります。生成速度は音声長、トークン率、RTFを併記すべきです。") },
      },
      {
        id: "anti-forgetting",
        kicker: l("03 · 防止遗忘", "03 · Preventing forgetting", "03 · 忘却を防ぐ", "03 · 망각 방지"),
        heading: l("先保护文字空间，再逐步让主干接触音频", "Protect the text space first, then expose the backbone gradually", "まず文字空間を守り、主幹へ段階的に音声を導入する", "텍스트 공간을 먼저 보호한 뒤 백본에 오디오를 단계적으로 노출한다"),
        paragraphs: [
          l("Audex 不从第一天就让全部参数接受音频梯度。早期阶段冻结文字嵌入与主干，先训练新增加的音频编码、投影和输出接口；随后逐步开放更多参数，并持续混入文字任务。这样把“学会音频格式”和“重写语言能力”分开，降低突然漂移。", "Audex does not expose all parameters to audio gradients immediately. Early stages freeze text embeddings and the backbone while training new audio encoders, projectors, and output interfaces. Later stages progressively unfreeze parameters and continue mixing text tasks, separating interface acquisition from rewriting linguistic behavior.", "Audexは最初から全パラメータへ音声勾配を流しません。初期は文字埋め込みと主幹を凍結し、新しい音声エンコーダ、射影、出力部を学習します。その後徐々に解放し文字タスクを混ぜ、音声形式の獲得と文字能力の書き換えを分離します。"),
          l("消融非常直接：单阶段训练在 256K needle-in-a-haystack 测试只有 6.0，多阶段达到 99.3；在 1M 上是 0 对 86.8。冻结文字嵌入时 AIME 为 93.2，不冻结则降到 71.8。说明最容易被破坏的可能不是日常对话，而是依赖精确位置和稳定表示的高难能力。", "The ablations are stark: single-stage versus multi-stage training scores 6.0 versus 99.3 on 256K needle-in-a-haystack and 0 versus 86.8 at 1M. Freezing text embeddings yields 93.2 on AIME, compared with 71.8 when they are trainable. Fragile capabilities may be precision retrieval and reasoning rather than casual conversation.", "消融は明確で、単段階対多段階のNIAHは256Kで6.0対99.3、1Mで0対86.8です。文字埋め込み凍結のAIMEは93.2、非凍結は71.8。日常会話より精密検索や推論の方が壊れやすい可能性を示します。"),
        ],
        table: {
          caption: l("训练策略消融：能力保持依赖阶段设计", "Training ablation: retention depends on staging", "学習消融：能力保持は段階設計に依存"),
          headers: [l("比较", "Comparison", "比較"), l("较弱设置", "Weaker setup", "弱い設定"), l("保护设置", "Protected setup", "保護設定"), l("含义", "Interpretation", "意味")],
          rows: [
            { cells: [l("NIAH 256K", "NIAH 256K", "NIAH 256K"), l("单阶段 6.0", "Single-stage 6.0", "単段階 6.0"), l("多阶段 99.3", "Multi-stage 99.3", "多段階 99.3"), l("长文档检索高度敏感", "Long retrieval is highly sensitive", "長文検索は非常に敏感")] },
            { cells: [l("NIAH 1M", "NIAH 1M", "NIAH 1M"), l("单阶段 0", "Single-stage 0", "単段階 0"), l("多阶段 86.8", "Multi-stage 86.8", "多段階 86.8"), l("上下文容量不等于保留能力", "Capacity does not guarantee retention", "容量だけでは保持できない")] },
            { cells: [l("AIME", "AIME", "AIME"), l("文字嵌入可训练 71.8", "Text embeddings trainable 71.8", "文字埋め込み学習可 71.8"), l("文字嵌入冻结 93.2", "Text embeddings frozen 93.2", "文字埋め込み凍結 93.2"), l("词表空间是关键锚点", "Embedding space is a critical anchor", "埋め込み空間が重要な錨")] },
          ],
          note: l("数值来自论文消融条件，不代表所有模型都应永久冻结嵌入；重点是避免新模态一开始重写稳定的文字接口。", "These are paper-specific ablations, not a rule that embeddings must always remain frozen. The principle is to prevent a new modality from immediately rewriting a stable text interface.", "論文固有の消融で、埋め込みを永久凍結すべきという一般則ではありません。新モダリティが安定した文字接口を直ちに上書きしないことが要点です。"),
        },
      },
      {
        id: "data-and-training",
        kicker: l("04 · 训练配方", "04 · Training recipe", "04 · 学習レシピ", "04 · 학습 레시피"),
        heading: l("最终约七成仍是文字：多模态训练也要持续“复习旧课”", "Roughly seven-tenths remains text: multimodal training needs rehearsal", "最終的に約7割は文字：マルチモーダル学習にも復習が必要", "최종 데이터의 약 70%는 여전히 텍스트다: 멀티모달 학습에도 복습이 필요하다"),
        paragraphs: [
          l("报告汇总约 394M 样本、109.2 万小时音频、1574 亿音频 token 与 3205 亿文字 token。多阶段监督训练之后还接入文字侧 Cascade RL 和多域 on-policy distillation。最终混合中，文字占比约 69%；当比例降到约 56% 时，已有文字能力出现更明显退化。", "The report aggregates roughly 394M samples, 1.092M audio hours, 157.4B audio tokens, and 320.5B text tokens. Multi-stage supervised training is followed by text-side Cascade RL and multi-domain on-policy distillation. The final mixture is about 69% text; reducing it to about 56% causes more visible text regression.", "報告は約394Mサンプル、109.2万時間、157.4B音声トークン、320.5B文字トークンを集計します。多段階教師学習後に文字側Cascade RLと多領域on-policy蒸留を行い、最終混合の文字比は約69%。約56%まで下げると文字能力の退化が目立ちます。"),
          l("这解释了为什么数据规模不能只看音频小时：统一模型必须同时购买“新能力样本”和“旧能力保险”。而且音频 token 率远高于文字，按样本数、小时数或 token 数计算比例会得到不同直觉，训练报告必须说明采样单位。", "This is why audio hours alone are misleading: a unified model needs both new-capability data and insurance for old capabilities. Since audio token rates are much higher than text, ratios by sample, hour, or token lead to different intuitions; the sampling unit must be explicit.", "音声時間だけでは不十分な理由です。統合モデルには新能力データと旧能力を守る保険の両方が必要です。また音声のトークン率が高いため、サンプル・時間・トークンの比率は意味が異なり、採样単位を明示すべきです。"),
        ],
        bullets: [
          { title: l("文字回放", "Text rehearsal", "文字リプレイ"), text: l("持续采样高质量文字任务，让推理、知识、工具使用与格式遵循仍收到梯度。", "Continued high-quality text sampling keeps reasoning, knowledge, tool use, and formatting under active supervision.", "高品質文字タスクを継続して、推論、知識、ツール利用、書式へ教師信号を与えます。") },
          { title: l("分布透明度", "Distribution transparency", "分布の透明性"), text: l("公开总量很大，但缺少逐数据集清单，外部读者难以判断语言、口音、版权与合成数据比例。", "The totals are large, but no itemized dataset list makes language, accent, copyright, and synthetic-data composition hard to assess.", "総量は大きいものの項目別一覧がなく、言語、アクセント、著作権、合成比率を外部から判断しにくい状態です。") },
        ],
        callout: { label: l("规模不是可复现性", "Scale is not reproducibility", "規模は再現性ではない"), text: l("512 张 H100、BF16 和 262K 训练上下文描述了工程规模；没有数据明细、采样权重和完整训练代码时，第三方仍无法复现同一能力平衡。", "512 H100s, BF16, and 262K training context describe engineering scale. Without data inventory, sampling weights, and complete training code, third parties cannot reproduce the same capability balance.", "512枚H100、BF16、262K文脈は工学規模を示しますが、データ内訳、采样重み、完全な学習コードなしに同じ能力バランスは再現できません。") },
      },
      {
        id: "text-retention",
        kicker: l("05 · 文字能力", "05 · Text retention", "05 · 文字能力の保持", "05 · 텍스트 능력 유지"),
        heading: l("“没有回退”更接近总体趋势，而不是每个基准都原封不动", "“No regression” describes the overall trend, not every benchmark", "「退化なし」は全体傾向であり、全ベンチが不変という意味ではない", "‘성능 저하 없음’은 전체 경향이지 모든 벤치마크가 그대로라는 뜻은 아니다"),
        paragraphs: [
          l("与文字基座 Nemotron-Cascade-2-30B-A3B 比较，Audex 在 AIME 从 92.4 到 91.2，IFBench 从 82.9 到 77.8，1M NIAH 从 99.0 到 83.4；IMO 则从 79.3 提升到 81.1。结果更像“多数核心能力仍然强，局部有升有降”，而不是数值完全不变。", "Against Nemotron-Cascade-2-30B-A3B, Audex moves from 92.4 to 91.2 on AIME, 82.9 to 77.8 on IFBench, and 99.0 to 83.4 on 1M NIAH, while IMO rises from 79.3 to 81.1. The fair summary is that core text ability remains strong with local gains and losses, not that every score is unchanged.", "文字基盤との比較ではAIME 92.4→91.2、IFBench 82.9→77.8、1M NIAH 99.0→83.4、IMO 79.3→81.1です。全数値不変ではなく、中心的文字能力は強いまま局所的な増減がある、が妥当です。"),
          l("尤其值得注意的是长上下文：83.4 仍是强结果，却与基座的 99.0 有明显距离。这和多阶段消融一起说明，模型标称支持长上下文与它能否在长上下文中稳定检索，是两个不同问题。", "Long context is particularly revealing: 83.4 remains strong, yet the gap from 99.0 is material. Together with the staged-training ablation, this shows that advertised context capacity and reliable retrieval within that context are different properties.", "長文脈の83.4は依然高いものの基盤99.0との差は無視できません。段階学習の消融と合わせ、対応コンテキスト長とその中での安定検索は別の能力だと分かります。"),
        ],
        table: {
          caption: l("文字基座与 Audex-30B-A3B（论文报告值）", "Text backbone versus Audex-30B-A3B (paper values)", "文字基盤とAudex-30B-A3B（論文値）"),
          headers: [l("基准", "Benchmark", "ベンチマーク"), l("文字基座", "Text backbone", "文字基盤"), l("Audex", "Audex", "Audex"), l("变化", "Change", "変化")],
          rows: [
            { cells: [l("AIME", "AIME", "AIME"), l("92.4", "92.4", "92.4"), l("91.2", "91.2", "91.2"), l("-1.2", "-1.2", "-1.2")] },
            { cells: [l("IFBench", "IFBench", "IFBench"), l("82.9", "82.9", "82.9"), l("77.8", "77.8", "77.8"), l("-5.1", "-5.1", "-5.1")] },
            { cells: [l("NIAH 1M", "NIAH 1M", "NIAH 1M"), l("99.0", "99.0", "99.0"), l("83.4", "83.4", "83.4"), l("-15.6", "-15.6", "-15.6")] },
            { cells: [l("IMO", "IMO", "IMO"), l("79.3", "79.3", "79.3"), l("81.1", "81.1", "81.1"), l("+1.8", "+1.8", "+1.8")] },
          ],
          note: l("不同基准的分数尺度与统计波动不同，变化量不能跨行直接比较；这里用于呈现“有保持，也有回退”的结构。", "Benchmark scales and variance differ, so deltas should not be compared across rows; the table illustrates the mixed retention pattern.", "ベンチごとに尺度と分散が異なるため変化量の行間比較はできません。保持と退化が混在する構造を示す表です。"),
        },
      },
      {
        id: "audio-results",
        kicker: l("06 · 音频表现", "06 · Audio performance", "06 · 音声性能", "06 · 오디오 성능"),
        heading: l("覆盖面很广，但榜单第一与统一能力是两件事", "Broad coverage and benchmark leadership are different claims", "広い対応範囲と各榜首は別の主張", "폭넓은 지원과 벤치마크 1위는 서로 다른 주장이다"),
        paragraphs: [
          l("Audex 同一系列覆盖音频理解、ASR、翻译、TTS、环境音生成和语音到语音。30B 在 OpenASR 汇总 WER 为 6.82，2B 为 7.14，表现有竞争力；但同表 Canary-Qwen 为 5.63、Qwen3-Omni-Instruct 为 5.72，因此不能把它描述成该表上绝对最强识别器。", "The family covers audio understanding, ASR, translation, TTS, general audio generation, and speech-to-speech. OpenASR aggregate WER is 6.82 for 30B and 7.14 for 2B, which is competitive; Canary-Qwen at 5.63 and Qwen3-Omni-Instruct at 5.72 are lower in the same table, so absolute ASR leadership is not supported there.", "同系列は音声理解、ASR、翻訳、TTS、一般音生成、音声対音声を扱います。OpenASR平均WERは30Bが6.82、2Bが7.14で競争力がありますが、同表のCanary-Qwen 5.63、Qwen3-Omni-Instruct 5.72より高く、絶対首位とは言えません。"),
          l("TTS 的 WER 1.70 也很强，但 Qwen3-Omni 的 1.39 更低。BigBenchAudio 约 90 则支持它在综合听觉理解上的优势。正确解读是：一个 checkpoint 在许多任务上都达到高水平，减少专用模型切换；它没有在每个单项都超过最强专用或闭源系统。", "TTS WER of 1.70 is also strong, while Qwen3-Omni reports a lower 1.39. BigBenchAudio around 90 supports broad auditory understanding. The defensible claim is high performance across many tasks in one checkpoint, reducing model switching—not best-in-class on every individual metric.", "TTS WER 1.70も高水準ですがQwen3-Omniの1.39の方が低く、BigBenchAudio約90は総合聴覚理解を支えます。妥当な主張は一つのcheckpointが多課題で高水準に達することで、全単項目の首位ではありません。"),
        ],
        table: {
          caption: l("代表性音频结果与应有结论", "Representative audio results and calibrated reading", "代表的音声結果と妥当な読み方"),
          headers: [l("任务", "Task", "タスク"), l("Audex 结果", "Audex result", "Audex結果"), l("对照", "Reference", "比較"), l("稳妥结论", "Calibrated conclusion", "妥当な結論")],
          rows: [
            { cells: [l("OpenASR", "OpenASR", "OpenASR"), l("30B 6.82 / 2B 7.14 WER", "30B 6.82 / 2B 7.14 WER", "30B 6.82 / 2B 7.14 WER"), l("Canary-Qwen 5.63", "Canary-Qwen 5.63", "Canary-Qwen 5.63"), l("强而非表内第一", "Strong, not table-best", "高水準だが表内首位ではない")] },
            { cells: [l("TTS 可懂度", "TTS intelligibility", "TTS明瞭度"), l("WER 1.70", "WER 1.70", "WER 1.70"), l("Qwen3-Omni 1.39", "Qwen3-Omni 1.39", "Qwen3-Omni 1.39"), l("统一模型中有竞争力", "Competitive for a unified model", "統合モデルとして競争力あり")] },
            { cells: [l("BigBenchAudio", "BigBenchAudio", "BigBenchAudio"), l("约 90", "About 90", "約90"), l("跨任务综合", "Cross-task aggregate", "複数課題の総合"), l("支持广泛音频理解", "Supports broad audio understanding", "広い音声理解を支持")] },
          ],
          note: l("WER 越低越好；BigBenchAudio 的方向和任务构成不同，不能与 WER 横向比较。", "Lower WER is better; BigBenchAudio has a different direction and task composition and is not numerically comparable to WER.", "WERは低いほど良い一方、BigBenchAudioは方向と構成が異なりWERと数値比較できません。"),
        },
        callout: { label: l("统一模型的评价方式", "How to evaluate a unified model", "統合モデルの評価法"), text: l("除了单项最佳，还应比较任务切换成本、跨模态一致性、总显存与维护复杂度；否则会低估“一个模型完成多件事”的系统价值，也可能掩盖单项短板。", "Beyond per-task best scores, compare task-switching overhead, cross-modal consistency, total memory, and maintenance complexity. Otherwise system value is understated while task-specific weaknesses may be hidden.", "単項目首位だけでなく、タスク切替コスト、モダリティ整合性、総メモリ、保守複雑性を比較すべきです。統合の価値と個別の弱点を両方見る必要があります。") },
      },
      {
        id: "deployment",
        kicker: l("07 · 使用与部署", "07 · Use and deployment", "07 · 利用と展開", "07 · 사용과 배포"),
        heading: l("A3B 降低每 token 计算，不会让 30B 权重凭空变小", "A3B reduces per-token compute; it does not shrink 30B of weights", "A3Bは一トークン計算を減らすが、30B重みを小さくはしない", "A3B는 토큰당 계산량을 줄이지만 30B 가중치 자체를 작게 만들지는 않는다"),
        paragraphs: [
          l("MoE 每个 token 只激活约 3B 参数，因此算力路径比稠密 30B 更轻；但专家权重仍需存储和调度，完整模型的内存、通信与加载时间不能按 3B 估算。模型卡示例使用 tensor parallel 8，说明官方验证过该配置，不代表逻辑上必须八卡，也不证明普通消费显卡能轻松运行完整 30B。", "MoE activates roughly 3B parameters per token, reducing the compute path relative to a dense 30B model. Yet expert weights still require storage and routing, so memory, communication, and load time cannot be budgeted as a 3B checkpoint. A tensor-parallel-8 example is a validated configuration, not proof that eight GPUs are mandatory or that a consumer GPU easily hosts the full 30B model.", "MoEは一トークンあたり約3Bを活性化し、稠密30Bより計算経路を軽くします。しかし全専門家重みの保存とルーティングが必要で、メモリや通信を3Bとして見積もれません。TP=8の例は検証済み構成で、8枚必須でも民生GPUで容易という証明でもありません。"),
          l("语音到语音演示还应拆开测量：录音结束到文字完成、文字推理、首个音频 token、音频播放追上实时的时间。若产品需要低延迟打断和同时听说，还要增加流式编码、回声消除、轮次管理与安全策略；论文中的顺序式 S2S 不足以证明这些能力。", "Speech-to-speech latency should be decomposed into end-of-input to transcript, text reasoning, first audio token, and time until playback catches real time. Low-latency interruption and simultaneous listen/speak additionally require streaming encoders, echo cancellation, turn control, and safety logic; sequential S2S does not establish them.", "音声対音声の遅延は入力終了から文字完成、文字推論、最初の音声トークン、再生が実時間へ追いつくまでに分解すべきです。割り込みや同時送受話には流式エンコーダ、エコー除去、ターン制御、安全設計が追加で必要で、順序式S2Sだけでは証明できません。"),
        ],
        bullets: [
          { title: l("先核对许可", "Check the license first", "まずライセンス確認"), text: l("非商业许可适合研究与评估；商业集成前需要重新确认权利范围。", "The noncommercial license supports research and evaluation; commercial integration requires a separate rights review.", "非商用ライセンスは研究・評価向けで、商用統合前に権利範囲の再確認が必要です。") },
          { title: l("按任务做路由", "Route by task", "タスク別にルーティング"), text: l("若只需要 ASR，小型专用模型可能更省；只有跨理解与生成时，统一模型的共享价值才充分体现。", "For ASR alone, a small specialist may be cheaper; the shared checkpoint is most valuable when understanding and generation are both needed.", "ASRだけなら小型専用モデルが安価な場合があり、理解と生成をまたぐとき統合checkpointの価値が大きくなります。") },
        ],
        callout: { label: l("先做总成本表", "Build a total-cost table", "総コスト表を作る"), text: l("同时记录权重内存、峰值 KV 缓存、音频 tokenizer 开销、首包延迟和许可约束，再与 ASR+LLM+TTS 管道比较，而不是只比较激活参数。", "Record weight memory, peak KV cache, audio-tokenizer cost, first-packet latency, and license constraints, then compare against an ASR+LLM+TTS cascade rather than comparing active parameters alone.", "重みメモリ、最大KV、音声tokenizer、初回遅延、ライセンスを記録し、活性パラメータだけでなくASR+LLM+TTSパイプラインと総合比較します。") },
      },
      {
        id: "limits",
        kicker: l("08 · 结论与边界", "08 · Conclusion and limits", "08 · 結論と限界", "08 · 결론과 한계"),
        heading: l("最值得学习的是训练控制，而最需要补的是独立复现与真实体验", "Training control is the lesson; independent reproduction and real-world experience are missing", "学ぶべきは学習制御、補うべきは独立再現と実体験", "가장 배울 점은 학습 제어이며 가장 필요한 보완은 독립 재현과 실제 사용 경험이다"),
        paragraphs: [
          l("Audex 用大量消融说明了统一音频模型的失败模式：单阶段训练会摧毁长文检索，开放文字嵌入可能伤害数学能力，文字回放比例过低会导致整体回退。这些证据比“能做多少任务”的列表更可迁移，因为任何向成熟 LLM 添加新模态的团队都会遇到类似问题。", "Audex ablations expose failure modes of unified audio training: single-stage tuning can destroy long retrieval, trainable text embeddings can hurt mathematical reasoning, and insufficient text rehearsal causes broad regression. These lessons transfer to any team adding a modality to a mature LLM.", "Audexの消融は、単段階学習が長文検索を壊し、文字埋め込み更新が数学を傷つけ、文字リプレイ不足が全体退化を招く失敗を示します。成熟LLMへ新モダリティを追加する多くの開発へ移せる知見です。"),
          l("边界同样清楚：主要 TTA 训练片段约十秒，最终版本移除了声音模仿能力；没有完整逐项数据清单、独立复现、系统听感测试或生产延迟曲线。模型权重可获得但许可非商业。因此当前最合适的定位是强研究基线与训练方法案例，而不是已经验证的通用商业语音代理。", "The boundaries are equally clear: much text-to-audio training centers on roughly ten-second clips, voice imitation is removed from the final release, and there is no full dataset inventory, independent reproduction, systematic listening study, or production latency curve. With a noncommercial license, the appropriate position is a strong research baseline and training case study, not a validated universal commercial voice agent.", "限界も明確です。TTA学習の中心は約10秒、最終版では声の模倣を除去し、完全なデータ一覧、独立再現、体系的聴感試験、実運用遅延曲線がありません。非商用ライセンスのため、強い研究基準・学習事例であり、検証済み汎用商用音声エージェントではありません。"),
        ],
        bullets: [
          { title: l("已证明", "Established", "示されたこと"), text: l("分阶段训练、文字锚点与高比例回放可以显著缓解跨模态灾难性遗忘。", "Staging, text anchors, and substantial rehearsal can materially reduce cross-modal catastrophic forgetting.", "段階学習、文字アンカー、十分なリプレイがモダリティ追加時の破局的忘却を大きく緩和できます。") },
          { title: l("仍待验证", "Still open", "未検証"), text: l("商业许可、真实双工、长音频生成、不同语言与口音、独立听感和端到端延迟。", "Commercial rights, true duplex interaction, long audio generation, languages and accents, independent listening, and end-to-end latency.", "商用権利、真の全二重、長音生成、多言語・アクセント、独立聴感、エンドツーエンド遅延です。") },
        ],
        callout: { label: l("独立导读声明", "Independent interpretation", "独立解説"), text: l("本文将论文、模型卡与原报道中的事实分开核对，并主动保留与标题不完全一致的结果；它是原创技术解读，不是原文改写或商业建议。", "This original technical interpretation cross-checks the paper, model cards, and article, retaining results that complicate the headline. It is neither a rewrite nor commercial advice.", "本稿は論文、モデルカード、記事を照合し、見出しを単純化できない結果も残した独自解説です。原文の書き換えでも商用助言でもありません。") },
      },
    ],
    glossary: [
      { term: "Audio LLM", definition: l("能以音频为输入或输出，并与语言推理共享模型能力的大语言模型。", "A language model that accepts or generates audio while sharing language-reasoning capacity.", "音声を入出力し、言語推論能力を共有する大規模言語モデルです。") },
      { term: "MoE / A3B", definition: l("专家混合模型按 token 路由到部分参数；A3B 表示约 3B 参数被激活，不是总权重。", "A mixture of experts routes each token through a subset; A3B denotes about 3B active parameters, not total weights.", "MoEはトークンごとに一部専門家へルーティングし、A3Bは約3B活性で総重みではありません。") },
      { term: "Audio codec token", definition: l("神经编解码器把连续波形量化成的离散符号，可由语言模型预测再还原为声音。", "A discrete symbol quantized from waveform by a neural codec and decoded back to audio.", "ニューラルcodecが波形を量子化した離散記号で、モデル予測後に音へ復元します。") },
      { term: "Catastrophic forgetting", definition: l("学习新任务时，参数更新显著破坏模型原有能力的现象。", "Severe loss of old capabilities while learning a new task or modality.", "新しい課題・モダリティの学習で既存能力が大きく失われる現象です。") },
      { term: "Replay", definition: l("新任务训练时持续混入旧任务样本，以维持原有行为。", "Mixing old-task examples into new training to preserve previous behavior.", "新学習へ旧課題サンプルを混ぜ、既存動作を維持する方法です。") },
      { term: "NIAH", definition: l("大海捞针测试，检查模型能否从很长上下文中找回指定信息。", "Needle-in-a-haystack testing of retrieval from very long context.", "非常に長い文脈から指定情報を取り出せるか測るテストです。") },
      { term: "On-policy distillation", definition: l("学生基于自己当前生成分布采样，再从教师信号学习，以缩小训练与推理分布差。", "Distillation on samples from the student's current policy to reduce train–inference mismatch.", "学生の現方策からサンプルし、教師信号で学ぶことで学習・推論分布差を減らす蒸留です。") },
      { term: "Tensor parallelism", definition: l("把同一层张量计算拆到多张加速卡上；示例卡数是配置选择，不等于模型逻辑要求。", "Splitting layer tensors across accelerators; an example degree is a configuration, not a logical model requirement.", "同一層のテンソル計算を複数GPUへ分割する方式で、例の枚数は構成選択です。") },
    ],
    sources: [
      { label: l("微信原文", "WeChat article", "WeChat記事", "WeChat 원문"), kind: "article", url: "https://mp.weixin.qq.com/s/_SI7YrQCWmFI-7e0SGYqTw" },
      { label: l("论文（arXiv）", "Paper (arXiv)", "論文（arXiv）", "논문(arXiv)"), kind: "paper", url: "https://arxiv.org/abs/2607.05196" },
      { label: l("Audex 官方模型合集", "Official Audex model collection", "Audex公式モデルコレクション", "Audex 공식 모델 컬렉션"), kind: "model", url: "https://huggingface.co/collections/nvidia/nemotron-labs-audex" },
      { label: l("30B-A3B 官方模型卡", "Official 30B-A3B model card", "30B-A3B公式モデルカード", "30B-A3B 공식 모델 카드"), kind: "model", url: "https://huggingface.co/nvidia/Nemotron-Labs-Audex-30B-A3B" },
      { label: l("2B 官方模型卡", "Official 2B model card", "2B公式モデルカード", "2B 공식 모델 카드"), kind: "model", url: "https://huggingface.co/nvidia/Nemotron-Labs-Audex-2B" },
    ],
  },
];

export const getReportBySlug = (slug: string): Report | undefined =>
  reports.find((report) => report.slug === slug);
