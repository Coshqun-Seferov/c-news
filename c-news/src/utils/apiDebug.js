/**
 * API Debug utilities
 */

/**
 * Test API endpoints to find working ones
 * @param {string} baseUrl - Base API URL
 * @returns {Promise<Object>} Test results
 */
export async function testApiEndpoints(baseUrl = "https://admin.ilkin.site/api") {
  const endpoints = [
    { path: "/auth/login/", method: "POST", description: "Standard login" },
    { path: "/auth/token/", method: "POST", description: "Token auth" },
    { path: "/token/", method: "POST", description: "Simple token" },
    { path: "/login/", method: "POST", description: "Simple login" },
    { path: "/auth/profile/", method: "GET", description: "User profile" },
    { path: "/user/", method: "GET", description: "User info" },
    { path: "/users/me/", method: "GET", description: "Current user" },
  ]

  const results = []

  for (const endpoint of endpoints) {
    try {
      const url = `${baseUrl}${endpoint.path}`
      const options = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      // For POST requests, add test data
      if (endpoint.method === "POST") {
        options.body = JSON.stringify({
          username: "test",
          password: "test",
        })
      }

      // For GET requests that need auth, add a dummy token
      if (endpoint.method === "GET") {
        options.headers.Authorization = "Token dummy-token"
      }

      const response = await fetch(url, options)

      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        status: response.status,
        available: response.status !== 404,
        requiresAuth: response.status === 401,
        methodAllowed: response.status !== 405,
      })
    } catch (error) {
      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        status: "Error",
        error: error.message,
        available: false,
      })
    }
  }

  return results
}

/**
 * Log API test results to console
 * @param {string} baseUrl - Base API URL
 */
export async function debugApiEndpoints(baseUrl) {
  console.log("🔍 Testing API endpoints...")
  const results = await testApiEndpoints(baseUrl)

  console.table(results)

  const workingEndpoints = results.filter((r) => r.available && r.methodAllowed)
  console.log("✅ Working endpoints:", workingEndpoints)

  const authEndpoints = results.filter((r) => r.requiresAuth)
  console.log("🔐 Endpoints requiring auth:", authEndpoints)

  return results
}
