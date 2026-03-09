
import { fetchUsers, fetchPosts, fetchComments } from "./mockData.js";
import { fetchWithCache }                        from "./cache.js";
import { NotFoundError }                         from "./errors.js";

export async function fetchDashboardData() {
  const results = await Promise.allSettled([
    fetchWithCache("users",    fetchUsers),
    fetchWithCache("posts",    fetchPosts),
    fetchWithCache("comments", fetchComments),
  ]);

  const [usersResult, postsResult, commentsResult] = results;

  // Log any failures
  if (usersResult.status    === "rejected") console.log("Users failed:",    usersResult.reason.message);
  if (postsResult.status    === "rejected") console.log("Posts failed:",    postsResult.reason.message);
  if (commentsResult.status === "rejected") console.log("Comments failed:", commentsResult.reason.message);

  return {
    users:    usersResult.value    || [],
    posts:    postsResult.value    || [],
    comments: commentsResult.value || [],
  };
}

export async function fetchPostsForUser(userId, allPosts) {
  const userPosts = allPosts.filter(p => p.userId === userId);
  if (userPosts.length === 0) throw new NotFoundError(`No posts for user ${userId}`);
  return userPosts;
}

export function searchPosts(keyword, posts) {
  return posts.filter(p =>
    p.title.toLowerCase().includes(keyword.toLowerCase())
  );
}
