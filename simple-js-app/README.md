# Simple JavaScript Application

This project is a simple JavaScript application that displays posts per user using data fetched from two separate services: `posts-service` and `users-service`. The application is structured to provide a clear separation of concerns, with components dedicated to displaying users and their respective posts.

## Project Structure

```
simple-js-app
├── public
│   ├── index.html        # Main HTML file
├── src
│   ├── index.js          # Entry point of the JavaScript application
│   ├── components
│   │   ├── App.js        # Main application component
│   │   ├── PostsTable.js  # Component to display posts
│   │   └── UsersTable.js  # Component to display users
├── package.json           # npm configuration file
└── README.md              # Project documentation
```

## Getting Started

To get started with this application, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd simple-js-app
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the application**:
   You can start the application using:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Features

- Displays a list of users fetched from the `users-service`.
- Displays a list of posts fetched from the `posts-service`.
- Each user is associated with their respective posts in a structured table format.

## Technologies Used

- JavaScript
- HTML
- CSS
- Fetch API for making HTTP requests
- React (if applicable, based on the component structure)

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.