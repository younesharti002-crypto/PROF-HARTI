import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

async function one(client, sql, params = []) {
  const result = await client.query(sql, params);
  if (!result.rows[0]) throw new Error("Seed query returned no row");
  return result.rows[0];
}

const client = await pool.connect();
try {
  await client.query("BEGIN");

  const year = await one(
    client,
    `INSERT INTO academic_years (name, starts_at, ends_at, active)
     VALUES ($1, $2, $3, true)
     ON CONFLICT (name) DO UPDATE SET starts_at = EXCLUDED.starts_at, ends_at = EXCLUDED.ends_at, active = true, updated_at = now()
     RETURNING id, name`,
    ["2026/2027", "2026-09-01T00:00:00+01:00", "2027-08-31T23:59:59+01:00"],
  );

  const level = await one(
    client,
    `INSERT INTO levels (name) VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET updated_at = now()
     RETURNING id, name`,
    ["2BAC"],
  );

  const streamIds = {};
  for (const name of ["PC", "SM"]) {
    const stream = await one(
      client,
      `INSERT INTO streams (name, level_id) VALUES ($1, $2)
       ON CONFLICT (level_id, name) DO UPDATE SET updated_at = now()
       RETURNING id, name`,
      [name, level.id],
    );
    streamIds[name] = stream.id;
  }

  for (const [name, slug] of [["Physique", "physique"], ["Chimie", "chimie"]]) {
    await one(
      client,
      `INSERT INTO subjects (name, slug, active) VALUES ($1, $2, true)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, active = true, updated_at = now()
       RETURNING id, name`,
      [name, slug],
    );
  }

  for (const streamName of ["PC", "SM"]) {
    const groupName = `2BAC-${streamName}-A`;
    await one(
      client,
      `INSERT INTO groups (name, academic_year_id, level_id, stream_id, active)
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (academic_year_id, level_id, stream_id, name)
       DO UPDATE SET active = true, updated_at = now()
       RETURNING id, name`,
      [groupName, year.id, level.id, streamIds[streamName]],
    );
  }

  await client.query("COMMIT");
  console.log("Academic seed completed: 2026/2027 · 2BAC · PC/SM · Physique/Chimie · groups A");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
