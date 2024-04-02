# GraphQL Chat App

Welcome to my GraphQL chat application, a real-time messaging web application built with modern web technologies. This project demonstrates my skills as a full-stack developer, focusing on creating a secure and scalable chat application.

## Features

- **Real-Time Messaging**: Instant messaging with GraphQL subscriptions.
- **Backend**: NestJS with a GraphQL API for handling CRUD operations and real-time communication.
- **Distributed Messaging**: Redis integration for handling a large number of concurrent users and messages.
- **Data Persistence**: MongoDB for efficient storage of chat data and user information.
- **Frontend**: React with Material UI for a responsive and visually appealing user interface.
- **State Management**: Apollo Client for interacting with the GraphQL API and caching data.
- **User Profile**: Ability to update user icons, stored securely on Amazon S3.
- **Deployment**: Deployed on AWS Elastic Beanstalk and Amplify with HTTPS configuration for security.

## Getting Started

To get started with this project, clone the repository and install the dependencies:

- git clone https://github.com/LouisC00/chatter-backend.git
- cd chatter-backend

## Running the Application

To run the application in development mode, use the following commands:

## Start the backend server

- cd chatter-backend
- pnpm install
- pnpm run start

## Environment Variables

Create a `.env` file in the root of the backend directory and add the following variables:

- `MONGODB_URI`: The URI for connecting to your MongoDB database.
- `DB_NAME`: The name of your database.
- `JWT_SECRET`: A secret key for JWT authentication.
- `JWT_EXPIRATION`: The expiration time for the JWT token (e.g., `1d` for 1 day).
- `PORT`: The port number on which the backend server should run.
- `AWS_ACCESS_KEY`: Your AWS access key.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
- `AWS_REGION`: The AWS region for your services.

Example `/sample.env`:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=mydatabase
JWT_SECRET=mysecretkey
JWT_EXPIRATION=1d
PORT=5000
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- **Louis** - Full-stack developer specializing in modern web technologies.

## Contact

For more details or to discuss potential opportunities, please feel free to reach out.

Thank you for exploring my GraphQL chat application. I'm excited to bring these skills to future projects and continue exploring the possibilities of modern web development.
```
