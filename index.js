const { flatten, isEqual } = require('lodash');
const { writeFileSync } = require('fs');

// Every coach has to play at every game
// Every coach has to play every other coach at least once
// Minimize the number of times teams play each other

const teams = [
  'Awesome Possums',
  'Fancy Farmers',
  'Totally Tacos',
  'Power Pidgeons',
  'Great Groundhogs',
  'Millipedes',
  'Kick Masters',
  'Sweet Feets']

const dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

const getUniqueCombinations = () => {
  let combos = []
  teams.forEach((coach1, idx1) => {
    teams.forEach((coach2, idx2) => {
      if (idx2 > idx1) {
        combos.push([coach1, coach2]);
      }
    })
  })
  return combos;
}

const getUniqueGames = (combos) => {
  let schedule = getPreviouslyPlayedGames();
  dates.forEach(d => {
    let games;
    if (Object.keys(schedule).includes(d)) {
      games = schedule[d];
    } else {
      games = [];
      combos.forEach(combo => {
        if (!flatten(games).includes(combo[0]) && !flatten(games).includes(combo[1])) {
          games.push(combo);
        }
      });
      schedule[d] = games;
    }
    combos = combos.filter(c => {
      for (let g of games) {
        if (isEqual(g, c)) return false;
      }
      return true;
    })
  });

  return schedule;
}

let combos = getUniqueCombinations();
let schedule = getUniqueGames(combos);
writeFileSync('schedule.json', JSON.stringify(schedule, null, 2));
