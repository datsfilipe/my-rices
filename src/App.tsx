import { ThemeProvider } from "@/components/theme/provider.tsx";
import { ThemeToggle } from "@/components/theme/toggle";
import { RiceGallery } from "@/components/gallery";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <header className="w-full flex items-center justify-center sticky top-0 z-10 border-b bg-[var(--card)]/80 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              <b className="text-[var(--primary-accenty)]">datsrice</b>
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container py-8">
          <section className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Rice Collection
            </h2>
            <p>
              A showcase of my unix customization screenshots. Click on any
              image to view in detail.
            </p>
          </section>
          <RiceGallery />
        </main>
        <footer className="w-full border-t py-6 flex items-center justify-center">
          <div className="container text-center text-sm text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} datsfilipe
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
