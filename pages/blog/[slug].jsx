import { RoutePathsConstants } from '@/constants/routes/routes';
import BlogItemWrapper from '@/pages/blog/BlogItemWrapper';
import { SSRBlogItem } from '@/SSR/requests/blog/SSRBlogRequests';

function BlogItemPage({ slug }) {
  return <BlogItemWrapper slug={slug} />;
}

BlogItemPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];
  const { req, res, query: { slug } = {} } = ctx;

  if (!slug && req && res) {
    res.statusCode = 302;
    res.setHeader('Location', RoutePathsConstants.BLOG);
    res.end();
  } else {
    awaitPromises.push(SSRBlogItem(ctx));
  }

  await Promise.all(awaitPromises);

  return {
    slug,
  };
};

export default BlogItemPage;
