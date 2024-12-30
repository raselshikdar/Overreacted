'use client';

import { useEffect } from "react";

const Comments = () => {
  useEffect(() => {
    const script = document.createElement("script");
    const commentsDiv = document.getElementById("post-comments");

    script.async = true;
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "raselshikdar/blog");
    script.setAttribute("data-repo-id", "R_kgDOMuevqw");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOMuevq84CiS_S");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");

    if (commentsDiv) {
      commentsDiv.appendChild(script);
    } else {
      console.error("Failed to find comments container.");
    }

    return () => {
      if (commentsDiv) {
        commentsDiv.innerHTML = "";
      }
    };
  }, []);

  return (
    <div id="post-comments" style={{ marginTop: "2rem" }}>
    </div>
  );
};

export default Comments;
