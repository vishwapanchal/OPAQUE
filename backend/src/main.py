from src.core.crypto import ecdh
from src.core.qr.generate import gen
from src.core.qr.scan import scan
from PIL import Image

print("🔐 Sender generating key...")

priv_A, pub_A = ecdh.generate()
data_A = ecdh.serialize(pub_A)

gen(data_A, "output/sender.png")
Image.open("output/sender.png").show()

print("➡️ Scan this on phone")

data_B = scan()

pub_B = ecdh.load(data_B)
shared = ecdh.derive(priv_A, pub_B)

code = ecdh.verification_code(shared)

print("🔑 FINAL SHARED KEY:", shared[:10])
print("🔐 VERIFICATION CODE:", code)
print("👉 Check if phone shows SAME code")
print("✅ HANDSHAKE COMPLETE")
