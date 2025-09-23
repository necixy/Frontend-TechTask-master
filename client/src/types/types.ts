// Keeping all types in a single file for simplicity as it is a very small project,
// can be split into multiple files if needed.

export type Category = {
  name: string;
  categoryArticles: CategoryArticle;
  articleCount: number;
  childrenCategories: ChildCategory;
};

export type Article = {
  name: string;
  variantName: string;
  prices: Prices;
  images: Image[];
};

export type ChildCategory = {
  list: Array<{
    name: string;
    urlPath: string;
    id: string;
  }>;
};

export type Prices = {
  currency: string;
  regular: {
    value: number;
  };
};

export type Image = {
  path: string;
};

export type CategoryArticle = {
  articles: Article[];
};
