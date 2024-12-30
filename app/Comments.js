'use client';

import { useEffect, useState } from 'react';
import Giscus from '@giscus/react';

const Comments = ({ repo, repoId, category, categoryId }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  useEffect(() => {
    // Function to detect the current theme dynamically
    const detectTheme = () => {
      const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');

      // Set the theme based on saved preferences or system preference
      if (savedTheme === 'dark' || (savedTheme === 'auto' && userPrefersDark)) {
        return 'dark';
      }
      if (savedTheme === 'auto') {
        return 'preferred_color_scheme';
      }
      return 'light';
    };

    // Set initial theme state based on detection
    const initialTheme = detectTheme();
    setTheme(initialTheme);

    // Listener for theme changes (if applicable)
    const themeChangeHandler = () => {
      const newTheme = detectTheme();
      setTheme(newTheme);
    };

    // Detect system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChangeHandler);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', themeChangeHandler);
    };
  }, []);

  return (
    <div id="post-comments" style={{ width: '100%', margin: '0 auto', paddingTop: '20px' }}>
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="en"
        loading="lazy"
      />
    </div>
  );
};

export default Comments;
