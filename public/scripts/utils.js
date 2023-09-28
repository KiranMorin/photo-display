
/**
 * Sends a request to the specified URL using the specified method and data.
 *
 * @param {string} url - The URL to send the request to.
 * @param {string} method - The HTTP method to use for the request.
 * @param {any} data - The data to send with the request.
 * @return {Promise<any>} A promise that resolves with the response data if the request is successful,
 * or rejects with an error object if the request fails.
 */
const makeRequest = (url, method, data) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.getResponseHeader('Content-Type').startsWith('application/json')) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    resolve(xhr.response);
                }
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = () => {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        if (data) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.send(data);
    });
};