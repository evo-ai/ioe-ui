# IOE-UI and Backend API

This project contains a React frontend (`ioe-ui`) and an ASP.NET Core backend (`ioe-api`) that work together to securely browse and preview files from an Azure Blob Storage container.
## Architecture Overview

The React frontend communicates with the ASP.NET Core API which retrieves files from an Azure Blob Storage container. The API exposes a small set of endpoints used by the UI to list available files and preview their contents.

## 🏗️ Project Overview

The application is a multi-step campaign creation wizard designed for the Medical Guardian Intelligent Orchestration Engine (IOE). It allows users to:
- Create new healthcare campaigns with detailed information.
- Select a **Care-flow Stream** (`Healthcare Partner` or `DTC`) which determines the data source.
- **Database-Driven Configuration**: Care gap selection is fully driven by a master `engage360.care_gaps` SQL database table, ensuring a single source of truth.
- Select target audiences from pre-ingested CSV files stored in different Azure Blob Storage containers.
- View an **instant validation summary** of the selected file, including member count and the number of recognized care gaps.
- Preview audience data in a paginated, user-friendly table.
- Configure care gap interventions using a **fully dynamic Command Center** interface.
- Navigate through a structured workflow with persistent state management across all steps.

## 🎨 UI/UX Enhancements
The user interface has been significantly enhanced to provide a clear, intuitive, and branded experience.

- **Medical Guardian Theme**: A custom MUI theme (`src/theme.ts`) using the brand's primary (`#4a246d`) and secondary (`#e5358a`) colors.
- **Dynamic Command Center UI**: The `CareGaps` component is now fully dynamic:
  - On application startup, it fetches the master list of all possible care gaps from the database via an API.
  - When a user selects an audience file, it fetches the list of available care gap flags (`_import_flag`) from that file.
  - The UI is **dynamically rendered** by filtering the master list against the available flags, ensuring only valid, data-backed care gaps can be selected.
  - Categories and options are generated on-the-fly with no hardcoded values.
- **Persistent Navigation**: Centralized navigation controls in a persistent footer that maintains state across step transitions.
- **Enriched File Selector**: The audience file dropdown displays the file's name and last modified date.
- **Proactive Validation**: An instant **Validation Summary** card appears upon file selection, providing immediate feedback on data quality, including the number of recognized care gaps found.
- **Skeleton Loaders**: Provides a better user experience while fetching data.
- **Data Pagination**: The file preview table is paginated, allowing users to inspect large datasets.

## 🛠️ Tech Stack

### Frontend (React/TypeScript)
- **Framework**: React 19.1.0 with TypeScript 4.9.5
- **UI Library**: Material-UI (MUI) v7.1.1 with Emotion
- **Icons**: `@mui/icons-material` for integrated iconography
- **State Management**: React Context API with `useReducer` for global state.
- **HTTP Client**: Native `fetch` API
- **Build Tool**: Create React App

### Backend (ASP.NET Core)
- **Framework**: ASP.NET Core 8.0
- **Language**: C#
- **Database**: **Microsoft SQL Server** with **Entity Framework Core 8.0**
- **Azure Integration**: Azure.Storage.Blobs 12.24.1
- **CSV Processing**: CsvHelper 33.1.0
- **API Documentation**: Swagger/OpenAPI with Swashbuckle

## 📁 Project Structure
```
ioe-ui/
├── 📁 ioe-api/                    # ASP.NET Core Backend
│   ├── Controllers/
│   │   ├── AudiencesController.cs  # API endpoints for file operations
│   │   └── CareGapsController.cs   # API endpoint for master care gap data
│   ├── Data/
│   │   └── ApplicationDbContext.cs # Entity Framework DbContext
│   └── Models/
│       └── CareGap.cs            # EF Core model for the care_gaps table
├── 📁 src/                        # React Frontend Source
│   ├── App.tsx                   # Main component, loads master data
│   ├── CampaignInfo.tsx          # Step 1: Campaign Information & Audience
│   ├── CareGaps.tsx              # Step 2: Fully dynamic Care Gap Selection
│   ├── AudienceSelector.tsx      # Fetches available care gap flags from files
│   └── contexts/
│       └── CampaignContext.tsx   # Global state with master/available lists
├── package.json
└── README.md
```

## 🚀 Current Features Implemented

### Backend API (`ioe-api`)
- **Database-Driven Care Gaps**: Connects to a SQL Server database using Entity Framework Core to fetch a master list of all available care gaps.
  - `GET /api/care-gaps`: Returns a complete list of all active care gap definitions from the `engage360.care_gaps` table.
- **Dynamic Audience File Analysis**:
  - `GET /api/audiences/file-headers`: Analyzes the header row of a specified CSV file in Azure Blob Storage and returns a simple list of column names that are potential care gap flags (ending in `_import_flag`).
- **Azure Blob Storage Integration**: Lists available files and provides file previews from Azure Blob Storage containers (`fs-partner` or `fs-dtc`).
- **Error Handling**: Gracefully handles requests for non-existent containers or files.

