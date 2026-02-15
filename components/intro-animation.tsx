"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function IntroAnimation() {
  const [show, setShow] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check if user has already seen the intro
    const hasSeenIntro = localStorage.getItem("master3d_intro_seen")
    
    if (!hasSeenIntro) {
      setShow(true)
      
      // Start fade out after 2.5 seconds
      const fadeTimer = setTimeout(() => {
        setFadeOut(true)
      }, 2500)
      
      // Remove from DOM after fade completes
      const removeTimer = setTimeout(() => {
        setShow(false)
        localStorage.setItem("master3d_intro_seen", "true")
      }, 3500)
      
      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(removeTimer)
      }
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo */}
        <div className="animate-scale-in">
          <Image
            src="/images/master3d_logo.jpg"
            alt="Master 3D"
            width={300}
            height={300}
            className="rounded-2xl shadow-2xl"
            priority
          />
        </div>
        
        {/* Animated Text */}
        <div className="animate-slide-up text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Master <span className="text-primary">3D</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Swiss 3D Printing Excellence</p>
        </div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] h-16 w-16 animate-float-slow rounded-lg border-2 border-primary/20 bg-primary/5" />
          <div className="absolute right-[15%] top-[30%] h-20 w-20 animate-float-medium rotate-45 rounded-lg border-2 border-primary/20 bg-primary/5" />
          <div className="absolute bottom-[25%] left-[20%] h-12 w-12 animate-float-fast rounded-full border-2 border-primary/20 bg-primary/5" />
          <div className="absolute bottom-[20%] right-[25%] h-24 w-24 animate-float-slow rounded-lg border-2 border-primary/20 bg-primary/5" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-15px) rotate(50deg);
          }
        }
        
        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
