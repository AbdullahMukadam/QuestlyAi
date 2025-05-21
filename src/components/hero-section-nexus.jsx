"use client";;
import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useMemo,
} from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RotatingText = forwardRef((
  {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2200,
    staggerDuration = 0.01,
    staggerFrom = "last",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  },
  ref
) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = text => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      try {
         const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
         return Array.from(segmenter.segment(text), (segment) => segment.segment);
      } catch (error) {
         console.error("Intl.Segmenter failed, falling back to simple split:", error);
         return text.split('');
      }
    }
    return text.split('');
  };

  const elements = useMemo(() => {
      const currentText = texts[currentTextIndex] ?? '';
      if (splitBy === "characters") {
          const words = currentText.split(/(\s+)/);
          let charCount = 0;
          return words.filter(part => part.length > 0).map((part) => {
              const isSpace = /^\s+$/.test(part);
              const chars = isSpace ? [part] : splitIntoCharacters(part);
              const startIndex = charCount;
              charCount += chars.length;
              return { characters: chars, isSpace: isSpace, startIndex: startIndex };
          });
      }
      if (splitBy === "words") {
          return currentText.split(/(\s+)/).filter(word => word.length > 0).map((word, i) => ({
              characters: [word], isSpace: /^\s+$/.test(word), startIndex: i
          }));
      }
      if (splitBy === "lines") {
          return currentText.split('\n').map((line, i) => ({
              characters: [line], isSpace: false, startIndex: i
          }));
      }
      return currentText.split(splitBy).map((part, i) => ({
          characters: [part], isSpace: false, startIndex: i
      }));
  }, [texts, currentTextIndex, splitBy]);

  const totalElements = useMemo(
      () => elements.reduce((sum, el) => sum + el.characters.length, 0),
      [elements]
  );

  const getStaggerDelay = useCallback((index, total) => {
    if (total <= 1 || !staggerDuration) return 0;
    const stagger = staggerDuration;
    switch (staggerFrom) {
      case "first": return index * stagger;
      case "last": return (total - 1 - index) * stagger;
      case "center":
        const center = (total - 1) / 2;
        return Math.abs(center - index) * stagger;
      case "random": return Math.random() * (total - 1) * stagger;
      default:
        if (typeof staggerFrom === 'number') {
          const fromIndex = Math.max(0, Math.min(staggerFrom, total - 1));
          return Math.abs(fromIndex - index) * stagger;
        }
        return index * stagger;
    }
  }, [staggerFrom, staggerDuration]);

  const handleIndexChange = useCallback((newIndex) => {
    setCurrentTextIndex(newIndex);
    onNext?.(newIndex);
  }, [onNext]);

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback((index) => {
    const validIndex = Math.max(0, Math.min(index, texts.length - 1));
    if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
  }, [texts.length, currentTextIndex, handleIndexChange]);

   const reset = useCallback(() => {
      if (currentTextIndex !== 0) handleIndexChange(0);
   }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(
      ref,
      () => ({ next, previous, jumpTo, reset }),
      [next, previous, jumpTo, reset]
  );

  useEffect(() => {
    if (!auto || texts.length <= 1) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto, texts.length]);

  return (
      (<motion.span
          className={cn(
              "inline-flex flex-wrap whitespace-pre-wrap relative align-bottom pb-[10px]",
              mainClassName
          )}
          {...rest}
          layout>
          <span className="sr-only">{texts[currentTextIndex]}</span>
          <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
            <motion.div
                key={currentTextIndex}
                className={cn(
                    "inline-flex flex-wrap relative",
                    splitBy === "lines" ? "flex-col items-start w-full" : "flex-row items-baseline"
                )}
                layout
                aria-hidden="true"
                initial="initial"
                animate="animate"
                exit="exit">
               {elements.map((elementObj, elementIndex) => (
                  <span
                      key={elementIndex}
                      className={cn("inline-flex", splitBy === 'lines' ? 'w-full' : '', splitLevelClassName)}
                      style={{ whiteSpace: 'pre' }}>
                      {elementObj.characters.map((char, charIndex) => {
                          const globalIndex = elementObj.startIndex + charIndex;
                          return (
                              (<motion.span
                                  key={`${char}-${charIndex}`}
                                  initial={initial}
                                  animate={animate}
                                  exit={exit}
                                  transition={{
                                      ...transition,
                                      delay: getStaggerDelay(globalIndex, totalElements),
                                  }}
                                  className={cn("inline-block leading-none tracking-tight", elementLevelClassName)}>
                                  {char === ' ' ? '\u00A0' : char}
                              </motion.span>)
                          );
                       })}
                  </span>
               ))}
            </motion.div>
          </AnimatePresence>
      </motion.span>)
  );
});
RotatingText.displayName = "RotatingText";

