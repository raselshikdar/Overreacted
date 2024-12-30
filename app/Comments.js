'use client';

import { useEffect, useState } from 'react';

const Comments = ({ repo, repoId, category, categoryId }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  useEffect(() => {
    // Function to detect the current theme dynamically
    const detectTheme = () => {
      const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme === 'dark' || (savedTheme === 'auto' && userPrefersDark)) {
        return 'dark';
      }
      if (savedTheme === 'auto') {
        return 'preferred_color_scheme';
      }
      return 'light';
    };

    // Update theme state
    setTheme(detectTheme());

    // Add the Giscus script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', detectTheme());
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';

    // Append the script to the comments div
    const commentsDiv = document.getElementById('post-comments');
    if (commentsDiv) {
      commentsDiv.innerHTML = ''; // Clear previous instances
      commentsDiv.appendChild(script);
    }

    // Listener for theme changes (if applicable)
    const themeChangeHandler = () => {
      const newTheme = detectTheme();
      setTheme(newTheme);
      const iframe = document.querySelector('iframe.giscus-frame');
      if (iframe) {
        iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: newTheme } } }, '*');
      }
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChangeHandler);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', themeChangeHandler);
    };
  }, [repo, repoId, category, categoryId]);

  return (
    <div id="post-comments" style={{ width: '100%', margin: '0 auto', paddingTop: '20px' }}>
    </div>
  );
};

export default Comments;
