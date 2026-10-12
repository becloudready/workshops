"""Package the Lambda backend into backend/lambda.zip.

Dependencies are downloaded as Linux (manylinux x86_64) wheels for Python 3.12,
so the zip works on AWS Lambda even when you build it on a Mac or Windows PC.

Usage:  python build.py
"""
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
BUILD_DIR = BACKEND / "_build"
ZIP_PATH = BACKEND / "lambda.zip"


def main():
    shutil.rmtree(BUILD_DIR, ignore_errors=True)
    BUILD_DIR.mkdir(parents=True)

    print("Installing dependencies for Lambda (Linux, Python 3.12)...")
    subprocess.run(
        [
            sys.executable, "-m", "pip", "install",
            "-r", str(BACKEND / "requirements.txt"),
            "-t", str(BUILD_DIR),
            "--platform", "manylinux2014_x86_64",
            "--implementation", "cp",
            "--python-version", "3.12",
            "--only-binary=:all:",
            "--upgrade",
            "--quiet",
        ],
        check=True,
    )

    shutil.copy(BACKEND / "lambda_function.py", BUILD_DIR)

    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(BUILD_DIR.rglob("*")):
            if path.is_file() and "__pycache__" not in path.parts:
                zf.write(path, path.relative_to(BUILD_DIR))

    size_mb = ZIP_PATH.stat().st_size / 1_000_000
    print(f"Created {ZIP_PATH.relative_to(ROOT)} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
