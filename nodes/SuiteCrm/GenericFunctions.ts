import {
    IExecuteFunctions,
    IHookFunctions, IHttpRequestMethods, IHttpRequestOptions,
} from 'n8n-workflow';

import {
	IDataObject,
} from 'n8n-workflow';

export interface IProduct {
	fields: {
		item?: object[];
	};
}

/**
 * Make an API request to Suite CRM
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function suiteCrmApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject, dataKey?: string): Promise<any> { // tslint:disable-line:no-any
	const credentials = await this.getCredentials('suiteCrmApi');
	if (credentials === undefined) {
		throw new Error('Please provide credentials');
	}

	if (query === undefined) {
		query = {};
	}

    // TODO implement caching of credentials with expiry
	const optionsAuth: IHttpRequestOptions = {
		headers: {},
		method: "POST",
		qs: {},
		url: `${credentials.suiteCrmUrl}/Api/access_token`,
		json: true,
		body: {
			grant_type: 'client_credentials',
			client_id: credentials.clientId,
			client_secret: credentials.clientSecret
		}
	};

	const options: IHttpRequestOptions = {
		headers: {
			Authorization: `Bearer `,
		},
		method: method,
		qs: query,
		url: `${credentials.suiteCrmUrl}${endpoint}`,
		json: true
	};

	if (Object.keys(body).length !== 0) {
		options.body = body;
	}

	try {
		const responseAuthData = await this.helpers.httpRequest(optionsAuth);

		if (responseAuthData.access_token) {
			options.headers!.Authorization = `Bearer ${responseAuthData.access_token}`;
		}
		else {
			throw new Error('Suite CRM credentials are not valid! Make sure to use client credentials.')
		}

		const responseData = await this.helpers.httpRequest(options);

		if (dataKey === undefined) {
			return responseData;
		} else {
			return responseData[dataKey] as IDataObject;
		}
	}
	catch (error: any) {
		console.error('SuiteCRM API request error:', error);
		if (error.statusCode === 401) {
			// Return a clear error
			throw new Error('The Suite CRM credentials are not valid!');
		}

		// If that data does not exist for some reason return the actual error
		throw error;
	}
}
