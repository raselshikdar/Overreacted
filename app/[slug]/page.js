import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "../Link";
import { sans } from "../fonts";
import remarkSmartpants from "remark-smartypants";
import rehypePrettyCode from "rehype-pretty-code";
import { remarkMdxEvalCodeBlock } from "./mdx.js";
import overnight from "overnight/themes/Overnight-Slumber.json";
import "./markdown.css";

overnight.colors["editor.background"] = "var(--code-bg)";

export default async function PostPage({ params }) {
  const filename = "./public/" + params.slug + "/index.md";
  const file = await readFile(filename, "utf8");
  let postComponents = {};
  try {
    postComponents = await import(
      "../../public/" + params.slug + "/components.js"
    );
  } catch (e) {
    if (!e || e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }
  const { content, data } = matter(file);
  const discussUrl = `https://github.com/raselshikdar/blog/discussions/main/public/${encodeURIComponent(
    params.slug,
  )}/index.md`;
  const editUrl = `https://github.com/raselshikdar/blog/edit/main/public/${encodeURIComponent(
    params.slug,
  )}/index.md`;
  return (
    <article>
      <h1
        className={[
          sans.className,
          "text-[40px] font-black leading-[44px] text-[--title]",
        ].join(" ")}
      >
        {data.title}
      </h1>
      <p className="mt-2 text-[13px] text-gray-700 dark:text-gray-300">
        {new Date(data.date).toLocaleDateString("en", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="markdown mt-10">
        <MDXRemote
          source={content}
          components={{
            a: Link,
            ...postComponents,
          }}
          options={{
            mdxOptions: {
              useDynamicImport: true,
              remarkPlugins: [
                remarkSmartpants,
                [remarkMdxEvalCodeBlock, filename],
              ],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: overnight,
                  },
                ],
              ],
            },
          }}
        />
          <hr />
          <p>
          <script src="https://giscus.app/client.js"
        data-repo="raselshikdar/blog"
        data-repo-id="R_kgDOMuevqw"
        data-category="General"
        data-category-id="DIC_kwDOMuevq84CiS_S"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
          </p>
          <hr />
        <p>
          <Link href={discussUrl}>Discuss on GitHub Issues</Link>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <Link href={editUrl}>Edit on GitHub</Link>
        </p>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const entries = await readdir("./public/", { withFileTypes: true });
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  return dirs.map((dir) => ({ slug: dir }));
}

export async function generateMetadata({ params }) {
  const file = await readFile("./public/" + params.slug + "/index.md", "utf8");
  let { data } = matter(file);
  return {
    title: data.title + " — overreacted",
    description: data.spoiler,
  };
}
