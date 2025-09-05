"use client";

import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  ExternalLink,
  Download,
  Share
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Slide {
  id: number;
  type: "intro" | "content" | "outro";
  heading: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  photographer?: string;
  unsplashUrl?: string;
  imageQuery?: string;
}

interface SlidesGeneratorProps {
  title: string;
  slides?: Omit<Slide, "id">[];
  theme?: "light" | "dark" | "blue" | "purple" | "gradient";
  autoPlay?: boolean;
  showProgress?: boolean;
}

export default function SlidesGenerator({ 
  title, 
  slides = [], 
  theme = "blue",
  autoPlay = false,
  showProgress = true
}: SlidesGeneratorProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images for smooth transitions
  useEffect(() => {
    if (!slides) return;
    
    // Reset image states when slides change
    setImageLoaded({});
    setImageError({});
    
    slides.forEach((slide, index) => {
      if (slide.imageUrl) {
        const img = new Image();
        img.onload = () => {
          setImageLoaded(prev => ({ ...prev, [index]: true }));
        };
        img.onerror = () => {
          setImageError(prev => ({ ...prev, [index]: true }));
        };
        img.src = slide.imageUrl;
      }
    });
  }, [slides]);

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        prev >= (slides?.length || 0) - 1 ? 0 : prev + 1
      );
      setProgress(0); // Reset progress on slide change
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, slides?.length]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || !showProgress) return;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 100 / 50, 100)); // 5 seconds to complete
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [isPlaying, currentSlide, showProgress]);

  const nextSlide = useCallback(() => {
    if (!slides || slides.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => {
      const next = prev >= slides.length - 1 ? 0 : prev + 1;
      // Reset progress after a small delay to ensure smooth transition
      setTimeout(() => setProgress(0), 50);
      return next;
    });
    // Allow next transition after animation completes
    setTimeout(() => setIsTransitioning(false), 400);
  }, [slides, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (!slides || slides.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => {
      const next = prev <= 0 ? slides.length - 1 : prev - 1;
      // Reset progress after a small delay to ensure smooth transition
      setTimeout(() => setProgress(0), 50);
      return next;
    });
    // Allow next transition after animation completes
    setTimeout(() => setIsTransitioning(false), 400);
  }, [slides, isTransitioning]);

  const goToSlide = (index: number) => {
    if (!slides || slides.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    // Reset progress after a small delay to ensure smooth transition
    setTimeout(() => setProgress(0), 50);
    // Allow next transition after animation completes
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const resetPresentation = () => {
    setCurrentSlide(0);
    setIsPlaying(autoPlay);
    setProgress(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleImageError = (slideId: number) => {
    setImageError(prev => ({ ...prev, [slideId]: true }));
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && !isTransitioning) {
        prevSlide();
      } else if (event.key === "ArrowRight" && !isTransitioning) {
        nextSlide();
      } else if (event.key === " " || event.key === "k") {
        setIsPlaying(prev => !prev);
      } else if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      } else if (event.key === "f") {
        toggleFullscreen();
      } else if (event.key === "0") {
        resetPresentation();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, prevSlide, nextSlide, isTransitioning]);

  // Auto-hide controls in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    let timeout: NodeJS.Timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    resetTimeout();

    document.addEventListener('mousemove', resetTimeout);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', resetTimeout);
    };
  }, [isFullscreen, currentSlide]);

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          container: "bg-gray-900 text-white",
          slide: "bg-gray-800 border-gray-700",
          accent: "text-gray-300",
          button: "bg-gray-700 hover:bg-gray-600 text-white",
          progress: "bg-gray-300",
          progressBar: "bg-white",
          imageGlowBg: "bg-white/10",
          imageGlowRing: "ring-1 ring-white/20"
        };
      case "purple":
        return {
          container: "bg-purple-50 text-gray-900",
          slide: "bg-white border-purple-200 shadow-lg",
          accent: "text-purple-600",
          button: "bg-purple-600 hover:bg-purple-700 text-white",
          progress: "bg-purple-200",
          progressBar: "bg-purple-600",
          imageGlowBg: "bg-purple-500/20",
          imageGlowRing: "ring-1 ring-purple-200/60"
        };
      case "light":
        return {
          container: "bg-gray-50 text-gray-900",
          slide: "bg-white border-gray-200 shadow-lg",
          accent: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700 text-white",
          progress: "bg-gray-200",
          progressBar: "bg-gray-600",
          imageGlowBg: "bg-gray-400/20",
          imageGlowRing: "ring-1 ring-gray-300/60"
        };
      case "gradient":
        return {
          container: "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900",
          slide: "bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl",
          accent: "text-blue-600",
          button: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
          progress: "bg-white/30",
          progressBar: "bg-gradient-to-r from-blue-500 to-purple-500",
          imageGlowBg: "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
          imageGlowRing: "ring-1 ring-blue-200/60"
        };
      default: // blue
        return {
          container: "bg-blue-50 text-gray-900",
          slide: "bg-white border-blue-200 shadow-lg",
          accent: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          progress: "bg-blue-200",
          progressBar: "bg-blue-600",
          imageGlowBg: "bg-blue-500/20",
          imageGlowRing: "ring-1 ring-blue-200/60"
        };
    }
  };

  // Handle case when slides is undefined or empty
  if (!slides || slides.length === 0) {
    return (
      <div className={`max-w-4xl mx-auto ${getThemeClasses().container} rounded-xl shadow-xl p-8 transition-all duration-300`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600">No slides available. Please generate a presentation first.</p>
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
      <div className={`max-w-4xl mx-auto ${getThemeClasses().container} rounded-xl shadow-xl p-8`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
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

  const themeClasses = getThemeClasses();
  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 p-4 bg-white" 
    : "max-w-4xl mx-auto";

  const exportPresentation = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Add title page with proper spacing
      pdf.setFontSize(24);
      pdf.text(title, 105, 60, { align: 'center' });
      
      // Add some space before metadata
      pdf.setFontSize(12);
      //pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 85, { align: 'center' });
      //pdf.text(`Total slides: ${slidesWithIds.length}`, 105, 100, { align: 'center' });

      // Generate slides
      for (let i = 0; i < slidesWithIds.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const slide = slidesWithIds[i];
        
        // Add slide number
        pdf.setFontSize(10);
        pdf.text(`Slide ${i + 1} of ${slidesWithIds.length}`, 20, 20);
        
        // Add slide type
        pdf.setFontSize(8);
        pdf.text(slide.type?.toUpperCase() || 'CONTENT', 20, 30);
        
        // Add heading
        pdf.setFontSize(18);
        const headingLines = pdf.splitTextToSize(slide.heading, 250);
        pdf.text(headingLines, 20, 50);
        
        // Add description
        pdf.setFontSize(12);
        const descriptionLines = pdf.splitTextToSize(slide.description, 250);
        let yPosition = 70;
        
        descriptionLines.forEach((line: string) => {
          if (yPosition > 180) {
            // If we run out of space, add a new page
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 20, yPosition);
          yPosition += 7;
        });

        // Add image if available
        if (slide.imageUrl && !imageError[slide.id]) {
          try {
            // Use a more reliable approach to load images for PDF
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = slide.imageUrl as string;
            });

            // Calculate image dimensions to fit in the PDF
            const maxWidth = 80;
            const maxHeight = 60;
            let imgWidth = maxWidth;
            let imgHeight = maxHeight;

            // Maintain aspect ratio
            if (img.width > img.height) {
              imgHeight = (img.height / img.width) * maxWidth;
            } else {
              imgWidth = (img.width / img.height) * maxHeight;
            }

            // Add image to PDF
            pdf.addImage(img, 'JPEG', 20, yPosition + 10, imgWidth, imgHeight);
            
          } catch (error) {
            console.error('Error adding image to PDF:', error);
            pdf.setFontSize(10);
            pdf.text('Image could not be loaded', 20, yPosition + 10);
          }
        }

        // Add photographer credit if available
        if (slide.photographer) {
          pdf.setFontSize(8);
          pdf.text(`Photo by ${slide.photographer}`, 20, 200);
        }
      }

      // Save the PDF
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const sharePresentation = async () => {
    exportPresentation();
  };

  const retryImageLoad = (slideId: number) => {
    setImageError(prev => ({ ...prev, [slideId]: false }));
    setImageLoaded(prev => ({ ...prev, [slideId]: false }));
  };

  return (
    <div className={`${containerClasses} ${themeClasses.container} rounded-xl shadow-xl transition-all duration-300 overflow-hidden`}>
      {/* Progress bar for auto-play */}
      {isPlaying && showProgress && (
        <div className={`w-full h-1 ${themeClasses.progress}`}>
          <div 
            className={`h-full ${themeClasses.progressBar} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="p-4 border-b border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold break-words max-w-xs">{title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-lg ${themeClasses.button} transition-colors hover:scale-105`}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={resetPresentation}
                  className={`p-2 rounded-lg ${themeClasses.button} transition-colors hover:scale-105`}
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={exportPresentation}
                  className={`p-2 rounded-lg ${themeClasses.button} transition-colors hover:scale-105`}
                  title="Export"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={sharePresentation}
                  className={`p-2 rounded-lg ${themeClasses.button} transition-colors hover:scale-105`}
                  title="Share"
                >
                  <Share className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-lg ${themeClasses.button} transition-colors hover:scale-105`}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slide Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ 
              duration: 0.4,
              ease: "easeInOut"
            }}
            className={`${themeClasses.slide} border rounded-lg m-4 min-h-[400px] flex flex-col justify-center`}
          >
            <div className={getSlideTypeStyle(currentSlideData.type || 'content')}>
              <div className="px-8">
                {/* Slide Type Indicator */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${themeClasses.accent} bg-opacity-10`}>
                    {currentSlideData.type || 'content'}
                  </span>
                </div>

                {/* Heading */}
                <h2
                  className={`font-bold mb-6 ${
                    currentSlideData.type === "intro" || currentSlideData.type === "outro"
                      ? "text-3xl md:text-4xl"
                      : "text-2xl md:text-3xl"
                  }`}
                  style={{ fontFamily: '"Inter", Times, serif' }}
                >
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
                    {(currentSlideData.description ?? '').split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>

                  {/* Image */}
                  {currentSlideData.imageUrl && !imageError[currentSlideData.id] ? (
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className={`pointer-events-none absolute -inset-4 rounded-xl ${themeClasses.imageGlowBg} blur-2xl opacity-70`}></div>
                        <div className={`relative z-10 rounded-lg overflow-hidden shadow-md max-w-sm group h-48 ${themeClasses.imageGlowRing}`}>
                          {!imageLoaded[currentSlideData.id] && (
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                              <div className="animate-pulse w-full h-full bg-gray-200"></div>
                            </div>
                          )}
                          <img
                            src={currentSlideData.imageUrl}
                            alt={currentSlideData.imageAlt || currentSlideData.heading}
                            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                              imageLoaded[currentSlideData.id] ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImageLoaded(prev => ({ ...prev, [currentSlideData.id]: true }))}
                            onError={() => handleImageError(currentSlideData.id)}
                          />
                          {(currentSlideData.photographer || currentSlideData.unsplashUrl) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex justify-between items-center">
                                <span>Photo by {currentSlideData.photographer || 'Unknown'}</span>
                                {currentSlideData.unsplashUrl && (
                                  <a 
                                    href={currentSlideData.unsplashUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-300 hover:text-blue-100"
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Unsplash
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="bg-gray-100 h-48 w-full max-w-sm rounded-lg flex flex-col items-center justify-center shadow-md p-4">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 text-center mb-2">
                          {imageError[currentSlideData.id] ? 
                            "Failed to load image" : 
                            "No image available"
                          }
                        </p>
                        {currentSlideData.imageQuery && (
                          <p className="text-xs text-gray-400 text-center mb-3">
                            Query: "{currentSlideData.imageQuery}"
                          </p>
                        )}
                        {imageError[currentSlideData.id] && (
                          <button
                            onClick={() => retryImageLoad(currentSlideData.id)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Retry loading image
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <AnimatePresence>
          {showControls && slidesWithIds.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={prevSlide}
                disabled={isTransitioning}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:shadow-xl transition-all border backdrop-blur-sm hover:scale-110 ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={nextSlide}
                disabled={isTransitioning}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:shadow-xl transition-all border backdrop-blur-sm hover:scale-110 ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center gap-2 p-4"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-between items-center p-4 border-t border-gray-200/50 text-sm"
          >
            <div className={themeClasses.accent}>
              Slide {currentSlide + 1} of {slidesWithIds.length}
            </div>
            <div className={`${themeClasses.accent} text-xs`}>
              {currentSlideData.type ? currentSlideData.type.charAt(0).toUpperCase() + currentSlideData.type.slice(1) : 'Unknown'} Slide
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard navigation hint */}
      <AnimatePresence>
        {showControls && !isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center pb-2 text-gray-500"
          >
            Use ← → arrow keys, Space to play/pause, F for fullscreen
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}