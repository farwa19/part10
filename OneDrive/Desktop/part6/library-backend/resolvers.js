const { GraphQLError } = require('graphql')
const Book = require('./models/books')
const Author = require('./models/authors')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/




const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments({}),
    authorCount: async () => Author.countDocuments({}),
    allBooks: async (root, args) => {
      const filters = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        filters.author = args.author
      }

      if (args.genre) {
        filters.genres = args.genre
      }

      return Book.find(filters)
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser || null,
  },


  
Mutation: {
  addBook: async (root, args, context) => {
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      })
    }

    if (args.title.length < 3) {
      throw new GraphQLError(
        `title is very short: ${args.title}`,
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        }
      )
    }

    if (args.author.length < 3) {
      throw new GraphQLError(
        `Author name is very short: ${args.author}`,
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        }
      )
    }

    const nameExists = await Book.exists({
      title: args.title,
    })

    if (nameExists) {
      throw new GraphQLError(
        `title must be unique: ${args.title}`,
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        }
      )
    }

    const author = await Author.findOneAndUpdate(
      { name: args.author },
      { $setOnInsert: { name: args.author } },
      { upsert: true, new: true }
    )

    const book = new Book({
      ...args,
      author: author._id,
    })

    const savedBook = await book.save()

    pubsub.publish('BOOK_ADDED', {
      bookAdded: savedBook,
    })

    return savedBook
  },

  editAuthor: async (root, args, context) => {
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      })
    }

    return Author.findOneAndUpdate(
      { name: args.name },
      { born: args.setBornTo },
      { new: true }
    )
  },

  createUser: async (root, args) => {
    const user = new User({
      username: args.username,
      favoriteGenre: args.favoriteGenre,
    })

    return user.save().catch(error => {
      throw new GraphQLError(
        `Creating the user failed: ${error.message}`,
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        }
      )
    })
  },

  login: async (root, args) => {
    const user = await User.findOne({
      username: args.username,
    })

    if (!user || args.password !== 'secret') {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return {
      value: jwt.sign(
        userForToken,
        process.env.JWT_SECRET
      ),
    }
  },

  _resetDatabase: async () => {
    if (process.env.NODE_ENV !== 'test') {
      throw new GraphQLError(
        '_resetDatabase is only available in test mode'
      )
    }

    await Author.deleteMany({})
    await Book.deleteMany({})
    await User.deleteMany({})

    return true
  },
},

Subscription: {
  bookAdded: {
    subscribe: () =>
      pubsub.asyncIterableIterator('BOOK_ADDED'),
  },
},

Book: {
  id: root => root._id.toString(),

  author: async root => {
    return Author.findById(root.author)
  },
},




  Author: {
  id: (root) => root._id.toString(),

  bookCount: async (root) => {
    return Book.countDocuments({ author: root._id })
  },
},

  User: {
    id: (root) => root._id.toString(),
  },
}

module.exports = resolvers