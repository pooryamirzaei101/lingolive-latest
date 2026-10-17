/** Media formats accepted for podcast uploads. Actual playback depends on the visitor's browser codecs. */
export const audioTypes=["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4","audio/x-m4a","audio/aac","audio/flac","audio/x-flac","audio/3gpp","audio/amr"] as const;
export const videoTypes=["video/mp4","video/webm"] as const;
const extensionTypes:Record<string,string>={mp3:"audio/mpeg",wav:"audio/wav",ogg:"audio/ogg",oga:"audio/ogg",opus:"audio/ogg",webm:"audio/webm",m4a:"audio/mp4",aac:"audio/aac",flac:"audio/flac",amr:"audio/amr","3gp":"audio/3gpp",mp4:"video/mp4"};
export function podcastMime(file:{name:string;type:string}){const claimed=file.type.toLowerCase().split(';')[0].trim(),extension=file.name.toLowerCase().split('.').at(-1)||'';if((audioTypes as readonly string[]).includes(claimed)||(videoTypes as readonly string[]).includes(claimed))return claimed;return extensionTypes[extension]||''}
export function podcastKind(file:{name:string;type:string}){return podcastMime(file).startsWith('audio/')?'audio':'video'}

/** Normalize voice recorder containers for an audio-only lesson. */
export function audioUploadMime(file:{name:string;type:string}){
  const claimed=file.type.toLowerCase().split(";")[0].trim();
  const extension=file.name.toLowerCase().split(".").at(-1)||"";
  const byExtension=extensionTypes[extension];
  if(extension==="mp4"&&["video/mp4","audio/mp4",""].includes(claimed))return "audio/mp4";
  if(extension==="webm"&&["video/webm","audio/webm",""].includes(claimed))return "audio/webm";
  if(extension==="3gp"&&["video/3gpp","audio/3gpp",""].includes(claimed))return "audio/3gpp";
  if((audioTypes as readonly string[]).includes(claimed))return claimed;
  return byExtension?.startsWith("audio/")?byExtension:"";
}
