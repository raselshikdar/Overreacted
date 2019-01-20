import React from 'react';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';
import ReadingIndicator from '../components/ReadingIndicator'
import '../fonts/fonts-post.css';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Signup from '../components/Signup';
import { formatReadingTime } from '../utils/helpers';
import { rhythm, scale } from '../utils/typography';
import {
  codeToLanguage,
  createLanguageLink,
  loadFontsForCode,
} from '../utils/i18n';

const GITHUB_USERNAME = 'gaearon';
const GITHUB_REPO_NAME = 'overreacted.io';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const { previous, next, slug } = this.props.pageContext;
    const lang = post.fields.langKey;
    const translations = (post.frontmatter.langs || []).filter(l => l !== 'en');
    translations.sort((a, b) => {
      return codeToLanguage(a) < codeToLanguage(b) ? -1 : 1;
    });

    loadFontsForCode(lang);
    const languageLink = createLanguageLink(slug, lang);
    const enSlug = languageLink('en');
    const editUrl = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/master/src/pages/${enSlug.slice(
      1,
      enSlug.length - 1
    )}/index${lang === 'en' ? '' : '.' + lang}.md`;
    const discussUrl = `https://mobile.twitter.com/search?q=${encodeURIComponent(
      `https://overreacted.io${enSlug}`
    )}`;
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          lang={lang}
          title={post.frontmatter.title}
          description={post.frontmatter.spoiler}
          slug={post.fields.slug}
          lang={lang}
        />
        <ReadingIndicator />
        <h1 style={{ color: 'var(--textTitle)' }}>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-4 / 5),
          }}
        >
          {post.frontmatter.date}
          {` • ${formatReadingTime(post.timeToRead)}`}
        </p>
        {translations.length > 0 && (
          <p
            style={{
              marginTop: '-1em',
              fontSize: '0.8em',
              border: '1px solid var(--hr)',
              borderRadius: '0.75em',
              padding: '0.75em',
              background: 'var(--inlineCode-bg)',
            }}
          >
            {translations.length > 0 && (
              <>
                This post was translated by readers into
                {translations.length > 1 && ':'}{' '}
                {translations.map((l, i) => (
                  <React.Fragment key={l}>
                    {l === lang ? (
                      <b>{codeToLanguage(l)}</b>
                    ) : (
                      <Link to={languageLink(l)}>{codeToLanguage(l)}</Link>
                    )}
                    {i === translations.length - 1 ? '.' : ' • '}
                  </React.Fragment>
                ))}
              </>
            )}
            {lang !== 'en' && (
              <>
                {translations.length > 4 ? (
                  <>
                    <br />
                    <br />
                  </>
                ) : (
                  <br />
                )}
                You can <Link to={languageLink('en')}>view</Link>
                {' the original or '}
                <a href={editUrl} target="_blank" rel="noopener noreferrer">
                  improve
                </a>{' '}
                this translation.
              </>
            )}
          </p>
        )}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <p>
          <a href={discussUrl} target="_blank" rel="noopener noreferrer">
            Discuss on Twitter
          </a>
          {` • `}
          <a href={editUrl} target="_blank" rel="noopener noreferrer">
            Edit on GitHub
          </a>
        </p>
        <div style={{ margin: '90px 0 40px 0' }}>
          <Signup />
        </div>
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: rhythm(0.25),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'var(--pink)',
            }}
            to={'/'}
          >
            Overreacted
          </Link>
        </h3>
        <Bio />
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        langs
        spoiler
      }
      fields {
        slug
        langKey
      }
    }
  }
`;
