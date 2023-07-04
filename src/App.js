import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAnecdotes, createAnecdote, updateAnecdote } from "./requests";
import { useReducer } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      return "anecdote '" + action.data + "' created";
    case "VOTE":
      return "anecdote '" + action.data + "' voted";
    case "HIDE":
      return null;
    default:
      return state;
  }
};

const App = () => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData("anecdotes");
      queryClient.setQueryData("anecdotes", anecdotes.concat(newAnecdote));
    },
  });

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
    },
  });

  const result = useQuery("anecdotes", getAnecdotes, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  console.log(result);

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    notificationDispatch({ type: "VOTE", data: anecdote.content });
    setTimeout(() => {
      notificationDispatch({ type: "HIDE" });
    }, 5000);
  };

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification notification={notification} />
      <AnecdoteForm
        newAnecdoteMutation={newAnecdoteMutation}
        notificationDispatch={notificationDispatch}
      />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
