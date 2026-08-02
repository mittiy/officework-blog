export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="在宅でオフィスワークをするイラスト"
      className="w-full h-auto"
    >
      {/* 背景の窓 */}
      <rect x="40" y="30" width="120" height="90" rx="8" fill="#ffffff" opacity="0.25" />
      <line x1="100" y1="30" x2="100" y2="120" stroke="#ffffff" strokeWidth="4" opacity="0.3" />
      <line x1="40" y1="75" x2="160" y2="75" stroke="#ffffff" strokeWidth="4" opacity="0.3" />

      {/* 観葉植物 */}
      <rect x="400" y="200" width="30" height="35" rx="4" fill="#ffffff" opacity="0.35" />
      <path
        d="M415 200 C405 175 395 170 388 160 M415 200 C415 170 415 160 415 150 M415 200 C425 175 435 170 442 160"
        stroke="#a7f3d0"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* デスク */}
      <rect x="90" y="205" width="300" height="12" rx="6" fill="#ffffff" opacity="0.9" />
      <rect x="110" y="217" width="12" height="60" rx="4" fill="#ffffff" opacity="0.6" />
      <rect x="358" y="217" width="12" height="60" rx="4" fill="#ffffff" opacity="0.6" />

      {/* ノートPC */}
      <rect x="200" y="150" width="110" height="58" rx="6" fill="#312e81" />
      <rect x="206" y="156" width="98" height="46" rx="3" fill="#c7d2fe" />
      <rect x="190" y="205" width="130" height="8" rx="4" fill="#1e1b4b" />
      {/* 画面のグラフ */}
      <polyline
        points="215,192 235,180 252,186 270,168 292,174"
        fill="none"
        stroke="#4f46e5"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* マグカップ */}
      <rect x="340" y="182" width="26" height="24" rx="4" fill="#ffffff" />
      <path d="M366 188 h8 a6 6 0 0 1 0 12 h-8" fill="none" stroke="#ffffff" strokeWidth="4" />
      <path
        d="M348 172 c2 -5 -2 -7 0 -12 M356 172 c2 -5 -2 -7 0 -12"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* ヘッドセット */}
      <path
        d="M130 175 a28 28 0 0 1 56 0"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="122" y="172" width="16" height="26" rx="6" fill="#ffffff" />
      <rect x="178" y="172" width="16" height="26" rx="6" fill="#ffffff" />
      <path
        d="M186 198 q4 14 -14 16"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="168" cy="216" r="5" fill="#ffffff" />

      {/* 吹き出し(チャット) */}
      <rect x="300" y="60" width="120" height="44" rx="12" fill="#ffffff" />
      <path d="M320 104 l-6 14 18 -14 z" fill="#ffffff" />
      <rect x="312" y="74" width="70" height="7" rx="3.5" fill="#818cf8" />
      <rect x="312" y="87" width="46" height="7" rx="3.5" fill="#c7d2fe" />

      <rect x="220" y="40" width="100" height="40" rx="12" fill="#ffffff" opacity="0.85" />
      <path d="M300 80 l8 12 -20 -12 z" fill="#ffffff" opacity="0.85" />
      <circle cx="240" cy="60" r="6" fill="#f472b6" />
      <rect x="254" y="56" width="52" height="8" rx="4" fill="#a5b4fc" />
    </svg>
  );
}
