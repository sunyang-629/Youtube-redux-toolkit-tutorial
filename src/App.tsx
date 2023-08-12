import "./App.css";
// lesson 1
// import Counter from "./features/counter/Counter";
// lesson 2
import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";

function App() {
  return (
    <>
      <h1>Redux toolkit tutorial</h1>
      {/* <Counter /> */}
      <AddPostForm />
      <PostsList />
    </>
  );
}

export default App;
