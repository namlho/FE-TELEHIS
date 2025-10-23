import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const homeStyles = {
  root: {
    p: { xs: 2, sm: 3 },
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  searchBarContainer: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "stretch", sm: "center" },
    gap: 2,
    mb: 3,
  },
  searchInput: {
    flex: 1,
    maxWidth: { xs: "100%", sm: 500 },
    backgroundColor: "#fff",
    "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } },
  },
  filterButton: {
    minWidth: { xs: "100%", sm: 100 },
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    px: 2,
    py: 1,
  },
  actionButtonsContainer: {
    display: "flex",
    justifyContent: { xs: "center", sm: "flex-end" },
    gap: 2,
    mb: 3,
    flexWrap: "wrap",
  },
  importButton: {
    minWidth: { xs: 90, sm: 100 },
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    px: 2,
    py: 1,
    backgroundColor: "#1976d2",
    "&:hover": { backgroundColor: "#1565c0" },
  },
  exportButton: {
    minWidth: { xs: 90, sm: 100 },
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    px: 2,
    py: 1,
    backgroundColor: "#ab47bc",
    "&:hover": { backgroundColor: "#9c27b0" },
  },
  tableContainer: {
    boxShadow: { xs: "none", sm: "0 4px 6px rgba(0,0,0,0.1)" },
    borderRadius: { xs: 0, sm: 2 },
    overflow: "auto",
    "&::-webkit-scrollbar": {
      height: 8,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: 4,
    },
  },
  tableTitle: {
    py: 3,
    borderBottom: "1px solid #e0e0e0",
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
  },
  tableCell: {
    padding: { xs: "8px 12px", sm: "16px 24px" },
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    whiteSpace: "nowrap",
  },
  editButton: {
    minWidth: { xs: 70, sm: 100 },
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    px: { xs: 1, sm: 2 },
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    mt: 3,
  },
  addColumnContainer: {
    mt: 3,
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
  },
  addColumnTextField: {
    flex: 1,
    "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } },
  },
  addColumnButton: {
    minWidth: { xs: "100%", sm: 150 },
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    py: 1,
  },
};

export default homeStyles;