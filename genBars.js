const fs = require("fs");
const path = require("path");
const all = require("./stats/all.json");
const bitcoin = require("./stats/bitcoin.json");
const display = require("./stats/display.json");
const hidden = require("./stats/hidden.json");
const landing = require("./stats/landing.json");
const visibility = require("./stats/visibility.json");

const bars = [all, bitcoin, display, hidden, landing, visibility]
  .map(({ averages, ...rest }) => ({
    ...rest,
    averages: averages.filter(({ score }) => !score)
  }))
  .reduce((prev, { label, averages }) => {
    const values = averages.reduce(
      (acc, { avg, groupLabel }) => {
        acc[groupLabel] = Math.floor(avg);
        acc.avg = acc.avg + avg;
        return acc;
      },
      { avg: 0 }
    );
    return prev.concat({ label, ...values });
  }, [])
  .sort((a, b) => a.avg - b.avg)
  .map(({ avg, ...rest }) => ({ ...rest }));

fs.writeFile(
  path.join(__dirname, "./presentation/bars.json"),
  JSON.stringify(bars),
  err => {
    if (err) return console.log(err);
    return console.log("Successfully saved data as bars");
  }
);

const highlights = [all, bitcoin, display, hidden, landing, visibility]
  .map(({ averages, ...rest }) => ({
    ...rest,
    averages: averages.filter(({ score }) => score)
  }))
  .reduce((prev, { label, averages }) => {
    const values = averages.reduce(
      (acc, { avg, groupLabel }) => {
        acc[groupLabel] = Math.floor(avg);
        acc.avg = acc.avg + avg;
        return acc;
      },
      { avg: 0 }
    );
    return prev.concat({ label, ...values });
  }, [])
  .sort((a, b) => a.avg - b.avg)
  .map(({ avg, ...rest }) => ({ ...rest }));

fs.writeFile(
  path.join(__dirname, "./presentation/highlights.json"),
  JSON.stringify(highlights),
  err => {
    if (err) return console.log(err);
    return console.log("Successfully saved data as highlights");
  }
);
