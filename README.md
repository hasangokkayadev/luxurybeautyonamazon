# Luxury Beauty on Amazon

Production-ready Amazon Associates luxury beauty affiliate website.

## Features

✅ **Complete Frontend**

- Responsive HTML/CSS/JavaScript
- 3 luxury product categories
- 15 curated premium products
- Clean, minimal design

✅ **Firebase Backend (Spark Plan Safe)**

- Email/Password authentication
- Firestore database
- Cloud Functions for Amazon PA-API
- Secure cart management

✅ **Amazon Associates Integration**

- Product Advertising API integration
- Automated product updates
- Affiliate link tracking
- Amazon compliance

✅ **SEO Optimized**

- Semantic HTML
- Meta tags
- Sitemap.xml
- Robots.txt
- Clean URLs

✅ **FTP Deployment Ready**

- No build tools required
- Shared hosting compatible
- No SSH needed

## Project Structure

```
luxurybeautyforyourskin/
├── public_html/              # Upload to hosting
│   ├── index.html           # Homepage
│   ├── category.html        # Category pages
│   ├── product.html         # Product details
│   ├── cart.html            # Shopping cart
│   ├── login.html           # Authentication
│   ├── about.html           # About page
│   ├── contact.html         # Contact page
│   ├── robots.txt           # SEO
│   ├── sitemap.xml          # SEO
│   ├── .htaccess            # Server config
│   ├── css/
│   │   └── styles.css       # All styles
│   ├── js/
│   │   ├── firebase-config.js
│   │   ├── auth.js
│   │   ├── login.js
│   │   ├── category.js
│   │   ├── product.js
│   │   └── cart.js
│   └── images/
│       └── placeholder.jpg
│
├── firebase/                 # Firebase configuration
│   ├── firestore.rules      # Security rules
│   ├── firestore.indexes.json
│   ├── firebase.json
│   └── functions/
│       ├── index.js         # Cloud Functions
│       ├── package.json
│       └── .gitignore
│
├── DEPLOYMENT_GUIDE.md      # Complete setup instructions
└── README.md                # This file
```

## Quick Start

1. **Setup Firebase**

   - Create Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Update `public_html/js/firebase-config.js`

2. **Deploy Firebase**

   ```bash
   cd firebase
   firebase login
   firebase init
   firebase deploy
   ```

3. **Configure Amazon PA-API**

   ```bash
   firebase functions:config:set amazon.access_key="YOUR_KEY"
   firebase functions:config:set amazon.secret_key="YOUR_SECRET"
   firebase functions:config:set amazon.partner_tag="YOUR_TAG"
   ```

4. **Update Affiliate Links**

   - Replace `YOUR_AFFILIATE_TAG` in JS files
   - Use your Amazon Associate Tag

5. **Upload to Hosting**

   - FTP upload `public_html/` contents
   - Verify all files uploaded

6. **Test**
   - Visit your site
   - Test authentication
   - Test cart functionality
   - Verify affiliate links

## Product Categories

1. **Luxury Face Moisturizers**

   - La Mer, La Prairie, Tatcha, Augustinus Bader, Charlotte Tilbury

2. **Luxury Serums & Anti-Aging**

   - Estée Lauder, La Prairie, Dr. Barbara Sturm, SkinCeuticals, Sunday Riley

3. **Luxury Hair Tools**
   - Dyson Airwrap, Dyson Supersonic, GHD, T3, BaBylissPRO

## Amazon Compliance

✅ Affiliate disclosure on all pages (footer)
✅ No pricing claims
✅ Direct links to Amazon
✅ Proper affiliate tag usage
✅ No checkout on site

## Firebase Spark Plan Limits

- Authentication: Unlimited
- Firestore: 50K reads/day, 20K writes/day
- Cloud Functions: 125K invocations/month, 40K GB-seconds/month
- No scheduled functions (manual trigger only)

## Maintenance

**Update Products**: Run Cloud Function manually (weekly recommended)

```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/updateProductsHTTP \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Monitor**: Check Firebase Console for usage

## Support

See `DEPLOYMENT_GUIDE.md` for detailed setup instructions.

## License

Proprietary - All rights reserved
