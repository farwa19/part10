import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS,EDIT_YEAR } from '../queries'
import { ME } from '../queries'
import { useMutation } from '@apollo/client/react'

const Recommend = ({ books, show }) => {
  
   const result = useQuery(ME)
    if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>{result.error.message}</div>
  }
  console.log(books)
  const selectedGenre= result.data?.me?.favoriteGenre
    console.log("in recommend", selectedGenre)

   
    const filterGenre = ({ genre }) => {
  const bookg = books.filter(book =>
    book.genres.includes(genre)
  )

  return bookg
}
const displayedBooks = selectedGenre
  ? filterGenre({ genre: selectedGenre })
  : books
  console.log(displayedBooks )

return (
  <div>
    <h2>Recommendations</h2>
    <h4>books in your favorite genre <strong>{selectedGenre}</strong></h4>
    

    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>

        {displayedBooks.map(book => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author.name}</td>
            <td>{book.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
)
}
  

export default Recommend