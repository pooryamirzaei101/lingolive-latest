import type { TranscriptSegment } from "@/lib/video";
export const videoExample={
  id:"sample-cafe-video",category:"daily-situations",title:"At the Café · Video Sample",level:"Beginner",description:"A short original silent video for checking the player, subtitles, transcript seeking, and sentence loop. Spoken audio is not included in this sample.",
  src:"/samples/cafe-demo.mp4",
  lines:[
    {start:0,end:4,english:"Welcome to the café.",translations:{fa:"به کافه خوش آمدید."}},
    {start:4,end:8,english:"Could I have a tea, please?",translations:{fa:"ممکن است یک چای داشته باشم، لطفاً؟"}},
    {start:8,end:12,english:"Thank you very much!",translations:{fa:"خیلی ممنون!"}},
  ] satisfies TranscriptSegment[],
};
export const newsExample={
  id:"sample-news-video",category:"news",title:"A New Park Opens · News Sample",level:"Beginner",description:"A fictional, original silent news clip for checking news folders and subtitle playback. It is not a report of a real event.",
  src:"/samples/news-demo.mp4",
  lines:[
    {start:0,end:4,english:"A new park opens.",translations:{fa:"یک پارک جدید افتتاح می‌شود."}},
    {start:4,end:8,english:"Families visit on Saturday.",translations:{fa:"خانواده‌ها روز شنبه بازدید می‌کنند."}},
    {start:8,end:12,english:"Children plant small trees.",translations:{fa:"کودکان درختان کوچک می‌کارند."}},
  ] satisfies TranscriptSegment[],
};
export const speakingVideoExample={
  id:"sample-speaking-cafe",category:"speaking-everyday",title:"At the Café · Speak Along",level:"Beginner",description:"Watch this short original video, read the lines aloud from the teleprompter, and save a private voice recording to practice later. The video is silent so you can focus on your voice.",
  src:"/samples/cafe-demo.mp4",
  lines:[
    {start:0,end:4,english:"Welcome to the café.",translations:{fa:"به کافه خوش آمدید."}},
    {start:4,end:8,english:"Could I have a tea, please?",translations:{fa:"ممکن است یک چای داشته باشم، لطفاً؟"}},
    {start:8,end:12,english:"Thank you very much!",translations:{fa:"خیلی ممنون!"}},
  ] satisfies TranscriptSegment[],
};
