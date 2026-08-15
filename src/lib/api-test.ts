/**
 * Quick API test helper to verify if the API endpoints are accessible
 * Check browser console for results: apiTest.testAll()
 */

const API_BASE_URL = "https://admin.jaindesipure.co.in/api/v1";

export const apiTest = {
  async testCategories() {
    try {
      console.log("[TEST] Checking /categories endpoint...");
      const response = await fetch(`${API_BASE_URL}/categories`);
      console.log(`[TEST] Categories response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[TEST] Categories data:`, data);
        return true;
      } else {
        console.error(`[TEST] Categories endpoint returned ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error("[TEST] Categories endpoint error:", error);
      return false;
    }
  },

  async testProductsByCategory(slug: string = "dairy-bread-egg") {
    try {
      console.log(`[TEST] Checking /categories/${slug}/products endpoint...`);
      const response = await fetch(`${API_BASE_URL}/categories/${slug}/products?page=1&page_size=30`);
      console.log(`[TEST] Products response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[TEST] Products data:`, data);
        return true;
      } else {
        console.error(`[TEST] Products endpoint returned ${response.status}`);
        const text = await response.text();
        console.error(`[TEST] Response body:`, text);
        return false;
      }
    } catch (error) {
      console.error(`[TEST] Products endpoint error:`, error);
      return false;
    }
  },

  async testAll() {
    console.log("\n=== API Connection Test ===");
    const catOk = await this.testCategories();
    const prodOk = await this.testProductsByCategory();
    
    console.log("\n=== Test Results ===");
    console.log(`Categories endpoint: ${catOk ? "✅ OK" : "❌ FAILED"}`);
    console.log(`Products endpoint: ${prodOk ? "✅ OK" : "❌ FAILED"}`);
    console.log("==================\n");
  },
};

// Make it available globally for testing
if (typeof window !== "undefined") {
  (window as any).apiTest = apiTest;
}
