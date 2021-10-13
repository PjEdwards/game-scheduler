import { difference, sample } from 'lodash';

// Every coach has to play at every game
// Every coach has to play every other coach at least once
// Minimize the number of times teams play each other

function _buildTeamMap(teams) {
  let teamMap = {}
  for (let team of teams) {
    teamMap[team] = teams.filter(t => t!== team)
  }
  return teamMap;
}

function _performValidations(teams, dates) {
  if (!teams || !dates || teams.length == 0 || dates.length == 0) {
    throw new Error('Please provide a list of teams and a list of dates');
  }
  if (teams.length % 2 !== 0) {
    throw new Error('There must be an even number of teams for this to work!')
  }
}

export default function generateSchedule(teams, dates) {

  _performValidations(teams, dates);

  let schedule = {};
  let _teamMap = _buildTeamMap(teams);

  for (let date of dates) {
    // console.log(`Scheduling ${date}`);

    let _retryCount = 0;
    let _alreadyScheduled = [];
    schedule[date] = [];

    // After every team combination has been scheduled, and there are still
    // game dates to fill, we can allow teams to play each other again
    if (_teamMap[teams[0]].length === 0) {
      _teamMap = _buildTeamMap(teams);
    }

    while (_alreadyScheduled.length < teams.length) {
      let team1, team2;
      // Get a random team from the list of all teams minus any
      // already schedule for this game day
      team1 = sample(difference(teams, _alreadyScheduled));
      // Get a second random team from the list of all teams
      // the first team hasn't played yet
      team2 = sample(difference(_teamMap[team1], _alreadyScheduled));

      // Sometimes the shifting combos for a given day will result in a
      // team that can't be matched. Start the day over. If we have started
      // the day over a bunch of times and aren't able to find a good
      // schedule, start the whole process over.
      if (!team1 || !team2) {
        if (++_retryCount > 200) {
          return generateSchedule(teams, dates);
        }
        schedule[date] = [];
        _alreadyScheduled = [];
        continue;
      }

      // Add this pair to the schedule and log in the tmp array
      // of already scheduled games this day
      schedule[date].push([team1, team2]);
      _alreadyScheduled.push(team1, team2);
    }

    // After finalizing the day's matches, remove the scheduled match
    // from each teams list of available subsequent matches
    for (let match of schedule[date]) {
      let t1 = match[0];
      let t2 = match[1];
      _teamMap[t1] = _teamMap[t1].filter(t => t !== t2);
      _teamMap[t2] = _teamMap[t2].filter(t => t !== t1);
    }
  }

  return schedule;
}