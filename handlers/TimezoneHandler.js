const fs = require('fs');
const path = require('path');

// Path to the JSON file storing timezones
const timezonesPath = path.join(__dirname, '../data/timezones.json');

// Ensure that the timezones.json file exists, if not, create it
function ensureTimezoneFileExists() {
    if (!fs.existsSync(timezonesPath)) {
        console.log('timezones.json does not exist. Creating a new file.');
        fs.writeFileSync(timezonesPath, JSON.stringify({}, null, 4), 'utf-8');
    }
}

// Save a user's timezone to the JSON file
function saveTimezone(userId, timezone) {
    ensureTimezoneFileExists();
    const timezones = readTimezones();
    timezones[userId] = { timezone };
    fs.writeFileSync(timezonesPath, JSON.stringify(timezones, null, 4), 'utf-8');
}

// Read the timezones from the JSON file
function readTimezones() {
    ensureTimezoneFileExists();
    const data = fs.readFileSync(timezonesPath, 'utf-8');
    return JSON.parse(data);
}

// Get a user's timezone from the JSON file
function getUserTimezone(userId) {
    const timezones = readTimezones();
    return timezones[userId]?.timezone || null;
}

module.exports = {
    saveTimezone,
    getUserTimezone,
    ensureTimezoneFileExists,
};
