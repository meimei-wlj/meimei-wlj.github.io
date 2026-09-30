import {env} from "cloudflare:workers";
import {getChatGPTUser} from "../app/chatgpt-auth";
export function db(){if(!env.DB)throw new Error("Storage unavailable");return env.DB;}
export function bucket(){if(!env.BUCKET)throw new Error("Storage unavailable");return env.BUCKET;}
export async function isAdmin(){const u=await getChatGPTUser();const email=(env as unknown as Record<string,string>).ADMIN_EMAIL;return !!u&&!!email&&u.email.toLowerCase()===email.toLowerCase();}
export async function guard(req:Request){if(!await isAdmin())return Response.json({error:"请使用管理员账号登录。"},{status:403});if(req.headers.get("origin")!==new URL(req.url).origin)return Response.json({error:"请求来源无效。"},{status:403});return null;}
export function failure(e:unknown){console.error(e);return Response.json({error:"暂时无法保存或读取，请稍后重试。你的输入仍保留在页面中。"},{status:503});}
