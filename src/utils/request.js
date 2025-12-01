// src/utils/request.js
export async function request(url, options = {}) {
  try {
    const fullUrl = import.meta.env.VITE_API_URL + url
    const response = await fetch(fullUrl, {
      credentials: 'include',
      ...options,
    })
    if (!response.ok)
      throw new Error('Network response was not ok')
    return await response.json()
  }
  catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
