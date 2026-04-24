# File Upload API Assignment

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- AWS account with S3 bucket and IAM credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wecredit-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Application
   PROJECT_NAME=File Upload API
   IS_SERVER=development
   PORT=3000

   # HTTPS Configuration (optional)
   SERVER_CERT=path/to/cert.pem
   SERVER_KEY=path/to/key.pem

   # MongoDB
   MongoDB_HOST=localhost
   MongoDB_URI=mongodb://localhost:27017/fileupload

   # AWS S3
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=us-east-1
   AWS_STATIC_ASSET_BUCKET=your-bucket-name
   AWS_FOLDER=uploads/
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
This will start the server with hot-reload using nodemon and ts-node.

#### Production Mode
```bash
npm start
```
This will run the compiled JavaScript from the `dist/` directory.

### Testing the APIs

The server will start on the configured port (default: 3000). You can test the APIs using tools like Postman or curl.

Example curl command for file upload:
```bash
curl -X POST -F "file=@/path/to/your/file.jpg" http://localhost:3000/api/v1/files/upload
```

## Available APIs

### Health check
- `GET /api/health-check`
- Returns a health-check success response.

### File management
- `POST /api/v1/files/upload`
  - Content-Type: `multipart/form-data`
  - Field name: `file`
  - Uploads a file to AWS S3 and stores metadata in MongoDB.

- `GET /api/v1/files`
  - Returns a list of uploaded files.

- `GET /api/v1/files/:id`
  - Returns metadata for a single uploaded file.

- `DELETE /api/v1/files/:id`
  - Deletes file metadata from MongoDB.

## Features

- **TypeScript**: Full TypeScript implementation with strict type checking
- **ES6 Modules**: Modern import/export syntax for better IDE navigation
- **File Upload**: Secure file upload to AWS S3 with UUID-based naming
- **MongoDB Integration**: File metadata storage with Mongoose ODM
- **Express.js**: RESTful API with proper error handling
- **Security**: Cryptographically secure file naming and input validation
