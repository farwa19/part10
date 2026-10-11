
import { gql } from '@apollo/client';


export const GET_REPOSITORIES = gql`
  query Repositories($searchKeyword: String) {
    repositories(searchKeyword: $searchKeyword) {
      edges {
        node {
          id
          fullName
          description
          language
          forksCount
          stargazersCount
          ratingAverage
          reviewCount
          ownerAvatarUrl
        }
      }
    }
  }
`;



export const USERS = gql`
  query {
    users {
      id
      username
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      username
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      id
      text
      rating
      createdAt
    }
  }
`;

export const LOGIN = gql`
  mutation authenticate($credentials: AuthenticateInput!) {
    authenticate(credentials: $credentials) {
      user {
        id
        username
      }
      accessToken
    }
  }
`;


export const ADD_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput!) {
    createReview(review: $review) {
      id
      text
      rating
      createdAt
    }
  }
`;


export const ME = gql`
  query getCurrentUser($includeReviews: Boolean = false) {
    me {
      id
      username
      reviews @include(if: $includeReviews) {
        edges {
          node {
            id
            rating
            text
            createdAt
            repositoryId
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;

export const GET_REPOSITORY = gql`
  query getRepository($id: ID!, $first: Int = 5, $after: String) {
    repository(id: $id) {
      id
      fullName
      description
      language
      forksCount
      stargazersCount
      ratingAverage
      reviewCount
      ownerAvatarUrl
      url
      reviews(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            text
            rating
            createdAt
            user {
              id
              username
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;
