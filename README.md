# Api Weaver

> Weaving your APIs into TypeScript !

A powerful CLI tool that generates TypeScript SDKs from OpenAPI specifications, making API integration seamless and type-safe.

## 🚀 Installation

Install Api Weaver globally via npm:

```bash
npm install -g api-weaver
```

## 📖 Usage

Api Weaver provides a simple command-line interface to generate TypeScript SDKs from your OpenAPI specifications.

### Basic Syntax

```bash
api-weaver <COMMANDS>
```

**or use the shorter alias:**

```bash
apiva <COMMANDS>
```

### Generate Command

Generate a TypeScript SDK from an OpenAPI specification:

```bash
api-weaver generate -f <openapi-file> -o <output-directory> -n <sdk-name>
```

**Aliases:** `g`, `gen`

#### Required Options

| Option | Flag | Description |
|--------|------|-------------|
| `--file` | `-f` | Path to the OpenAPI specification file (JSON format) |
| `--out` | `-o` | Output directory for the generated SDK files |
| `--name` | `-n` | Name for the generated SDK |

#### Examples

```bash
# Generate SDK from OpenAPI file
api-weaver generate -f ./api-spec.json -o ./generated-sdk -n MyApiSdk

# Using aliases
apiva g -f ./swagger.json -o ./sdk -n UserApi

# Full command with long flags
api-weaver generate --file ./openapi.json --out ./output --name PaymentAPI
```

## 📁 Output Structure

The generated SDK will include:

- **Type definitions** - TypeScript interfaces and types based on your OpenAPI schemas
- **API clients** - Ready-to-use client classes for each API endpoint
- **Models** - Data models corresponding to your API schemas
- **Enums** - Enumeration types from your OpenAPI specification

## 🔧 Features

- ✅ **OpenAPI 3.x Support** - Full compatibility with OpenAPI 3.x specifications
- ✅ **Type Safety** - Generate fully typed TypeScript code
- ✅ **Automatic Client Generation** - Create API clients for all endpoints
- ✅ **Schema Validation** - Built-in validation for OpenAPI specifications
- ✅ **Flexible Output** - Customizable output directory and SDK naming
- ✅ **CLI Friendly** - Simple command-line interface with helpful aliases

## 📋 Requirements

- Node.js (version 14 or higher)
- Valid OpenAPI 3.x specification file in JSON format

## 🛠️ Development

If you want to contribute or run Api Weaver from source:

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run start:dev

# Run tests
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please file an issue on the project repository.

---

**Author:** Aka-Amir

**Version:** 0.0.3