### Frontend Application (`ioe-ui`)
- **Fully Dynamic Care Gap Selection**:
    - On application startup, it fetches the master list of all possible care gaps from the `/api/care-gaps` endpoint.
    - When a user selects an audience file, it fetches the list of available `_import_flag`s from that specific file.
    - The "Care Gaps" screen is **dynamically rendered** by filtering the master list against the available flags from the file. This ensures only valid, data-backed care gaps can be selected.
- **Global State Management**: `CampaignContext` manages the master care gap list and the available flags from the selected file, providing a single source of truth to all components.
- **Advanced Audience Selection**:
  - Dropdown enriched with file modification dates.
  - **Validation Summary Card**:
    - ✅ Confirms total members found.
    - ✅⚠️ Validates the presence of the strictly required `salesforce_account_number` header.
    - ✅ Confirms the number of **recognized care gaps** found in the file.
  - Paginated preview of audience file data.
- **Themed Stepper**: A multi-step workflow (Campaign Info → Care Gaps → Review) styled with brand colors.

## 🔧 Local Development Setup

To run this project locally, you need to run both the frontend and backend servers simultaneously.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js and npm](https://nodejs.org/en/)
- An Azure Storage Account with a configured container and files.
- **Microsoft SQL Server**: An accessible SQL Server instance with the `engage360.care_gaps` table created and populated.

---

### 1. Configure and Run the Backend API

The backend API requires connection strings for both Azure Storage and your SQL Server database. These should be configured using the .NET Secret Manager for security.

1.  **Navigate to the API directory:**
    ```bash
    cd ioe-api
    ```

2.  **Set the Azure Storage Connection String:**
    ```bash
    dotnet user-secrets set "ConnectionStrings:StorageAccount" "<YOUR_AZURE_STORAGE_CONNECTION_STRING>"
    ```

3.  **Set the Database Connection String:**
    ```bash
    dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<YOUR_SQL_SERVER_CONNECTION_STRING>"
    ```

4.  **Run the server:**
    ```bash
    dotnet run
    ```
    The API will start and listen on a local port (e.g., `http://localhost:5192`).

---

### 2. Configure and Run the Frontend Application

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
    Your default browser should open to `http://localhost:3000`.

---

## 🧪 Testing the Application

- Navigate to the "Create New Campaign" page.
- **Step 1 - Campaign Info**:
  - Select a "Care-flow Stream".
  - Select an audience file.
  - The "Validation Summary" card should appear, showing the number of members and the **count of recognized care gaps** found in the file's headers.
- **Step 2 - Care Gaps**:
  - Verify that only the care gaps that were identified in the file are displayed as selectable options.
  - If a file with no recognized `_import_flag` headers is chosen, a message should appear indicating no care gaps are available.

## 🔍 API Endpoints

### CareGaps Controller
- `GET /api/care-gaps`: Returns the master list of all active care gaps from the database.

### Audiences Controller
- `GET /api/audiences/available-files`: Returns list of CSV files in the landing zone.
- `GET /api/audiences/file-headers`: Returns a list of headers from the specified file that end with `_import_flag`.
- `GET /api/audiences/file-preview`: Returns parsed CSV data for the selected file.

### Swagger Documentation
- Available at `http://localhost:5192/swagger` when running in development mode

## 📋 Development Status

### ✅ Completed Features
- [x] **Database-Driven Architecture**: System now driven by a master SQL database table for care gaps.
- [x] **Dynamic Care Gap UI**: The care gap selection UI is now fully dynamic based on the selected audience file.
- [x] Backend API with Azure Blob Storage integration
- [x] CSV file listing and preview functionality
- [x] Multi-step campaign creation workflow
- [x] Campaign information form with validation
- [x] Audience file selection with preview
- [x] Material-UI responsive design
- [x] TypeScript type safety
- [x] Error handling and loading states
- [x] Development proxy configuration
- [x] Global state management with React Context
- [x] Persistent navigation and state across wizard steps
- [x] Advanced file validation and preview features, **including recognized care gap counts**.

### 🚧 In Progress / Planned Features
- [ ] Review step implementation
- [ ] Campaign submission and storage
- [ ] User authentication and authorization
- [ ] Campaign management dashboard
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] Unit and integration tests
- [ ] Production deployment configuration
- [ ] Database-backed draft persistence (Phase 2)

## 🤝 Contributing

This project uses a modern development stack with TypeScript for type safety and Material-UI for consistent design. When contributing:

1. Follow TypeScript best practices
2. Use Material-UI components for UI consistency
3. Implement proper error handling
4. Add tests for new features
5. Update this README for significant changes

## 📝 Notes for Developers

- The application uses a proxy configuration in `package.json` to forward API calls from the React dev server to the ASP.NET Core backend.
- The frontend uses React 19 with the new JSX transform.
- All components are functional components using React Hooks.
