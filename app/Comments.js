'use client';

import { useEffect, useState } from 'react';
import Giscus from '@giscus/react';

const Comments = ({ repo, repoId, category, categoryId }) => {
  const [theme, setTheme] = useState('preferred_color_scheme'); // Default to auto mode

  useEffect(() => {
    const detectTheme = () => {
      const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');

      // Determine theme based on saved preference or system preference
      if (savedTheme === 'dark') return 'dark';
      if (savedTheme === 'light') return 'light';
      return userPrefersDark ? 'dark' : 'light';
    };

    // Set the detected theme
    setTheme(detectTheme());

    const themeChangeHandler = () => {
      setTheme(detectTheme());
    };

    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', themeChangeHandler);

    return () => {
      darkModeMediaQuery.removeEventListener('change', themeChangeHandler);
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
