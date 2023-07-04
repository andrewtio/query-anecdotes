import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const AnecdoteForm = ({ newAnecdoteMutation }) => {
  const [notification, dispatch] = useContext(NotificationContext);
  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content < 5) {
      return <div>Must be at least 5 characters long</div>;
    }
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          dispatch({
            type: "SHOW",
            data: `Anecdote "${content}" created`,
          });
          setTimeout(() => {
            dispatch({ type: "HIDE" });
          }, 5000);
        },
        onError: () => {
          dispatch({
            type: "SHOW",
            data: "too short anecdote, must have length 5 or more",
          });
          setTimeout(() => {
            dispatch({ type: "HIDE" });
          }, 5000);
        },
      }
    );
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
