#!/usr/bin/env sh
set -e

echo "Waiting for database..."
python - <<'PY'
import os, asyncio, asyncpg
url = os.environ["DATABASE_URL"].replace("postgresql+asyncpg://", "postgresql://")
async def main():
    for i in range(60):
        try:
            conn = await asyncpg.connect(url)
            await conn.close()
            print("DB is up!")
            return
        except Exception:
            await asyncio.sleep(1)
    raise SystemExit("DB not ready after 60s")
asyncio.run(main())
PY

echo "Running migrations..."
alembic upgrade head

echo "Starting API..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${APP_PORT:-8000}"
