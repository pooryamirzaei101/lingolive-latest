export type SpeakingExample={id:string;category:string;question:string;cue:string;answer:string;translation:string;audioKey?:string|null;status:"published"|"draft"};
export function isSpeakingFolder(id:string,categories:{id:string;parentId:string|null}[]){
  let current=categories.find(category=>category.id===id);
  for(let i=0;current&&i<categories.length;i++){
    if(current.id==="ielts-speaking")return true;
    current=categories.find(category=>category.id===current?.parentId);
  }
  return false;
}

export const speakingSamples:SpeakingExample[]=[
  {id:"sample-introduce-yourself",category:"ielts-speaking-introduction",question:"Can you tell me a little about yourself?",cue:"Give a short answer about where you live and what you enjoy.",answer:"My name is Lina. I live in a small city, and I enjoy reading in my free time.",translation:"اسم من لینا است. در یک شهر کوچک زندگی می‌کنم و در وقت آزاد از مطالعه لذت می‌برم.",status:"published"},
  {id:"sample-study",category:"ielts-speaking-study",question:"What do you enjoy most about your studies?",cue:"Mention one subject and explain why you like it.",answer:"I enjoy learning languages because I can talk with people from different places. I practice a little every day.",translation:"از یادگیری زبان‌ها لذت می‌برم، چون می‌توانم با مردم جاهای مختلف صحبت کنم. هر روز کمی تمرین می‌کنم.",status:"published"},
  {id:"sample-describe-a-friend",category:"ielts-speaking-people",question:"Describe someone you know well.",cue:"You should say who this person is, how you met, what they are like, and why they are important to you.",answer:"I would like to talk about my friend Sara. We met at school five years ago. She is kind and patient, and we often study together. I appreciate her because she always listens when I need help.",translation:"می‌خواهم دربارهٔ دوستم سارا صحبت کنم. پنج سال پیش در مدرسه آشنا شدیم. او مهربان و صبور است و ما اغلب با هم درس می‌خوانیم. برایش ارزش قائلم، چون همیشه وقتی به کمک نیاز دارم به حرف‌هایم گوش می‌دهد.",status:"published"},
];
