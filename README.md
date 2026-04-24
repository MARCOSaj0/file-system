# 📁 File System API

A robust TypeScript-based file upload and management API with AWS S3 integration and MongoDB storage. Built with Express.js, featuring secure file handling, comprehensive logging, and RESTful endpoints.

## 🚀 Features

- **TypeScript**: Full TypeScript implementation with strict type checking
- **ES6 Modules**: Modern import/export syntax for better IDE navigation
- **File Upload**: Secure file upload to AWS S3 with UUID-based naming
- **MongoDB Integration**: File metadata storage with Mongoose ODM
- **Express.js**: RESTful API with proper error handling and middleware
- **Security**: Cryptographically secure file naming and input validation
- **HTTPS Support**: Optional SSL/TLS encryption
- **API Logging**: Comprehensive request/response logging
- **CORS Enabled**: Cross-origin resource sharing support

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (local installation or cloud instance like MongoDB Atlas)
- AWS account with S3 bucket and IAM credentials

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/MARCOSaj0/file-system.git
cd file-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Application Configuration
PROJECT_NAME=File System API
IS_SERVER=development
PORT=5000

# HTTPS Configuration (Optional - remove for HTTP only)
SERVER_CERT=path/to/your/certificate.pem
SERVER_KEY=path/to/your/private-key.pem

# MongoDB Configuration
MONGODB_HOST=localhost
MONGODB_URI=mongodb://localhost:27017/filesystem

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_STATIC_ASSET_BUCKET=your-s3-bucket-name
AWS_FOLDER=uploads/
```

### 4. Build the Project
```bash
npm run build
```

## 🚀 Running the Application

### Development Mode (with hot-reload)
```bash
npm run dev
```
Starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
Runs the compiled JavaScript from the `dist/` directory.

## 📖 API Documentation

The API server runs on `http://localhost:5000` (or configured port).

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
- **GET** `/api/health-check`
- **Description**: Check API health status
- **Response**: `200 OK` with health status message

#### File Upload
- **POST** `/api/files/upload`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (binary file data)
- **Description**: Upload a file to AWS S3 and store metadata in MongoDB
- **Response**: File metadata with S3 URL

#### List Files
- **GET** `/api/files`
- **Description**: Retrieve list of all uploaded files
- **Response**: Array of file metadata objects

#### Get File by ID
- **GET** `/api/files/:id`
- **Description**: Get metadata for a specific file
- **Parameters**: `id` (MongoDB ObjectId)
- **Response**: Single file metadata object

#### Delete File
- **DELETE** `/api/files/:id`
- **Description**: Delete file from MongoDB and AWS S3
- **Parameters**: `id` (MongoDB ObjectId)
- **Response**: Deletion confirmation

## 🧪 Testing the APIs

### Using cURL

**Upload a file:**
```bash
curl -X POST \
  -F "file=@/path/to/your/file.jpg" \
  http://localhost:5000/api/files/upload
```

**List all files:**
```bash
curl http://localhost:5000/api/files
```

**Get specific file:**
```bash
curl http://localhost:5000/api/files/YOUR_FILE_ID
```

**Delete a file:**
```bash
curl -X DELETE http://localhost:5000/api/files/YOUR_FILE_ID
```

### Using Postman
1. Import the collection or create requests manually
2. Set base URL to `http://localhost:5000/api`
3. Use appropriate HTTP methods and endpoints as documented above

## 🏗️ Project Structure

```
file-system/
├── app.ts                 # Main application entry point
├── config/                # Configuration files
│   ├── index.ts          # Environment variables
│   ├── database.ts       # MongoDB connection
│   ├── httpConst.ts      # HTTP status constants
│   └── commonConst.ts    # Common constants
├── controller/           # Request handlers
│   ├── fileController.ts # File operations
│   └── healthCheck.ts    # Health check endpoint
├── model/               # Database models
│   └── files.ts         # File schema
├── routes/              # API routes
│   ├── index.ts         # Route aggregator
│   ├── files.ts         # File routes
│   └── healthCheck.ts   # Health check route
├── service/             # Business logic
│   ├── awsSdk.ts        # AWS S3 operations
│   └── util.ts          # Utility functions
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## 🔧 Configuration Details

### AWS S3 Setup
1. Create an S3 bucket in your AWS account
2. Create an IAM user with S3 permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
3. Generate access keys for the IAM user
4. Update your `.env` file with the credentials

### MongoDB Setup
- **Local**: Install MongoDB and start the service
- **Cloud**: Use MongoDB Atlas or similar service
- Update `MONGODB_URI` in your `.env` file

### HTTPS Setup (Optional)
- Obtain SSL certificate and private key files
- Update `SERVER_CERT` and `SERVER_KEY` paths in `.env`
- The app will automatically use HTTPS if certificates are provided

## 📊 API Logging

All API requests are automatically logged with:
- Timestamp (ISO format)
- HTTP method and URL
- Response status code
- Response time in milliseconds

Example log output:
```
[2026-04-24T10:30:00.000Z] POST /api/files/upload - 201 - 2450ms
[2026-04-24T10:30:05.000Z] GET /api/files - 200 - 150ms
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 5000
lsof -ti:5000
# Kill the process
kill -9 <PID>
```

**MongoDB connection failed:**
- Ensure MongoDB is running locally or check cloud connection string
- Verify network connectivity for cloud databases

**AWS S3 upload failed:**
- Check AWS credentials in `.env`
- Verify S3 bucket permissions
- Ensure bucket exists and is in the correct region

**TypeScript compilation errors:**
```bash
npm run build
```
Check for any missing dependencies or type errors.

### Development Tips
- Use `npm run dev` for development with auto-restart
- Check logs in the terminal for debugging information
- Use Postman or similar tools for API testing
- Monitor MongoDB and AWS S3 consoles for data verification

## 📄 Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (if implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**MARCOSaj0**

---

⭐ Star this repo if you found it helpful!
