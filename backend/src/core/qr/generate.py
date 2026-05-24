import qrcode
def gen(data, path):
    qrcode.make(data).save(path)
