"use client";

import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Maximize2,
  Image as ImageIcon
} from "lucide-react";
import { useState, useEffect } from "react";

interface Slide {
  id: number;
  type: "intro" | "content" | "outro";
  heading: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface SlidesGeneratorProps {
  title: string;
  slides?: Omit<Slide, "id">[];
  theme?: "light" | "dark" | "blue" | "purple";
}

export default function SlidesGenerator({ 
  title, 
  slides, 
  theme = "blue" 
}: SlidesGeneratorProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        prev >= (slides?.length || 0) - 1 ? 0 : prev + 1
      );
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, slides?.length]);

  const nextSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide(prev => 
      prev >= slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide(prev => 
      prev <= 0 ? slides.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide(index);
  };

  const resetPresentation = () => {
    setCurrentSlide(0);
    setIsPlaying(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          container: "bg-gray-900 text-white",
          slide: "bg-gray-800 border-gray-700",
          accent: "text-gray-300",
          button: "bg-gray-700 hover:bg-gray-600 text-white"
        };
      case "purple":
        return {
          container: "bg-purple-50 text-gray-900",
          slide: "bg-white border-purple-200",
          accent: "text-purple-600",
          button: "bg-purple-600 hover:bg-purple-700 text-white"
        };
      case "light":
        return {
          container: "bg-gray-50 text-gray-900",
          slide: "bg-white border-gray-200",
          accent: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700 text-white"
        };
      default: // blue
        return {
          container: "bg-blue-50 text-gray-900",
          slide: "bg-white border-blue-200",
          accent: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 text-white"
        };
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, prevSlide, nextSlide]);

  const themeClasses = getThemeClasses();

  // Handle case when slides is undefined or empty
  if (!slides || slides.length === 0) {
    return (
      <div className={`max-w-4xl mx-auto ${themeClasses.container} rounded-xl shadow-xl p-8`}>
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600">Loading presentation slides...</p>
        </div>
      </div>
    );
  }

  const slidesWithIds: Slide[] = slides.map((slide, index) => ({
    ...slide,
    id: index
  }));

  const currentSlideData = slidesWithIds[currentSlide];
  
  // Safety check for currentSlideData
  if (!currentSlideData) {
    return (
      <div className={`max-w-4xl mx-auto ${themeClasses.container} rounded-xl shadow-xl p-8`}>
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600">Error: Slide data not found. Please try again.</p>
        </div>
      </div>
    );
  }

  const getSlideTypeStyle = (type: string) => {
    if (!type) return "text-left py-8";
    
    switch (type) {
      case "intro":
        return "text-center py-12";
      case "outro":
        return "text-center py-8";
      default:
        return "text-left py-8";
    }
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 p-4" 
    : "max-w-4xl mx-auto";

  return (
    <div className={`${containerClasses} ${themeClasses.container} rounded-xl shadow-xl`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg ${themeClasses.button} transition-colors`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={resetPresentation}
              className={`p-2 rounded-lg ${themeClasses.button} transition-colors`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg ${themeClasses.button} transition-colors`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="relative">
        <div className={`${themeClasses.slide} border rounded-lg m-4 min-h-[400px] flex flex-col justify-center`}>
          <div className={getSlideTypeStyle(currentSlideData.type || 'content')}>
            <div className="px-8">
              {/* Slide Type Indicator */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${themeClasses.accent} bg-opacity-10`}>
                  {currentSlideData.type || 'content'}
                </span>
              </div>

              {/* Heading */}
              <h2 className={`font-bold mb-6 ${
                currentSlideData.type === "intro" || currentSlideData.type === "outro" 
                  ? "text-3xl md:text-4xl" 
                  : "text-2xl md:text-3xl"
              }`}>
                {currentSlideData.heading}
              </h2>

              {/* Content Layout */}
              <div className={`${
                currentSlideData.imageUrl && (currentSlideData.type === "content" || !currentSlideData.type)
                  ? "grid md:grid-cols-2 gap-8 items-center"
                  : ""
              }`}>
                {/* Description */}
                <div className={`${
                  (currentSlideData.type === "intro" || currentSlideData.type === "outro")
                    ? "text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
                    : "text-base md:text-lg leading-relaxed"
                }`} style={{ fontFamily: '"Inter", Times, serif' }}>
                  {currentSlideData.description || 'No description available'}
                </div>

                {/* Image */}
                {currentSlideData.imageUrl ? (
                  <div className="flex justify-center">
                    <div className="relative rounded-lg overflow-hidden shadow-md max-w-sm">
                      <img
                        src={currentSlideData.imageUrl}
                        alt={currentSlideData.imageAlt || currentSlideData.heading}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden bg-gray-100 h-48 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Image failed to load</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="bg-gray-100 h-48 w-full max-w-sm rounded-lg flex items-center justify-center shadow-md">
                      <div className="text-center text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">No image available</p>
                        <p className="text-xs text-gray-400">Use search-unsplash-images tool to add images</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border"
          disabled={slidesWithIds.length <= 1}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border"
          disabled={slidesWithIds.length <= 1}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 p-4">
        {slidesWithIds.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? themeClasses.button.split(' ')[0] // Get background color
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 border-t border-gray-200 text-sm">
        <div className={themeClasses.accent}>
          Slide {currentSlide + 1} of {slidesWithIds.length}
        </div>
        <div className={`${themeClasses.accent} text-xs`}>
          {currentSlideData.type ? currentSlideData.type.charAt(0).toUpperCase() + currentSlideData.type.slice(1) : 'Unknown'} Slide
        </div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="text-xs text-center pb-2 text-gray-500">
        Use ← → arrow keys or click dots to navigate
      </div>
    </div>
  );
}

