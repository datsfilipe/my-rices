import { ThemeProvider } from "@/components/theme/provider.tsx";
import { ThemeToggle } from "@/components/theme/toggle";
import { RiceGallery } from "@/components/gallery";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-primary">Unix</span>Rice
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container py-8">
          <section className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              My Rice Collection
            </h2>
            <p className="text-muted-foreground">
              A showcase of my Unix customization screenshots. Click on any
              image to view in detail.
            </p>
          </section>
          <RiceGallery />
        </main>
        <footer className="border-t py-6">
          <div className="container text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UnixRice Gallery
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
