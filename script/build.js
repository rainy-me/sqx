// @ts-check
const esbuild = require("esbuild");
const execa = require("execa");
const chalk = require("chalk");
const { cac } = require("cac");
const { argv } = require("process");

const cli = cac();

cli
  .option("--entry <entry>", "")
  .option("--out <outfile>", "outfile")
  .option("--run", "run the built file")
  .option("--watch", "watch build and run")
  .option("--build", "build only");

/**
 * @typedef BuildServiceOptions
 * @property {Boolean} run
 * @property {Boolean} watch
 * @property {Boolean} build
 * @property {string} entry
 * @property {string} out
 */

const { options } = cli.parse();
const { entry, out, ...flags } = /** @type {BuildServiceOptions} */ (options);

/**
 * @type {import('execa').ExecaChildProcess | undefined}
 */
let runProcess;

/**
 *
 * @param {import('esbuild').BuildResult} result
 */
const run = async (result) => {
  let _ = result;
  console.log(chalk`{cyan [buildService]} build succeeded: `);

  try {
    runProcess?.kill();
    const splitIndex = argv.findIndex((v) => v === "-");
    const runArgs = splitIndex === -1 ? [] : argv.splice(splitIndex + 1);
    runProcess = execa("node", [out, ...runArgs], {
      stdio: "inherit",
    });
    await runProcess;
  } catch (e) {
    if (e.signal === "SIGTERM") {
      console.log(chalk`{cyan [buildService]} restarting`);
      return;
    }
    console.error(e);
  }
};

/**
 * @typedef BuildConfig
 * @property {import('esbuild').BuildOptions} esbuildConfig
 */

/**
 *
 * @param {BuildConfig|undefined} config
 */
function buildWith(config) {
  return esbuild.build({
    platform: "node",
    incremental: true,
    outfile: out,
    entryPoints: [entry],
    bundle: true,
    ...config?.esbuildConfig,
  });
}

/**
 * @typedef {(config?: BuildConfig) => Promise<void>} BuildFn
 */

/**
 * @typedef BuildService
 * @property {BuildFn} build
 * @property {BuildFn} run
 * @property {BuildFn} watch
 */

/**
 * @type {BuildService}
 */
const buildService = {
  async build(config) {
    buildWith(config);
  },
  async run(config) {
    await buildWith(config).then(run);
    process.exit();
  },
  async watch(config) {
    buildWith({
      ...config,
      esbuildConfig: {
        watch: {
          async onRebuild(error, result) {
            if (error) {
              console.error("watch build failed:", error);
              return;
            }
            await run(result);
          },
        },
      },
    }).then(run);
  },
};

if (flags.build) {
  buildService.build();
} else if (flags.run) {
  buildService.run();
} else if (flags.watch) {
  buildService.watch();
}
