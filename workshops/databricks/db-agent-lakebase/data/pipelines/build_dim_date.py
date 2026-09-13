"""Generate a standard Kimball date dimension covering the Olist order range.

No dependency on the raw Olist CSVs — this is a pure calendar generator, safe
to run before data/raw/ is even populated. Range defaults to the known Olist
order window (Sept 2016 - Oct 2018) padded a year on each side so date joins
never fall outside the dimension.

Output: data/processed/dim_date.csv — one row per calendar day, a
date_key column (YYYYMMDD integer) suitable as a join/partition key across
Postgres (Lakebase), Athena, and DuckDB alike.

Usage:
    python data/pipelines/build_dim_date.py
    python data/pipelines/build_dim_date.py --start 2015-01-01 --end 2019-12-31
"""
from __future__ import annotations

import argparse
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

DATA = Path(__file__).resolve().parents[1]
PROCESSED = DATA / "processed"
PROCESSED.mkdir(exist_ok=True)

DEFAULT_START = date(2015, 1, 1)   # one year before Olist's earliest orders
DEFAULT_END = date(2019, 12, 31)   # one year after Olist's latest orders


def build_dim_date(start: date, end: date) -> pd.DataFrame:
    rows = []
    d = start
    while d <= end:
        iso_year, iso_week, iso_weekday = d.isocalendar()
        rows.append({
            "date_key": int(d.strftime("%Y%m%d")),
            "full_date": d.isoformat(),
            "year": d.year,
            "quarter": (d.month - 1) // 3 + 1,
            "month": d.month,
            "month_name": d.strftime("%B"),
            "day": d.day,
            "day_of_week": d.isoweekday(),          # 1=Mon .. 7=Sun
            "day_name": d.strftime("%A"),
            "week_of_year": iso_week,
            "is_weekend": d.isoweekday() in (6, 7),
        })
        d += timedelta(days=1)
    return pd.DataFrame(rows)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", type=date.fromisoformat, default=DEFAULT_START)
    parser.add_argument("--end", type=date.fromisoformat, default=DEFAULT_END)
    args = parser.parse_args()

    df = build_dim_date(args.start, args.end)
    out = PROCESSED / "dim_date.csv"
    df.to_csv(out, index=False)
    print(f"wrote {len(df)} rows ({args.start} .. {args.end}) -> {out}")


if __name__ == "__main__":
    main()
