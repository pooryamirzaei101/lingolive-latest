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
