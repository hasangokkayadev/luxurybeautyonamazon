const functions = require("firebase-functions");
const admin = require("firebase-admin");
const amazonPaapi = require("amazon-paapi");

admin.initializeApp();

// Amazon PA-API Configuration
// Set these as environment variables using: firebase functions:config:set
const commonParameters = {
  AccessKey: functions.config().amazon.access_key,
  SecretKey: functions.config().amazon.secret_key,
  PartnerTag: functions.config().amazon.partner_tag,
  PartnerType: "Associates",
  Marketplace: "www.amazon.com",
};

// Product categories with search keywords
const categories = {
  moisturizers: {
    name: "Luxury Face Moisturizers",
    keywords: [
      "La Mer Creme de la Mer",
      "La Prairie Skin Caviar Luxe Cream",
      "Tatcha Dewy Skin Cream",
      "Augustinus Bader Rich Cream",
      "Charlotte Tilbury Magic Cream",
    ],
  },
  serums: {
    name: "Luxury Serums & Anti-Aging",
    keywords: [
      "Estee Lauder Advanced Night Repair",
      "La Prairie Skin Caviar Liquid Lift",
      "Dr Barbara Sturm Hyaluronic Serum",
      "SkinCeuticals C E Ferulic",
      "Sunday Riley Good Genes",
    ],
  },
  hairtools: {
    name: "Luxury Hair Tools",
    keywords: [
      "Dyson Airwrap",
      "Dyson Supersonic",
      "GHD Platinum Plus",
      "T3 Lucea styling iron",
      "BaBylissPRO Nano Titanium",
    ],
  },
};

/**
 * HTTPS Callable Function to update luxury products
 * Manual trigger only - Spark plan safe
 */
exports.updateLuxuryProducts = functions.https.onCall(async (data, context) => {
  try {
    // Optional: Add authentication check
    // if (!context.auth) {
    //   throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
    // }

    const db = admin.firestore();
    const batch = db.batch();
    let productsUpdated = 0;

    // Process each category
    for (const [categoryKey, categoryData] of Object.entries(categories)) {
      console.log(`Processing category: ${categoryData.name}`);

      // Search for each product in the category
      for (const keyword of categoryData.keywords) {
        try {
          const requestParameters = {
            Keywords: keyword,
            SearchIndex: "Beauty",
            ItemCount: 1,
            Resources: [
              "Images.Primary.Large",
              "ItemInfo.Title",
              "ItemInfo.Features",
              "Offers.Listings.Price",
              "CustomerReviews.StarRating",
              "CustomerReviews.Count",
              "BrowseNodeInfo.BrowseNodes.SalesRank",
            ],
          };

          // Search for product
          const response = await amazonPaapi.SearchItems(
            commonParameters,
            requestParameters
          );

          if (
            response &&
            response.SearchResult &&
            response.SearchResult.Items
          ) {
            const item = response.SearchResult.Items[0];

            // Extract product data
            const productData = {
              asin: item.ASIN,
              name: item.ItemInfo?.Title?.DisplayValue || keyword,
              category: categoryKey,
              categoryName: categoryData.name,
              image: item.Images?.Primary?.Large?.URL || "",
              rating: parseFloat(item.CustomerReviews?.StarRating?.Value || 0),
              reviewCount: parseInt(item.CustomerReviews?.Count || 0),
              affiliateLink: item.DetailPageURL || "",
              salesRank:
                item.BrowseNodeInfo?.BrowseNodes?.[0]?.SalesRank || 999999,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            // Filter logic: rating >= 4.3, price range check if available
            if (productData.rating >= 4.3) {
              // Generate product ID from keyword
              const productId = keyword
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

              const productRef = db.collection("products").doc(productId);
              batch.set(productRef, productData, { merge: true });
              productsUpdated++;

              console.log(`Added/Updated: ${productData.name}`);
            }
          }

          // Rate limiting - wait between requests
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error processing ${keyword}:`, error.message);
          // Continue with next product
        }
      }
    }

    // Commit batch
    await batch.commit();

    return {
      success: true,
      message: `Successfully updated ${productsUpdated} products`,
      productsUpdated,
    };
  } catch (error) {
    console.error("Error updating products:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * HTTPS Request Function (alternative trigger method)
 * Can be called via direct HTTPS request
 */
exports.updateProductsHTTP = functions.https.onRequest(async (req, res) => {
  // Optional: Add authentication/authorization
  const authHeader = req.headers.authorization;
  const expectedToken = functions.config().admin?.token;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const db = admin.firestore();
    const batch = db.batch();
    let productsUpdated = 0;

    // Process each category
    for (const [categoryKey, categoryData] of Object.entries(categories)) {
      console.log(`Processing category: ${categoryData.name}`);

      // Search for each product in the category
      for (const keyword of categoryData.keywords) {
        try {
          const requestParameters = {
            Keywords: keyword,
            SearchIndex: "Beauty",
            ItemCount: 1,
            Resources: [
              "Images.Primary.Large",
              "ItemInfo.Title",
              "ItemInfo.Features",
              "Offers.Listings.Price",
              "CustomerReviews.StarRating",
              "CustomerReviews.Count",
              "BrowseNodeInfo.BrowseNodes.SalesRank",
            ],
          };

          // Search for product
          const response = await amazonPaapi.SearchItems(
            commonParameters,
            requestParameters
          );

          if (
            response &&
            response.SearchResult &&
            response.SearchResult.Items
          ) {
            const item = response.SearchResult.Items[0];

            // Extract product data
            const productData = {
              asin: item.ASIN,
              name: item.ItemInfo?.Title?.DisplayValue || keyword,
              category: categoryKey,
              categoryName: categoryData.name,
              image: item.Images?.Primary?.Large?.URL || "",
              rating: parseFloat(item.CustomerReviews?.StarRating?.Value || 0),
              reviewCount: parseInt(item.CustomerReviews?.Count || 0),
              affiliateLink: item.DetailPageURL || "",
              salesRank:
                item.BrowseNodeInfo?.BrowseNodes?.[0]?.SalesRank || 999999,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            // Filter logic: rating >= 4.3
            if (productData.rating >= 4.3) {
              // Generate product ID from keyword
              const productId = keyword
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

              const productRef = db.collection("products").doc(productId);
              batch.set(productRef, productData, { merge: true });
              productsUpdated++;

              console.log(`Added/Updated: ${productData.name}`);
            }
          }

          // Rate limiting - wait between requests
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error processing ${keyword}:`, error.message);
          // Continue with next product
        }
      }
    }

    // Commit batch
    await batch.commit();

    res.json({
      success: true,
      message: `Successfully updated ${productsUpdated} products`,
      productsUpdated,
    });
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
