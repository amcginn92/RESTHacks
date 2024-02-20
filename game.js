import { capitalize } from './utils.js';
import * as events from "events";

// Get the upcoming due dates from syllabus API
export function getUpcomingDueDates() {
  const apiUrl = 'https://courses.ianapplebaum.com/api/syllabus/5'; // Replace '5' with the actual syllabus ID
  const headers = {
    'Authorization': 'Bearer z6xncUuPDynr7UATcVVa0vUjj4sLHzjdrB7zh6CO54fa4000',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  return new Promise((resolve, reject) => {
    fetch(apiUrl, { headers })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const events = data.events || [];

          // Create an array to store event information
          const eventInfoArray = [];

          events.forEach(event => {
            const eventId = event.id;
            const eventName = event.event_name;
            const eventDescription = event.event_description;
            const eventDate = event.event_date;


            // Log the event information
            // console.log(`Event ID: ${eventId}`);
            // console.log(`Event Name: ${eventName}`);
            // console.log(`Event Description: ${eventDescription}`);
            // console.log(`Event Date: ${eventDate}`);
            // console.log('\n');

            // Push event information to the array
            eventInfoArray.push({
              id: eventId,
              name: eventName,
              description: eventDescription,
              date: eventDate
            });
            const dateToCheck = "2024-04-22";
            const numberOfDays = 3; // Change this value based on your requirement

            if (isDateInNextDays(eventDate, numberOfDays)) {
              console.log(`${dateToCheck} is in the next ${numberOfDays} days.`);
              resolve(event);
            } else {
              // console.log(`${dateToCheck} is not in the next ${numberOfDays} days.`);
            }

          });

          // Resolve with the array of event information
          // resolve(eventInfoArray);
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
  });
}
function isDateInNextDays(dateString, numberOfDays) {
  // Parse the input date string into a Date object
  const inputDate = new Date(dateString);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds between the input date and the current date
  const timeDifference = inputDate - currentDate;

  // Calculate the difference in days
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  // Check if the date is within the specified number of days from the current date
  return daysDifference >= 0 && daysDifference <= numberOfDays;
}


export function getResult(p1, p2) {
  let gameResult;
  if (RPSChoices[p1.objectName] && RPSChoices[p1.objectName][p2.objectName]) {
    // o1 wins
    gameResult = {
      win: p1,
      lose: p2,
      verb: RPSChoices[p1.objectName][p2.objectName],
    };
  } else if (
    RPSChoices[p2.objectName] &&
    RPSChoices[p2.objectName][p1.objectName]
  ) {
    // o2 wins
    gameResult = {
      win: p2,
      lose: p1,
      verb: RPSChoices[p2.objectName][p1.objectName],
    };
  } else {
    // tie -- win/lose don't
    gameResult = { win: p1, lose: p2, verb: 'tie' };
  }

  return formatResult(gameResult);
}

function formatResult(result) {
  const { win, lose, verb } = result;
  return verb === 'tie'
    ? `<@${win.id}> and <@${lose.id}> draw with **${win.objectName}**`
    : `<@${win.id}>'s **${win.objectName}** ${verb} <@${lose.id}>'s **${lose.objectName}**`;
}

// this is just to figure out winner + verb
const RPSChoices = {
  rock: {
    description: 'sedimentary, igneous, or perhaps even metamorphic',
    virus: 'outwaits',
    computer: 'smashes',
    scissors: 'crushes',
  },
  cowboy: {
    description: 'yeehaw~',
    scissors: 'puts away',
    wumpus: 'lassos',
    rock: 'steel-toe kicks',
  },
  scissors: {
    description: 'careful ! sharp ! edges !!',
    paper: 'cuts',
    computer: 'cuts cord of',
    virus: 'cuts DNA of',
  },
  virus: {
    description: 'genetic mutation, malware, or something inbetween',
    cowboy: 'infects',
    computer: 'corrupts',
    wumpus: 'infects',
  },
  computer: {
    description: 'beep boop beep bzzrrhggggg',
    cowboy: 'overwhelms',
    paper: 'uninstalls firmware for',
    wumpus: 'deletes assets for',
  },
  wumpus: {
    description: 'the purple Discord fella',
    paper: 'draws picture on',
    rock: 'paints cute face on',
    scissors: 'admires own reflection in',
  },
  paper: {
    description: 'versatile and iconic',
    virus: 'ignores',
    cowboy: 'gives papercut to',
    rock: 'covers',
  },
};

export function getRPSChoices() {
  return Object.keys(RPSChoices);
}

// Function to fetch shuffled options for select menu
export function getShuffledOptions() {
  const allChoices = getRPSChoices();
  const options = [];

  for (let c of allChoices) {
    // Formatted for select menus
    // https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
    options.push({
      label: capitalize(c),
      value: c.toLowerCase(),
      description: RPSChoices[c]['description'],
    });
  }

  return options.sort(() => Math.random() - 0.5);
}
