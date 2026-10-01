import { useState } from 'react' 
import { useQuery } from '@apollo/client/react' 
import { ALL_BOOKS } from '../queries'
const Books = ({ show }) => {

 
  const [selectedGenre, setSelectedGenre] = useState(null)
const result = useQuery(ALL_BOOKS, { variables: { genre: selectedGenre } })
   if (!show) {
    return null
  }
console.log(result,"result")
const books = result.data.allBooks 
console.log(Books,"ahxsj")
const uniqueGenres = [ ...new Set( books.flatMap(book => book.genres) ) ]
const filterGenre = ({ genre }) => {
  const bookg = books.filter(book =>
    book.genres.includes(genre)
  )

  return bookg
}

const displayedBooks = selectedGenre
  ? filterGenre({ genre: selectedGenre })
  : books
return (
  <div>
    <h2>books</h2>
    {selectedGenre && <p>in genre {selectedGenre}</p>}
    

    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>

        {displayedBooks .map(book => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author.name}</td>
            <td>{book.published}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div>
    <button onClick={() => setSelectedGenre(null)}>all genres</button>
    {uniqueGenres.map(genre => (
  <button
    key={genre}
    onClick={() => setSelectedGenre(genre)}
  >
    {genre}
  </button>
))}
        </div>
    
    </div>
  
)


}

export default Books
