import {
    IDataObject,
    INodeExecutionData,
    INodeTypeDescription,
    INodeType, NodeConnectionType, IExecuteFunctions,
} from 'n8n-workflow';

import {
	suiteCrmApiRequest
} from './GenericFunctions';

export class SuiteCrm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Suite CRM',
		name: 'SuiteCrm',
		icon: 'file:suiteCrm.png',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		group: ['input'],
		version: 1,
        usableAsTool: true,
		description: 'Consume Suite CRM API.',
		defaults: {
			name: 'Suite CRM',
			color: '#CE2232',
		},
        inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'suiteCrmApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{
						name: 'Standard (to be implemented)',
						value: 'standard',
					},
					{
						name: 'Custom',
						value: 'custom',
					}
				],
				default: 'custom',
				required: true,
				description: 'Choose between standard or customized Suite CRM.',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
					},
				},
				options: [
					{
						name: 'Module',
						value: 'module'
					},
					{
						name: 'Relationship',
						value: 'relationship',
					},
					{
						name: 'Link',
						value: 'link'
					},
					{
						name: 'Swagger Documentation',
						value: 'swagger',
					},
					{
						name: 'Log out',
						value: 'logout'
					}
				],
				default: 'module',
				required: true,
				description: 'The resource to operate on.',
			},

			// ----------------------------------
			//         modules
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a module entry.',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a module entry.',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all module entries.',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a module entry.',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a module entry.',
					},
				],
				default: 'create',
				required: true,
				description: 'The operation to perform.',
			},
			{
				displayName: 'Module name',
				name: 'moduleName',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
					},
				},
				default: '',
				description: 'The module to operate on. Is optional for operations create and update if set as "Module name" in data field. Will be overwritten by the "Module name" fields value if set.',
			},
			{
				displayName: 'Module entry ID',
				name: 'moduleEntryId',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'delete', 'get', 'update'
						],
					},
				},
				default: '',
				placeholder: 'b13a39f8-1c24-c5d0-ba0d-5ab123d6e899',
				description: 'The ID of the entry to operate on. Is optional for update operation if set as "Module entry ID" in data field. Will be overwritten by the "Module entry ID" fields value if set.',
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'create', 'update'
						],
					},
				},
				default: '',
				required: true,
				description: 'The data to send to Suite CRM. Example: {"type":"Contacts", "id": "12345", "attributes": {"name": "Leonardo da Vinci"}}',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module',
						],
						operation: [
							'get', 'getAll'
						],
					},
				},
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Name',
								name: 'fieldName',
								type: 'string',
								default: '',
								description: 'Name of the field.',
							}
						]
					},
				],
				default: {},
				placeholder: 'Add Field',
				description: 'Specify the fields you want to request.',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module',
						],
						operation: [
							'getAll'
						],
					},
				},
				options: [
					{
						displayName: 'Filter Field',
						name: 'field',
						values: [
							{
								displayName: 'Filter By',
								name: 'filterBy',
								type: 'string',
								default: '',
								description: 'Name of the field.',
							},
							{
								displayName: 'Operator',
								name: 'operator',
								type: 'options',
								options: [
									{
										name: 'Equals',
										value: 'eq'
									},
									{
										name: 'Not Equals',
										value: 'neq'
									},
									{
										name: 'Greater than',
										value: 'gt'
									},
									{
										name: 'Greater or equals than',
										value: 'gte'
									},
									{
										name: 'Lower than',
										value: 'lt'
									},
									{
										name: 'Lower or equals than',
										value: 'lte'
									},
									{
										name: 'Like',
										value: 'like'
									},
								],
								default: 'eq',
								description: 'Operator to filter by.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value to compare the results with.',
							},
							{
								displayName: 'Field Operator Strategy',
								name: 'operatorStrategy',
								type: 'options',
								options: [
									{
										name: 'And',
										value: 'and'
									},
									{
										name: 'Or',
										value: 'or'
									}
								],
								default: 'and',
								description: 'Operator strategy AND/OR.',
							},
						]
					},
				],
				default: {},
				placeholder: 'Add Filter Condition',
				description: 'Specify the filter.',
			},
			{
				displayName: 'Paginate',
				name: 'paginate',
				type: 'boolean',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'getAll'
						],
					},
				},
				default: false,
				description: 'Select true if you want to paginate the module.',
			},
			{
				displayName: 'Results per page',
				name: 'resultsPerPage',
				type: 'number',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'getAll'
						],
						paginate: [
							true
						],
					},
				},
				default: 20,
				description: 'Select the numbers per page.',
			},
			{
				displayName: 'Page number',
				name: 'page',
				type: 'number',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'getAll'
						],
						paginate: [
							true,
						]
					},
				},
				default: 1,
				description: 'Page you want to retrieve.',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'boolean',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'getAll'
						],
					},
				},
				default: false,
				description: 'Select true if you want to sort the results.',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'getAll'
						],
						sort: [
							true
						],
					},
				},
				default: '',
				description: 'Field to sort by.',
			},
			{
				displayName: 'Descending',
				name: 'desc',
				type: 'boolean',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'module'
						],
						operation: [
							'getAll'
						],
						sort: [
							true,
						]
					},
				},
				default: false,
				description: 'Select true if you want to sort the results in descending order.',
			},
			// ----------------------------------
			//         relationships
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'relationship',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a relationship for an module entry.',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all relationships of an module entry.',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a relationship.',
					},
				],
				default: 'create',
				required: true,
				description: 'The operation to perform.',
			},
			{
				displayName: 'Module name',
				name: 'moduleName',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'relationship',
						],
					},
				},
				default: '',
				required: true,
				description: 'The module to operate on.',
			},
			{
				displayName: 'Module entry ID',
				name: 'moduleEntryId',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'relationship',
						],
					},
				},
				default: '',
				required: true,
				placeholder: 'b13a39f8-1c24-c5d0-ba0d-5ab123d6e899',
				description: 'The ID of the entry to operate on.',
			},
			{
				displayName: 'Relationship Name',
				name: 'relationshipName',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'relationship',
						],
					},
				},
				default: '',
				required: true,
				description: 'The relationship name related to the module entry.',
			},
			{
				displayName: 'Related bean ID',
				name: 'relatedBeanId',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'relationship',
						],
						operation: [
							'delete', 'create'
						]
					},
				},
				default: '',
				required: true,
				placeholder: '11806811-0b4b-fcdd-268b-5b2260e68333',
				description: 'The ID of the related module entry.',
			},
			// ----------------------------------
			//         links
			// ----------------------------------
			{
				displayName: 'Link',
				name: 'link',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'custom'
						],
						resource: [
							'link',
						],
					},
				},
				default: 'create',
				required: true,
				description: 'Input the link you want to GET-Request.',
			},
		],
	};

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length as unknown as number;

		// For Post
		let body: IDataObject = {};
		// For Query string
		const qs: IDataObject = {};

		let responseData;
		for (let i = 0; i < length; i++) {
			const mode = this.getNodeParameter('mode', 0) as string;


			if (mode === 'standard') {

				throw new Error('Standard Suite CRM is not yet implemented');

			} else if (mode === 'custom') {
				const resource = this.getNodeParameter('resource', 0) as string;

				if (resource === 'logout') {
					responseData = await suiteCrmApiRequest.call(this, 'POST', '/Api/V8/logout', {});
				}
				else if (resource === 'swagger') {
					responseData = await suiteCrmApiRequest.call(this, 'GET', '/Api/V8/meta/swagger.json', {});
				}
				else if (resource === 'module') {
					const operation = this.getNodeParameter('operation', 0) as string;

					if (operation === 'create') {

						body = {
							data: JSON.parse(this.getNodeParameter('data', i) as string) as object
						} as IDataObject;

						if (!(body!.data!.hasOwnProperty('type'))) {
							// tslint:disable-next-line: no-any
							(body.data as any).type = this.getNodeParameter('moduleName', 0) as string;
						}

						responseData = await suiteCrmApiRequest.call(this, 'POST', '/Api/V8/module', body);

					} else if (operation === 'update') {

						body = {
							data: JSON.parse(this.getNodeParameter('data', i) as string) as object
						} as IDataObject;

						if (!(body!.data!.hasOwnProperty('type'))) {
							// tslint:disable-next-line: no-any
							(body.data as any).type = this.getNodeParameter('moduleName', 0) as string;
						}

						if (!(body!.data!.hasOwnProperty('id'))) {
							// tslint:disable-next-line: no-any
							(body.data as any).id = this.getNodeParameter('moduleEntryId', 0) as string;
						}

						responseData = await suiteCrmApiRequest.call(this, 'PATCH', '/Api/V8/module', body);

					} else if (operation === 'delete') {

						const moduleName = this.getNodeParameter('moduleName', 0) as string;
						const moduleEntryId = this.getNodeParameter('moduleEntryId', 0) as string;

						responseData = await suiteCrmApiRequest.call(this, 'DELETE', `/Api/V8/module/${moduleName}/${moduleEntryId}`, {});

					} else if (operation === 'get') {

						const moduleName = this.getNodeParameter('moduleName', 0) as string;
						const moduleEntryId = this.getNodeParameter('moduleEntryId', 0) as string;

						// tslint:disable-next-line: no-any
						const fields = this.getNodeParameter('fields', 0) as any;
						
						if (fields.hasOwnProperty('field') && fields.field.length !== 0) {
							let fieldsString = '';
							fields.field.forEach((param: { fieldName: string; }) => {
								fieldsString = fieldsString.concat(',').concat(param.fieldName);
							});
							fieldsString = fieldsString.slice(1);
							qs[`fields[${moduleName}]`] = fieldsString;
						}

						responseData = await suiteCrmApiRequest.call(this, 'GET', `/Api/V8/module/${moduleName}/${moduleEntryId}`, {}, qs);

					} else if (operation === 'getAll') {

						const moduleName = this.getNodeParameter('moduleName', 0) as string;

						// tslint:disable-next-line: no-any
						const fields = this.getNodeParameter('fields', 0) as any;
						const paginate = this.getNodeParameter('paginate', 0) as boolean;
						const sort = this.getNodeParameter('sort', 0) as boolean;
						const filters = this.getNodeParameter('filters', 0) as any;

						if (paginate) {
							const results = this.getNodeParameter('resultsPerPage', 0) as number;
							const page = this.getNodeParameter('page', 0) as number;
							qs['page[number]'] = page.toString();
							qs['page[size]'] = results.toString();
						}

						if (sort) {
							const sortBy = this.getNodeParameter('sortBy', 0) as string;
							const desc = this.getNodeParameter('desc', 0) as boolean;
							if (desc) {
								qs['sort'] = '-'.concat(sortBy);
							} else {
								qs['sort'] = sortBy;
							}
						}

						if (filters.hasOwnProperty('field') && filters.field.length !== 0) {
							filters.field.forEach((param: { filterBy: string, operator: string, value: string, operatorStrategy: string; }) => {
								qs[`filter[${param.filterBy}][${param.operator}]`] = param.value;
								qs[`filter[operator]`] = param.operatorStrategy;
							});
						}

						if (fields.hasOwnProperty('field') && fields.field.length !== 0) {
							let fieldsString = '';
							fields.field.forEach((param: { fieldName: string; }) => {
								fieldsString = fieldsString.concat(',').concat(param.fieldName);
							});
							fieldsString = fieldsString.slice(1);
							qs[`fields[${moduleName}]`] = fieldsString;
						}

						responseData = await suiteCrmApiRequest.call(this, 'GET', `/Api/V8/module/${moduleName}`, {}, qs);

					} else {
						throw new Error(`The operation "${operation}" is not known!`);
					}
				} else if (resource === 'relationship') {
					const operation = this.getNodeParameter('operation', 0) as string;

					if (operation === 'create') {

						body = {
							data: {
								type: this.getNodeParameter('relationshipName', 0) as string,
								id: this.getNodeParameter('relatedBeanId', 0) as string,
							}
						} as IDataObject;

						const moduleName = this.getNodeParameter('moduleName', 0) as string;
						const moduleEntryId = this.getNodeParameter('moduleEntryId', 0) as string;

						responseData = await suiteCrmApiRequest.call(this, 'POST', `/Api/V8/module/${moduleName}/${moduleEntryId}/relationships`, body);

					} else if (operation === 'delete') {

						const moduleName = this.getNodeParameter('moduleName', 0) as string;
						const moduleEntryId = this.getNodeParameter('moduleEntryId', 0) as string;
						const relationshipName = (this.getNodeParameter('relationshipName', 0) as string).toLowerCase();
						const relatedBeanId = this.getNodeParameter('relatedBeanId', 0) as string;

						responseData = await suiteCrmApiRequest.call(this, 'DELETE', `/Api/V8/module/${moduleName}/${moduleEntryId}/relationships/${relationshipName}/${relatedBeanId}`, {});

					} else if (operation === 'getAll') {

						const moduleName = this.getNodeParameter('moduleName', 0) as string;
						const moduleEntryId = this.getNodeParameter('moduleEntryId', 0) as string;
						const relationshipName = (this.getNodeParameter('relationshipName', 0) as string).toLowerCase();

						responseData = await suiteCrmApiRequest.call(this, 'GET', `/Api/V8/module/${moduleName}/${moduleEntryId}/relationships/${relationshipName}`, {});

					} else {
						throw new Error(`The operation "${operation}" is not known!`);
					}

				} else if (resource === 'link') {

					const link = this.getNodeParameter('link', 0) as string;

					responseData = await suiteCrmApiRequest.call(this, 'GET', `/Api/${link}`, {});

				} else {
					throw new Error(`The resource "${resource}" is not known!`);
				}
			} else {
				throw new Error(`The mode "${mode}" is not known!`);
			}


			if (Array.isArray(responseData)) {
				returnData.push.apply(returnData, responseData as IDataObject[]);
			} else if (responseData !== undefined) {
				returnData.push(responseData as IDataObject);
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
