import Link from 'next/link';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {achievementsData} from '@/lib/achievements-data';
import {AchievementsDashboard} from '@/components/achievements-dashboard';
export const dynamic='force-dynamic';
export default async function Achievements(){const user=await getChatGPTUser();if(!user)return <section className="section shell"><span className="section-eyebrow">YOUR LEARNING</span><h1>Achievements & progress</h1><p>Sign in to save learning time and lesson progress to your account.</p><Link className="button primary" href="/login?returnTo=%2Fachievements">Sign in</Link></section>;try{const data=await achievementsData(user.userId);return <AchievementsDashboard data={data}/>}catch{return <section className="section shell"><h1>Achievements & progress</h1><p>Your progress is temporarily unavailable. Please try again.</p></section>}}
