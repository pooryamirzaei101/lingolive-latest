import {isAdmin} from "@/lib/admin";
import {listFlashcards} from "@/lib/flashcards";
import {FlashcardCreate,FlashcardEditor} from "@/components/flashcard-admin";
export const dynamic="force-dynamic";
export default async function FlashcardsAdmin(){
 if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>Administrator access required.</p></section>;
 try{const cards=await listFlashcards(true);return <section className="section shell admin-page"><a className="folder-back" href="/administration">← Administration</a><span className="section-eyebrow">ADMINISTRATION · FLASHCARDS</span><h1>Flashcards studio</h1><p>Write or paste a short word or phrasal verb. Add an example sentence, an explanation, or both, then upload its voice recording and publish.</p><div className="detail-grid"><div className="detail-panel"><h2>Your flashcards</h2>{cards.length?cards.map(card=><FlashcardEditor key={card.id} card={card}/>):<p>No flashcards yet. Create your first card here.</p>}</div><aside className="detail-panel" id="add-content"><h2>Add a flashcard</h2><FlashcardCreate/></aside></div></section>}catch{return <section className="section shell"><h1>Flashcards studio</h1><p className="notice">The flashcard database is temporarily unavailable. Please try again later.</p></section>}
}
