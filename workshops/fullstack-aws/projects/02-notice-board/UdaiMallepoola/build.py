#!/usr/bin/env python3
"""Package the Lambda function and its dependencies into backend/lambda.zip."""

import os
import shutil
import subprocess
import zipfile

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
BUILD_DIR   = os.path.join(BACKEND_DIR, "_build")
ZIP_PATH    = os.path.join(BACKEND_DIR, "lambda.zip")


def build():
    # Clean previous build
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
    os.makedirs(BUILD_DIR)

    # Install dependencies into _build/
    subprocess.check_call([
        "pip", "install",
        "-r", os.path.join(BACKEND_DIR, "requirements.txt"),
        "-t", BUILD_DIR,
        "-q",
    ])

    # Copy Lambda handler
    shutil.copy(
        os.path.join(BACKEND_DIR, "lambda_function.py"),
        os.path.join(BUILD_DIR, "lambda_function.py"),
    )

    # Zip everything
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)

    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(BUILD_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                arcname   = os.path.relpath(full_path, BUILD_DIR)
                zf.write(full_path, arcname)

    print(f"Created: {ZIP_PATH}")
    shutil.rmtree(BUILD_DIR)


if __name__ == "__main__":
    build()
