"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---------- 型定義 ---------- */

type Target = "callcenter" | "sns" | "secretary" | "other";
type EduType = "junior" | "high" | "vocational" | "juniorcollege" | "university";
type Exp = "none" | "similar" | "experienced";
type Priority = "stable" | "remote" | "growth";

type JobEntry = {
  id: number;
  company: string;
  inY: number;
  inM: number;
  current: boolean;
  outY: number;
  outM: number;
  note: string;
};

type LicenseEntry = { id: number; name: string; y: number; m: number };

type ResumeData = {
  target: Target;
  name: string;
  kana: string;
  birthY: number;
  birthM: number;
  birthD: number;
  gender: "" | "男" | "女";
  postal: string;
  address: string;
  phone: string;
  email: string;
  eduType: EduType;
  eduName: string;
  eduInY: number;
  eduInM: number;
  eduOutY: number;
  eduOutM: number;
  jobs: JobEntry[];
  licenses: LicenseEntry[];
  exp: Exp;
  strengths: string[];
  priority: Priority;
  motivation: string;
  motivationEdited: boolean;
  wishes: string;
  photo: string | null;
};

/* ---------- 定数 ---------- */

const STORAGE_KEY = "resume-builder-v1";
const NOW = new Date();
const THIS_YEAR = NOW.getFullYear();

const range = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

const BIRTH_YEARS = range(THIS_YEAR - 65, THIS_YEAR - 15).reverse();
const WORK_YEARS = range(1975, THIS_YEAR + 1).reverse();
const MONTHS = range(1, 12);
const DAYS = range(1, 31);

const TARGET_OPTIONS: { key: Target; icon: string; label: string }[] = [
  { key: "callcenter", icon: "🎧", label: "コールセンター・カスタマーサポート" },
  { key: "sns", icon: "📱", label: "SNS運用代行" },
  { key: "secretary", icon: "💻", label: "オンライン秘書・事務サポート" },
  { key: "other", icon: "🏢", label: "その他の事務・オフィスワーク" },
];

const TARGET_LABELS: Record<Target, string> = {
  callcenter: "コールセンター・カスタマーサポート",
  sns: "SNS運用代行",
  secretary: "オンライン秘書",
  other: "事務職",
};

const EDU_OPTIONS: { key: EduType; label: string; placeholder: string }[] = [
  { key: "high", label: "高校卒", placeholder: "例)県立桜台高等学校" },
  { key: "vocational", label: "専門学校卒", placeholder: "例)東京ビジネス専門学校 医療事務学科" },
  { key: "juniorcollege", label: "短大卒", placeholder: "例)青葉短期大学 生活学科" },
  { key: "university", label: "大学卒", placeholder: "例)桜台大学 経済学部" },
  { key: "junior", label: "中学卒", placeholder: "例)市立桜台中学校" },
];

const STRENGTH_OPTIONS = [
  "丁寧なコミュニケーション",
  "正確な事務処理",
  "タイピング・PC操作",
  "責任感・継続力",
  "相手の話を聴く力",
  "文章を書くこと",
];

const LICENSE_PRESETS = [
  "普通自動車第一種運転免許",
  "日商簿記検定3級",
  "MOS(Microsoft Office Specialist)",
  "秘書検定2級",
  "実用英語技能検定2級",
  "ITパスポート試験",
];

const WISH_PRESETS = [
  "在宅勤務を希望いたします。",
  "週3日からの勤務を希望いたします。",
  "扶養内での勤務を希望いたします。",
  "連絡は平日日中にお願いいたします。",
];

const STEPS = [
  "応募する仕事",
  "基本情報",
  "連絡先",
  "学歴",
  "職歴",
  "免許・資格",
  "志望動機",
  "写真・希望欄",
  "完成",
];

/* ---------- ユーティリティ ---------- */

