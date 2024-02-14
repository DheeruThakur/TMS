import { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  useDeletePostMutation,
  usePositionListQuery,
} from "../../../redux/services/position";
import { Box, IconButton, TableSortLabel } from "@mui/material";
import { Delete, ModeEdit } from "@mui/icons-material";
import TableToolBar from "../../../components/TableToolBar";
import Loader from "../../../components/Loader";
import AddPosition from "../../../components/Position/AddPosition";

interface Column {
  id: "id" | "name" | "totalMembers" | "status" | "action" | "team";
  label: string;
  maxWidth?: number;
  align?: "right";
  status?: string;
}

const columns: readonly Column[] = [
  { id: "id", label: "#id", maxWidth: 100 },
  { id: "name", label: "Name", maxWidth: 100 },
  { id: "team", label: "Team Name", maxWidth: 100 },
  {
    id: "totalMembers",
    label: "Total Members",
    maxWidth: 100,
  },
  {
    id: "status",
    label: "Status",
  },
];
type Order = "asc" | "desc";

export default function Position() {
  console.log("Position page is rendering");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<string>("id");
  const { data, isFetching, isLoading } = usePositionListQuery({
    page,
    rowsPerPage,
    orderBy,
    order,
  });

  const [deletePosition, { isLoading: deletePostLoading }] =
    useDeletePostMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const deletePositionHandler = (id: string) => async () => {
    console.log(id);
    await deletePosition(id);
  };

  return (
    <Box
      sx={{
        margin: "15px",
      }}
    >
      {isLoading && <Loader size={100} thickness={1.5} />}
      {data && (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableToolBar
            numSelected={0}
            title="Position & Roles"
            component={AddPosition}
            toolTipText="Add Position"
          />
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <caption>Team listing with stats</caption>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sortDirection={orderBy === column.id ? order : "asc"}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              {/* {true && <Loader size={50} thickness={2} />} */}
              <TableBody>
                {!isFetching &&
                  data.positionList?.map((row) => {
                    return (
                      <TableRow hover tabIndex={-1} key={row._id}>
                        <TableCell>
                          {row._id.substring(row._id.length - 6)}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.team.name || "null"}</TableCell>
                        <TableCell>{row.totalMembers || 0}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                          <IconButton aria-label="delete" color="success">
                            <ModeEdit />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={deletePositionHandler(row._id)}
                          >
                            {deletePostLoading ? <Loader /> : <Delete />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={data?.totalPosition || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
}
