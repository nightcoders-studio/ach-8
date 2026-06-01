import { WargaNavbar } from "@/components/layout/warga-navbar";
import { WargaFooter } from "@/components/layout/warga-footer";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

export default function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <WargaNavbar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <WargaFooter />
      <BottomTabBar />
    </div>
  );
}
