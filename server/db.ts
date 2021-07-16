import mysql from "mysql";
import { ConnectionString } from "connection-string";

interface Driver<P> {
  pool: P;
  query(sql: string): Promise<{ data?: any; error?: string }>;
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
    };
  },
};

export const db = {
  driver: null as Driver<any> | null,
  connect(url: string) {
    const config = new ConnectionString(url);
    db.driver = driver.mysql({ ...config, database: config.path?.[0] });
  },
  async query(sql: string): Promise<{ data?: any; error?: string }> {
    try {
      if (!db.driver) throw new Error("no database driver");
      return db.driver.query(sql);
    } catch (error) {
      return { error };
    }
  },
};
