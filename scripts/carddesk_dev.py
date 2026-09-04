"""Local stand-in for the Vercel Python Function at api/carddesk.py.

    pnpm dev:desk        # serves http://127.0.0.1:8001/api/carddesk

next.config.js rewrites /api/carddesk to this in development, so the browser
hits the same URL it will hit in production. Loads the function by file path
so the module name can never shadow the `cardquant` package.
"""

import importlib.util
import os
import sys
from http.server import ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
FN = os.path.join(HERE, "..", "api", "carddesk.py")

spec = importlib.util.spec_from_file_location("carddesk_fn", FN)
assert spec and spec.loader
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

PORT = int(os.environ.get("CARDDESK_PORT", "8001"))

if __name__ == "__main__":
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), mod.handler)
    # ASCII only: Windows consoles default to cp1252 and choke on an arrow
    print(f"carddesk dev: {mod.LIBRARY} on {mod.RUNTIME} -> http://127.0.0.1:{PORT}/api/carddesk", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    sys.exit(0)
