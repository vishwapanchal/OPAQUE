from cryptography.hazmat.primitives.asymmetric import dh
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import base64

def generate_parameters():
    return dh.generate_parameters(generator=2, key_size=2048)

def generate_key_pair(parameters):
    private_key = parameters.generate_private_key()
    public_key = private_key.public_key()
    return private_key, public_key

def serialize_public_key(public_key):
    raw = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return base64.b64encode(raw).decode()

def load_public_key(data):
    raw = base64.b64decode(data)
    return serialization.load_pem_public_key(raw)

def derive_shared_key(private_key, peer_public_key):
    shared_secret = private_key.exchange(peer_public_key)

    return HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b'ghostmark'
    ).derive(shared_secret)
