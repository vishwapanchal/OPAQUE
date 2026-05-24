import json
from cryptography.hazmat.primitives.asymmetric import ec
from src.core.crypto import ecdh
from src.core.qr.scan import scan

with open("output/state.json") as f:
    priv_val = json.load(f)["priv_A"]

priv_A = ec.derive_private_key(priv_val, ec.SECP256R1())

print("👨‍💻 Now scan phone QR...")
data_B = scan()

if not data_B:
    print("❌ Scan failed")
    exit()

pub_B = ecdh.load(data_B)
shared = ecdh.derive(priv_A, pub_B)

print("🔑 Shared Key:", shared[:12])
print("✅ SUCCESS")
