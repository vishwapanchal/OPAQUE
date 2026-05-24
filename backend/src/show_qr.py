from src.core.crypto import ecdh
from src.core.qr.generate import gen
from PIL import Image

priv, pub = ecdh.generate_key_pair()
data = ecdh.serialize(pub)

gen(data, "output/sender_qr.png")

print("📷 QR generated")

Image.open("output/sender_qr.png").show()
