
import { useState } from 'react'
import { CREATE_Book, ALL_BOOKS } from '../queries'
import { useMutation } from '@apollo/client/react'

const NewBook = ({ show, setPage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(null)

  const [createBook] = useMutation(CREATE_Book, {
    refetchQueries: [{ query: ALL_BOOKS }],
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      await createBook({
        variables: {
          title,
          author,
          published: Number(published),
          genres,
        },
      })

      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
      setError(null)

      setPage('books')
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h1>Add book</h1>

      {error && (
        <div style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          <label htmlFor="published">published</label>
          <input
            id="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>

        <div>
          <label htmlFor="genre">genre</label>
          <input
            id="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />

          <button
            onClick={addGenre}
            type="button"
          >
            add genre
          </button>
        </div>

        <div>
          genres: {genres.join(' ')}
        </div>

        <button type="submit">
          create book
        </button>
      </form>
    </div>
  )
}

export default NewBook

