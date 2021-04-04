import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const columns = [
  { id: 'name', label: 'Props', minWidth: 190 },
  { id: 'deleteme', label: 'Remove', minWidth: 80 }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    minHeight: 340,
  },
});

function createData(items) {
  if (items) {
    return items.map(item => {
      return { name: item }
    });
  } else {
    return [];
  }
}

export default function StickyHeadTable(props) {
  const classes = useStyles();
  let { name, rows, handleRemoveItem } = props;

  rows = createData(rows);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                  <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow key={row.name}>
                  {columns.map((column) => {
                    if (column.id === 'deleteme') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <IconButton id={`${name}-${row.name}`} aria-label="delete" className={classes.margin} onClick={() => handleRemoveItem(name, row.name)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      );
                    } else {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
