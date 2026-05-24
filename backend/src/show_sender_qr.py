import json
from src.core.crypto import ecdh
from src.core.qr.generate import gen
from PIL import Image

priv_A, pub_A = ecdh.generate_key_pair()
data_A = ecdh.serialize(pub_A)

gen(data_A, "output/sender_qr.png")

# save private key
with open("output/state.json", "w") as f:
    f.write(json.dumps({
        "priv_A": priv_A.private_numbers().private_value
    }))

print("➡️ Show this QR to phone")
Image.open("output/sender_qr.png").show()
