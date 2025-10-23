import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: { padding: 24, backgroundColor: "#f5f5f5" },
  contentContainer: { display: "flex", gap: 24, alignItems: "flex-start" },
  tableContainer: {
    flex: 1,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  searchBar: { marginBottom: 24, width: "100%", maxWidth: 500 },
  tableHeader: { backgroundColor: "#f8f9fa" },
  tableCell: { padding: "16px 24px" },
  editButton: { minWidth: 100 },
});