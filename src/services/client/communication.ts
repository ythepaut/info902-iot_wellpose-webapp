import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";

/**
 * Makes an HTTP request to the API
 * @param {Method}              method              HTTP request method.
 * @param {string}              url                 API URL.
 * @param {object}              data                Request body as an object.
 * @param {AxiosRequestHeaders} additionalHeaders   Additional headers to send.
 * @param {AxiosRequestConfig}  additionalOptions   Additional axios config.
 * @return {Promise<APIResponse>}
 */
export async function request(
    method: Method,
    url: string,
    data: object,
    additionalHeaders?: AxiosRequestHeaders,
    additionalOptions?: AxiosRequestConfig,
): Promise<any> {
    return new Promise<any>(async (resolve) => {
        await axios
            .request({
                method: method,
                url: url,
                data: data,
                headers: {
                    ...additionalHeaders,
                },
                ...additionalOptions,
            })
            .then((response) => {
                resolve(response);
            })
            .catch((reason) => {
                try {
                    const response = JSON.parse(reason.request.response);
                    resolve({
                        status: response.status,
                        verbose: response.verbose,
                        data: {},
                    });
                } catch (_) {
                    resolve(null);
                }
            });
    });
}
