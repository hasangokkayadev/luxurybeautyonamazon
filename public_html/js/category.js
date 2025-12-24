// Category page logic
const categoryData = {
  moisturizers: {
    title: "Luxury Face Moisturizers",
    products: [
      {
        id: "lamer-creme",
        name: "La Mer – Crème de la Mer",
        description:
          "A legendary moisturizing cream known for its rich texture and iconic formulation. Formulated with La Mer's signature Miracle Broth™, it is designed to help support skin's hydration and natural radiance.",
        category: "moisturizers",
        amazonLink: "https://amzn.to/4jeRR88",
      },
      {
        id: "laprairie-caviar",
        name: "La Prairie – Skin Caviar Luxe Cream",
        description:
          "An ultra-luxurious cream enriched with caviar extract, known for its rich texture and refined formulation. Inspired by Swiss skincare innovation, it is designed to help support the appearance of smoother-looking, radiant skin.",
        category: "moisturizers",
        amazonLink: "https://amzn.to/4pSecL6",
      },
      {
        id: "belif-aquabomb",
        name: "belif – The Lightweight Skin Cream",
        description:
          "A lightweight gel-cream moisturizer with niacinamide, hyaluronic acid, and squalane, designed to hydrate and leave skin feeling fresh and comfortable.",
        category: "moisturizers",
        amazonLink: "https://amzn.to/4pRcPMH",
      },
      {
        id: "bader-rich",
        name: "Augustinus Bader – The Rich Cream",
        description:
          "A richer version of the award-winning cream, featuring TFC8® technology and a refined formulation. Designed to help support the appearance of smoother-looking, revitalized skin.",
        category: "moisturizers",
        amazonLink: "https://amzn.to/491wqUN",
      },
      {
        id: "tilbury-magic",
        name: "Charlotte Tilbury – Magic Cream",
        description:
          "Inspired by Charlotte Tilbury's signature glow, this moisturizer is known for its hydrating feel and smooth, radiant-looking finish. Designed to help prep the skin for a refined makeup application.",
        category: "moisturizers",
        amazonLink: "https://amzn.to/4aB5zjz",
      },
    ],
  },
  serums: {
    title: "Luxury Serums & Anti-Aging",
    products: [
      {
        id: "estee-anr",
        name: "Estée Lauder – Advanced Night Repair",
        description:
          "An iconic serum widely recognized for its signature formulation and ChronoluxCB™ technology. Designed to help support the appearance of smoother-looking, more radiant skin.",
        category: "serums",
        amazonLink: "https://amzn.to/3NfDi8f",
      },
      {
        id: "caviar-serum",
        name: "Caviar Hydrating Extract Face Serum",
        description:
          "A lightweight hydrating serum with caviar extract and vitamin E, formulated to nourish skin and support a smooth, radiant-looking complexion.",
        category: "serums",
        amazonLink: "https://amzn.to/4sdp7kd",
      },
      {
        id: "sturm-hyaluronic",
        name: "Dr. Barbara Sturm – Hyaluronic Serum",
        description:
          "An intensive hydration serum formulated with long and short-chain hyaluronic molecules, designed to help support skin's hydration for a refreshed, supple-looking feel.",
        category: "serums",
        amazonLink: "https://amzn.to/4pdYPM6",
      },
      {
        id: "skinceuticals-ce",
        name: "SkinCeuticals – C E",
        description:
          "A widely recognized antioxidant serum featuring a refined vitamin C formulation. Known for supporting the appearance of brighter-looking, more radiant skin.",
        category: "serums",
        amazonLink: "https://amzn.to/3KOghIZ",
      },
      {
        id: "riley-genes",
        name: "Sunday Riley – Good Genes",
        description:
          "A cult-favorite lactic acid treatment known for its refined formulation and luminous-looking finish. Designed to help support the appearance of smoother-looking, radiant skin.",
        category: "serums",
        amazonLink: "https://amzn.to/45nA4po",
      },
    ],
  },
  hairtools: {
    title: "Luxury Hair Tools",
    products: [
      {
        id: "dyson-airwrap",
        name: "Dyson Airwrap",
        description:
          "A versatile multi-styler designed for a range of hair types and styling preferences. Known for its innovative design and ability to support a variety of curling, waving, smoothing, and drying styles.",
        category: "hairtools",
        amazonLink: "https://amzn.to/493hmVe",
      },
      {
        id: "dyson-supersonic",
        name: "Dyson Supersonic",
        description:
          "Designed for efficient drying with advanced heat management technology. Known for its controlled airflow and thoughtful engineering that supports a comfortable styling experience.",
        category: "hairtools",
        amazonLink: "https://amzn.to/48PBgEo",
      },
      {
        id: "ghd-platinum",
        name: "GHD Platinum+",
        description:
          "A smart styler featuring Ultra-zone technology and advanced heat management. Designed to adapt to different styling needs and support a consistent, refined styling experience.",
        category: "hairtools",
        amazonLink: "https://amzn.to/3Y9IFIE",
      },
      {
        id: "shark-flexstyle",
        name: "Shark FlexStyle Air Styling",
        description:
          "A multi-functional air styling system that uses controlled airflow to help dry and style hair with ease.",
        category: "hairtools",
        amazonLink: "https://amzn.to/4b1u7lJ",
      },
      {
        id: "babyliss-nano",
        name: "BaBylissPRO Nano Titanium",
        description:
          "A titanium straightening iron with professional-inspired design, featuring even heat distribution and ionic technology to help create smooth, polished styles.",
        category: "hairtools",
        amazonLink: "https://amzn.to/4sr2gBY",
      },
    ],
  },
};

