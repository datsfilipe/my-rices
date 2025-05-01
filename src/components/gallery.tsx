import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Terminal,
  Monitor,
  Palette,
  Calendar,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import riceData from "@/lib/rices.json";
import { DialogDescription } from "@radix-ui/react-dialog";

export function RiceGallery() {
  const [selectedRice, setSelectedRice] = useState<(typeof riceData)[0] | null>(
    null,
  );
  // Initialize all images as loading
  const [isLoading, setIsLoading] = useState(() =>
    Object.fromEntries(riceData.map(rice => [rice.id, true]))
  );
  // Track when dialog image is loaded
  const [dialogImageLoaded, setDialogImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef(null);

  const handleImageLoad = (id: number) => {
    setIsLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleDialogImageLoad = () => {
    setDialogImageLoaded(true);
  };

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
  }, []);

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  useEffect(() => {
    if (!selectedRice) {
      resetZoom();
    } else {
      // Reset dialog image loading state when changing images
      setDialogImageLoaded(false);
    }
  }, [selectedRice, resetZoom]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {riceData.map((rice) => (
          <div
            key={rice.id}
            className="group relative overflow-hidden rounded-lg border bg-[var(--card)] transition-all hover:shadow-lg"
            onClick={() => setSelectedRice(rice)}
            onKeyDown={(e) => e.key === "Enter" && setSelectedRice(rice)}
            role="button"
            tabIndex={0}
          >
            <div className="aspect-video relative overflow-hidden">
              {/* Skeleton placeholder shown while image is loading */}
              {isLoading[rice.id] && (
                <Skeleton className="absolute inset-0 z-10 h-full w-full" text={rice.dimensions} />
              )}
              <img
                src={rice.image}
                alt={rice.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onLoad={() => handleImageLoad(rice.id)}
                style={{ display: isLoading[rice.id] ? 'none' : 'block' }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{rice.title}</h3>
              <p className="text-sm text-muted-foreground">
                {rice.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {rice.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedRice}
        onOpenChange={(open) => !open && setSelectedRice(null)}
      >
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] overflow-auto sm:max-w-[90vw] md:max-w-[85vw]"
        >
          <DialogDescription className="sr-only">
            rice-details
          </DialogDescription>
          {selectedRice && (
            <div className="space-y-4" id="rice-details">
              <h2 className="text-2xl font-bold">{selectedRice.title}</h2>

              <div className="relative overflow-hidden rounded-lg">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  <Button variant="secondary" size="icon" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={resetZoom}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  className="overflow-auto"
                  style={{
                    maxHeight: "70vh",
                    maxWidth: "100%",
                  }}
                >
                  {/* Skeleton placeholder for dialog image */}
                  {!dialogImageLoaded && (
                    <Skeleton
                      className="text-8xl max-h-full"
                      style={{
                        aspectRatio: Number(selectedRice.dimensions.split('x')[0]) / Number(selectedRice.dimensions.split('x')[1])
                      }}
                      text={selectedRice.dimensions}
                    />
                  )}
                  <img
                    ref={imageRef}
                    src={selectedRice.image}
                    alt={selectedRice.title}
                    className="transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "top left",
                      display: dialogImageLoaded ? 'block' : 'none'
                    }}
                    onLoad={handleDialogImageLoad}
                  />
                </div>
              </div>

              <p className="text-muted-foreground">
                {selectedRice.description}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    WM: {selectedRice.wm}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {selectedRice.dimensions}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {selectedRice.tags.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {selectedRice.date}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
