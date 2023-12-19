import { useQuery, useMutation } from '@tanstack/react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
  });

  // const updateMutation = useMutation((updatePost) => updatePost(post.id));
  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>Error!</h3>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>
        Delete
      </button>{' '}
      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>Error deleting the post</p>
      )}
      {deleteMutation.isPending && (
        <p style={{ color: 'purple' }}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has (not) been deleted</p>
      )}
      {updateMutation.isError && (
        <p style={{ color: 'red' }}>Error Updating the post</p>
      )}
      {updateMutation.isPending && (
        <p style={{ color: 'purple' }}>Updating the post</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has (not) been updated</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
