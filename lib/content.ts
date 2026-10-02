import { BookOpen, Headphones, Mic2, Languages, Sparkles, Volume2, MessageCircle } from "lucide-react";
export type Course = {slug:string;title:string;level:string;lessons:number;status:"Free"|"Premium";description:string;theme:string;symbol:string};
export type Lesson = {slug:string;title:string;category:string;level:string;minutes:number;status:"Free"|"Premium";description:string;course:string;transcript:{english:string;persian:string}[];vocabulary:{word:string;meaning:string}[]};
export const categories = [
  {name:"Grammar",description:"Make every sentence count",icon:BookOpen,tone:"blue"},
  {name:"Listening",description:"Understand real English",icon:Headphones,tone:"violet"},
  {name:"Speaking",description:"Find your voice",icon:Mic2,tone:"peach"},
  {name:"Vocabulary",description:"Words you can use",icon:Languages,tone:"mint"},
  {name:"Stories",description:"Learn through moments",icon:Sparkles,tone:"yellow"},
  {name:"Shadowing",description:"Listen, repeat, improve",icon:MessageCircle,tone:"rose"},
  {name:"Pronunciation",description:"Sound more natural",icon:Volume2,tone:"sky"},
];
export const courses:Course[] = [
  {slug:"everyday-english",title:"Everyday English Essentials",level:"Beginner · A1–A2",lessons:12,status:"Free",description:"Useful phrases for the moments that fill your day.",theme:"course-blue",symbol:"Hello!"},
  {slug:"grammar-in-action",title:"Grammar in Action",level:"Intermediate · B1",lessons:16,status:"Free",description:"Understand grammar through real conversations.",theme:"course-purple",symbol:"Aa"},
  {slug:"speak-with-confidence",title:"Speak with Confidence",level:"Advanced · B2–C1",lessons:10,status:"Premium",description:"Express your ideas clearly and naturally.",theme:"course-orange",symbol:"•••"},
];
export const lessons:Lesson[] = [
  {slug:"a-morning-routine",title:"A Morning Routine",category:"Stories",level:"Beginner",minutes:6,status:"Free",description:"Follow Sara through her morning and learn everyday verbs.",course:"Everyday English Essentials",transcript:[{english:"Sara wakes up at seven o’clock.",persian:"سارا ساعت هفت از خواب بیدار می‌شود."},{english:"She makes breakfast and gets ready for work.",persian:"او صبحانه آماده می‌کند و برای کار آماده می‌شود."}],vocabulary:[{word:"wake up",meaning:"از خواب بیدار شدن"},{word:"get ready",meaning:"آماده شدن"}]},
  {slug:"present-simple",title:"Present Simple: Everyday Habits",category:"Grammar",level:"Beginner",minutes:8,status:"Free",description:"Talk about routines, facts, and things you do often.",course:"Grammar in Action",transcript:[{english:"I drink tea every morning.",persian:"من هر صبح چای می‌نوشم."},{english:"She works at a small café.",persian:"او در یک کافه کوچک کار می‌کند."}],vocabulary:[{word:"habit",meaning:"عادت"},{word:"often",meaning:"اغلب"}]},
  {slug:"at-the-cafe",title:"At the Café",category:"Listening",level:"Beginner",minutes:7,status:"Free",description:"Listen to a simple conversation and order with ease.",course:"Everyday English Essentials",transcript:[{english:"Hi! Could I have a coffee, please?",persian:"سلام! می‌توانم یک قهوه داشته باشم، لطفاً؟"},{english:"Of course. Would you like anything else?",persian:"البته. چیز دیگری میل دارید؟"}],vocabulary:[{word:"could I have",meaning:"می‌توانم داشته باشم"},{word:"anything else",meaning:"چیز دیگری"}]},
  {slug:"shadow-a-conversation",title:"Shadow a Conversation",category:"Shadowing",level:"Intermediate",minutes:10,status:"Premium",description:"Repeat natural sentences and work on your rhythm.",course:"Speak with Confidence",transcript:[{english:"What are you working on this week?",persian:"این هفته روی چه چیزی کار می‌کنی؟"},{english:"I’m preparing for an important meeting.",persian:"دارم برای یک جلسه مهم آماده می‌شوم."}],vocabulary:[{word:"working on",meaning:"روی چیزی کار کردن"},{word:"preparing",meaning:"آماده شدن"}]},
];
