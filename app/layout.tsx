import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "HEALTH OS",
  description: "Gestão pessoal de saúde"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className="app"><Sidebar /><main className="main"><div className="container">{children}</div></main></div>;
}
