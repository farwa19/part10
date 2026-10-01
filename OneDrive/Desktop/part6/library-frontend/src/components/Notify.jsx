const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  const style = errorMessage.type === 'success'
    ? { color: 'green' }
    : { color: 'red' }

  return <div style={style}>{errorMessage.text}</div>
}

export default Notify