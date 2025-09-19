#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../backend"
if [ ! -f ".env" ]; then
  cp .env.example .env
fi
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
