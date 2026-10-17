import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLearningSection } from "@/lib/section-folders";
import { SectionFolderCatalog } from "@/components/section-folder-catalog";
const sections:Record<string,{title:string;description:string}>={
  "daily-lessons":{title:"Daily Lessons",description:"Short daily reading and listening lessons will live here."},
  "youtube-videos":{title:"YouTube Videos",description:"Reviewed YouTube learning lessons will appear here."},
  "reading-room":{title:"Reading Room",description:"Books, stories, and articles will be available here."},
  "speaking-practice":{title:"Speaking Practice",description:"Guided recording and speaking activities are planned for this section."},
  "quick-tips":{title:"Quick Tips",description:"Short, useful English-learning tips will appear here."},
  "word-bank":{title:"Word Bank",description:"Your saved vocabulary and reviews will appear here when accounts are connected."},
  "my-collection":{title:"My Collection",description:"Your saved sentences will appear here when accounts are connected."},
  achievements:{title:"Achievements",description:"Learning milestones and streaks will appear here."},
  "invite-friends":{title:"Invite Friends",description:"Invitations and referral rewards will be available after member accounts are ready."},
  settings:{title:"Settings",description:"Language, subtitles, playback, appearance, and privacy controls are planned here."},
};
export function generateStaticParams(){return Object.keys(sections).map(section=>({section}))}
export const dynamic="force-dynamic";
export default async function SectionPage({params}:{params:Promise<{section:string}>}){const {section}=await params,entry=sections[section];if(section==="youtube-videos")redirect("/flashcards");if(section==="achievements")redirect("/achievements");if(!entry)notFound();if(isLearningSection(section))return <SectionFolderCatalog slug={section}/>;return <section className="section shell planned-page"><span className="section-eyebrow">COMING IN A LATER STAGE</span><h1>{entry.title}</h1><p>{entry.description}</p><p>We are building and testing one learning area at a time. This section is not active yet.</p><Link className="button primary" href="/video-lessons">Explore Video Lessons</Link></section>}
