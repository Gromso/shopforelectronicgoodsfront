import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Apiconfig } from '../config/apiConfig';
import { resolve } from 'path';
import { rejects } from 'assert';
import { request } from 'http';



export default function api(path: string, method: 'get' | 'post' | 'put' | 'delete', body: any | undefined) {
    return new Promise<ApiRepsonse>((resolve) => {
        const requestData = {
            method: method,
            url: path,
            baseURL: Apiconfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": getAuthorizationHeader(),
            },
        };

        axios(requestData)
            .then(res => responseHandler(res, resolve, requestData))
            .catch(async err => {
                if (err.response.status === 403) {
                    const response: ApiRepsonse = {
                        status: 'login',
                        date: null,
                    };
                    return resolve(response);
                }
                if (err.response.status === 401) {  
                    const newToken = await refreshToken();
                    if (!newToken) {
                        const response: ApiRepsonse = {
                            status: 'login',
                            date: null,
                        };
                        return resolve(response);
                    }
                    
                    saveToken(newToken);
                    requestData.headers['Authorization'] = getAuthorizationHeader()
                    return await repeatRequest(requestData, resolve);
                }

            });
    });

}


export function apifile(
    path: string,
    name: string,
    file: File) {
    return new Promise<ApiRepsonse>((resolve) => {
        const formData = new FormData();
        formData.append(name, file)


        const requestData : AxiosRequestConfig = {
            method: 'post',
            url: path,
            baseURL: Apiconfig.API_URL,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": getAuthorizationHeader(),
            },
        };

        axios(requestData)
            .then(res => responseHandler(res, resolve, requestData))
            .catch(async err => {
                if (err.response.status === 403) {
                    const response: ApiRepsonse = {
                        status: 'login',
                        date: null,
                    };
                    return resolve(response);
                }
                if (err.response.status === 401) {
                    //const newToken = await refreshToken();
                    /*if (!newToken) {
                        const response: ApiRepsonse = {
                            status: 'login',
                            date: null,
                        };
                        return resolve(response);
                    }
                    saveToken(newToken);*/

                    if(requestData.headers === undefined){
                        const response: ApiRepsonse = {
                            status: 'login',
                            date: null,
                        };
                        return resolve(response);
                    }
                    requestData.headers['Authorization'] = getAuthorizationHeader()
                    return await repeatRequest(requestData, resolve);
                    
                }

                const response : ApiRepsonse = {
                    status : 'error',
                    date : err
                };
                resolve(response);
            });
    });

}

export interface ApiRepsonse {
    status: 'ok' | 'error' | 'login';
    date: any;
}

async function responseHandler(res: AxiosResponse<any>,
    resolve: (value: ApiRepsonse) => void, requestData: AxiosRequestConfig) {

    if (res.status < 200 || res.status >= 300) {
        if (!requestData.headers) {
            const response: ApiRepsonse = {
                status: 'login',
                date: null,
            };
            return response;
        }
        requestData.headers['Authorization'] = getAuthorizationHeader();
        return await repeatRequest(requestData, resolve);
        const response: ApiRepsonse = {
            status: 'error',
            date: res.data,
        };
        return resolve(response);
    }
    let response: ApiRepsonse;
    if (res.data.statusCode < 0) {
        response = {
            status: 'login',
            date: null
        };
    } else {
        response = {
            status: 'ok',
            date: res.data
        };
    }
    resolve(response);
}


function getAuthorizationHeader() {
    const token = localStorage.getItem('api_token');
    if (token) {
        return `Bearer ${token}`;
    } else {
        return '';
    }
}

function getToken() {
    const token = localStorage.getItem("api-token");
    return token + '';
}

export function saveToken(token: string) {
    localStorage.setItem('api_token', token);
}

function getRefreshToken(): string {
    const token = localStorage.getItem('api_refresh_token');
    return token + '';
}

export function saveRefreshToken(token: string) {
    localStorage.setItem('api_refresh_token', token);
}


async function refreshToken(): Promise<string | null> {
    
    const path = "/auth/user/refresh";
    const data = { token: getRefreshToken() }
    console.log(data.token)


    const refreshTokenRequestData: AxiosRequestConfig = {
        method: 'post',
        url: path,
        baseURL: Apiconfig.API_URL,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    };
    
    const res: { data: { token: string | undefined } } = await axios(refreshTokenRequestData);

    
    if (!res.data.token && res.data.token == null) {
        return null;
    }
 
    return res.data.token;
}


async function repeatRequest(requestData: AxiosRequestConfig<any>,
    resolve: (value: ApiRepsonse) => void) {

    axios(requestData)
        .then(res => {
            let response: ApiRepsonse;

            if (res.status === 401 && res.status === null) {
                response = {
                    status: 'login',
                    date: null,
                };
                return response;
            } else {
                response = {
                    status: 'ok',
                    date: res,
                };
            }
            return resolve(response);
        })
        .catch(err => {
            const response: ApiRepsonse = {
                status: 'error',
                date: err,
            };
            return resolve(response);
        });
}