// Get category from URL
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get("cat");

// Load category
if (categoryParam && categoryData[categoryParam]) {
  const category = categoryData[categoryParam];
  document.getElementById("categoryTitle").textContent = category.title;

  const productGrid = document.getElementById("productGrid");
  productGrid.innerHTML = "";

  category.products.forEach((product) => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
} else {
  document.getElementById("categoryTitle").textContent = "Category Not Found";
  document.getElementById("productGrid").innerHTML =
    "<p>The requested category does not exist.</p>";
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Map product IDs to image files
  const imageMap = {
    "lamer-creme": "images/1.1.lamer.jpg",
    "laprairie-caviar": "images/1.2.laprairie.jpg",
    "belif-aquabomb": "images/1.3.belif.jpg",
    "bader-rich": "images/1.4.augustinusbader.jpg",
    "tilbury-magic": "images/1.5.charlottetilbury.jpg",
    "estee-anr": "images/2.1.esteelauder.jpg",
    "caviar-serum": "images/2.2.caviar.jpg",
    "sturm-hyaluronic": "images/2.3.sturm.jpg",
    "skinceuticals-ce": "images/2.4.scinceutials.jpg",
    "riley-genes": "images/2.5.sundayriley.jpg",
    "dyson-airwrap": "images/3.1.airwrap.jpg",
    "dyson-supersonic": "images/3..2.supersonic.jpg",
    "ghd-platinum": "images/3.3.GHD Platinum+.jpg",
    "shark-flexstyle": "images/3.4.sharkflexistyle.jpg",
    "babyliss-nano": "images/3.5.babylis.jpg",
  };

  const imageUrl = imageMap[product.id] || "images/placeholder.jpg";

  card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="Premium ${product.name} luxury beauty" class="product-thumb" loading="lazy">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-actions">
                <a href="${product.amazonLink}" target="_blank" rel="nofollow noopener" onclick="trackAmazonClick('${product.id}','${product.category}','category')" class="btn-primary">Check Price on Amazon</a>
                <small class="trust-line">✓ Secure checkout on Amazon<br>✓ Official product listing</small>
                <button onclick="addToCart('${product.id}')" class="btn-secondary">Add to List</button>
            </div>
        </div>
    `;

  return card;
}

// Add to cart function
function addToCart(productId) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login to add items to your watchlist.");
    window.location.href = "login.html";
    return;
  }

  // Find product in all categories
  let product = null;
  for (const cat in categoryData) {
    const found = categoryData[cat].products.find((p) => p.id === productId);
    if (found) {
      product = found;
      break;
    }
  }

  if (!product) {
    alert("Product not found.");
    return;
  }

  // Add to Firestore cart
  const cartRef = db.collection("carts").doc(user.uid);

  cartRef
    .get()
    .then((doc) => {
      let items = [];
      if (doc.exists && doc.data().items) {
        items = doc.data().items;
      }

      // Check if product already in cart
      if (items.some((item) => item.id === productId)) {
        alert("This product is already in your watchlist.");
        return;
      }

      // Add product to cart
      items.push({
        id: productId,
        name: product.name,
        category: product.category,
        addedAt: new Date().toISOString(),
      });

      return cartRef.set({
        items: items,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    })
    .then(() => {
      alert("Product added to watchlist!");
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      alert("Error adding to watchlist. Please try again.");
    });
}
