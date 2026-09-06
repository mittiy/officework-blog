import type { Metadata } from "next";
import ResumeBuilder from "@/components/ResumeBuilder";

export const metadata: Metadata = {
  title: "履歴書かんたん作成|質問に答えるだけで完成",
  description:
    "質問に答えていくだけで転職用の履歴書が完成する無料ツール。志望動機の文章も自動で下書き。登録不要・スマホ対応で、そのまま印刷・PDF保存できます。",
};

export default function ResumePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            📝 履歴書かんたん作成
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            質問に答えていくだけで履歴書が完成。志望動機の文章も自動で下書きします。無料・登録不要、入力内容はこの端末の外に送信されません。
          </p>
        </div>
      </section>
      <ResumeBuilder />
    </>
  );
}
