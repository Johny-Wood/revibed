import BlogWrapper from '@/pages/blog/BlogWrapper';
import { SSRBlog } from '@/SSR/requests/blog/SSRBlogRequests';

function BlogPage() {
  return <BlogWrapper />;
}

BlogPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(SSRBlog(ctx));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default BlogPage;
