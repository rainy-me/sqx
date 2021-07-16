// @ts-check

const path = require("node:path");
const esbuild = require("esbuild");
const execa = require("execa");
const chalk = require("chalk");

/**
 * @type {import('execa').ExecaChildProcess | undefined}
 */
let serverProcess;
let outfile = path.join(__dirname, "../dist/server.js");

/**
 *
 * @param {import('esbuild').BuildResult} result
 */
const run = async (result) => {
  let _ = result;
  console.log(chalk`{cyan [server]} watch build succeeded: `);

  try {
    serverProcess?.kill();
    serverProcess = execa("node", [outfile], {
      stdio: "inherit",
    });
    await serverProcess;
  } catch (e) {
    if (e.signal === "SIGTERM") {
      console.log(chalk`{cyan [server]} restarting`);
      return;
    }
    console.error(e);
  }
};

esbuild
  .build({
    platform: "node",
    incremental: true,
    entryPoints: [path.join(__dirname, "index.ts")],
    outfile,
    bundle: true,
    external: ["knex"],
    watch: {
      async onRebuild(error, result) {
        if (error) {
          console.error("watch build failed:", error);
          return;
        }
        await run(result);
      },
    },
  })
  .then(run);
