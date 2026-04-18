'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface PageEntranceProps {
  children: React.ReactNode;
  className?: string;
}

export function PageEntrance({ children, className = '' }: PageEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.animate-entrance', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions || {};

          if (reduceMotion) {
            gsap.set('.scroll-reveal', { opacity: 1, y: 0 });
            return;
          }

          gsap.from('.scroll-reveal', {
            y: isDesktop ? 50 : 30,
            opacity: 0,
            duration: isDesktop ? 0.8 : 0.5,
            ease: 'power3.out',
            delay,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface CardHoverProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHover({ children, className = '' }: CardHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll('.hover-card') || [];

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;

        cardElement.addEventListener('mouseenter', () => {
          gsap.to(cardElement, {
            y: -5,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(cardElement, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });

      return () => {
        cards.forEach((card) => {
          const cardElement = card as HTMLElement;
          cardElement.removeEventListener('mouseenter', () => {});
          cardElement.removeEventListener('mouseleave', () => {});
        });
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className = '', speed = 0.5 }: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(
        {
          isDesktop: '(min-width: 1024px)',
        },
        (context) => {
          const { isDesktop } = context.conditions || {};

          if (!isDesktop) return;

          const section = containerRef.current;
          if (!section) return;

          gsap.to(section, {
            yPercent: -20 * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className = '' }: StaggerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions || {};

          if (reduceMotion) {
            gsap.set('.stagger-item', { opacity: 1, y: 0 });
            return;
          }

          gsap.from('.stagger-item', {
            y: isDesktop ? 40 : 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: {
              amount: isDesktop ? 0.4 : 0.2,
              from: 'start',
            },
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
