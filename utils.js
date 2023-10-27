/**
 * Parses a "YYYYMMDD" date notation into a JS Date.
 *
 * @param {string} date
 */
export function parseDate(date) {
  let year = date.substring(0, 4);
  let month = date.substring(4, 6);
  let day = date.substring(6, 8);

  return new Date(year, month - 1, day);
}

/**
 * Parses a raw row into a usable row.
 *
 * @param {string[]} row
 */
export function parseRow(row) {
  if (!row) throw new Error('parseRow called without a row');
  // God forbid what I'm about to do.
  const result = {};

  // Ignoring the first column. For some reason the thing always has the same
  // value and it's not even described in the documentation.
  result.date = parseDate(row[1]);
  result.hour = row[2];
  result.meanDir = row[3];
  result.meanSpeedLastHour = row[4];
  result.meanSpeedLastTenMins = row[5];
  result.maxGust = row[6];
  result.temp = row[7];
  // For some reason, minTemp is empty sometimes, meaning it turns into an
  // empty string. It's the end consumer's responsibility to take care of this!
  result.minTemp = row[8];
  result.dewTemp = row[9];
  result.sunDuration = row[10];
  result.radiation = row[11];
  result.precipDuration = row[12];
  result.hourlyPrecipAmount = row[13];
  result.airPressure = row[14];
  result.horVisibility = row[15];
  result.cloudCover = row[16];
  result.relativeHumidity = row[17];
  // This, too, is sometimes empty. Once again a case to take care of for the
  // end consumer.
  result.weatherCode = row[18];
  result.observationMethod = row[18];
  result.fog = row[19];
  result.rainfall = row[20];
  result.snow = row[21];
  result.thunder = row[22];
  result.iceFormation = row[23];

  return result;
}

/**
 * Typechecks the entire row and sets values to '[INVALID]' if they are wrong.
 *
 * @param {Object} row
 */
export function validateRow(row) {
  // There currently aren't any other cases of this... but you get the gist.
  // The function should go over every property and check if they are of the
  // right type. If not, sets it to '[INVALID]'.
  if (isNaN(parseInt(row.temp))) row.temp = '[INVALID]';
  return row;
}

/**
 * Sets the correct types of all properties on a row.
 *
 * @param {Object} row
 */
export function transformRow(row) {
  for (let key of Object.keys(row)) {
    if (key === 'date' || row[key] === '[INVALID]') continue;
    row[key] = parseInt(row[key]);
    if (isNaN(row[key])) row[key] = '[UNKNOWN]';
  }

  return row;
}
