import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
export async function isAdmin(){const user=await getChatGPTUser();const address=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL;return !!user&&!!address&&user.email.toLowerCase()===address.toLowerCase()}
