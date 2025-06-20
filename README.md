# IOE-UI and Backend API

This project contains a React frontend (`ioe-ui`) and an ASP.NET Core backend (`ioe-api`) that work together to securely browse and preview files from an Azure Blob Storage container.
## Architecture Overview

The React frontend communicates with the ASP.NET Core API which retrieves files from an Azure Blob Storage container. The API exposes a small set of endpoints used by the UI to list available files and preview their contents.

## Local Development Setup

To run this project locally, you need to run both the frontend and backend servers simultaneously.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js and npm](https://nodejs.org/en/)
- An Azure Storage Account with a configured container and files.

---

### 1. Configure and Run the Backend API

The backend API is responsible for securely connecting to Azure Storage. It requires a connection string to be set as an environment variable for local testing.

1.  **Open a terminal** in the project's root directory.

2.  **Set the Azure Storage Connection String:**
    Export the connection string as an environment variable. This command is for the current terminal session only and is not stored in your git history.
    
    ```bash
    export ConnectionStrings__StorageAccount="<YOUR_AZURE_STORAGE_CONNECTION_STRING>"
    ```
    *Replace `<YOUR_AZURE_STORAGE_CONNECTION_STRING>` with your actual key.*
    - The `AudiencesController` expects files in the `fs-partner` container under the `landing/` folder. Update the controller if your storage layout differs.


3.  **Navigate to the API directory and run the server:**

    ```bash
    cd ioe-api
    dotnet run
    ```

4.  The API will start and listen on a local port (e.g., `http://localhost:5192`). Keep this terminal window open.

---

### 2. Configure and Run the Frontend Application

The React frontend communicates with the backend via a proxy configured in `package.json`.

1.  **Open a new, separate terminal** in the project's root directory.

2.  **Navigate to the frontend directory and install dependencies:**

    ```bash
    cd ioe-ui 
    npm install
    ```
    *(If you are running this for the first time or have new packages)*

3.  **Start the React development server:**

    ```bash
    npm start
    ```

4.  Your default browser should open to `http://localhost:3000`. The application will now be running and connected to your local backend API.

---

## Testing the Application

- Navigate to the "Campaign Identification" page in the browser.
- The **"Available Files"** dropdown should populate with a list of files from your Azure Storage `landing/` directory.
- Selecting a file should display a preview of its contents in a table below.

## Running the Test Suite

From the `ioe-ui` directory you can execute all Jest tests with:

```bash
npm test
```

The included `App.test.tsx` currently fails with `ReferenceError: React is not defined`. This is due to the Jest/Babel configuration and does not affect the running application.

## API Endpoints

The backend exposes a small set of endpoints:

- `GET /api/audiences/available-files` returns a list of CSV file names located in `landing/`.
- `GET /api/audiences/file-preview?fileName=<name>` returns the parsed CSV rows for the requested file.

When the API runs in development mode you can explore these endpoints via Swagger at `http://localhost:5192/swagger`.

## Production Build & Deployment

To create a production build of the React app run:

```bash
npm run build
```

This generates static files in the `build/` directory that can be served by any web server. For the API you can publish a self-contained build with:

```bash
dotnet publish -c Release
```

Deploy the published output along with the contents of `build/` to your hosting environment of choice.