function eduDefaults(birthY: number, birthM: number, type: EduType) {
  // 高校入学年(早生まれは1年前倒し)
  const base = birthY + (birthM <= 3 ? 15 : 16);
  switch (type) {
    case "junior":
      return { inY: base - 3, inM: 4, outY: base, outM: 3 };
    case "high":
      return { inY: base, inM: 4, outY: base + 3, outM: 3 };
    case "vocational":
    case "juniorcollege":
      return { inY: base + 3, inM: 4, outY: base + 5, outM: 3 };
    case "university":
      return { inY: base + 3, inM: 4, outY: base + 7, outM: 3 };
  }
}

function calcAge(y: number, m: number, d: number): number {
  let age = NOW.getFullYear() - y;
  if (
    NOW.getMonth() + 1 < m ||
    (NOW.getMonth() + 1 === m && NOW.getDate() < d)
  ) {
    age -= 1;
  }
  return age;
}

function buildMotivation(data: ResumeData): string {
  const job = TARGET_LABELS[data.target];
  const strength =
    data.strengths.length > 0
      ? data.strengths.join("と")
      : "丁寧なコミュニケーション";
  const expSentence: Record<Exp, string> = {
    none: "未経験ではありますが、研修やマニュアルを通じて業務を一つずつ確実に習得し、丁寧な対応を心がけてまいります。",
    similar:
      "これまでの接客・電話応対で培った経験を活かし、お客様に寄り添った対応ができると考えております。",
    experienced:
      "これまでの同職種での経験を活かし、即戦力として貢献できると考えております。",
  };
  const prioritySentence: Record<Priority, string> = {
    stable:
      "腰を据えて長く働きながら、業務の質を高めていきたいと考えております。",
    remote:
      "在宅勤務の環境でも自己管理を徹底し、安定した成果を出すことを大切にしております。",
    growth:
      "新しい知識の習得にも前向きに取り組み、担当できる業務の幅を広げていきたいと考えております。",
  };
  return `私は${strength}に自信があり、その力を${job}の仕事で活かしたいと考え、志望いたしました。${expSentence[data.exp]}${prioritySentence[data.priority]}貴社の一員として一日も早く戦力になれるよう努めてまいります。`;
}

const initialData: ResumeData = {
  target: "callcenter",
  name: "",
  kana: "",
  birthY: THIS_YEAR - 30,
  birthM: 4,
  birthD: 1,
  gender: "",
  postal: "",
  address: "",
  phone: "",
  email: "",
  eduType: "high",
  eduName: "",
  eduInY: 0,
  eduInM: 4,
  eduOutY: 0,
  eduOutM: 3,
  jobs: [],
  licenses: [],
  exp: "none",
  strengths: [],
  priority: "stable",
  motivation: "",
  motivationEdited: false,
  wishes: "貴社規定に従います。",
  photo: null,
};

/* ---------- 小さなUI部品 ---------- */

