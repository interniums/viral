#!/usr/bin/env node

/**
 * Generate a secure CRON_SECRET for GitHub Actions
 */

const crypto = require('crypto')

// Generate a random 32-byte secret
const secret = crypto.randomBytes(32).toString('hex')

console.log('Generated CRON_SECRET:')
console.log('')
console.log(secret)
console.log('')
console.log('Copy this value to your GitHub repository secrets:')
console.log('1. Go to your GitHub repository')
console.log('2. Settings → Secrets and variables → Actions')
console.log('3. Click "New repository secret"')
console.log('4. Name: CRON_SECRET')
console.log('5. Value: (paste the secret above)')
console.log('')
console.log("Keep this secret secure and don't share it publicly!")
