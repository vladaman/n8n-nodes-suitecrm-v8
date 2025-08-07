# n8n SuiteCRM Custom Nodes

Custom n8n nodes for interacting with SuiteCRM via REST API (v8).

## Installation

### Prerequisites

- Node.js (>=14.x)
- n8n (>=0.200.0)

### Install via npm

Depending on your n8n installation mode (local or global):

```bash
# For local n8n installation (using package.json)
npm install n8n
npm install @digital-boss/n8n-nodes-suitecrm

# For global n8n installation
npm install -g @digital-boss/n8n-nodes-suitecrm
```

If you installed n8n globally, ensure that the custom nodes module is installed in the same directory as n8n and n8n-core.

## Usage

Launch n8n:

```bash
n8n
```

Configure the SuiteCRM credentials under **Settings > Credentials > Suite CRM API**.

Add the **Suite CRM** node to your workflow and select the operation and resource.

![SuiteCRM node parameters](nodes/SuiteCrm/suiteCrm.png)

## Credentials Setup

Ensure your SuiteCRM v8 instance has OAuth2 keys configured:

```bash
cd /path/to/SuiteCRM/public/legacy/Api/V8/OAuth2
openssl genrsa -out private.key 2048
openssl rsa -in private.key -pubout -out public.key
chmod 600 private.key public.key
chown www-data:www-data private.key public.key
```

## Supported Resources & Operations

- **Module**: create, get, getAll, update, delete
- **Relationship**: getAll (retrieve related records)
- **Link**: operations for link management
- **Swagger**: fetch API documentation dynamically
- **Logout**: invalidate the current session

For detailed parameter options, refer to the node properties in the n8n Editor UI.

## Roadmap & Improvements

- Add pagination support for large result sets
- Implement dynamic option loading for module names and fields
- Enhance error handling and detailed logging
- Expand unit and end-to-end test coverage
- Support SuiteCRM community and on-premises editions

## Contributing

Contributions are welcome! Please open issues or submit pull requests on GitHub:
https://github.com/quansenB/n8n-nodes-suitecrm

## License

GPL-3.0 © Iñaki Breinbauer
