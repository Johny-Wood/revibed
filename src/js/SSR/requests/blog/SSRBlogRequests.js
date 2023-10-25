import { RoutePathsConstants } from '@/constants/routes/routes';
import { loadBlogItemRequestAction, loadBlogRequestAction } from '@/redux-actions/blog/blogActions';
import NextRouter from '@/services/NextRouter';
import { handleErrorUtil } from '@/utils/apiUtils';
import { parseReplaceTextUtil } from '@/utils/textUtils';

export const SSRBlog = async ({ refreshedToken, req, store, store: { dispatch } = {} }) => {
  if (req) {
    await loadBlogRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  } else {
    const { BlogReducer: { loadBlogFromApi } = {} } = store.getState();

    if (!loadBlogFromApi) {
      loadBlogRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
    }
  }
};

const SSRBlogItemRedirect = ({ error, req, res, data: { slug } = {} } = {}) => {
  if (!error) {
    return;
  }

  const newLocation = parseReplaceTextUtil(RoutePathsConstants.BLOG_ITEM, slug);

  handleErrorUtil(error, {
    ARTICLE_SLUG_DIFFERENT: () => {
      if (req && res) {
        res.statusCode = 301;
        res.setHeader('Location', newLocation);
        res.end();
      } else {
        const { router } = NextRouter.getInstance();

        router.push(newLocation).then();
      }
    },
  });
};

export const SSRBlogItem = async ({ refreshedToken, query: { slug } = {}, req, res, store, store: { dispatch } = {} }) => {
  if (req) {
    await loadBlogItemRequestAction({ slug, cookie: refreshedToken, dispatch })
      .then(({ data, error }) => SSRBlogItemRedirect({ req, res, error, data }))
      .catch();
  } else {
    const { BlogReducer: { blogItems } = {} } = store.getState();

    const foundBlogItemIndex = Object.values(blogItems).findIndex(({ slug: foundSlug }) => foundSlug === slug);

    if (foundBlogItemIndex === -1) {
      loadBlogItemRequestAction({ slug, cookie: refreshedToken, dispatch })
        .then(({ data, error }) => SSRBlogItemRedirect({ req, res, error, data }))
        .catch();
    }
  }
};
