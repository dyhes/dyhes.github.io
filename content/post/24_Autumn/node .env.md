---
title: 【Node】.env
date: 2024-09-12 00:00:00+0000
categories: 
    - nutrition
tags:
   -  Node
---

## Basic

Using a `.env` file is a great practice for managing environment variables in a Node.js project. 

```typescript
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// usage
process.env.IMGBB_API_KEY
```

## Process

Now, let's go through the changes and additional steps to set up the `.env` file:

1. First, install the `dotenv` package:
   ```
   npm install dotenv @types/dotenv
   ```

2. Create a `.env` file in the root of your project with the following content:
   ```
   IMGBB_API_KEY=your_actual_api_key_here
   MARKDOWN_DIRECTORY=./path/to/your/markdown/files
   ```

3. In the script, we've made the following changes:
   - Imported the `dotenv` package: `import * as dotenv from 'dotenv';`
   - Added `dotenv.config();` to load the environment variables.
   - Replaced the hardcoded API key with `process.env.IMGBB_API_KEY`.
   - Added error handling if the API key is not set.
   - Used `process.env.MARKDOWN_DIRECTORY` for the directory path, with a fallback.

4. Make sure to add `.env` to your `.gitignore` file to prevent committing sensitive information:
   ```
   echo ".env" >> .gitignore
   ```

