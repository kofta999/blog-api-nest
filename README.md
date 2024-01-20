Here's a high-level overview of the features you might want to implement:

1. **User Authentication**: Users should be able to register and log in. You can use Passport.js with JWT strategy for this.

2. **Post Creation**: Authenticated users should be able to create a new blog post. Each post would have a title, body, author (the authenticated user), and timestamps for creation and updates.

3. **Post Retrieval**: Users should be able to retrieve posts. You might want to provide several endpoints for this, such as getting a single post by ID, getting all posts by a specific user, or getting all posts in the system.

4. **Post Update**: Authenticated users should be able to update their own posts.

5. **Post Deletion**: Authenticated users should be able to delete their own posts.

6. **Comments**: Users should be able to comment on posts. Like posts, comments would have an author and timestamps. You might also want to allow users to update and delete their own comments.

7. **Likes**: Users should be able to "like" posts. You'll need to keep track of which users have liked which posts to prevent a user from liking a post multiple times.

Remember to use NestJS's features effectively. For example, you can use Modules to organize your code into the User, Post, and Comment modules. You can use Guards to protect routes that should only be accessible to authenticated users. You can use Interceptors to transform the response data before sending it to the user.