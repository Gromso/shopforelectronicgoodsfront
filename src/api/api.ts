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
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            },
        }

        
        axios(requestData)
            .then(res => responseHandler(res, resolve, requestData))
            .catch(async err => {
                if (err.response.status === 401) {
                    const newToken = await refreshToken();
        
        
                    if (!newToken) {
                        const response: ApiRepsonse = {
                            status: 'login',
                            data: null,
                        };
                        return resolve(response);
                    }
        
                    saveToken(newToken);
                requestData.headers['Authorization'] = getToken()
                
                return await repeatRequest(requestData,resolve);
            }
            });
    });

}


export interface ApiRepsonse {
    status: 'ok' | 'error' | 'login';
    data: any;
}

async function responseHandler(res: AxiosResponse<any>,
    resolve: (value: ApiRepsonse) => void, requestData: AxiosRequestConfig) {
    if (res.status < 200 || res.status >= 300) {
            if (!requestData.headers) {
                const response: ApiRepsonse = {
                    status: 'login',
                    data: null,
                };
                return response;
            }

            requestData.headers['Authorization'] = getToken();

            return await repeatRequest(requestData, resolve);
        

        const response: ApiRepsonse = {
            status: 'error',
            data: res.data,
        };
        return resolve(response);
    }

    let response: ApiRepsonse;
    if(res.data.statusCode < 0){
        response = {
            status: 'login',
            data: null
        };
    }else{
        response = {
            status: 'ok',
            data: res.data
        };
    }
    resolve(response);
}


function getToken(): string {
    const token = localStorage.getItem('api_token');
    return 'Berer ' + token;
}


 export function saveToken(token: string) {
    localStorage.setItem('api_token', token);
}

function getRefreshToken() :string{
    const token = localStorage.getItem('api_refresh_token');
    return token + '';
}

export function saveRefreshToken(token:string){
    localStorage.setItem('api_refresh_token', token);
}


async function refreshToken(): Promise<string | null> {
    const path = "/auth/user/refresh";
    const data = {
        token: getRefreshToken(),
    }




    const refreshTokenRequestData: AxiosRequestConfig = {
        method: 'post',
        url: path,
        baseURL: Apiconfig.API_URL,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const rtr: { data: { token: string | undefined } } = await axios(refreshTokenRequestData);

    if (!rtr.data.token && rtr.data.token == null) {
        return null;
    }
    return rtr.data.token;
}


async function repeatRequest(requestData: AxiosRequestConfig<any>,
    resolve: (value: ApiRepsonse) => void) {

    axios(requestData)
        .then(res => {
            let response: ApiRepsonse;

            if (res.status === 401) {
                response = {
                    status: 'login',
                    data: null,
                };
                return response;
            } else {
                response = {
                    status: 'ok',
                    data: res,
                };
            }
            return resolve(response);
        })
        .catch(err => {
            const response: ApiRepsonse = {
                status: 'error',
                data: err,
            };
            return resolve(response);
        });
}
