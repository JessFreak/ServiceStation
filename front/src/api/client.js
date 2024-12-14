class APIClient {
  static headers = {
    'Content-Type': 'application/json',
    credentials: 'include',
  };

  static async _request(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: APIClient.headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, options);
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
      return response.json();
    } catch (error) {
      console.error(`Error with ${method} request to ${endpoint}:`, error.message);
      throw error;
    }
  }

  static get(endpoint) {
    return APIClient._request(endpoint, 'GET');
  }

  static post(endpoint, body) {
    return APIClient._request(endpoint, 'POST', body);
  }

  static patch(endpoint, body) {
    return APIClient._request(endpoint, 'PATCH', body);
  }

  static delete(endpoint) {
    return APIClient._request(endpoint, 'DELETE');
  }
}

export default APIClient;