const ShinyText = ({ text, className = "" }) => (
    <span className={cn("relative overflow-hidden inline-block", className)}>
        {text}
        <span
            style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shine 2s infinite linear',
                opacity: 0.5,
                pointerEvents: 'none'
            }}></span>
        <style>{`
            @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
    </span>
);

const ChevronDownIcon = (props) => (
   <svg
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 24 24"
       strokeWidth={2}
       stroke="currentColor"
       className="w-3 h-3 ml-1 inline-block transition-transform duration-200 group-hover:rotate-180"
       {...props}>
     <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="m19.5 8.25-7.5 7.5-7.5-7.5" />
   </svg>
);

const MenuIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
        {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
        {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const ExternalLinkIcon = (props) => (
  <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity"
      {...props}>
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const NavLink = ({ href = "#", children, hasDropdown = false, className = "", onClick }) => (
   <motion.a
       href={href}
       onClick={onClick}
       className={cn(
           "relative group text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 flex items-center py-1",
           className
       )}
       whileHover="hover">
     {children}
     {hasDropdown && <ChevronDownIcon />}
     {!hasDropdown && (
         <motion.div
             className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[#0CF2A0]"
             variants={{ initial: { scaleX: 0, originX: 0.5 }, hover: { scaleX: 1, originX: 0.5 } }}
             initial="initial"
             transition={{ duration: 0.3, ease: "easeOut" }} />
     )}
   </motion.a>
 );

const DropdownMenu = ({ children, isOpen }) => (
   <AnimatePresence>
     {isOpen && (
       <motion.div
           initial={{ opacity: 0, y: 10, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
           transition={{ duration: 0.2, ease: "easeOut" }}
           className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 origin-top z-40">
           <div
               className="bg-[#111111] border border-gray-700/50 rounded-md shadow-xl p-2">
               {children}
           </div>
       </motion.div>
     )}
   </AnimatePresence>
);

const DropdownItem = ({ href = "#", children, icon }) => (
 <a
     href={href}
     className="group flex items-center justify-between w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/30 hover:text-white rounded-md transition-colors duration-150">
   <span>{children}</span>
   {icon && React.cloneElement(
       icon,
       { className: "w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" }
   )}
 </a>
);

const InteractiveHero = () => {
   const canvasRef = useRef(null);
   const animationFrameId = useRef(null);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [openDropdown, setOpenDropdown] = useState(null);
   const [isScrolled, setIsScrolled] = useState(false);

   const { scrollY } = useScroll();
   useMotionValueEvent(scrollY, "change", (latest) => {
       setIsScrolled(latest > 10);
   });

   const dotsRef = useRef([]);
   const gridRef = useRef({});
   const canvasSizeRef = useRef({ width: 0, height: 0 });
   const mousePositionRef = useRef({ x: null, y: null });

   const DOT_SPACING = 25;
   const BASE_OPACITY_MIN = 0.40;
   const BASE_OPACITY_MAX = 0.50;
   const BASE_RADIUS = 1;
   const INTERACTION_RADIUS = 150;
   const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
   const OPACITY_BOOST = 0.6;
   const RADIUS_BOOST = 2.5;
   const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5));

   const handleMouseMove = useCallback((event) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            mousePositionRef.current = { x: null, y: null };
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;
        mousePositionRef.current = { x: canvasX, y: canvasY };
   }, []);

   const createDots = useCallback(() => {
       const { width, height } = canvasSizeRef.current;
       if (width === 0 || height === 0) return;

       const newDots = [];
       const newGrid = {};
       const cols = Math.ceil(width / DOT_SPACING);
       const rows = Math.ceil(height / DOT_SPACING);

       for (let i = 0; i < cols; i++) {
           for (let j = 0; j < rows; j++) {
               const x = i * DOT_SPACING + DOT_SPACING / 2;
               const y = j * DOT_SPACING + DOT_SPACING / 2;
               const cellX = Math.floor(x / GRID_CELL_SIZE);
               const cellY = Math.floor(y / GRID_CELL_SIZE);
               const cellKey = `${cellX}_${cellY}`;

               if (!newGrid[cellKey]) {
                   newGrid[cellKey] = [];
               }

               const dotIndex = newDots.length;
               newGrid[cellKey].push(dotIndex);

               const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
               newDots.push({
                   x,
                   y,
                   baseColor: `rgba(87, 220, 205, ${BASE_OPACITY_MAX})`,
                   targetOpacity: baseOpacity,
                   currentOpacity: baseOpacity,
                   opacitySpeed: (Math.random() * 0.005) + 0.002,
                   baseRadius: BASE_RADIUS,
                   currentRadius: BASE_RADIUS,
               });
           }
       }
       dotsRef.current = newDots;
       gridRef.current = newGrid;
   }, [DOT_SPACING, GRID_CELL_SIZE, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

   const handleResize = useCallback(() => {
       const canvas = canvasRef.current;
       if (!canvas) return;
       const container = canvas.parentElement;
       const width = container ? container.clientWidth : window.innerWidth;
       const height = container ? container.clientHeight : window.innerHeight;

       if (canvas.width !== width || canvas.height !== height ||
           canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height)
       {
           canvas.width = width;
           canvas.height = height;
           canvasSizeRef.current = { width, height };
           createDots();
       }
   }, [createDots]);

   const animateDots = useCallback(() => {
       const canvas = canvasRef.current;
       const ctx = canvas?.getContext('2d');
       const dots = dotsRef.current;
       const grid = gridRef.current;
       const { width, height } = canvasSizeRef.current;
       const { x: mouseX, y: mouseY } = mousePositionRef.current;

       if (!ctx || !dots || !grid || width === 0 || height === 0) {
           animationFrameId.current = requestAnimationFrame(animateDots);
           return;
       }

       ctx.clearRect(0, 0, width, height);

       const activeDotIndices = new Set();
       if (mouseX !== null && mouseY !== null) {
           const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
           const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
           const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
           for (let i = -searchRadius; i <= searchRadius; i++) {
               for (let j = -searchRadius; j <= searchRadius; j++) {
                   const checkCellX = mouseCellX + i;
                   const checkCellY = mouseCellY + j;
                   const cellKey = `${checkCellX}_${checkCellY}`;
                   if (grid[cellKey]) {
                       grid[cellKey].forEach(dotIndex => activeDotIndices.add(dotIndex));
                   }
               }
           }
       }

       dots.forEach((dot, index) => {
           dot.currentOpacity += dot.opacitySpeed;
           if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
               dot.opacitySpeed = -dot.opacitySpeed;
               dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
               dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
           }

           let interactionFactor = 0;
           dot.currentRadius = dot.baseRadius;

           if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
               const dx = dot.x - mouseX;
               const dy = dot.y - mouseY;
               const distSq = dx * dx + dy * dy;

               if (distSq < INTERACTION_RADIUS_SQ) {
                   const distance = Math.sqrt(distSq);
                   interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
                   interactionFactor = interactionFactor * interactionFactor;
               }
           }

           const finalOpacity = Math.min(1, dot.currentOpacity + interactionFactor * OPACITY_BOOST);
           dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;

           const colorMatch = dot.baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
           const r = colorMatch ? colorMatch[1] : '87';
           const g = colorMatch ? colorMatch[2] : '220';
           const b = colorMatch ? colorMatch[3] : '205';

           ctx.beginPath();
           ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity.toFixed(3)})`;
           ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
           ctx.fill();
       });

       animationFrameId.current = requestAnimationFrame(animateDots);
   }, [GRID_CELL_SIZE, INTERACTION_RADIUS, INTERACTION_RADIUS_SQ, OPACITY_BOOST, RADIUS_BOOST, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

   useEffect(() => {
       handleResize();
       const canvasElement = canvasRef.current;
        const handleMouseLeave = () => {
            mousePositionRef.current = { x: null, y: null };
        };

       window.addEventListener('mousemove', handleMouseMove, { passive: true });
       window.addEventListener('resize', handleResize);
       document.documentElement.addEventListener('mouseleave', handleMouseLeave);


       animationFrameId.current = requestAnimationFrame(animateDots);

       return () => {
           window.removeEventListener('resize', handleResize);
           window.removeEventListener('mousemove', handleMouseMove);
           document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
           if (animationFrameId.current) {
               cancelAnimationFrame(animationFrameId.current);
           }
       };
   }, [handleResize, handleMouseMove, animateDots]);

   useEffect(() => {
       if (isMobileMenuOpen) {
           document.body.style.overflow = 'hidden';
       } else {
           document.body.style.overflow = 'unset';
       }
       return () => { document.body.style.overflow = 'unset'; };
   }, [isMobileMenuOpen]);

   const headerVariants = {
       top: {
           backgroundColor: "rgba(17, 17, 17, 0.8)",
           borderBottomColor: "rgba(55, 65, 81, 0.5)",
           position: 'fixed',
           boxShadow: 'none',
       },
       scrolled: {
           backgroundColor: "rgba(17, 17, 17, 0.95)",
           borderBottomColor: "rgba(75, 85, 99, 0.7)",
           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
           position: 'fixed'
       }
   };

   const mobileMenuVariants = {
       hidden: { opacity: 0, y: -20 },
       visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
       exit: { opacity: 0, y: -20, transition: { duration: 0.15, ease: "easeIn" } }
   };

    const contentDelay = 0.3;
    const itemDelayIncrement = 0.1;

    const bannerVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: contentDelay } }
    };
   const headlineVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement } }
    };
    const subHeadlineVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 2 } }
    };
    const formVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 3 } }
    };
    const trialTextVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 4 } }
    };
    const worksWithVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 5 } }
    };
    const imageVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, delay: contentDelay + itemDelayIncrement * 6, ease: [0.16, 1, 0.3, 1] } }
    };

  return (
      (<div
          className="pt-[100px] relative bg-[#000000] text-gray-300 min-h-screen flex flex-col overflow-x-hidden">
          <canvas
              ref={canvasRef}
              className="absolute inset-0 z-0 pointer-events-none opacity-80" />
          <div
              className="absolute inset-0 z-1 pointer-events-none"
              style={{
                  background: 'linear-gradient(to bottom, transparent 0%, #111111 96%), radial-gradient(ellipse at center, transparent 40%, #111111 95%)'
              }}></div>
          
          <main
              className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-8 pb-16 relative z-10">

              <motion.div
                  variants={bannerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-6">
                  <ShinyText
                      text="New Feature Soon"
                      className="bg-[#1a1a1a] border border-gray-700 text-[#0CF2A0] px-4 py-1 rounded-full text-xs sm:text-sm font-medium cursor-pointer hover:border-[#0CF2A0]/50 transition-colors" />
              </motion.div>

              <motion.h1
                  variants={headlineVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl sm:text-5xl lg:text-[62px] font-semibold text-white leading-tight max-w-4xl mb-4">
                  AI-Powered Mock Interviewer<br />{' '}
                  <span
                      className="inline-block h-[1.2em] sm:h-[1.2em] lg:h-[1.2em] overflow-hidden align-bottom">
                        
                      <RotatingText
                          texts={[' For your Success', ' For Experience',]}
                          mainClassName="text-[#0CF2A0] mx-1"
                          staggerFrom={"last"}
                          initial={{ y: "-100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "110%", opacity: 0 }}
                          staggerDuration={0.01}
                          transition={{ type: "spring", damping: 18, stiffness: 250 }}
                          rotationInterval={2200}
                          splitBy="characters"
                          auto={true}
                          loop={true} />
                  </span>
              </motion.h1>

              <motion.p
                  variants={subHeadlineVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                 Questly AI is your personal AI-powered mock interviewer, designed to help you prepare for real-world interviews. 
              </motion.p>

              <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-md mx-auto mb-3"
                  >
                  <motion.button
                      
                      className="w-full sm:w-auto bg-[#0CF2A0] text-[#111111] px-5 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                      See QuestlyAI in action
                  </motion.button>
              </motion.div>

              <motion.p
                  variants={trialTextVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xs text-gray-500 mb-10">
                  Click on the Get Started Button
              </motion.p>


             
          </main>
      </div>)
  );
};

export default InteractiveHero;