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
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";

type SelectedRice = {
  id: number;
  title: string;
  description: string;
  image: string;
  'mini-image': string;
  tags: string[];
  wm: string;
  date: string;
  dimensions: string;
} | null;

type ImgModalProps = {
  selectedRice: SelectedRice;
  setSelectedRice: Dispatch<React.SetStateAction<SelectedRice>>;
};

export function ImgModal({
  selectedRice,
  setSelectedRice,
}: ImgModalProps) {
  const [dialogImageLoaded, setDialogImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [handTool, setHandTool] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const scrollPosRef = useRef({ x: 0, y: 0 });

  const handleDialogImageLoad = useCallback(() => {
    setDialogImageLoaded(true);
  }, []);

  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const toggleHandTool = useCallback(() => {
    setHandTool(prev => !prev);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!handTool || zoomLevel <= 1) return;

    setIsDragging(true);

    startPosRef.current = {
      x: e.clientX,
      y: e.clientY
    };

    if (containerRef.current) {
      scrollPosRef.current = {
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop
      };
    }

    e.preventDefault();
  }, [handTool, zoomLevel]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    containerRef.current.scrollLeft = scrollPosRef.current.x - dx;
    containerRef.current.scrollTop = scrollPosRef.current.y - dy;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && zoomLevel > 1) {
        setHandTool(true);
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setHandTool(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [zoomLevel]);

  useEffect(() => {
    if (!selectedRice) {
      resetZoom();
      setHandTool(false);
    } else {
      setDialogImageLoaded(false);
    }
  }, [selectedRice, resetZoom]);

  return (
    <Dialog
      open={!!selectedRice}
      onOpenChange={(open) => !open && setSelectedRice(null)}
    >
      <DialogContent
        className="max-w-4xl max-h-screen overflow-hidden"
      >
        <DialogDescription className="sr-only">
          rice-details
        </DialogDescription>
        {selectedRice && (
          <div className="space-y-4" id="rice-details">
            <h2 className="text-2xl font-bold">{selectedRice.title}</h2>

            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <Button variant="default" size="icon" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="default" size="icon" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant={handTool ? "secondary" : "default"}
                  size="icon"
                  onClick={toggleHandTool}
                  disabled={zoomLevel <= 1}
                  title="Hand Tool"
                >
                  <Hand className="h-4 w-4" />
                </Button>
                <Button variant="default" size="icon" onClick={resetZoom}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <div
                ref={containerRef}
                className="overflow-auto"
                style={{
                  maxHeight: "70vh",
                  maxWidth: "100%",
                  cursor: handTool && zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default"
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {!dialogImageLoaded && (
                  <div className="relative flex items-center justify-center bg-muted">
                    <Skeleton
                      className="w-full text-8xl"
                      style={{
                        aspectRatio: selectedRice.dimensions ?
                          Number(selectedRice.dimensions.split('x')[0]) /
                          Number(selectedRice.dimensions.split('x')[1]) : 16 / 9
                      }}
                      text={selectedRice.dimensions}
                    />
                  </div>
                )}
                <img
                  ref={imageRef}
                  src={selectedRice.image}
                  alt={selectedRice.title}
                  className={`transition-transform duration-200 ${!dialogImageLoaded ? 'hidden' : 'block'}`}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "top left",
                    pointerEvents: handTool ? "none" : "auto"
                  }}
                  onLoad={handleDialogImageLoad}
                  draggable={false}
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
  );
}
