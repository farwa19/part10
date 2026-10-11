import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import { config } from 'dotenv';
import JWT from 'jsonwebtoken';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { parsed: backendEnv } = config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '.env'),
});

const jwtSecret = process.env.JWT_SECRET || backendEnv?.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is required. Set it in backend/.env or the process environment.');
}

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    

   
  }
     


type Repository {
  id: ID!
  fullName: String!
  url: String!
  description: String!
  language: String!
  forksCount: Int!
  stargazersCount: Int!
  ratingAverage: Int!
  reviewCount: Int!
  ownerAvatarUrl: String
  reviews(first: Int, after: String): ReviewConnection!
}

type Review {
  id: ID!
  text: String!
  rating: Int!
  createdAt: String!
  user: User!
    repositoryId: ID!
}

type ReviewEdge {
  node: Review!
  cursor: String!
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
}
input CreateReviewInput {
  ownerName: String!
  repositoryName: String!
  rating: Int!
  text: String
}

type ReviewConnection {
  edges: [ReviewEdge!]!
  pageInfo: PageInfo
}


  type RepositoryEdge {
    node: Repository!
  }
  type LoginResult {
    user: User!
    accessToken: String!
  }
    

  type RepositoryConnection {
    edges: [RepositoryEdge!]!
  }

enum ORDERBY {
  CREATED_AT
  RATING_AVERAGE
}

enum ORDERDIRECTION {
  ASC
  DESC
}
  
type CurrentUser {
  id: ID!
  username: String!
  reviews: ReviewConnection
}

type Query {
  repositories(
    first: Int = 30
    orderBy: ORDERBY = CREATED_AT
    orderDirection: ORDERDIRECTION = DESC
    searchKeyword: String
  ): RepositoryConnection!

  users: [User!]!
  me: CurrentUser
  repository(id: ID!): Repository
}
  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResult!
    authenticate(code: String!): User!
    authorize(code: String!): User!
    deleteReview(id: ID!): Review!
    createReview(review: CreateReviewInput!): Review!
  }

