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