function Sel({
  value,
  onChange,
  options,
  suffix,
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  options: number[];
  suffix: string;
  className?: string;
}) {
  return (
    <label className={`inline-flex items-center gap-1 ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-2 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">{suffix}</span>
    </label>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {optional && (
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            任意
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400";

/* ---------- 本体 ---------- */

export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ResumeData>(initialData);
  const [loaded, setLoaded] = useState(false);
  const idRef = useRef(1);

  // 保存データの復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as ResumeData;
        setData({ ...initialData, ...saved });
        const maxId = Math.max(
          0,
          ...saved.jobs.map((j) => j.id),
          ...saved.licenses.map((l) => l.id)
        );
        idRef.current = maxId + 1;
      }
    } catch {
      /* 破損データは無視 */
    }
    setLoaded(true);
  }, []);

  // 自動保存
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* 容量超過(写真が大きい等)は無視 */
    }
  }, [data, loaded]);

  const update = useCallback((patch: Partial<ResumeData>) => {
    setData((d) => ({ ...d, ...patch }));
  }, []);

  // 生年月日・学歴タイプが変わったら入学卒業年を自動計算
  // (復元直後は実行せず、保存されていた手修正を守る)
  const eduDepsRef = useRef<string | null>(null);
  useEffect(() => {
    if (!loaded) return;
    const key = `${data.birthY}-${data.birthM}-${data.eduType}`;
    if (
      (eduDepsRef.current === null || eduDepsRef.current === key) &&
      data.eduInY !== 0 // 0=未入力なら初回でも計算する
    ) {
      eduDepsRef.current = key;
      return;
    }
    eduDepsRef.current = key;
    const def = eduDefaults(data.birthY, data.birthM, data.eduType);
    setData((d) => ({
      ...d,
      eduInY: def.inY,
      eduInM: def.inM,
      eduOutY: def.outY,
      eduOutM: def.outM,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.birthY, data.birthM, data.eduType, loaded]);

  // 志望動機の自動生成(手動編集後は上書きしない)
  useEffect(() => {
    if (!loaded || data.motivationEdited) return;
    setData((d) =>
      d.motivationEdited ? d : { ...d, motivation: buildMotivation(d) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.target, data.exp, data.strengths, data.priority, loaded]);

  const nextId = () => idRef.current++;

  const addJob = () =>
    update({
      jobs: [
        ...data.jobs,
        {
          id: nextId(),
          company: "",
          inY: THIS_YEAR - 3,
          inM: 4,
          current: data.jobs.length === 0,
          outY: THIS_YEAR,
          outM: 3,
          note: "",
        },
      ],
    });

  const updateJob = (id: number, patch: Partial<JobEntry>) =>
    update({
      jobs: data.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    });

  const removeJob = (id: number) =>
    update({ jobs: data.jobs.filter((j) => j.id !== id) });

  const addLicense = (name: string) =>
    update({
      licenses: [
        ...data.licenses,
        { id: nextId(), name, y: THIS_YEAR - 5, m: 4 },
      ],
    });

  const updateLicense = (id: number, patch: Partial<LicenseEntry>) =>
    update({
      licenses: data.licenses.map((l) =>
        l.id === id ? { ...l, ...patch } : l
      ),
    });

  const removeLicense = (id: number) =>
    update({ licenses: data.licenses.filter((l) => l.id !== id) });

  const onPhotoChange = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // 縦480pxに縮小してlocalStorage容量を節約
        const scale = Math.min(1, 480 / img.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        update({ photo: canvas.toDataURL("image/jpeg", 0.85) });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resetAll = () => {
    if (!window.confirm("入力内容をすべて削除してやり直しますか?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setData(initialData);
    setStep(0);
  };

  const toggleStrength = (s: string) => {
    const has = data.strengths.includes(s);
    if (has) {
      update({ strengths: data.strengths.filter((x) => x !== s) });
    } else if (data.strengths.length < 2) {
      update({ strengths: [...data.strengths, s] });
    }
  };

  const chipCls = (active: boolean) =>
    `px-3.5 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
      active
        ? "bg-indigo-600 text-white border-indigo-600"
        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
    }`;

  const bigChoiceCls = (active: boolean) =>
    `w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
      active
        ? "border-indigo-500 bg-indigo-50 shadow-sm"
        : "border-gray-200 bg-white hover:border-indigo-300"
    }`;

  /* ---------- 各ステップの中身 ---------- */

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <p className="text-gray-600 text-sm mb-5">
              どの仕事に応募しますか?志望動機の下書きに使います。
            </p>
            <div className="space-y-3">
              {TARGET_OPTIONS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => update({ target: t.key })}
                  className={bigChoiceCls(data.target === t.key)}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-semibold text-gray-900">{t.label}</span>
                </button>
              ))}
            </div>
          </>
        );

      case 1:
        return (
          <>
            <Field label="お名前">
              <input
                className={inputCls}
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="例)山田 花子"
              />
            </Field>
            <Field label="ふりがな">
              <input
                className={inputCls}
                value={data.kana}
                onChange={(e) => update({ kana: e.target.value })}
                placeholder="例)やまだ はなこ"
              />
            </Field>
            <Field label="生年月日">
              <div className="flex flex-wrap gap-2">
                <Sel
                  value={data.birthY}
                  onChange={(v) => update({ birthY: v })}
                  options={BIRTH_YEARS}
                  suffix="年"
                />
                <Sel
                  value={data.birthM}
                  onChange={(v) => update({ birthM: v })}
                  options={MONTHS}
                  suffix="月"
                />
                <Sel
                  value={data.birthD}
                  onChange={(v) => update({ birthD: v })}
                  options={DAYS}
                  suffix="日"
                />
              </div>
            </Field>
            <Field label="性別" optional>
              <div className="flex gap-2">
                {(["男", "女", ""] as const).map((g) => (
                  <button
                    key={g || "none"}
                    type="button"
                    onClick={() => update({ gender: g })}
                    className={chipCls(data.gender === g)}
                  >
                    {g || "記載しない"}
                  </button>
                ))}
              </div>
            </Field>
          </>
        );

      case 2:
        return (
          <>
            <Field label="郵便番号" optional>
              <input
                className={inputCls}
                value={data.postal}
                onChange={(e) => update({ postal: e.target.value })}
                placeholder="例)123-4567"
                inputMode="numeric"
              />
            </Field>
            <Field label="住所">
              <input
                className={inputCls}
                value={data.address}
                onChange={(e) => update({ address: e.target.value })}
                placeholder="例)東京都新宿区西新宿1-2-3 ○○マンション101"
              />
            </Field>
            <Field label="電話番号">
              <input
                className={inputCls}
                value={data.phone}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="例)090-1234-5678"
                inputMode="tel"
              />
            </Field>
            <Field label="メールアドレス">
              <input
                className={inputCls}
                value={data.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="例)hanako@example.com"
                inputMode="email"
              />
            </Field>
          </>
        );

      case 3:
        return (
          <>
            <p className="text-gray-600 text-sm mb-4">
              最終学歴を選ぶと、生年月日から入学・卒業年を自動で計算します(浪人・留年などがあれば直してください)。
            </p>
            <Field label="最終学歴">
              <div className="flex flex-wrap gap-2">
                {EDU_OPTIONS.map((e) => (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() => update({ eduType: e.key })}
                    className={chipCls(data.eduType === e.key)}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="学校名(学部・学科まで)">
              <input
                className={inputCls}
                value={data.eduName}
                onChange={(e) => update({ eduName: e.target.value })}
                placeholder={
                  EDU_OPTIONS.find((e) => e.key === data.eduType)?.placeholder
                }
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="入学">
                <div className="flex gap-2">
                  <Sel
                    value={data.eduInY}
                    onChange={(v) => update({ eduInY: v })}
                    options={WORK_YEARS}
                    suffix="年"
                  />
                  <Sel
                    value={data.eduInM}
                    onChange={(v) => update({ eduInM: v })}
                    options={MONTHS}
                    suffix="月"
                  />
                </div>
              </Field>
              <Field label="卒業">
                <div className="flex gap-2">
                  <Sel
                    value={data.eduOutY}
                    onChange={(v) => update({ eduOutY: v })}
                    options={WORK_YEARS}
                    suffix="年"
                  />
                  <Sel
                    value={data.eduOutM}
                    onChange={(v) => update({ eduOutM: v })}
                    options={MONTHS}
                    suffix="月"
                  />
                </div>
              </Field>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <p className="text-gray-600 text-sm mb-4">
              新しい順でなくてOK。アルバイト・パートも書いて大丈夫です。職歴がなければそのまま「次へ」。
            </p>
            <div className="space-y-4 mb-4">
              {data.jobs.map((j, i) => (
                <div
                  key={j.id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700">
                      職歴 {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeJob(j.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      削除
                    </button>
                  </div>
                  <input
                    className={`${inputCls} mb-3`}
                    value={j.company}
                    onChange={(e) =>
                      updateJob(j.id, { company: e.target.value })
                    }
                    placeholder="例)株式会社○○"
                  />
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 w-12">入社</span>
                    <Sel
                      value={j.inY}
                      onChange={(v) => updateJob(j.id, { inY: v })}
                      options={WORK_YEARS}
                      suffix="年"
                    />
                    <Sel
                      value={j.inM}
                      onChange={(v) => updateJob(j.id, { inM: v })}
                      options={MONTHS}
                      suffix="月"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 w-12">退社</span>
                    {j.current ? (
                      <span className="text-sm text-gray-500">在職中</span>
                    ) : (
                      <>
                        <Sel
                          value={j.outY}
                          onChange={(v) => updateJob(j.id, { outY: v })}
                          options={WORK_YEARS}
                          suffix="年"
                        />
                        <Sel
                          value={j.outM}
                          onChange={(v) => updateJob(j.id, { outM: v })}
                          options={MONTHS}
                          suffix="月"
                        />
                      </>
                    )}
                    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700 ml-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={j.current}
                        onChange={(e) =>
                          updateJob(j.id, { current: e.target.checked })
                        }
                        className="w-4 h-4 accent-indigo-600"
                      />
                      在職中
                    </label>
                  </div>
                  <input
                    className={inputCls}
                    value={j.note}
                    onChange={(e) => updateJob(j.id, { note: e.target.value })}
                    placeholder="仕事内容(任意)例)コールセンターにて受電業務を担当"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addJob}
              className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-colors"
            >
              + 職歴を追加
            </button>
          </>
        );

      case 5:
        return (
          <>
            <p className="text-gray-600 text-sm mb-4">
              当てはまるものをタップで追加。なければそのまま「次へ」。
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {LICENSE_PRESETS.filter(
                (p) => !data.licenses.some((l) => l.name === p)
              ).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => addLicense(p)}
                  className={chipCls(false)}
                >
                  + {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => addLicense("")}
                className="px-3.5 py-2 rounded-full text-sm font-medium border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50"
              >
                + その他の資格を書く
              </button>
            </div>
            <div className="space-y-3">
              {data.licenses.map((l) => (
                <div
                  key={l.id}
                  className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      className={inputCls}
                      value={l.name}
                      onChange={(e) =>
                        updateLicense(l.id, { name: e.target.value })
                      }
                      placeholder="資格名"
                    />
                    <button
                      type="button"
                      onClick={() => removeLicense(l.id)}
                      className="text-xs text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      削除
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">取得</span>
                    <Sel
                      value={l.y}
                      onChange={(v) => updateLicense(l.id, { y: v })}
                      options={WORK_YEARS}
                      suffix="年"
                    />
                    <Sel
                      value={l.m}
                      onChange={(v) => updateLicense(l.id, { m: v })}
                      options={MONTHS}
                      suffix="月"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 6:
        return (
          <>
            <p className="text-gray-600 text-sm mb-4">
              3つ選ぶだけで志望動機の下書きを自動で作ります。あとから自由に手直しできます。
            </p>
            <Field label="この仕事の経験は?">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["none", "未経験"],
                    ["similar", "接客・電話応対の経験あり"],
                    ["experienced", "同じ職種の経験あり"],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => update({ exp: k })}
                    className={chipCls(data.exp === k)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="アピールしたい強み(2つまで)">
              <div className="flex flex-wrap gap-2">
                {STRENGTH_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStrength(s)}
                    className={chipCls(data.strengths.includes(s))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="働き方で大事にしたいこと">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["stable", "長く安定して働きたい"],
                    ["remote", "在宅で両立したい"],
                    ["growth", "スキルを伸ばしたい"],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => update({ priority: k })}
                    className={chipCls(data.priority === k)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="志望動機(自動で下書き済み・編集OK)">
              <textarea
                className={`${inputCls} min-h-[140px] leading-relaxed`}
                value={data.motivation}
                onChange={(e) =>
                  update({ motivation: e.target.value, motivationEdited: true })
                }
              />
              <button
                type="button"
                onClick={() =>
                  update({
                    motivation: buildMotivation(data),
                    motivationEdited: false,
                  })
                }
                className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-800"
              >
                ↺ 選択内容から作り直す
              </button>
            </Field>
          </>
        );

      case 7:
        return (
          <>
            <Field label="証明写真" optional>
              {data.photo ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.photo}
                    alt="証明写真プレビュー"
                    className="w-[90px] h-[120px] object-cover border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => update({ photo: null })}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
              ) : (
                <label className="block w-full py-6 rounded-xl border-2 border-dashed border-gray-300 text-center text-sm text-gray-500 cursor-pointer hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                  タップして写真を選ぶ(あとで貼るなら空欄でOK)
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              <p className="text-xs text-gray-400 mt-2">
                写真はこの端末の中だけで処理され、どこにも送信されません。
              </p>
            </Field>
            <Field label="本人希望欄">
              <div className="flex flex-wrap gap-2 mb-3">
                {WISH_PRESETS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() =>
                      update({
                        wishes: data.wishes.includes(w)
                          ? data.wishes
                          : `${data.wishes.trim()}\n${w}`.trim(),
                      })
                    }
                    className={chipCls(data.wishes.includes(w))}
                  >
                    + {w.replace("いたします。", "")}
                  </button>
                ))}
              </div>
              <textarea
                className={`${inputCls} min-h-[90px] leading-relaxed`}
                value={data.wishes}
                onChange={(e) => update({ wishes: e.target.value })}
              />
            </Field>
          </>
        );

      case 8:
        return (
          <ResumePreview data={data} onEdit={(s) => setStep(s)} />
        );
    }
  };

  /* ---------- レイアウト ---------- */

  const isPreview = step === STEPS.length - 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 進捗 */}
      <div className="mb-6 no-print">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-indigo-700">
            {STEPS[step]}
          </span>
          <span className="text-xs text-gray-400">
            {step + 1} / {STEPS.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        className={
          isPreview
            ? ""
            : "bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        }
      >
        {renderStep()}
      </div>

      {/* ナビゲーション */}
      <div className="flex items-center justify-between mt-6 no-print">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 border border-gray-300 bg-white hover:bg-gray-50"
          >
            ← 戻る
          </button>
        ) : (
          <span />
        )}
        {!isPreview && (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="px-8 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-600 shadow hover:from-indigo-600 hover:to-indigo-700"
          >
            {step === STEPS.length - 2 ? "完成イメージを見る →" : "次へ →"}
          </button>
        )}
      </div>

      <div className="mt-8 text-center no-print">
        <button
          type="button"
          onClick={resetAll}
          className="text-xs text-gray-400 hover:text-red-500 underline"
        >
          入力内容をすべてリセット
        </button>
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          入力内容はこの端末(ブラウザ)にのみ保存され、サーバーには一切送信されません。
        </p>
      </div>
    </div>
  );
}

/* ---------- 履歴書プレビュー(印刷用) ---------- */

function ResumePreview({
  data,
  onEdit,
}: {
  data: ResumeData;
  onEdit: (step: number) => void;
}) {
  const age = calcAge(data.birthY, data.birthM, data.birthD);
  const today = `${NOW.getFullYear()}年${NOW.getMonth() + 1}月${NOW.getDate()}日現在`;

  const th =
    "border border-gray-700 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap";
  const td = "border border-gray-700 px-2 py-1.5 text-sm";
  const yCell = "border border-gray-700 px-1 py-1.5 text-sm text-center w-14";
  const mCell = "border border-gray-700 px-1 py-1.5 text-sm text-center w-10";

  const historyRows: React.ReactNode[] = [];
  historyRows.push(
    <tr key="edu-h">
      <td className={yCell}></td>
      <td className={mCell}></td>
      <td className={`${td} text-center font-semibold tracking-[1em]`}>学歴</td>
    </tr>
  );
  historyRows.push(
    <tr key="edu-in">
      <td className={yCell}>{data.eduInY || ""}</td>
      <td className={mCell}>{data.eduInM}</td>
      <td className={td}>
        {data.eduName || "(学校名)"} 入学
      </td>
    </tr>,
    <tr key="edu-out">
      <td className={yCell}>{data.eduOutY || ""}</td>
      <td className={mCell}>{data.eduOutM}</td>
      <td className={td}>
        {data.eduName || "(学校名)"} 卒業
      </td>
    </tr>
  );
  historyRows.push(
    <tr key="job-h">
      <td className={yCell}></td>
      <td className={mCell}></td>
      <td className={`${td} text-center font-semibold tracking-[1em]`}>職歴</td>
    </tr>
  );
  if (data.jobs.length === 0) {
    historyRows.push(
      <tr key="job-none">
        <td className={yCell}></td>
        <td className={mCell}></td>
        <td className={td}>なし</td>
      </tr>
    );
  } else {
    const sorted = [...data.jobs].sort(
      (a, b) => a.inY * 100 + a.inM - (b.inY * 100 + b.inM)
    );
    for (const j of sorted) {
      historyRows.push(
        <tr key={`in-${j.id}`}>
          <td className={yCell}>{j.inY}</td>
          <td className={mCell}>{j.inM}</td>
          <td className={td}>
            {j.company || "(会社名)"} 入社
            {j.note && (
              <span className="block text-xs text-gray-600">({j.note})</span>
            )}
          </td>
        </tr>
      );
      if (j.current) {
        historyRows.push(
          <tr key={`cur-${j.id}`}>
            <td className={yCell}></td>
            <td className={mCell}></td>
            <td className={td}>現在に至る</td>
          </tr>
        );
      } else {
        historyRows.push(
          <tr key={`out-${j.id}`}>
            <td className={yCell}>{j.outY}</td>
            <td className={mCell}>{j.outM}</td>
            <td className={td}>{j.company || "(会社名)"} 一身上の都合により退社</td>
          </tr>
        );
      }
    }
  }
  historyRows.push(
    <tr key="end">
      <td className={yCell}></td>
      <td className={mCell}></td>
      <td className={`${td} text-right pr-6`}>以上</td>
    </tr>
  );

  return (
    <div>
      <style>{`
        .resume-sheet {
          width: 210mm;
          min-height: 296mm;
          padding: 13mm 14mm;
          background: #fff;
          color: #111;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          @page { size: A4; margin: 0; }
          body * { visibility: hidden; }
          #resume-print, #resume-print * { visibility: visible; }
          #resume-print { position: absolute; top: 0; left: 0; width: 210mm; }
          .resume-sheet {
            min-height: 0;
            height: 296mm;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            page-break-after: always;
          }
          .resume-sheet:last-child { page-break-after: auto; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 text-sm text-indigo-900 leading-relaxed">
        <p className="font-bold mb-1">🎉 履歴書ができました!</p>
        <p>
          下のボタンから印刷、またはPDF保存(印刷画面で「PDFに保存」を選択)できます。直したいところは「戻る」か各見出しの
          <span className="font-semibold">編集</span>から。
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-3 px-8 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-600 shadow hover:from-indigo-600 hover:to-indigo-700"
        >
          🖨 印刷・PDF保存する
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div id="resume-print" className="space-y-6">
          {/* 1枚目 */}
          <div className="resume-sheet border border-gray-300 rounded shadow-md mx-auto">
            <div className="flex items-end justify-between mb-1">
              <h1 className="text-2xl font-bold tracking-[0.5em]">履歴書</h1>
              <span className="text-xs">{today}</span>
            </div>
            <div className="flex gap-4">
              <table className="border-collapse flex-1 w-full">
                <tbody>
                  <tr>
                    <td className={`${th} w-20`}>ふりがな</td>
                    <td className={`${td}`} colSpan={2}>
                      {data.kana}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${th}`}>氏名</td>
                    <td
                      className={`${td} text-xl py-4 font-semibold`}
                      colSpan={2}
                    >
                      {data.name || "(お名前)"}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${th}`}>生年月日</td>
                    <td className={td}>
                      {data.birthY}年{data.birthM}月{data.birthD}日生(満{age}
                      歳)
                    </td>
                    <td className={`${td} w-20 text-center`}>
                      {data.gender && `性別 ${data.gender}`}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="w-[30mm] h-[40mm] border border-gray-500 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 overflow-hidden">
                {data.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center leading-relaxed">
                    写真
                    <br />
                    (30×40mm)
                  </span>
                )}
              </div>
            </div>
            <table className="border-collapse w-full mt-3">
              <tbody>
                <tr>
                  <td className={`${th} w-20`}>現住所</td>
                  <td className={td}>
                    {data.postal && `〒${data.postal} `}
                    {data.address || ""}
                  </td>
                </tr>
                <tr>
                  <td className={th}>電話</td>
                  <td className={td}>{data.phone}</td>
                </tr>
                <tr>
                  <td className={th}>メール</td>
                  <td className={td}>{data.email}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-5 mb-1">
              <span className="text-sm font-semibold">学歴・職歴</span>
              <EditLink onEdit={onEdit} steps={[3, 4]} />
            </div>
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className={`${th} w-14 text-center`}>年</th>
                  <th className={`${th} w-10 text-center`}>月</th>
                  <th className={`${th} text-center`}>学歴・職歴</th>
                </tr>
              </thead>
              <tbody>{historyRows}</tbody>
            </table>
          </div>

          {/* 2枚目 */}
          <div className="resume-sheet border border-gray-300 rounded shadow-md mx-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">免許・資格</span>
              <EditLink onEdit={onEdit} steps={[5]} />
            </div>
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className={`${th} w-14 text-center`}>年</th>
                  <th className={`${th} w-10 text-center`}>月</th>
                  <th className={`${th} text-center`}>免許・資格</th>
                </tr>
              </thead>
              <tbody>
                {data.licenses.length === 0 ? (
                  <tr>
                    <td className={yCell}></td>
                    <td className={mCell}></td>
                    <td className={td}>特になし</td>
                  </tr>
                ) : (
                  data.licenses.map((l) => (
                    <tr key={l.id}>
                      <td className={yCell}>{l.y}</td>
                      <td className={mCell}>{l.m}</td>
                      <td className={td}>{l.name} 取得</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-6 mb-1">
              <span className="text-sm font-semibold">
                志望の動機、特技、アピールポイントなど
              </span>
              <EditLink onEdit={onEdit} steps={[6]} />
            </div>
            <div className="border border-gray-700 p-3 min-h-[60mm] text-sm leading-[1.9] whitespace-pre-wrap">
              {data.motivation}
            </div>

            <div className="flex items-center justify-between mt-6 mb-1">
              <span className="text-sm font-semibold">
                本人希望記入欄
              </span>
              <EditLink onEdit={onEdit} steps={[7]} />
            </div>
            <div className="border border-gray-700 p-3 min-h-[35mm] text-sm leading-[1.9] whitespace-pre-wrap">
              {data.wishes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditLink({
  onEdit,
  steps,
}: {
  onEdit: (step: number) => void;
  steps: number[];
}) {
  return (
    <button
      type="button"
      onClick={() => onEdit(steps[0])}
      className="no-print text-xs text-indigo-600 hover:text-indigo-800 font-medium"
    >
      ✎ 編集
    </button>
  );
}
