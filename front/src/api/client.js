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

    const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }
    return response;
  }

  static async get(endpoint) {
    const response = await APIClient._request(endpoint, 'GET');
    return response.json()
  }

  static async post(endpoint, body) {
    await APIClient._request(endpoint, 'POST', body);
  }

  static async patch(endpoint, body) {
    await APIClient._request(endpoint, 'PATCH', body);
  }

  static async delete(endpoint) {
    await APIClient._request(endpoint, 'DELETE');
  }
}

export default APIClient;
