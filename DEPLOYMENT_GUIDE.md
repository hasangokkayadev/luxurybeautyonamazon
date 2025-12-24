# Luxury Beauty on Amazon - Deployment Guide

## Project Overview

Complete Amazon Associates luxury beauty affiliate website for luxurybeautyforyourskin.com

## Technology Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Hosting**: Shared hosting via FTP
- **API**: Amazon Product Advertising API

---

## PHASE 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: `luxurybeauty-amazon` (or your choice)
4. Disable Google Analytics (Spark plan requirement)
5. Create project

### 1.2 Enable Firebase Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. Save

### 1.3 Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose location closest to your users
5. Create database

### 1.4 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (</>) to add web app
4. Register app name: `luxurybeautyforyourskin`
5. Copy the `firebaseConfig` object
6. Update `public_html/js/firebase-config.js` with your credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

---

## PHASE 2: Deploy Firestore Rules

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase

```bash
firebase login
```

### 2.3 Initialize Firebase in Project

```bash
cd firebase
firebase init
```

- Select: Firestore, Functions
- Use existing project: select your project
- Accept default file names
- Install dependencies: Yes

### 2.4 Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

---

## PHASE 3: Setup Amazon Product Advertising API

### 3.1 Get Amazon PA-API Credentials

1. Go to https://affiliate-program.amazon.com/
2. Sign in to Amazon Associates
3. Go to **Tools** → **Product Advertising API**
4. Request access (if not already approved)
5. Once approved, get:
   - Access Key
   - Secret Key
   - Associate Tag (Tracking ID)

### 3.2 Configure Cloud Functions

```bash
cd firebase/functions
npm install
```

### 3.3 Set Environment Variables

```bash
firebase functions:config:set amazon.access_key="YOUR_ACCESS_KEY"
firebase functions:config:set amazon.secret_key="YOUR_SECRET_KEY"
firebase functions:config:set amazon.partner_tag="YOUR_ASSOCIATE_TAG"
firebase functions:config:set admin.token="YOUR_SECURE_RANDOM_TOKEN"
```

### 3.4 Deploy Cloud Functions

```bash
firebase deploy --only functions
```

---

## PHASE 4: Update Affiliate Links

### 4.1 Replace Affiliate Tag

In the following files, replace `YOUR_AFFILIATE_TAG` with your actual Amazon Associate Tag:

- `public_html/js/product.js`
- `public_html/js/cart.js`

Search for: `tag=YOUR_AFFILIATE_TAG`
Replace with: `tag=yourtag-20` (your actual tag)

---

## PHASE 5: FTP Upload to Shared Hosting

### 5.1 Prepare Files

Upload the entire `public_html` folder contents to your hosting's `public_html` directory:

```
public_html/
├── index.html
├── category.html
├── product.html
├── cart.html
├── login.html
├── about.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── .htaccess
├── css/
│   └── styles.css
├── js/
│   ├── firebase-config.js (with your credentials)
│   ├── auth.js
│   ├── login.js
│   ├── category.js
│   ├── product.js
│   └── cart.js
└── images/
    └── placeholder.jpg
```

### 5.2 FTP Upload Steps

1. Connect to your hosting via FTP client (FileZilla, etc.)
2. Navigate to `public_html` directory
3. Upload all files maintaining folder structure
4. Verify file permissions (644 for files, 755 for directories)

---

## PHASE 6: Trigger Product Updates

### 6.1 Manual Product Update (Option A - Callable Function)

Use Firebase Console or create admin page to call:

```javascript
const updateProducts = firebase
  .functions()
  .httpsCallable("updateLuxuryProducts");
updateProducts().then((result) => console.log(result));
```

### 6.2 Manual Product Update (Option B - HTTP Request)

```bash
curl -X POST \
  https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/updateProductsHTTP \
  -H "Authorization: Bearer YOUR_SECURE_RANDOM_TOKEN"
```

Replace:

- `YOUR_REGION`: e.g., `us-central1`
- `YOUR_PROJECT_ID`: your Firebase project ID
- `YOUR_SECURE_RANDOM_TOKEN`: token you set in functions config

---

## PHASE 7: Testing

### 7.1 Test Authentication

1. Visit your site
2. Click "Login"
3. Create account
4. Verify login/logout works
5. Test "Delete Account" feature

### 7.2 Test Cart Functionality

1. Login
2. Browse categories
3. Add products to cart
4. View cart
5. Click "View on Amazon" links
6. Verify affiliate tag in URLs

### 7.3 Test Product Updates

1. Trigger Cloud Function
2. Check Firestore console for products collection
3. Verify product data populated

---

## PHASE 8: SEO & Final Steps

### 8.1 Submit Sitemap

1. Go to Google Search Console
2. Add property: luxurybeautyforyourskin.com
3. Submit sitemap: https://luxurybeautyforyourskin.com/sitemap.xml

### 8.2 Enable HTTPS

1. Get SSL certificate from hosting provider
2. Uncomment HTTPS redirect in `.htaccess`
3. Update sitemap URLs to https://

### 8.3 Update Contact Email

In `public_html/contact.html`, update:

```html
<p><strong>Email:</strong> info@luxurybeautyforyourskin.com</p>
```

to your actual email address.

---

## Maintenance

### Update Products

Run the Cloud Function manually when you want to refresh product data:

- Recommended: Weekly or bi-weekly
- Method: Use HTTP request or callable function

### Monitor Usage

- Check Firebase Console for:
  - Authentication users
  - Firestore reads/writes
  - Function invocations
- Stay within Spark plan limits

### Amazon Associates Compliance

- Ensure affiliate disclosure is visible on all pages (already in footer)
- Update product links if they expire
- Monitor Amazon Associates dashboard for performance

---

## Troubleshooting

### Firebase Connection Issues

- Verify `firebase-config.js` has correct credentials
- Check browser console for errors
- Ensure Firestore rules are deployed

### Amazon API Errors

- Verify PA-API credentials are correct
- Check rate limits (1 request per second)
- Ensure Associate Tag is active

### FTP Upload Issues

- Verify file permissions
- Check .htaccess syntax
- Ensure all files uploaded completely

---

## Support Resources

- Firebase Documentation: https://firebase.google.com/docs
- Amazon PA-API Documentation: https://webservices.amazon.com/paapi5/documentation/
- Amazon Associates Program: https://affiliate-program.amazon.com/

---

## Project Complete

Your luxury beauty affiliate website is now fully deployed and operational!
