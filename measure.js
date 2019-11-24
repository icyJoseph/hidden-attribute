const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const AUDITS = "audits";
const WORK = "mainthread-work-breakdown";
const FCP = "first-contentful-paint";
const FMP = "first-meaningful-paint";
const PWA = "load-fast-enough-for-pwa";

const avg = arr =>
  arr.length ? arr.reduce((acc, curr) => acc + curr, 0) / arr.length : 0;

const repeats = Array.from({ length: 20 }, (_, i) => i);

// slow on purpose to avoid spamming the used API's
fs.readdir(path.join(__dirname, "./results"), async (_, dirs) => {
  for (const dir of dirs) {
    console.log(`Checking out: ${dir}`);
    const checkout = spawn(`git checkout ${dir}`, { shell: true });
    await new Promise(resolve => {
      checkout.on("close", resolve);
    });
    let iteration;
    for (const repeat of repeats) {
      console.log(`Auditing: ${dir}`);
      const measure = spawn("yarn build:audit", {
        shell: true
      });

      await new Promise(resolve => {
        measure.on("close", resolve);
      });
      iteration = repeat;
    }

    console.log(`Done auditing ${dir}, ${iteration + 1} times`);

    let results = [];
    const all = await new Promise(accept => {
      fs.readdir(path.join(__dirname, "./results", dir), async (_, files) => {
        for (const file of files) {
          const data = await new Promise(resolve => {
            return fs.readFile(
              path.join(__dirname, "./results", dir, file),
              (err, data) => {
                if (err) return console.log(err);
                return resolve(JSON.parse(data));
              }
            );
          });
          results.push(data);
        }
        accept(results);
      });
    });

    const aggregate = all
      .filter(
        ({
          [AUDITS]: {
            [WORK]: { details }
          }
        }) => !!details
      )
      .reduce(
        (
          prev,
          {
            [AUDITS]: {
              [FCP]: { title: fcpTitle, numericValue: fcp, score: fcpScore },
              [FMP]: { title: fmpTitle, numericValue: fmp, score: fmpScore },
              [PWA]: { title: pwaTitle, numericValue: pwa, score: pwaScore },
              [WORK]: {
                details: { items }
              }
            }
          }
        ) =>
          prev.concat([
            ...items,
            {
              group: FCP,
              groupLabel: fcpTitle,
              duration: fcp,
              score: fcpScore
            },
            {
              group: FMP,
              groupLabel: fmpTitle,
              duration: fmp,
              score: fmpScore
            },
            {
              group: PWA,
              groupLabel: pwaTitle,
              duration: pwa,
              score: pwaScore
            }
          ]),
        []
      )
      .reduce((acc, { group, duration, ...rest }) => {
        const data = acc[group];
        if (data) {
          return {
            ...acc,
            [group]: { ...data, duration: data.duration.concat(duration) }
          };
        }
        return {
          ...acc,
          [group]: { group, duration: [duration], ...rest }
        };
      }, {});
    console.log(aggregate);
    const averages = Object.values(aggregate).map(({ duration, ...rest }) => ({
      ...rest,
      duration,
      avg: avg(duration)
    }));

    fs.writeFile(
      path.join(__dirname, "./stats", `${dir}.json`),
      JSON.stringify({ label: dir, averages }),
      err => {
        if (err) return console.log(err);
        return console.log("Done saving stats for: ", dir);
      }
    );
  }
});
