export type ThumbnailSource='custom'|'generated'|'default';
export type ThumbnailSettings={fit:'contain'|'cover';x:number;y:number;zoom:number};
export const defaultThumbnailSettings:ThumbnailSettings={fit:'contain',x:50,y:50,zoom:1};
export function parseThumbnailSettings(value:string|null|undefined):ThumbnailSettings{try{const data=JSON.parse(value||'');if((data.fit==='contain'||data.fit==='cover')&&[data.x,data.y,data.zoom].every(Number.isFinite)&&data.x>=0&&data.x<=100&&data.y>=0&&data.y<=100&&data.zoom>=1&&data.zoom<=3)return data}catch{}return defaultThumbnailSettings}
export function thumbnailRatio(format:string){return format==='vertical'?'9 / 16':format==='square'?'1 / 1':/^\d{1,3}:\d{1,3}$/.test(format)?format.replace(':',' / '):'16 / 9'}
export function validVideoFormat(format:string){if(['landscape','vertical','square'].includes(format))return true;const match=/^(\d{1,3}):(\d{1,3})$/.exec(format);return !!match&&Number(match[1])>0&&Number(match[2])>0}
