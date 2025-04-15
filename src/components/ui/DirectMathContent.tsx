import React, { useEffect, useRef, FC } from 'react';

interface DirectMathContentProps {
  content: string;
}

const DirectMathContent: FC<DirectMathContentProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set the raw content
    containerRef.current.innerHTML = content;
    
    // Ensure MathJax is loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
      script.async = true;
      
      script.onload = () => {
        configureMathJax();
      };
      
      document.head.appendChild(script);
    } else {
      configureMathJax();
    }
    
    function configureMathJax() {
      if (window.MathJax) {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [['$', '$']],
            displayMath: [['$$', '$$']],
            processEscapes: true,
            processClass: "math-content",
            ignoreClass: "no-math"
          },
          TeX: {
            equationNumbers: { autoNumber: "AMS" },
            extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
          },
          messageStyle: "none",
          showProcessingMessages: false
        });
        
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, containerRef.current]);
      }
    }
  }, [content]);
  
  return (
    <div ref={containerRef} className="math-content"></div>
  );
};

declare global {
  interface Window {
    MathJax?: {
      Hub: {
        Config: (config: any) => void;
        Queue: (args: any[]) => void;
      }
    }
  }
}

export default DirectMathContent;