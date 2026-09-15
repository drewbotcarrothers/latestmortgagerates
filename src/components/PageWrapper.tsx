import StickyNavigation from "./StickyNavigation";

interface PageWrapperProps {
  children: React.ReactNode;
  currentPage?: "rates" | "guides" | "glossary" | "tools";
}

export default function PageWrapper({ children, currentPage }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <StickyNavigation currentPage={currentPage} />
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
}
