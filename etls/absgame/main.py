from pathlib import Path

import polars as pl

data_dir = Path("./data/")
info = {
    "14100DO0001_2011-25.xlsx": ["Table 2"],
    "14100DO0002_2011-25.xlsx": ["Table 2"],
    "14100DO0003_2011-25.xlsx": ["Table 2"],
    "14100DO0004_2011-25.xlsx": ["Table 2"],
    "14100DO0005_2011-25.xlsx": ["Table 2"],
    "14100DO0006_2011-25.xlsx": ["Table 2"],
    "14100DO0007_2011-25.xlsx": ["Table 2"],
    "14100DO0008_2011-25.xlsx": ["Table 2"],
    "14100DO0009_2011-25.xlsx": ["Table 2"],
    "14100DO0010_2011-25.xlsx": ["Table 2"],
}

all_dfs = []
d: dict[str, dict[str, dict[str, float]]] = {}
for book_name, sheet_names in info.items():
    dfs: dict[str, pl.DataFrame] = pl.read_excel(
        data_dir / book_name,
        sheet_id=0,
        read_options={
            "header_row": 6,
        },
    )
    dfs = {k: v for k, v in dfs.items() if k.startswith("Table ")}
    print(dfs.keys())
    for df in dfs.values():
        cols = df.columns
        df = df.with_columns(
            [
                pl.col(cols[0]).cast(pl.Int64, strict=False),
                pl.col(cols[1]).cast(pl.String),
                pl.col(cols[2]).cast(pl.Int64, strict=False),
                pl.col(cols[3:]).cast(pl.Float64, strict=False),
            ]
        ).filter(pl.col("Code").is_not_null() & (pl.col("Code") >= 10_000) & (pl.col("Code") <= 99_999))
    dfs = {k: v for k, v in dfs.items() if not v.is_empty()}
    all_dfs.append(dfs)
    break
print(all_dfs)
