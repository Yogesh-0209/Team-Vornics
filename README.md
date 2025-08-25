# SoF Event Extractor

A web application for extracting events from Statement of Facts (SoF) documents in the maritime industry.

## Features

- Upload and process PDF and Word documents
- Extract maritime events with timestamps
- Detect anomalies in event sequences
- Calculate laytime and demurrage
- Responsive UI with dark mode support

## Quick Start

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend

Option 1: Run the backend locally
```bash
cd backend
python simple_server.py
```

Option 2: Deploy on Netlify (Serverless)
See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

## Deployment

### Frontend + Backend on Netlify

This project is configured to deploy both the frontend and backend on Netlify using serverless functions.

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize Netlify site (if not already done):
```bash
netlify init
```

4. Test locally:
```bash
npm run netlify:dev
```

5. Deploy to Netlify:
```bash
netlify deploy --prod
```

For more detailed instructions, see [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md).

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python) or Netlify Functions (Node.js)
- **Deployment**: Netlify (Frontend + Serverless Backend)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
