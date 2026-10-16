.PHONY: install run test smoke docker-build docker-up docker-down

install:
\tpython3 -m pip install -r requirements.txt

run:
\tPYTHONPATH=src uvicorn mirror_ai.main:app --reload --port 8000

test:
\tPYTHONPATH=src pytest -q

smoke:
\tPYTHONPATH=src python scripts/smoke_test.py

docker-build:
\tdocker compose build

docker-up:
\tdocker compose up -d

docker-down:
\tdocker compose down
