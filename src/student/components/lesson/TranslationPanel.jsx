import { useState } from "react";

export default function TranslationPanel() {
  const [language, setLanguage] = useState("English");

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <h2 className="text-3xl font-bold">
          Lesson Translation
        </h2>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option>English</option>
          <option>Persian</option>
          <option>German</option>
          <option>Turkish</option>
          <option>Arabic</option>
          <option>Spanish</option>
          <option>French</option>
        </select>

      </div>

      <div className="bg-gray-50 rounded-lg p-6 leading-8">

        {language === "English" && (
          <>
            <p>
              The Present Simple Tense is used to describe habits,
              routines, facts and permanent situations.
            </p>

            <p className="mt-4">
              We use it every day when talking about our daily life.
            </p>
          </>
        )}

        {language === "Persian" && (
          <>
            <p>
              زمان حال ساده برای بیان عادت‌ها، برنامه‌های روزانه،
              حقیقت‌ها و وضعیت‌های دائمی استفاده می‌شود.
            </p>

            <p className="mt-4">
              ما هر روز هنگام صحبت درباره زندگی روزمره از آن استفاده می‌کنیم.
            </p>
          </>
        )}

        {language === "German" && (
          <>
            <p>
              Das Präsens wird verwendet, um Gewohnheiten,
              Routinen, Fakten und allgemeine Aussagen auszudrücken.
            </p>

            <p className="mt-4">
              Es gehört zu den wichtigsten Zeiten der englischen Sprache.
            </p>
          </>
        )}

        {language === "Turkish" && (
          <>
            <p>
              Simple Present Tense alışkanlıkları,
              günlük rutinleri ve genel doğruları anlatmak için kullanılır.
            </p>

            <p className="mt-4">
              İngilizce öğrenirken en önemli zamanlardan biridir.
            </p>
          </>
        )}

        {language === "Arabic" && (
          <>
            <p>
              يُستخدم المضارع البسيط للتعبير عن العادات
              والحقائق والأعمال اليومية.
            </p>

            <p className="mt-4">
              وهو من أهم الأزمنة في اللغة الإنجليزية.
            </p>
          </>
        )}

        {language === "Spanish" && (
          <>
            <p>
              El presente simple se utiliza para expresar hábitos,
              rutinas y hechos generales.
            </p>

            <p className="mt-4">
              Es uno de los tiempos verbales más importantes del inglés.
            </p>
          </>
        )}

        {language === "French" && (
          <>
            <p>
              Le présent simple est utilisé pour parler
              des habitudes, des routines et des faits généraux.
            </p>

            <p className="mt-4">
              C'est l'un des temps les plus importants en anglais.
            </p>
          </>
        )}

      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5">

        <h3 className="font-bold text-lg mb-2">
          Future AI Translation
        </h3>

        <p className="text-gray-700">
          In Phase 8, AI will automatically translate every lesson
          into multiple languages without needing to write translations manually.
        </p>

      </div>

    </div>
  );
}