# IOE-UI and Backend API

This project contains a React frontend (`ioe-ui`) and an ASP.NET Core backend (`ioe-api`) that work together to create healthcare campaigns with secure file browsing and preview capabilities from Azure Blob Storage.

## 🏗️ Project Overview

The application is a multi-step campaign creation wizard designed for healthcare organizations. It allows users to:
- Create new healthcare campaigns with detailed information.
- Select a **Care-flow Stream** (`Healthcare Partner` or `DTC`) which determines the data source.
- Select target audiences from pre-ingested CSV files stored in different Azure Blob Storage containers.
- View an **instant validation summary** of the selected file, including member count and mandatory header checks.
- Preview audience data in a paginated, user-friendly table.
- Configure care gap interventions for the campaign.
- Navigate through a structured workflow using a custom-themed Material-UI stepper.

## 🎨 UI/UX Enhancements
The user interface has been significantly enhanced to provide a clear, intuitive, and branded experience.

- **Medical Guardian Theme**: A custom MUI theme (`src/theme.ts`) has been implemented using the brand's primary (deep purple `#4a246d`) and secondary (vibrant pink `#e5358a`) colors.
- **Improved Layout**: Forms are structured into logical sections using `<Paper>` and `<Typography>` for clear visual hierarchy.
- **Enriched File Selector**: The audience file dropdown now displays the file's name and last modified date, helping users select the correct version.
- **Proactive Validation**: An instant **Validation Summary** card appears upon file selection, providing immediate feedback on data quality.
- **Skeleton Loaders**: Instead of a generic spinner, skeleton screens that mimic the table layout are shown during data fetching, improving perceived performance.
- **Data Pagination**: The file preview table is now paginated, allowing users to inspect large datasets without cluttering the UI.

## 🛠️ Tech Stack

### Frontend (React/TypeScript)
- **Framework**: React 19.1.0 with TypeScript 4.9.5
- **UI Library**: Material-UI (MUI) v7.1.1 with Emotion
- **Icons**: `@mui/icons-material` for integrated iconography
- **Theming**: Custom MUI theme for brand alignment
- **State Management**: React Hooks (useState, useEffect)
- **Form Handling**: Controlled components with real-time validation
- **HTTP Client**: Native `fetch` API
- **Testing**: Jest with React Testing Library
- **Build Tool**: Create React App

### Backend (ASP.NET Core)
- **Framework**: ASP.NET Core 8.0
- **Language**: C#
- **Azure Integration**: Azure.Storage.Blobs 12.24.1
- **API**: Returns rich file metadata (name, size, modification date).
- **CSV Processing**: CsvHelper 33.1.0
- **API Documentation**: Swagger/OpenAPI with Swashbuckle

## 📁 Project Structure
```
ioe-ui/
├── 📁 ioe-api/                    # ASP.NET Core Backend
│   └── Controllers/
│       └── AudiencesController.cs  # API endpoints for file operations
├── 📁 src/                        # React Frontend Source
│   ├── App.tsx                   # Main application component with ThemeProvider
│   ├── CampaignInfo.tsx          # Step 1: Campaign Information & Audience
│   ├── CareGaps.tsx              # Step 2: Care Gap Selection
│   ├── AudienceSelector.tsx      # Advanced file selection & validation component
│   ├── theme.ts                  # Custom MUI theme file
│   └── index.tsx                 # Application entry point
├── package.json                   # Frontend dependencies and scripts
└── README.md                      # This file
```

## 🚀 Current Features Implemented

### Backend API (`ioe-api`)
- **Dynamic Container Logic**: Selects `fs-partner` or `fs-dtc` container based on "Care-flow Stream".
- **Rich File Metadata**: `GET /api/audiences/available-files` now returns file name, size, and modification date, sorted by date.
- **File Preview**: `GET /api/audiences/file-preview` returns parsed CSV data for the selected file.
- **Error Handling**: Gracefully handles requests for non-existent containers or files.

### Frontend Application (`ioe-ui`)
- **Themed Stepper**: A multi-step workflow (Campaign Info → Care Gaps → Review) styled with brand colors.
- **Campaign Information Form**: 
  - **Care-flow Stream**: Dropdown to select the data source.
  - **Partner Name**: Auto-populated, read-only field derived from the audience file.
  - Standard fields for Campaign Name (required) and Description.
- **Advanced Audience Selection**:
  - Dropdown enriched with file modification dates.
  - **Validation Summary Card**:
    - ✅ Confirms total members found.
    - ✅⚠️ Validates the presence of the strictly required `salesforce_account_number` header.
  - **Paginated Preview Table**: Allows easy inspection of large audience files.
  - **Skeleton Loading State**: Provides a better user experience while fetching data.
- **Care Gap Configuration**: Checkbox-based selection interface for configuring campaign interventions.

## 🔧 Local Development Setup

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

## 🧪 Testing the Application

- Navigate to the "Create New Campaign" page.
- The UI should reflect the new Medical Guardian theme (purple and pink).
- **Step 1 - Campaign Info**:
  - Select a "Care-flow Stream".
  - The "Available Files" dropdown will populate. Notice the file dates next to the names.
  - Select a file.
    - The "Partner Name" field should auto-fill.
    - The "Validation Summary" card will appear, showing member count and header status.
    - A paginated preview of the file will appear below. Test the pagination controls.
- Proceed to "Step 2 - Care Gaps" and select interventions.

## 🔍 API Endpoints

### Audiences Controller
- `GET /api/audiences/available-files` - Returns list of CSV files in the landing zone
- `GET /api/audiences/file-preview` - Returns parsed CSV data for the selected file

### Swagger Documentation
- Available at `http://localhost:5192/swagger` when running in development mode

## 📋 Development Status

### ✅ Completed Features
- [x] Backend API with Azure Blob Storage integration
- [x] CSV file listing and preview functionality
- [x] Multi-step campaign creation workflow
- [x] Campaign information form with validation
- [x] Audience file selection with preview
- [x] Care gap configuration interface
- [x] Material-UI responsive design
- [x] TypeScript type safety
- [x] Error handling and loading states
- [x] Development proxy configuration

### 🚧 In Progress / Planned Features
- [ ] Review step implementation
- [ ] Campaign submission and storage
- [ ] User authentication and authorization
- [ ] Campaign management dashboard
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] Unit and integration tests
- [ ] Production deployment configuration

## 🤝 Contributing

This project uses a modern development stack with TypeScript for type safety and Material-UI for consistent design. When contributing:

1. Follow TypeScript best practices
2. Use Material-UI components for UI consistency
3. Implement proper error handling
4. Add tests for new features
5. Update this README for significant changes

## 📝 Notes for Developers

- The application uses a proxy configuration in `package.json` to forward API calls from the React dev server to the ASP.NET Core backend
- Azure Storage connection string should be configured via environment variables for security
- CSV files are expected to be in the `landing/` directory of the `fs-partner` container
- The frontend uses React 19 with the new JSX transform
- All components are functional components using React Hooks
