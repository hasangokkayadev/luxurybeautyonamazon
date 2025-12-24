// Cart page logic
const AMAZON_TAG = "luxurybea0f7a-20";

const productData = {
  "lamer-creme": {
    name: "La Mer – Crème de la Mer",
    image: "images/1.1.lamer.jpg",
    amazonLink: `https://www.amazon.com/s?k=la+mer+creme+de+la+mer&tag=${AMAZON_TAG}`,
  },
  "laprairie-caviar": {
    name: "La Prairie – Skin Caviar Luxe Cream",
    image: "images/1.2.laprairie.jpg",
    amazonLink: `https://www.amazon.com/s?k=la+prairie+skin+caviar+luxe+cream&tag=${AMAZON_TAG}`,
  },
  "belif-aquabomb": {
    name: "belif – The Lightweight Skin Cream",
    image: "images/1.3.belif.jpg",
    amazonLink: `https://www.amazon.com/s?k=belif+lightweight+skin+cream&tag=${AMAZON_TAG}`,
  },
  "bader-rich": {
    name: "Augustinus Bader – The Rich Cream",
    image: "images/1.4.augustinusbader.jpg",
    amazonLink: `https://www.amazon.com/s?k=augustinus+bader+rich+cream&tag=${AMAZON_TAG}`,
  },
  "tilbury-magic": {
    name: "Charlotte Tilbury – Magic Cream",
    image: "images/1.5.charlottetilbury.jpg",
    amazonLink: `https://www.amazon.com/s?k=charlotte+tilbury+magic+cream&tag=${AMAZON_TAG}`,
  },
  "estee-anr": {
    name: "Estée Lauder – Advanced Night Repair",
    image: "images/2.1.esteelauder.jpg",
    amazonLink: `https://www.amazon.com/s?k=estee+lauder+advanced+night+repair&tag=${AMAZON_TAG}`,
  },
  "caviar-serum": {
    name: "Caviar Hydrating Extract Face Serum",
    image: "images/2.2.caviar.jpg",
    amazonLink: `https://www.amazon.com/s?k=caviar+hydrating+serum&tag=${AMAZON_TAG}`,
  },
  "sturm-hyaluronic": {
    name: "Dr. Barbara Sturm – Hyaluronic Serum",
    image: "images/2.3.sturm.jpg",
    amazonLink: `https://www.amazon.com/s?k=dr+barbara+sturm+hyaluronic+serum&tag=${AMAZON_TAG}`,
  },
  "skinceuticals-ce": {
    name: "SkinCeuticals – C E Ferulic",
    image: "images/2.4.scinceutials.jpg",
    amazonLink: `https://www.amazon.com/s?k=skinceuticals+ce+ferulic&tag=${AMAZON_TAG}`,
  },
  "riley-genes": {
    name: "Sunday Riley – Good Genes",
    image: "images/2.5.sundayriley.jpg",
    amazonLink: `https://www.amazon.com/s?k=sunday+riley+good+genes&tag=${AMAZON_TAG}`,
  },
  "dyson-airwrap": {
    name: "Dyson Airwrap",
    image: "images/3.1.airwrap.jpg",
    amazonLink: `https://www.amazon.com/s?k=dyson+airwrap&tag=${AMAZON_TAG}`,
  },
  "dyson-supersonic": {
    name: "Dyson Supersonic",
    image: "images/3..2.supersonic.jpg",
    amazonLink: `https://www.amazon.com/s?k=dyson+supersonic&tag=${AMAZON_TAG}`,
  },
  "ghd-platinum": {
    name: "GHD Platinum+",
    image: "images/3.3.GHD Platinum+.jpg",
    amazonLink: `https://www.amazon.com/s?k=ghd+platinum+plus&tag=${AMAZON_TAG}`,
  },
  "shark-flexstyle": {
    name: "Shark FlexStyle Air Styling",
    image: "images/3.4.sharkflexistyle.jpg",
    amazonLink: `https://www.amazon.com/s?k=shark+flexstyle+air+styling&tag=${AMAZON_TAG}`,
  },
  "babyliss-nano": {
    name: "BaBylissPRO Nano Titanium",
    image: "images/3.5.babylis.jpg",
    amazonLink: `https://www.amazon.com/s?k=babylisspro+nano+titanium&tag=${AMAZON_TAG}`,
  },
};

// Check authentication and load cart
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is logged in, show cart
    document.getElementById("authRequired").style.display = "none";
    document.getElementById("cartContent").style.display = "block";
    loadCart(user.uid);
  } else {
    // User is not logged in
    document.getElementById("authRequired").style.display = "block";
    document.getElementById("cartContent").style.display = "none";
  }
});

// Load cart items
function loadCart(userId) {
  const cartRef = db.collection("carts").doc(userId);

  cartRef.onSnapshot(
    (doc) => {
      const cartItems = document.getElementById("cartItems");
      const emptyCart = document.getElementById("emptyCart");

      if (doc.exists && doc.data().items && doc.data().items.length > 0) {
        const items = doc.data().items;
        cartItems.innerHTML = "";
        emptyCart.style.display = "none";

        items.forEach((item) => {
          const product = productData[item.id];
          if (product) {
            const cartItem = createCartItem(item.id, product);
            cartItems.appendChild(cartItem);
          }
        });
      } else {
        cartItems.innerHTML = "";
        emptyCart.style.display = "block";
      }
    },
    (error) => {
      console.error("Error loading cart:", error);
      alert("Error loading cart. Please refresh the page.");
    }
  );
}

// Create cart item element
function createCartItem(productId, product) {
  const item = document.createElement("div");
  item.className = "cart-item";

  const imageUrl = product.image || "images/placeholder.jpg";

  item.innerHTML = `
        <img src="${imageUrl}" alt="Premium ${product.name} luxury beauty" loading="lazy">
        <div class="cart-item-info">
            <h3>${product.name}</h3>
            <p>Purchase this item on Amazon</p>
        </div>
        <div class="cart-item-actions">
            <a href="${product.amazonLink}" target="_blank" rel="nofollow noopener" onclick="trackAmazonClick('${productId}','${product.category}','watchlist')" class="btn-primary">Check Price on Amazon</a>
            <small class="trust-line">✓ Secure checkout on Amazon<br>✓ Official product listing</small>
            <button onclick="removeFromCart('${productId}')" class="btn-remove">Remove</button>
        </div>
    `;

  return item;
}

// Remove from cart
function removeFromCart(productId) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login to manage your cart.");
    return;
  }

  const cartRef = db.collection("carts").doc(user.uid);

  cartRef
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().items) {
        let items = doc.data().items;
        items = items.filter((item) => item.id !== productId);

        return cartRef.set({
          items: items,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    })
    .then(() => {
      // Cart will update automatically via snapshot listener
    })
    .catch((error) => {
      console.error("Error removing from cart:", error);
      alert("Error removing item. Please try again.");
    });
}
