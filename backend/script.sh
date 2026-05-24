#!/bin/bash
set -e

echo "🚀 GhostMark Act 1 (INDUSTRY GRADE)"

mkdir -p src/core/crypto
mkdir -p src/core/qr
mkdir -p mobile
mkdir -p output

touch src/__init__.py
touch src/core/__init__.py
touch src/core/crypto/__init__.py

# ----------------------------
# REQUIREMENTS
# ----------------------------
cat <<EOF > requirements.txt
cryptography
qrcode[pil]
opencv-python
fastapi
uvicorn
pillow
EOF

pip install -r requirements.txt

# ----------------------------
# ECDH + CODE
# ----------------------------
cat <<'EOF' > src/core/crypto/ecdh.py
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
EOF

# ----------------------------
# QR
# ----------------------------
cat <<'EOF' > src/core/qr/generate.py
import qrcode
def gen(data, path):
    qrcode.make(data).save(path)
EOF

cat <<'EOF' > src/core/qr/scan.py
import cv2

def scan():
    cap = cv2.VideoCapture(0)
    det = cv2.QRCodeDetector()

    print("📷 Scan receiver QR")

    while True:
        _, f = cap.read()
        data,_,_ = det.detectAndDecode(f)
        if data:
            cap.release()
            cv2.destroyAllWindows()
            return data
        cv2.imshow("Scan", f)
        if cv2.waitKey(1)==27:
            break
EOF

# ----------------------------
# MAIN (SENDER)
# ----------------------------
cat <<'EOF' > src/main.py
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
EOF

# ----------------------------
# MOBILE (WITH CODE)
# ----------------------------
cat <<'EOF' > mobile/index.html
<!DOCTYPE html>
<html>
<head>
<title>Receiver</title>
<script src="https://cdn.jsdelivr.net/npm/jsqr"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
</head>
<body>

<h2>📱 Receiver</h2>

<button onclick="startScan()">Start Scan</button>

<video id="v" autoplay playsinline style="width:100%; margin-top:10px;"></video>
<p id="s">Click Start</p>

<div id="out"></div>
<h3 id="code"></h3>

<script>
const v = document.getElementById("v");
const s = document.getElementById("s");
const out = document.getElementById("out");
const codeBox = document.getElementById("code");

let scanning = false;

async function startScan(){
  if(scanning) return;
  scanning = true;

  const stream = await navigator.mediaDevices.getUserMedia({
    video:{facingMode:"environment"}
  });

  v.srcObject = stream;
  s.innerText = "Scanning...";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  setInterval(async ()=>{
    if(!scanning) return;

    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;

    ctx.drawImage(v,0,0);

    const img = ctx.getImageData(0,0,canvas.width,canvas.height);
    const code = jsQR(img.data,canvas.width,canvas.height);

    if(code){
      scanning = false;
      s.innerText = "QR scanned. Generating key...";

      const key = await crypto.subtle.generateKey(
        {name:"ECDH", namedCurve:"P-256"},
        true,
        ["deriveKey"]
      );

      const raw = await crypto.subtle.exportKey("raw", key.publicKey);
      const pubB = btoa(String.fromCharCode(...new Uint8Array(raw)));

      // derive shared key
      const pubA_bytes = Uint8Array.from(atob(code.data), c=>c.charCodeAt(0));
      const pubA = await crypto.subtle.importKey(
        "raw",
        pubA_bytes,
        {name:"ECDH", namedCurve:"P-256"},
        true,
        []
      );

      const shared = await crypto.subtle.deriveBits(
        {name:"ECDH", public: pubA},
        key.privateKey,
        256
      );

      // verification code
      const hash = await crypto.subtle.digest("SHA-256", shared);
      const hex = Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
      const code6 = parseInt(hex.slice(0,8),16).toString().slice(0,6);

      codeBox.innerText = "Verification Code: " + code6;

      s.innerText = "Show this QR to laptop";

      QRCode.toCanvas(pubB, {width:250}, (err,canvas)=>{
        out.innerHTML="";
        out.appendChild(canvas);
      });
    }

  },500);
}
</script>

</body>
</html>
EOF

# ----------------------------
# SERVER
# ----------------------------
cat <<'EOF' > src/server.py
from fastapi import FastAPI
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI()

@app.get("/")
def home():
    return FileResponse("mobile/index.html")

if __name__=="__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)
EOF

# ----------------------------
# RUN
# ----------------------------
echo "▶️ Starting system..."

export PYTHONPATH=.
python src/main.py &

sleep 2

python src/server.py