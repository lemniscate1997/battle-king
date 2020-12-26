import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TableSortLabel,
  Toolbar, Typography, Paper, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

function descendingComparator(a, b, orderBy) {
  return (b[orderBy] < a[orderBy]) ? -1 : (b[orderBy] > a[orderBy]) ? 1 : 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', label: 'Battle Name', sortable: true },
  { id: 'year', label: 'Year', sortable: true },
  { id: 'attacker_king', label: 'Attacker King', sortable: true },
  { id: 'defender_king', label: 'Defender King', sortable: true },
  { id: 'battle_type', label: 'Battle Type', sortable: true },
  { id: 'attacker_size', label: 'Attacker Size', sortable: false },
  { id: 'defender_size', label: 'Defender Size', sortable: false },
  { id: 'attacker_outcome', label: 'Battle Result', sortable: true },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id}
            className="font-weight-bolder"
            align={'left'} padding={'default'}
            sortDirection={orderBy === headCell.id ? order : false}>
              {
                headCell.sortable === true ?
                  (<TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={createSortHandler(headCell.id)}>
                    {headCell.label}
                  </TableSortLabel>) : headCell.label
              }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = ({locations, handleSearch}) => {
  return (
    <Toolbar className="ml-3 mb-4 pt-4">
      <Typography className="font-weight-bolder" variant="h5" id="tableTitle" component="div">
        Battles
      </Typography>
      <div className="text-left ml-auto mr-3">
        {
          locations.length !== 0 && 
          <Autocomplete id="combo-box-demo" style={{ width: 200 }}
              options={locations} getOptionLabel={(option) => option}
              onChange={(event, value, change) => handleSearch(value)}
              renderInput={(params) => <TextField {...params} label="Battle Location" variant="outlined" />} />
        }
      </div>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export function BattleListView({battles=[], handleClick, locations=[], fetchBattles}) {
  const rows = battles;
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEmptyViewData = (data, replase='---', validation=true) => (data && validation ? data : replase);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 
  const handleSearch = (location) => {
    setPage(0);
    fetchBattles(location);
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={`my-4 ${classes.root}`}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar locations={locations} handleSearch={handleSearch} />
        <TableContainer className="px-4">
          <Table
            className={classes.table}
            size={'medium'}
            aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length} />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover key={row._id}
                      onClick={(event) => handleClick(row)}>
                      <TableCell component="th" id={row._id} scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{handleEmptyViewData(row.year)}</TableCell>
                      <TableCell align="left">{handleEmptyViewData(row.attacker_king)}</TableCell>
                      <TableCell align="left">{handleEmptyViewData(row.defender_king)}</TableCell>
                      <TableCell align="left">{handleEmptyViewData(row.battle_type)}</TableCell>
                      <TableCell align="left">{handleEmptyViewData(row.attacker_size)}</TableCell>
                      <TableCell align="left">{handleEmptyViewData(row.defender_size)}</TableCell>
                      <TableCell align="left">{handleEmptyViewData(`Attacker ${row.attacker_outcome}`, 'Unknown', row.attacker_outcome)}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" className="mr-3 mt-4 pb-1"
          count={rows.length} rowsPerPage={rowsPerPage} page={page}
          onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage} />
      </Paper>
    </div>
  );
}
