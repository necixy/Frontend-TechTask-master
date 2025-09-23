import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories($ids: [String!]!, $first: Int!, $offset: Int!) {
    categories: productLists(ids: $ids, locale: de_DE) {
      name
      articleCount
      childrenCategories: childrenProductLists {
        list {
          name
          urlPath
          id
        }
      }
      categoryArticles: articlesList(first: $first, offset: $offset) {
        articles {
          name
          variantName
          prices {
            currency
            regular {
              value
            }
          }
          images(format: WEBP, maxWidth: 200, maxHeight: 200, limit: 1) {
            path
          }
        }
      }
    }
  }
`;
