async function testProducts() {
  const url = 'http://localhost:3000/api/products';
  console.log(`Fetching products from: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response length: ${data?.products?.length || 0}`);
    if (data?.products) {
      console.log("Sample Product:", JSON.stringify(data.products[0], null, 2));
    } else {
      console.log("Response Body:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

testProducts();
