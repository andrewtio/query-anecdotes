const AnecdoteForm = ({ newAnecdoteMutation }) => {
  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content < 5) {
      return <div>Must be at least 5 characters long</div>;
    }
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
