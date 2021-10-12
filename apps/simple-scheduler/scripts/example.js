const { writeFileSync } = require('fs');
const generateSchedule = require('../src/scheduler');

const teams = [
  'Awesome Possums',
  'Fancy Farmers',
  'Totally Tacos',
  'Power Pidgeons',
  'Great Groundhogs',
  'Milli pedes',
  'Kickin Kiddos',
  'Sweet Feets']

const dates = ['game-1', 'game-2', 'game-3', 'game-4', 'game-5', 'game-6', 'game-7', 'game-8', 'game-9']

const schedule = generateSchedule(teams, dates);
const output = JSON.stringify(schedule, null, 2);
console.log(output);
writeFileSync('schedule.json', output);
