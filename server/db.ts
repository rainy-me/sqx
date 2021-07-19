import mysql from "mysql";
import { ConnectionString } from "connection-string";

interface Driver<P> {
  pool: P;
  query(sql: string): Promise<{ data?: any; error?: string }>;
  sample(): Promise<any>;
}

const driver = {
  mysql(config: mysql.PoolConfig): Driver<mysql.Pool> {
    return {
      pool: mysql.createPool(config),
      async query(sql) {
        return new Promise((resolve) => {
          this.pool.query(sql, (error, results, fields) => {
            if (error) return resolve({ error: error.message });
            resolve({ data: { results, fields } });
          });
        });
      },
      async sample() {
        const { data } = await this.query(`
        SELECT CONCAT('SELECT * FROM ', t.table_name, ' LIMIT 5;') as query
        FROM information_schema.tables AS t
        WHERE table_schema NOT IN (
            'sys',
            'mysql',
            'information_schema',
            'performance_schema'
          );`);
        const samples = await Promise.all(
          data.results.map(({ query: sql }: { query: string }) => {
            return this.query(sql);
          })
        );
        // @ts-ignore
        return { data: samples.filter(({ data }) => data) };
      },
    };
  },
};

export const db = {
  driver: null as Driver<any> | null,
  connect(url: string) {
    const config = new ConnectionString(url);
    db.driver = driver.mysql({ ...config, database: config.path?.[0] });
  },
};
