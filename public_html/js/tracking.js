function trackAmazonClick(productId, category, pageType) {
  if (typeof gtag === "function") {
    gtag("event", "amazon_click", {
      product_id: productId,
      category: category,
      page_type: pageType,
    });
  }
}
