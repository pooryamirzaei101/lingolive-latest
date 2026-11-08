// Shared public metadata only. Secrets and network calls live in media-integrations.
export const translationProviders={google:'Google Cloud Translation',deepl:'DeepL',azure:'Azure Translator',openai:'OpenAI-compatible API',custom:'Custom translation API'} as const;
export type TranslationProvider=keyof typeof translationProviders;
export function isTranslationProvider(value:unknown):value is TranslationProvider{return typeof value==='string'&&Object.hasOwn(translationProviders,value)}
export type TranslationConfig={translationProvider:string;googleKey:string;deeplKey:string;deeplPlan:string;azureKey:string;azureRegion:string;translationConnection?:import('@/lib/provider-options').ProviderConnection};
export function translationConnected(c:TranslationConfig){return c.translationProvider==='google'?!!c.googleKey:c.translationProvider==='deepl'?!!c.deeplKey:c.translationProvider==='azure'?!!c.azureKey:['openai','custom'].includes(c.translationProvider)?!!c.translationConnection?.key&&!!c.translationConnection.endpoint:false}

export function deeplAccount(key:string){return key.trim().endsWith(':fx')?'free':'pro'}
export function deeplApiBase(key:string){return deeplAccount(key)==='free'?'https://api-free.deepl.com':'https://api.deepl.com'}
