# CCA Training Node.js Project Documentation

## Overview
This is a mock Node.js project for CCA (Cloud Computing Academy) training purposes. It demonstrates basic API endpoints for user management and data retrieval using Express.js and MongoDB.

## Installation
1. Clone the repository: `git clone https://github.com/paco/cca-training.git`
2. Navigate to the project directory: `cd cca-training`
3. Install dependencies: `npm install`
4. Set up environment variables in `.env` (e.g., `MONGODB_URI`, `PORT`)
5. Start the server: `npm start`

## Usage
- Run in development mode: `npm run dev`
- Build for production: `npm run build`
- Run tests: `npm test`

## API Endpoints
- `GET /users` - Retrieve all users
- `POST /users` - Create a new user (body: `{name, email}`)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID

## Dependencies
- express: ^4.18.0
- mongoose: ^7.0.0
- dotenv: ^16.0.0

## Contributing
Fork the repo, create a feature branch, and submit a pull request.

## License
MIT License