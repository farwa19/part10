import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Recommend from './components/Recommend'
import NewBook from './components/NewBook'
import {
  useApolloClient,
  useQuery,
  useSubscription,
} from '@apollo/client/react'

import {ALL_BOOKS  , BOOK_ADDED, ALL_AUTHORS } from './queries'
import LoginForm from './components/LoginForm'
import {  addBookToCache} from './utils/apolloCache'
import Notify from './components/Notify'
const App = () => {
  const [page, setPage] = useState('authors')
  const result = useQuery(ALL_AUTHORS)
  const [errorMessage, setErrorMessage] = useState(null)
  const booksResult = useQuery(ALL_BOOKS)
  const client = useApolloClient()
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )

  const notify = (message, type = 'error') => {
    setErrorMessage({ text: message, type })
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`, 'success')
      addBookToCache(client.cache, addedBook)
    },
  })

  if (result.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (result.error || booksResult.error) {
    return <div>{(result.error || booksResult.error).message}</div>
  }
   if (!token) {
    return (
      <div>
         <div>
  <button onClick={() => setPage('authors')}>authors</button>
  <button onClick={() => setPage('books')}>books</button>
   <button onClick={() => setPage('login')}>login</button>
 
</div>
    
        {page === 'login' && <>
        <h2>Login</h2>
        <LoginForm
  setToken={(token) => {
    setToken(token)
    setPage('authors')
  }}
  setError={notify}
/>
        </>}
        {errorMessage && <Notify errorMessage={errorMessage} />}
        <Authors
  persons={result.data.allAuthors}
  show={page === 'authors'}
  canEdit={false}
/>

<Books
  books={booksResult.data.allBooks}
  show={page === 'books'}
/>

      </div>
      
    )
  }

  return (
    <div>
     <div>
  <button onClick={() => setPage('authors')}>authors</button>
  <button onClick={() => setPage('books')}>books</button>
  <button onClick={() => setPage('add')}>add book</button>
   <button onClick={() => setPage('recommend')}>recommend</button>
    <button onClick={onLogout}>logout</button>

</div>

{errorMessage && <Notify errorMessage={errorMessage} />}

<Authors
  persons={result.data.allAuthors}
  show={page === 'authors'}
  canEdit={true}
/>

<Books

  show={page === 'books'}
/>

<NewBook
  show={page === 'add'}
  setPage={setPage}
/>
<Recommend 
  books={booksResult.data.allBooks}
  show={page === 'recommend'} 
/>
</div>
  )
}

export default App
