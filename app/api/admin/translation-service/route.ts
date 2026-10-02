import { isAdmin } from "@/lib/admin";
import { translationServiceConnected, translateEnglish } from "@/lib/translation-service";
export async function GET(){if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});return Response.json({connected:translationServiceConnected()})}
export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  if(!translationServiceConnected())return Response.json({connected:false,error:"No translation service is connected."},{status:400});
  const result=await translateEnglish("hello","es");
  return Response.json({connected:result.source==="provider",testPassed:result.source==="provider"});
}
