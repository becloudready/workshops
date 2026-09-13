"""Generate the synthetic dim_marketing_channel dimension and assign a channel
to every real order.

Olist's raw data has no acquisition-channel field — this is the one
deliberately synthetic piece of the schema, added so demo questions like
"which channel drove the most revenue" have something to answer. Assignment
is a seeded, weighted random draw per order_id, so it's reproducible across
every re-run and every downstream system (Postgres, Athena, MinIO) without
having to ship a huge join file around, anyone can regenerate identical
output from the same orders CSV and the same seed.

Prereqs:
    Olist CSVs in data/raw/ (needs olist_orders_dataset.csv for the order_id
    list — the channel dimension itself has no data dependency).

Output:
    data/processed/dim_marketing_channel.csv  — 6 rows, the dimension itself
    data/processed/order_channel_bridge.csv   — order_id -> channel_id, one
                                                 row per real order

Usage:
    python data/pipelines/build_dim_marketing_channel.py
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

DATA = Path(__file__).resolve().parents[1]
RAW = DATA / "raw"
PROCESSED = DATA / "processed"
PROCESSED.mkdir(exist_ok=True)

SEED = 42  # fixed — makes the assignment reproducible across every run/system

# (channel_id, channel_name, channel_type, weight)
# Weights are a plausible, not-uniform mix — organic/direct dominate, paid
# and affiliate are minority channels — realistic enough for demo questions
# without pretending to be real attribution data.
CHANNELS = [
    (1, "Organic Search", "organic", 0.30),
    (2, "Direct",         "direct",  0.22),
    (3, "Paid Social",    "paid",    0.18),
    (4, "Email",          "owned",   0.14),
    (5, "Referral",       "earned",  0.10),
    (6, "Affiliate",      "paid",    0.06),
]


def build_dim_marketing_channel() -> pd.DataFrame:
    return pd.DataFrame(
        [(c, n, t) for c, n, t, _ in CHANNELS],
        columns=["channel_id", "channel_name", "channel_type"],
    )


def build_order_channel_bridge() -> pd.DataFrame:
    orders_path = RAW / "olist_orders_dataset.csv"
    if not orders_path.exists():
        raise FileNotFoundError(
            f"{orders_path} not found — download the Olist dataset into "
            "data/raw/ first (see the lab README)."
        )
    orders = pd.read_csv(orders_path, usecols=["order_id"])

    rng = np.random.default_rng(SEED)
    channel_ids = [c for c, _, _, _ in CHANNELS]
    weights = np.array([w for _, _, _, w in CHANNELS])
    weights = weights / weights.sum()

    orders["channel_id"] = rng.choice(channel_ids, size=len(orders), p=weights)
    return orders[["order_id", "channel_id"]]


def main() -> None:
    dim = build_dim_marketing_channel()
    dim_out = PROCESSED / "dim_marketing_channel.csv"
    dim.to_csv(dim_out, index=False)
    print(f"wrote {len(dim)} rows -> {dim_out}")

    bridge = build_order_channel_bridge()
    bridge_out = PROCESSED / "order_channel_bridge.csv"
    bridge.to_csv(bridge_out, index=False)
    print(f"wrote {len(bridge)} rows -> {bridge_out}")


if __name__ == "__main__":
    main()
