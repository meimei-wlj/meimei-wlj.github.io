import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"mabel portfolio",description:"Mabel 的文案、摄影与设计作品集。",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>;}
