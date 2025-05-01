import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImgModal } from "./imgModal";
import { cn } from "@/lib/utils";

import riceData from "@/lib/rices.json";

export function RiceGallery() {
  const [selectedRice, setSelectedRice] = useState<typeof riceData[0] | null>(null);
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const initialLoadingState: Record<number, boolean> = {};
    riceData.forEach(rice => {
      initialLoadingState[rice.id] = true;
    });
    setLoadingImages(initialLoadingState);
  }, []);

  const handleImageLoad = useCallback((id: number) => {
    setLoadingImages(prev => ({
      ...prev,
      [id]: false
    }));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {riceData.map((rice) => (
          <div
            key={rice.id}
            className={cn(
              "cursor-pointer group relative overflow-hidden rounded-lg",
              "border bg-[var(--card)] transition-all hover:shadow-lg",
            )}
            onClick={() => setSelectedRice(rice)}
            onKeyDown={(e) => e.key === "Enter" && setSelectedRice(rice)}
            role="button"
            tabIndex={0}
          >
            <div className="aspect-video relative overflow-hidden">
              {/* Skeleton loading state */}
              {loadingImages[rice.id] && (
                <Skeleton
                  className="absolute inset-0 z-10 h-full w-full"
                  text={rice.dimensions}
                />
              )}
              <img
                src={rice['mini-image']}
                alt={rice.title}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
                  `${loadingImages[rice.id] ? 'opacity-0' : 'opacity-100'}`
                )}
                loading="lazy"
                onLoad={() => handleImageLoad(rice.id)}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{rice.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {rice.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {rice.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[var(--primary)] px-2 py-1 text-xs text-[var(--foreground)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImgModal
        selectedRice={selectedRice}
        setSelectedRice={setSelectedRice}
      />
    </>
  );
}
