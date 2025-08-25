# Deploying SoF Event Extractor Backend on Netlify

## Overview

This guide explains how to deploy the SoF Event Extractor backend on Netlify using serverless functions. The backend has been adapted to run as a Netlify Function, which provides a serverless environment for handling API requests.

## Setup

### Files Structure

- `netlify/functions/api.js` - The serverless function that handles API requests
- `netlify/functions/formParser.js` - Helper utility for parsing multipart form data
- `netlify.toml` - Configuration file for Netlify deployment
- `netlify-build.js` - Build script to ensure Netlify Functions directory is properly created
- `package.json` - Updated with required dependencies for serverless functions

### How It Works

1. The frontend makes API calls to `/api/*` endpoints
2. Netlify redirects these requests to the serverless function at `/.netlify/functions/api`
3. For file uploads, the `formParser.js` utility parses the multipart form data
4. The serverless function processes the request and returns a response

## Deployment Steps

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Connect your repository to Netlify**:
   - Log in to Netlify
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Deploy your site**:
   - Click "Deploy site"
   - Netlify will build and deploy your site

4. **Verify deployment**:
   - Once deployed, visit your site URL
   - Test the API endpoints at `/api/health` and `/api/process`

## Local Development

To test the serverless functions locally:

1. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Run the development server:
   ```
   netlify dev
   ```

3. Your site will be available at `http://localhost:8888` with the serverless functions accessible at `/api/*`

## Limitations

- The serverless function currently returns sample data instead of processing actual files
- File uploads are limited to 10MB in the free tier of Netlify Functions
- Execution time is limited to 10 seconds in the free tier
- For production use with larger files or longer processing times, you would need to implement file processing within the serverless function or connect to an external service

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Serverless HTTP Package](https://github.com/dougmoscrop/serverless-http)
- [Express.js Documentation](https://expressjs.com/)