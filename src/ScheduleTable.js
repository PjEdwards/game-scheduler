import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(schedule) {
  let data = [];
  for (let date in schedule) {
    // Row with just the game date
    data.push({
      name: date,
      gameDate: date,
      team1: null,
      team2: null,
      field: null,
      time: null
    });
    // Rows with all the matches
    schedule[date].forEach((match, idx) => {
      data.push({
        name: `${date}-${idx}`,
        gaemDate: null,
        team1: match[0],
        team2: match[1],
        field: null,
        time: null
      });
    });
  }
  return data;
}

export default function BasicTable(props) {
  const classes = useStyles();
  const { schedule } = props;
  const rows = createData(schedule);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Game Date</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Field</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.gameDate}
              </TableCell>
              <TableCell>{row.team1}</TableCell>
              <TableCell>{row.team2}</TableCell>
              <TableCell>{row.field}</TableCell>
              <TableCell>{row.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
