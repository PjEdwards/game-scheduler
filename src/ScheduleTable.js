import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
    minHeight: 200
  },
  header: {
    backgroundColor: '#cecece'
  },
  subheader: {
    backgroundColor: '#b9b9ff'
  }
});

function createData(schedule) {
  let data = [];
  for (let date in schedule) {
    // Row with just the game date
    data.push({
      name: date,
      gameDate: date,
      teams: null,
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


export default function ScheduleTable(props) {
  const classes = useStyles();
  const { schedule } = props;
  const rows = createData(schedule);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" id="exportMe">
        <TableHead>
          <TableRow className={classes.header}>
            <TableCell>Team 1</TableCell>
            <TableCell>Team 2</TableCell>
            <TableCell>Field</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            if (row.gameDate) {
              return (
                <TableRow key={row.name} className={classes.subheader}>
                  <TableCell colSpan={4}>{row.gameDate}</TableCell>
                </TableRow>
              )
            } else {
              return (
                <TableRow key={row.name}>
                  <TableCell>{row.team1}</TableCell>
                  <TableCell>{row.team2}</TableCell>
                  <TableCell>{row.field}</TableCell>
                  <TableCell>{row.time}</TableCell>
                </TableRow>
              )
            }

          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
