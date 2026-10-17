export const translationLanguages={
  fa:"Persian (فارسی)",ar:"Modern Standard Arabic (العربية الفصحى)",tr:"Turkish (Türkçe)",de:"German (Deutsch)",es:"Spanish (Español)",
  fr:"French (Français)",pt:"Portuguese (Português)",hi:"Hindi (हिन्दी)",id:"Indonesian (Bahasa Indonesia)",ur:"Urdu (اردو)",zh:"Chinese (中文)",
} as const;
export type TranslationLanguage=keyof typeof translationLanguages;
export function isTranslationLanguage(value:unknown):value is TranslationLanguage{return typeof value==="string"&&Object.hasOwn(translationLanguages,value)}
export function translationDirection(language:TranslationLanguage){return language==="fa"||language==="ar"||language==="ur"?"rtl":"ltr"}
