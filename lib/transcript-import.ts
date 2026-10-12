import type { TranscriptSegment } from "@/lib/video";
export function validateSegments(value:unknown):TranscriptSegment[]{
  if(!Array.isArray(value)||value.length>5000)throw new Error("Use up to 5,000 subtitle sentences.");
  let previous=-1;
  return value.map((s:any)=>{if(!s||!Number.isFinite(s.start)||!Number.isFinite(s.end)||s.start<0||s.end<=s.start||s.start<previous||typeof s.english!=="string"||!s.english.trim()||s.english.length>4000)throw new Error("Check every sentence's start, end, and English text. Keep sentences in time order.");previous=s.start;const translations:Record<string,string>={};for(const [lang,text] of Object.entries(s.translations||{})){if(typeof text!=="string"||text.length>4000)throw new Error("Translation text is too long.");translations[lang]=text.trim()}const words=Array.isArray(s.words)?s.words.map((w:any)=>{if(!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.start<s.start-.1||w.end>s.end+.1||w.end<=w.start||typeof w.text!=="string"||!w.text.trim()||w.text.length>100)throw new Error("Check the word timestamps and text.");return {start:w.start,end:w.end,text:w.text.trim()}}):undefined;return {start:s.start,end:s.end,english:s.english.trim(),translations,...(words?.length?{words}:{})}});
}
export function parseSrt(text:string):{start:number;end:number;text:string}[]{
  const blocks=text.replace(/^\uFEFF/,"").replace(/\r/g,"").trim().split(/\n\s*\n/);
  const time=(s:string)=>{const m=/^(\d+):(\d{2}):(\d{2})[,.](\d{3})$/.exec(s);if(!m||+m[2]>59||+m[3]>59)throw new Error("Invalid SRT timestamp.");return +m[1]*3600 + +m[2]*60 + +m[3] + +m[4]/1000};
  const rows=blocks.map(b=>{const lines=b.split("\n");if(/^\d+$/.test(lines[0]))lines.shift();const m=/^(\S+)\s*-->\s*(\S+)/.exec(lines.shift()||"");if(!m)throw new Error("Use an SRT file with numbered timestamped subtitle blocks.");const start=time(m[1]),end=time(m[2]),text=lines.join(" ").trim();if(end<=start||!text)throw new Error("Each SRT block needs valid times and text.");return {start,end,text}});
  if(rows.length>5000)throw new Error("SRT file has too many subtitles.");return rows;
}
export function parseVtt(text:string):{start:number;end:number;text:string}[]{
 const blocks=text.replace(/^\uFEFF/,'').replace(/\r/g,'').trim().split(/\n\s*\n/).filter(b=>!/^WEBVTT|^NOTE/.test(b.trim()));
 const time=(value:string)=>{const m=/^(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})$/.exec(value);if(!m||+m[2]>59||+m[3]>59)throw Error('Invalid VTT timestamp.');return Number(m[1]||0)*3600+Number(m[2])*60+Number(m[3])+Number(m[4])/1000};
 const rows=blocks.map(block=>{const lines=block.split('\n');if(!lines[0].includes('-->'))lines.shift();const match=/^(\S+)\s*-->\s*(\S+)/.exec(lines.shift()||'');if(!match)throw Error('Use timestamped WebVTT cues.');const start=time(match[1]),end=time(match[2]),content=lines.join(' ').replace(/<[^>]+>/g,'').trim();if(end<=start||!content)throw Error('Each VTT cue needs valid time and text.');return {start,end,text:content}});
 if(!rows.length||rows.length>5000)throw Error('Use a VTT file with 1 to 5,000 cues.');return rows;
}
