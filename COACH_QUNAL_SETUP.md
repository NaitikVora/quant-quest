# 🤖 Coach Qunal Setup Guide

## Overview
Coach Qunal is an AI-powered quantitative finance coach integrated into QuantQuest, powered by Anthropic's Claude API. This guide will help you set up the chatbot for full functionality.

## Prerequisites
- Node.js and npm installed
- Anthropic API account

## Step 1: Get Your Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key (it starts with `sk-ant-`)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the project root directory:
   ```bash
   touch .env
   ```

2. Add your API key to the `.env` file:
   ```bash
   VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
   ```

3. **Important**: Never commit the `.env` file to version control. It should already be in `.gitignore`.

## Step 3: Restart the Development Server

1. Stop the current development server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

## Step 4: Test the Integration

1. Open your browser to `http://localhost:8080`
2. Look for the floating chat bubble in the bottom-right corner
3. Click on it to open Coach Qunal
4. Try asking a question like: "What's the difference between alpha and beta?"

## Features

### ✅ What's Included
- **Floating Chat Widget**: Always accessible from any page
- **Session Management**: Conversations persist during your session
- **Rate Limiting**: Prevents API abuse
- **Error Handling**: Graceful fallbacks for API issues
- **Responsive Design**: Works on desktop and mobile
- **Expert Knowledge**: Specialized in quantitative finance

### 🎯 Coach Qunal's Expertise
- Quantitative finance fundamentals
- Trading strategies and algorithms
- Risk management and portfolio theory
- Mathematical concepts (stochastic calculus, linear algebra)
- Programming for finance (Python, R, MATLAB)
- Career guidance in quantitative finance
- Financial modeling and valuation

## Troubleshooting

### Common Issues

**1. "API key not found" error**
- Ensure your `.env` file is in the project root
- Check that the variable name is exactly `VITE_ANTHROPIC_API_KEY`
- Restart the development server after adding the key

**2. "Rate limit exceeded" error**
- The chatbot has built-in rate limiting (1 request per second)
- Wait a moment before sending another message

**3. Chat widget not appearing**
- Check browser console for errors
- Ensure all dependencies are installed: `npm install`
- Verify the development server is running

**4. API errors**
- Check your Anthropic account has sufficient credits
- Verify the API key is valid and active
- Check Anthropic's status page for service issues

### Demo Mode
If no API key is configured, the chatbot will show a demo mode with sample responses. This allows you to see the interface without requiring an API key.

## Security Notes

- **Never share your API key** publicly
- **Keep your `.env` file secure** and never commit it to version control
- **Monitor your API usage** in the Anthropic console
- **Use environment-specific keys** for development vs production
- **Browser Usage**: The chatbot uses `dangerouslyAllowBrowser: true` for client-side operation. This is safe for development but consider server-side implementation for production

## Cost Considerations

- Anthropic charges per API call
- Monitor your usage in the Anthropic console
- Consider implementing usage limits for production deployments
- The current implementation includes rate limiting to help manage costs

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the browser console for errors
3. Verify your API key and environment setup
4. Check Anthropic's documentation for API-specific issues

---

**Happy learning with Coach Qunal! 🚀**
