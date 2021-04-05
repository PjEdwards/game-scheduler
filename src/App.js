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
import ListTable from './ListTable';
import generateSchedule from './scheduler';
import ScheduleTable from './ScheduleTable';
import { Paper } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    margin: theme.spacing(3),
  },
  textfield: {
    width: '86%'
  },
  submit: {
    margin: theme.spacing(0),
    width: '40%'
  },
  reset: {
    margin: theme.spacing(0, 1, 0),
    width: '20%'
  },
  example: {
    margin: theme.spacing(0, 1, 0),
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
  'SM Storm',
  'Team Awesome'
]

const DEFAULT_DATES = [
  'game-1',
  'game-2',
  'game-3',
  'game-4',
  'game-5',
  'May 7',
  'Groundhog Day',
  'Tourney A',
  'Last Game'
]

export default function SignUp() {
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
          Step 1: Enter all team names<br />
          Step 2: Enter all game dates as text<br />
          Step 3: Click the "Generate Schedule" button. The created schedule is shown at the bottom of the page.<br />
          Step 4: If desired, click the "Generate Schedule" button again to re-generate a different random schedule.

        </Typography>
        <div className={classes.paper}>
          <Grid container spacing={3}>
          <Grid item xs={12} sm={12} style={{textAlign: "center"}}>
              <Button
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleGenerateSchedule}
              >
                Generate Schedule
              </Button>
              <Button
                variant="contained"
                color="secondary"
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
              <ListTable name="Dates" rows={dates} handleRemoveItem={handleRemoveItem} />
            </Grid>
          </Grid>
          <br />
          <ScheduleTable schedule={schedule} className={classes.form} />
        </div>
      </div>
    </Container>
  );
}