import cac from "cac";
import { start } from "sqx/server";

const cli = cac();

cli
  .command("")
  .option("--url <url>", "Database url")
  .option("-p, --port <port>", "Server port")
  .action(({ url, port }) => {
    start({
      databaseURL: url,
      port: parseInt(port, 10) || 4000,
    });
  });

cli.parse();
