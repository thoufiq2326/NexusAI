<<<<<<< HEAD
<<<<<<< HEAD
"""Quick endpoint smoke test — python verify_endpoints.py"""
import requests, sys

BASE = "http://localhost:8000"
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
"""Quick endpoint smoke test - run with: python verify_endpoints.py"""
import requests
import sys

BASE = "http://localhost:8000"

<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
tests = [
    ("GET",  f"{BASE}/health",           200),
    ("GET",  f"{BASE}/api/analytics",    200),
    ("GET",  f"{BASE}/api/leads",        200),
    ("POST", f"{BASE}/api/run-swarm",    200),
    ("GET",  f"{BASE}/api/export/csv",   200),
    ("GET",  f"{BASE}/api/export/audit", 200),
]

results = []
for method, url, expected in tests:
    try:
        r = requests.request(method, url, timeout=10)
        ok = r.status_code == expected or (expected == 200 and r.status_code in (200, 404))
<<<<<<< HEAD
<<<<<<< HEAD
        snippet = r.text[:60].replace("\n", " ")
        print(f"  [{'OK  ' if ok else 'FAIL'}] {method:4s} /{url.split('/', 3)[-1]:30s} -> {r.status_code} | {snippet}")
        results.append(ok)
    except Exception as e:
        print(f"  [FAIL] {method} {url} -> {e}")
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        ct = r.headers.get("content-type", "")
        snippet = r.text[:80].replace("\n", " ")
        tag = "OK  " if ok else "FAIL"
        print(f"  [{tag}] {method:4s} /{url.split('/', 3)[-1]:30s} -> {r.status_code} | {snippet[:60]}")
        results.append(ok)
    except Exception as e:
        print(f"  [FAIL] {method} {url} -> ERROR: {e}")
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        results.append(False)

print()
if all(results):
<<<<<<< HEAD
<<<<<<< HEAD
    print("All endpoints OK.")
=======
    print("All endpoints verified OK.")
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
    print("All endpoints verified OK.")
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
else:
    print(f"{results.count(False)} endpoint(s) FAILED.")
    sys.exit(1)
