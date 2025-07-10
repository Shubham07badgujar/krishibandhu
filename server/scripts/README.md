# KrishiBandhu Server Scripts

This directory contains various utility scripts for managing the KrishiBandhu application database and performing diagnostics.

## Database Scripts

### 1. `seedComprehensiveSchemes.js`
- Adds 50 detailed agricultural schemes to the database
- Covers 10 different scheme categories (Subsidy, Credit, Insurance, etc.)
- Includes both Pan India (42) and state-specific (14) schemes
- Each scheme has complete metadata: title, description, eligibility, year launched, implementing agency, and more

Usage:
```
node scripts/seedComprehensiveSchemes.js
```

### 2. `seedSchemes.js` and `seedSchemesImproved.js`
- Basic script to seed sample schemes to the database
- Improved version includes more metadata

Usage:
```
node scripts/seedSchemes.js
```

## Diagnostic Scripts

### 1. `verifySchemes.js`
- Comprehensive verification of the scheme database
- Checks categories, states, and temporal distribution
- Tests common search queries
- Verifies presence of key schemes

Usage:
```
node scripts/verifySchemes.js
```

### 2. `checkSchemes.js`
- Simple script to check what schemes are in the database
- Lists each scheme with basic information

Usage:
```
node scripts/checkSchemes.js
```

### 3. `diagnoseSchemes.js`
- Diagnostic tool for troubleshooting scheme database issues
- Shows distinct values for key fields
- Tests queries with pagination

Usage:
```
node scripts/diagnoseSchemes.js
```

### 4. `addMoreSchemes.js`
- Adds additional test schemes to the database
- Useful for testing the admin dashboard and user-facing schemes section

Usage:
```
node scripts/addMoreSchemes.js
```

### 5. `testSchemeAPI.js`
- Tests the scheme API endpoints
- Verifies filtering, pagination, and search functionality
- Requires the server to be running

Usage:
```
node scripts/testSchemeAPI.js
```

## Environment

All scripts expect a `.env` file in the server directory with the MongoDB connection string.
The default database name used is `krishibandhu1`.

Example `.env` content:
```
MONGO_URI=mongodb://localhost:27017/krishibandhu1
```
