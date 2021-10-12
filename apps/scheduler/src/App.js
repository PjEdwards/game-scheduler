import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { ListTable, ScheduleTable } from '@soccer/tables';

import generateSchedule from './scheduler';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  textfield: {
    width: '86%'
  },
  submit: {
    margin: theme.spacing(0, 1),
    width: '30%'
  },
  download: {
    margin: theme.spacing(0, 1),
    width: '20%'
  },
  reset: {
    margin: theme.spacing(0, 1),
    width: '20%',
    backgroundColor: '#f39a9a'
  },
  example: {
    margin: theme.spacing(0, 1),
    width: '20%'
  }
}));

const DEFAULT_TEAMS = [
  'Awesome Possums',
  'Totally Tacos',
  'Power Pidgeons',
  'Kickin Kiddos',
  'Coach Payne',
  'Dream Team',
  'Mandalorian Pizza',
  'Team Awesome'
]

const DEFAULT_DATES = [
  'game-1',
  'May 7',
  'game-2',
  'Groundhog Day',
  'game-3',
  'game-4',
  'game-5',
  'Last Game'
]

export default function App() {
  const classes = useStyles();

  const [teams, setTeams] = useState([]);
  const [dates, setDates] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [schedule, setSchedule] = useState([]);


  function handleClearAll() {
    setTeams([]);
    setDates([]);
    setSchedule([]);
    setTeamName('');
    setGameDate('');
  }

  function handleShowExample() {
    setTeams(DEFAULT_TEAMS);
    setDates(DEFAULT_DATES);
    invokeScheduler(DEFAULT_TEAMS, DEFAULT_DATES);
  }

  function handleGenerateSchedule() {
    invokeScheduler(teams, dates);
  }

  function invokeScheduler(teams, dates) {
    try {
      const schedule = generateSchedule(teams, dates);
      setSchedule(schedule);
    } catch (e) {
      alert(e.message);
    }
  }

  function handleRemoveItem(name, item) {
    if (name === 'Teams') {
      setTeams(teams.filter(t => t !== item));
    } else if (name === 'Dates') {
      setDates(dates.filter(d => d !== item));
    }
  }

  function handleAddItem(e) {
    let tmp;
    if (e.currentTarget.id === 'addTeam') {
      tmp = teams.filter(t => t !== teamName);
      tmp.push(teamName);
      setTeams(tmp);
      setTeamName('');
    } else if (e.currentTarget.id === 'addDate') {
      tmp = dates.filter(d => d !== gameDate);
      tmp.push(gameDate);
      setDates(tmp);
      setGameDate('');
    }
  }

  function handleTextFieldChange(e) {
    if (e.currentTarget.id === 'teamName') {
      setTeamName(e.target.value);
    } else if (e.currentTarget.id === 'gameDate') {
      setGameDate(e.target.value);
    }
  }

  function toCsv(table) {
    // Query all rows
    const rows = table.querySelectorAll('tr');

    return [].slice.call(rows)
        .map(function(row) {
            // Query all cells
            const cells = row.querySelectorAll('th,td');
            return [].slice.call(cells)
                .map(function(cell) {
                    return cell.textContent;
                })
                .join(',');
        })
        .join('\n');
  };

  function handleDownload() {

    if (schedule.length === 0) {
      alert('There is nothing to download yet.');
      return;
    }

    const table = document.getElementById('exportMe');
    const csv = toCsv(table);
    const link = document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    link.setAttribute('download', 'schedule.csv');

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };


  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <EventNoteIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create a Game Schedule
        </Typography>
        <Typography component="p">
          This tool generates a random collection of matches that ensures that each team plays on every game day, that each team plays every other team, and that each team plays the minimum number of repeat matches.<br /><br />
          Step 1: Enter all team names (there have to be an even number of teams)<br />
          Step 2: Enter all game dates as text<br />
          Step 3: Click the "Generate Schedule" button. The created schedule is shown at the bottom of the page.<br />
          Step 4: If desired, click the "Generate Schedule" button again to re-generate a different random schedule.<br />
          Step 5: Click the "Download CSV" button to download the generated schedule as a CSV file
        </Typography>
        <div className={classes.paper}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={12} style={{textAlign: "center"}}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={handleGenerateSchedule}
              >
                Generate Schedule
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.download}
                onClick={handleDownload}
                disabled={schedule.length===0}
              >
                Download CSV
              </Button>
              <Button
                variant="contained"
                className={classes.reset}
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                color="default"
                className={classes.example}
                onClick={handleShowExample}
              >
                Show Example
              </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <ScheduleTable schedule={schedule} className={classes.form} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textfield}
                name="teamName"
                variant="outlined"
                id="teamName"
                label="Add Team"
                size="small"
                onChange={handleTextFieldChange}
                onKeyDown={(e) => {
                  if (e.code == 'Enter') {
                    e.currentTarget.id = 'addTeam';
                    handleAddItem(e);
                  }
                }}
                value={teamName}
                />
              <IconButton id="addTeam" aria-label="add" className={classes.margin} onClick={handleAddItem}>
                <AddIcon />
              </IconButton>
              <ListTable name="Teams" rows={teams} handleRemoveItem={handleRemoveItem} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textfield}
                name="gameDate"
                variant="outlined"
                fullWidth
                id="gameDate"
                label="Add Game Date"
                size="small"
                onChange={handleTextFieldChange}
                onKeyDown={(e) => {
                  e.currentTarget.id = 'addDate';
                  if (e.code == 'Enter') {
                    handleAddItem(e);
                  }
                }}
                value={gameDate}
              />
              <IconButton id="addDate" aria-label="add" className={classes.margin} onClick={handleAddItem}>
                <AddIcon />
              </IconButton>
              <ListTable name="Games" rows={dates} handleRemoveItem={handleRemoveItem} />
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
}