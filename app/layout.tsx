import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"留白 · 个人作品集",description:"影像、设计、摄影、文字与数字实验。一份持续生长的个人作品档案。",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>;}