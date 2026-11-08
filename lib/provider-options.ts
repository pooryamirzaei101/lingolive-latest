export type ProviderConnection = { endpoint: string; model: string; key: string; authHeader: 'Authorization' | 'x-api-key' | 'api-key' };
export type ProviderOptions = { transcriptionProvider: 'assembly' | 'openai' | 'custom'; transcription: ProviderConnection; translation: ProviderConnection };
export const emptyConnection: ProviderConnection = { endpoint: '', model: '', key: '', authHeader: 'Authorization' };
export function providerOptions(raw?: string): ProviderOptions {
  const value = JSON.parse(raw || '{}');
  return { transcriptionProvider: value.transcriptionProvider || 'assembly',
    transcription: { ...emptyConnection, ...value.transcription },
    translation: { ...emptyConnection, ...value.translation } };
}
