import json
from cryptography.hazmat.primitives.asymmetric import ec
from src.core.crypto import ecdh
from src.core.qr.scan import scan

# load sender private key
with open("output/state.json") as f:
    priv_val = json.load(f)["priv_A"]

priv_A = ec.derive_private_key(priv_val, ec.SECP256R1())

print("👨‍💻 Scan receiver QR from phone...")
data_B = scan("Scan Receiver QR")

if not data_B:
    print("❌ No QR scanned")
    exit()

pub_B = ecdh.load(data_B)
shared_A = ecdh.derive(priv_A, pub_B)

print("🔑 Shared key (A):", shared_A[:12])
print("🎉 Handshake complete!")
