
import { fetchDashboardData, fetchPostsForUser, searchPosts } from "./api.js";
import { fetchWithCache }                                      from "./cache.js";
import { fetchUsers }                                          from "./mockData.js";
import { debounce, throttle }                                  from "./utils.js";

async function main() {
  console.log("========== API DASHBOARD ==========\n");

  const { users, posts, comments } = await fetchDashboardData();
  console.log(`Users   : ${users.length}`);
  console.log(`Posts   : ${posts.length}`);
  console.log(`Comments: ${comments.length}`);

  console.log("\n-- Posts for User 1 --");
  const userPosts = await fetchPostsForUser(1, posts);
  userPosts.forEach(p => console.log(`  - ${p.title}`));

  console.log("\n-- Cache Test --");
  await fetchWithCache("users", fetchUsers); 
  console.log("\n-- Debounce Search --");
  const debouncedSearch = debounce((keyword) => {
    const results = searchPosts(keyword, posts);
    console.log(`[search] "${keyword}" → ${results.length} result(s)`);
    results.forEach(p => console.log(`  - ${p.title}`));
  }, 300);

  debouncedSearch("a");
  debouncedSearch("ar");
  debouncedSearch("are"); 
  await new Promise(r => setTimeout(r, 400)); 

  console.log("\n-- Throttle Scroll --");
  let page = 1;
  const onScroll = throttle(() => {
    console.log(`[scroll] Loading page ${page++}...`);
  }, 1000);

  onScroll(); 
  onScroll(); 
  onScroll(); 
  await new Promise(r => setTimeout(r, 1100));
  onScroll(); 
  console.log("\n-- Custom Error --");
  try {
    await fetchPostsForUser(999, posts);
  } catch (err) {
    console.log(`${err.name}: ${err.message}`);
  }

  console.log("\n========== DONE ==========");
}
main();
