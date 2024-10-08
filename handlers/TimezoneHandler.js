import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Path to the JSON file storing timezones
const timezonesPath = join(process.cwd(), 'data/timezones.json');

// Ensure that the timezones.json file exists, if not, create it
export function ensureTimezoneFileExists() {
    if (!existsSync(timezonesPath)) {
        console.log('timezones.json does not exist. Creating a new file.');
        writeFileSync(timezonesPath, JSON.stringify({}, null, 4), 'utf-8');
    }
}

// Save a user's timezone to the JSON file
export function saveTimezone(userId, timezone) {
    ensureTimezoneFileExists();
    const timezones = readTimezones();
    timezones[userId] = { timezone };
    writeFileSync(timezonesPath, JSON.stringify(timezones, null, 4), 'utf-8');
}

// Read the timezones from the JSON file
function readTimezones() {
    ensureTimezoneFileExists();
    const data = readFileSync(timezonesPath, 'utf-8');
    return JSON.parse(data);
}

// Get a user's timezone from the JSON file
export function getUserTimezone(userId) {
    const timezones = readTimezones();
    return timezones[userId]?.timezone || null;
}