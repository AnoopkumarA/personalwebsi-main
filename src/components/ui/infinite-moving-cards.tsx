"use client";

import { cn } from "../../lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollWidth = container.scrollWidth;
      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;

      if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-[95%] mx-auto overflow-x-auto overflow-y-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-track-transparent scrollbar-thumb-red-600 scroll-smooth",
        className
      )}
      onMouseDown={(e) => {
        if (containerRef.current) {
          const slider = containerRef.current;
          let isDown = true;
          let startX = e.pageX - slider.offsetLeft;
          let scrollLeft = slider.scrollLeft;

          const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
          };

          const handleMouseUp = () => {
            isDown = false;
            slider.removeEventListener('mousemove', handleMouseMove);
            slider.removeEventListener('mouseup', handleMouseUp);
            slider.removeEventListener('mouseleave', handleMouseUp);
          };

          slider.addEventListener('mousemove', handleMouseMove);
          slider.addEventListener('mouseup', handleMouseUp);
          slider.addEventListener('mouseleave', handleMouseUp);
        }
      }}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(220, 38, 38) transparent',
        maxWidth: 'calc(100% - 2rem)',
        margin: '0 auto'
      }}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap select-none px-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[310px] min-h-[200px] max-w-full relative rounded-2xl border border-b-0 shrink-0 border-slate-700 px-6 py-6 md:w-[400px] md:min-h-[220px] hover:border-red-500/50 transition-colors duration-300"
            style={{
              background: "linear-gradient(180deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))"
            }}
            key={item.name}
          >
            <blockquote className="h-full flex flex-col justify-between">
              <div className="space-y-4">
                <a href="" target="blank" > <h3 className="text-base md:text-lg font-semibold leading-snug text-white">
                  {item.quote}
                </h3></a>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 font-normal">
                    {item.name}
                  </p>
                  <div className="space-y-1">
                    {item.title.split('\n').map((line, index) => (
                      <p 
                        key={index} 
                        className={cn(
                          "text-xs",
                          index === 0 ? "text-red-400" : "text-gray-500"
                        )}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}; 