
import { NetworkError } from "./errors.js";
function fakeAPI(data, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new NetworkError("Simulated network failure"));
      else resolve(data);
    }, 80);
  });
}

const USERS = [
  { id: 1, name: "Alice",   email: "alice@example.com"   },
  { id: 2, name: "Bob",     email: "bob@example.com"     },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

const POSTS = [
  { id: 1, userId: 1, title: "alice learns javascript" },
  { id: 2, userId: 1, title: "are closures hard?"      },
  { id: 3, userId: 2, title: "bob builds a rest api"   },
  { id: 4, userId: 2, title: "async await explained"   },
  { id: 5, userId: 3, title: "charlie tries react"     },
];

const COMMENTS = [
  { id: 1, postId: 1, body: "Great post!"   },
  { id: 2, postId: 1, body: "Very helpful." },
  { id: 3, postId: 2, body: "I agree!"      },
];

export async function fetchUsers()    { return fakeAPI(USERS);    }
export async function fetchPosts()    { return fakeAPI(POSTS);    }
export async function fetchComments() { return fakeAPI(COMMENTS); }
