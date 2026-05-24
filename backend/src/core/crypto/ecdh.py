from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import base64, hashlib

def generate():
    priv = ec.generate_private_key(ec.SECP256R1())
    pub = priv.public_key()
    return priv, pub

def serialize(pub):
    raw = pub.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )
    return base64.b64encode(raw).decode()

def load(data):
    raw = base64.b64decode(data)
    return ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), raw)

def derive(priv, pub):
    shared = priv.exchange(ec.ECDH(), pub)
    return HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b'ghostmark'
    ).derive(shared)

def verification_code(shared_key):
    digest = hashlib.sha256(shared_key).hexdigest()
    return str(int(digest[:8], 16))[:6]
