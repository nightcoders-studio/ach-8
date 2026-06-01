"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PhotoCarousel({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  if (photos.length === 1) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={photos[0]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {photos.map((src, i) => (
          <CarouselItem key={i}>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={src}
                alt={`${alt} — foto ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority={i === 0}
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                {i + 1}/{photos.length}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3" />
      <CarouselNext className="right-3" />
    </Carousel>
  );
}
