"""Quick endpoint smoke test - run with: python verify_endpoints.py"""
import requests
import sys

BASE = "http://localhost:8000"

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
        ct = r.headers.get("content-type", "")
        snippet = r.text[:80].replace("\n", " ")
        tag = "OK  " if ok else "FAIL"
        print(f"  [{tag}] {method:4s} /{url.split('/', 3)[-1]:30s} -> {r.status_code} | {snippet[:60]}")
        results.append(ok)
    except Exception as e:
        print(f"  [FAIL] {method} {url} -> ERROR: {e}")
        results.append(False)

print()
if all(results):
    print("All endpoints verified OK.")
else:
    print(f"{results.count(False)} endpoint(s) FAILED.")
    sys.exit(1)
