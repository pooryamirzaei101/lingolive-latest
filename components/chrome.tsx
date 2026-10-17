import { BookOpen, Menu, House, Clapperboard, CalendarDays, Layers3, Newspaper, LibraryBig, Mic2, Lightbulb, NotebookTabs, Headphones, GraduationCap, Bookmark, Trophy, Crown, UserRoundPlus, LifeBuoy, Settings, Shield, LayoutDashboard, Users, SquarePlay } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { getChatGPTUser } from "@/app/chatgpt-auth";

const navigation=[
  {label:"Home",href:"/",icon:House},
  {label:"Video Lessons",href:"/video-lessons",icon:Clapperboard},
  {label:"News",href:"/news",icon:Newspaper},
  {label:"Daily Lessons",href:"/daily-lessons",icon:CalendarDays},
  {label:"YouTube Lessons",href:"/youtube-videos",icon:SquarePlay},
  {label:"Flashcards",href:"/flashcards",icon:Layers3},
  {label:"Podcasts",href:"/podcasts",icon:Headphones},
  {label:"IELTS Listening & Reading",href:"/ielts-listening-reading",icon:Headphones},
  {label:"IELTS Video Speaking",href:"/ielts-video-speaking",icon:GraduationCap},
  {label:"Reading Room",href:"/reading-room",icon:LibraryBig},
  {label:"Speaking Practice",href:"/speaking-practice",icon:Mic2},
  {label:"Quick Tips",href:"/quick-tips",icon:Lightbulb},
  {label:"Word Bank",href:"/word-bank",icon:NotebookTabs},
  {label:"My Collection",href:"/my-collection",icon:Bookmark},
  {label:"Achievements",href:"/achievements",icon:Trophy},
  {label:"Membership",href:"/premium",icon:Crown},
  {label:"Invite Friends",href:"/invite-friends",icon:UserRoundPlus},
  {label:"Contact Admin",href:"/support",icon:LifeBuoy},
  {label:"Settings",href:"/settings",icon:Settings},
];
function Brand(){return <a href="/" className="brand"><span className="brand-icon"><BookOpen size={21}/></span> Lingo<span>Live</span></a>}
function NavLinks({admin}:{admin:boolean}){return <><span className="side-group">LEARN & PRACTICE</span>{navigation.map(({label,href,icon:Icon})=><a className="side-link" href={href} key={href}><Icon size={18}/>{label}</a>)}<span className="side-group">YOUR SPACE</span><a className="side-link" href="/dashboard"><LayoutDashboard size={18}/> Dashboard</a>{admin&&<><a className="side-link" href="/administration"><Shield size={18}/> Administration</a><a className="side-link" href="/administration/users"><Users size={18}/> Users</a><a className="side-link" href="/administration/support"><LifeBuoy size={18}/> Support inbox</a></>}</>}
export async function Header(){const [admin,user]=await Promise.all([isAdmin(),getChatGPTUser()]),accountHref=user?'/account':'/login';return <><aside className="site-sidebar"><div className="side-brand"><Brand/></div><nav aria-label="Main navigation" className="side-scroll"><NavLinks admin={admin}/></nav><div className="side-bottom"><a href={accountHref}>{user?"Account":"Sign in / Register"}</a></div></aside><header className="site-header app-topbar"><div className="shell nav-row"><details className="mobile-nav"><summary aria-label="Open menu"><Menu size={24}/></summary><nav aria-label="Mobile navigation"><NavLinks admin={admin}/><a className="side-link" href={accountHref}>{user?"Account":"Sign in / Register"}</a></nav></details><div className="mobile-brand"><Brand/></div><span className="topbar-note">Your learning space</span><a className="button secondary topbar-action" href={accountHref}>{user?"My account":"Sign in / Register"}</a></div></header></>}
export function Footer(){return <footer className="site-footer"><div className="shell footer-bottom"><span>© {new Date().getFullYear()} LingoLive</span><span>Learn at your own pace.</span></div></footer>}