`;

const repositories = [
  {
    id: 'jaredpalmer.formik',
    fullName: 'aredpalmer/formik',
    description: 'Build forms in React, without the tears',
    language: 'TypeScript',
    forksCount: 1589,
    stargazersCount: 21553,
    ratingAverage: 88,
    reviewCount: 4,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
  },
  {
    id: 'rails.rails',
    fullName: 'rails/rails',
    description: 'Ruby on Rails',
    language: 'Ruby',
    forksCount: 18349,
    stargazersCount: 45377,
    ratingAverage: 100,
    reviewCount: 2,
    ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/4223?v=4',
  },
  {
    id: 'django.django',
    fullName: 'django/django',
    description: 'The Web framework for perfectionists with deadlines.',
    language: 'Python',
    forksCount: 21015,
    stargazersCount: 48496,
    ratingAverage: 73,
    reviewCount: 5,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/27804?v=4',
  },
  {
    id: 'reduxjs.redux',
    fullName: 'reduxjs/redux',
    description: 'Predictable state container for JavaScript apps',
    language: 'TypeScript',
    forksCount: 13902,
    stargazersCount: 52869,
    ratingAverage: 0,
    reviewCount: 0,
    
    ownerAvatarUrl: 'https://avatars3.githubusercontent.com/u/13142323?v=4',
  },
];

const users = [
  { id: '1', username: 'alice', email: 'alice@example.com', password: 'password123' },
  { id: '2', username: 'bob', email: 'bob@example.com', password: 'password456' },
];
const reviews = [];
let nextReviewId = 1;
const resolvers = {

  Query: {
    
    
repositories: (_, { first = 30, orderBy = 'CREATED_AT', orderDirection = 'DESC', searchKeyword }) => {
  let filteredRepositories = [...repositories];

  if (searchKeyword) {
    filteredRepositories = filteredRepositories.filter((repo) =>
      repo.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  const sortedRepositories = [...filteredRepositories].sort((a, b) => {
    
    let comparison = 0;

    if (orderBy === 'RATING_AVERAGE') {
      comparison = a.ratingAverage - b.ratingAverage;
    } else if (orderBy === 'CREATED_AT') {
      const getFirstReviewDate = (repository) => {
        const dates = reviews
          .filter((review) => review.repositoryId === repository.id)
          .map((review) => new Date(review.createdAt).getTime());

        return dates.length ? Math.min(...dates) : 0;
      };

      comparison = getFirstReviewDate(a) - getFirstReviewDate(b);
    }

    return orderDirection === 'DESC' ? -comparison : comparison;
  });

  return {
    edges: sortedRepositories
      .slice(0, Math.max(0, first))
      .map((node) => ({ node })),
  };
},



    users: () =>
      users.map(({ id, username, email }) => ({
        id,
        username,
        email,
      })),

    me: (_, __, { user }) => {
      if (!user) {
        return null;
      }
      
     const hn = reviews.filter((review) => review.user.id === user.id) .map((node) => ({ node }));



      return {
        id: user.id,
        username: user.username,
        reviews: {
  edges: hn
}
       
      };
    },

    repository: (_, { id }) => {

      return repositories.find((repo) => repo.id === id) || null;
    },
    
  },

 Repository: {
  url: (repository) =>
    `https://github.com/${repository.fullName}`,

  reviews: (repository, { first, after }) => {
    const repositoryReviews = reviews.filter(
      (review) => review.repositoryId === repository.id,
    );
    const startIndex = after == null
      ? 0
      : repositoryReviews.findIndex((review) => review.id === after) + 1;

    if (after != null && startIndex === 0) {
      throw new Error(`Review cursor "${after}" was not found`);
    }
    if (first != null && first < 1) {
      throw new Error('The first argument must be greater than zero');
    }

    const pageSize = first ?? repositoryReviews.length;
    const page = repositoryReviews.slice(startIndex, startIndex + pageSize + 1);
    const hasNextPage = page.length > pageSize;
    const edges = page.slice(0, pageSize).map((node) => ({
      node,
      cursor: node.id,
    }));

    return {
      edges,
      pageInfo: {
        endCursor: edges.at(-1)?.cursor ?? null,
        hasNextPage,
      },
    };
  },
  
},
  
  
Mutation: {
deleteReview: (_, { id }, context = {}) => {
  const { user } = context;
  if (!user) {
    throw new Error('Not authenticated');
  }

  const foundReview = reviews.find((r) => r.id === id);

  if (!foundReview) {
    throw new Error('Review not found');
  }

  if (foundReview.user.id !== user.id) {
    throw new Error('Review does not belong to user');
  }

  const index = reviews.findIndex((r) => r.id === id);
  reviews.splice(index, 1);

  const repository = repositories.find(
    (r) => r.id === foundReview.repositoryId
  );

  if (repository) {
    repository.reviewCount -= 1;
  }

  return foundReview;
},

    

    createReview: (_, { review }, { user }) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { ownerName, repositoryName, rating, text } = review;

  const repository = repositories.find(
    (repo) =>
      repo.fullName === `${ownerName}/${repositoryName}`,
  );

  if (!repository) {
    throw new Error('Repository not found');
  }

  if (!Number.isInteger(rating) || rating < 0 || rating > 100) {
    throw new Error('Rating must be an integer between 0 and 100');
  }

  const newReview = {
    id: String(nextReviewId++),
    text: text || '',
    rating,
    createdAt: new Date().toISOString(),
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    repositoryId: repository.id,
  };

  reviews.push(newReview);

  repository.reviewCount += 1;

  return newReview;
},
    createUser: (_, { username, password }) => {
      const normalizedUsername = username.trim();
      const existingUser = users.find(
        (user) => user.username === normalizedUsername,
      );

      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: String(users.length + 1),
        username: normalizedUsername,
        password,
      };

      users.push(newUser);

      return {
        id: newUser.id,
        username: newUser.username,
      };
    },
    login: (_, { username, password }) => {
      const user = users.find(
        (item) => item.username === username && item.password === password,
      );

      if (!user) {
        throw new Error('Invalid username or password');
      }

      const accessToken = JWT.sign(
  {
    userId: user.id,
    username: user.username,
  },
  jwtSecret,
  {
    expiresIn: '1h',
  }
);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken,
      };
    },
    authenticate: (_, { code }) => {
      if (!code) {
        throw new Error('GitHub auth code is required');
      }

      const user = users[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    },
    authorize: (_, { code }) => {
      return resolvers.Mutation.authenticate(_, { code });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const { url } = await startStandaloneServer(server, {
  listen: { host: '0.0.0.0', port: 4000 },
  context: async ({ req }) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return { user: null };
    }

    const token = authorization.replace('Bearer ', '');

    try {
      const decoded = JWT.verify(token, jwtSecret);

      const user = users.find((u) => u.id === decoded.userId);

      return { user };
    } catch {
      return { user: null };
    }
  },
});

console.log(`GraphQL server ready at ${url}`);
