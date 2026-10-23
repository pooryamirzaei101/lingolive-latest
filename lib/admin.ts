import { getChatGPTUser } from "@/app/chatgpt-auth";
export async function isAdmin(){const user=await getChatGPTUser();const address=process.env.ADMIN_EMAIL?.trim().toLowerCase();return !!user&&!!address&&user.email.trim().toLowerCase()===address}
