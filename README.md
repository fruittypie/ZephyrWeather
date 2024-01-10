## Zephyr Weather
#### Description:
 The project is a user-friendly weather forecast and news application, offering real-time weather updates, interactive maps, and personalized news content to keep users informed in one accessible platform.
## Why I built the project this way
- My plan is to become a full-stack developer eventually. But for the beginning I focus on the frontend. That’s why I decided to use existing APIs rather to create a custom server. I have basic backend knowledge as well.
- In terms of state management, I opted for a pragmatic approach, using **`useState`** for simplicity rather than incorporating Redux. This decision aligns with the project's scope and my focus on frontend proficiency.
- Additionally, I employed **`localStorage`** for client-side storage, providing a straightforward solution for persisting data locally within the browser. This choice preserves basic information across sessions without the need for complex server-side storage.
- For backend security, I implemented industry-standard practices. The registration and authentication processes are fortified using **`bcrypt`** for password hashing, **`jsonwebtoken`** for secure user authentication, and **`email-validator`** for validating email formats. Additionally, API keys are securely stored on the backend, minimizing exposure and enhancing overall security measures.
## If I had time I would change this
- Testing is an essential part of production applications. I plan to cover the essential features of the app with tests.
- I plan to explore further security measures, implement the email verification.
- Optimize API calls (implement caching mechanisms, minimize unnecessary data transfer) for improved performance.
- Improve CSS Scaling and Responsiveness. A crucial aspect would be to fine-tune the CSS for responsive design, ensuring the website's compatibility across various device sizes. This involves adjustments to layout, styling to guarantee an optimal viewing experience on different screens.
  
