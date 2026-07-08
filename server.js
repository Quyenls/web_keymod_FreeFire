const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const app = express();

app.use(express.urlencoded({ extended: true }));

// --- CẤU HÌNH ---
const MAT_KHAU_ADMIN = "05012007"; 
const FILE_LUU_KEY = "data.json"; 

if (!fs.existsSync(FILE_LUU_KEY)) {
    const defaultData = {
        key: "KRY_MOD_DEFAULT",
        token: "token_mac_dinh",
        timeUpdated: new Date().toLocaleString('vi-VN')
    };
    fs.writeFileSync(FILE_LUU_KEY, JSON.stringify(defaultData));
}

const commonHead = `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HỆ THỐNG HMT MOD</title>
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
        <style>
            body { background-color: #050505; color: #00ffcc; font-family: 'Share Tech Mono', monospace; text-align: center; margin: 0; padding-top: 50px; background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px); background-size: 25px 25px; }
            .box { background: rgba(10, 10, 10, 0.85); border: 1px solid #00ffcc; box-shadow: 0 0 15px rgba(0, 255, 204, 0.2); max-width: 500px; margin: 0 auto; padding: 40px; border-radius: 8px; position: relative; }
            .box::before { content: "[ MENU KRY MOD ]"; position: absolute; top: -10px; left: 20px; background: #050505; padding: 0 10px; font-size: 14px; color: #00ffcc; }
            h1, h2 { text-transform: uppercase; letter-spacing: 2px; margin-top: 0; }
            .status-text { color: #ff003c; font-size: 14px; margin-bottom: 25px; }
            .btn { background: transparent; color: #00ffcc; border: 2px solid #00ffcc; padding: 12px 24px; font-family: 'Share Tech Mono', monospace; font-size: 16px; cursor: pointer; text-transform: uppercase; transition: 0.3s; text-decoration: none; display: inline-block; width: 80%; }
            .btn:hover { background: #00ffcc; color: #000; box-shadow: 0 0 20px #00ffcc; }
            .btn-red { border-color: #ff003c; color: #ff003c; }
            .btn-red:hover { background: #ff003c; color: #000; box-shadow: 0 0 20px #ff003c; }
            input { background: #111; color: #00ffcc; border: 1px solid #333; padding: 12px; font-family: 'Share Tech Mono', monospace; font-size: 16px; width: 80%; text-align: center; margin-bottom: 15px; outline: none; transition: 0.3s; }
            input:focus { border-color: #00ffcc; box-shadow: 0 0 10px rgba(0, 255, 204, 0.4); }
            .warning-box { margin-top: 25px; padding: 15px; border-left: 4px solid #ff003c; background: rgba(255, 0, 60, 0.05); text-align: left; font-size: 13px; color: #ccc; line-height: 1.6; }
        </style>
    </head>
`;

app.get('/', (req, res) => {
    // Đừng quên thay link của bạn vào đây
    const linkPool = ["https://link4m.com/link_co_dinh_cua_ban"];
    const randomLink = linkPool[Math.floor(Math.random() * linkPool.length)];
    res.send(`
        <!DOCTYPE html><html lang="vi">${commonHead}
        <body><div class="box" style="margin-top: 10%;">
            <h1 style="font-size: 36px; text-shadow: 0 0 10px #00ffcc;">KRY MOD</h1>
            <div class="status-text">[ HỆ THỐNG: HOẠT ĐỘNG ] | [ BẢO MẬT: AN TOÀN ]</div>
            <p style="color: #888; margin-bottom: 30px; font-size: 14px;">Vượt tường lửa để nạp mã lệnh & nhận Key.</p>
            <a href="${randomLink}" class="btn">>> KÍCH HOẠT SCRIPT <<</a>
        </div></body></html>
    `);
});

app.get('/admin', (req, res) => {
    const data = JSON.parse(fs.readFileSync(FILE_LUU_KEY, 'utf8'));
    const linkDich = "https://web-keymod-freefire.onrender.com/getkey?token=" + data.token;
    
    res.send(`
        <!DOCTYPE html><html lang="vi">${commonHead}
        <body><div class="box" style="max-width: 600px;">
            <h2>BẢNG ĐIỀU KHIỂN ADMIN</h2>
            <div style="text-align: left; background: #0a0a0a; padding: 15px; border: 1px dashed #333; margin-bottom: 20px;">
                <p style="margin: 5px 0;">[+] KEY HIỆN TẠI: <strong style="color: #fff; font-size: 18px;">${data.key}</strong></p>
                <p style="margin: 5px 0; color: #666;">[+] CẬP NHẬT LÚC: ${data.timeUpdated}</p>
                <hr style="border-color: #222; margin: 15px 0;">
                <p style="margin: 5px 0; color: #ff003c;">[!] LINK ĐÍCH (Đem rút gọn Link4M):</p>
                <input type="text" value="${linkDich}" readonly style="width: 95%; margin-top: 10px; color: #ff003c; border-color: #ff003c;" onclick="this.select()">
            </div>
            <form action="/luu-key" method="POST">
                <input type="password" name="matKhau" placeholder="NHẬP MẬT KHẨU ADMIN" required><br>
                <input type="text" name="keyMoi" placeholder="NHẬP KEY CHO HÔM NAY" required><br>
                <button type="submit" class="btn btn-red">LƯU & CẬP NHẬT HỆ THỐNG</button>
            </form>
        </div></body></html>
    `);
});

app.post('/luu-key', (req, res) => {
    const { matKhau, keyMoi } = req.body;
    if (matKhau === MAT_KHAU_ADMIN) {
        const tokenMoi = crypto.randomBytes(4).toString('hex');
        const newData = { key: keyMoi, token: tokenMoi, timeUpdated: new Date().toLocaleString('vi-VN') };
        fs.writeFileSync(FILE_LUU_KEY, JSON.stringify(newData));
        res.send('<script>alert("CẬP NHẬT KEY VÀ LINK MỚI THÀNH CÔNG!"); window.location.href="/admin";</script>');
    } else {
        res.send('<script>alert("SAI MẬT KHẨU. TỪ CHỐI TRUY CẬP!"); window.location.href="/admin";</script>');
    }
});

app.get('/getkey', (req, res) => {
    const userToken = req.query.token;
    const data = JSON.parse(fs.readFileSync(FILE_LUU_KEY, 'utf8'));
    
    if (userToken && userToken === data.token) {
        res.send(`
            <!DOCTYPE html><html lang="vi">${commonHead}
            <body><div class="box" style="margin-top: 5%;">
                <h2 style="color: #00ffcc; text-shadow: 0 0 10px #00ffcc;">CHO PHÉP TRUY CẬP</h2>
                <p style="color: #888;">Key sử dụng Tool của bạn là:</p>
                <input type="text" value="${data.key}" readonly style="font-size: 24px; color: #fff; font-weight: bold;" onclick="this.select()">
                <div class="warning-box">
                    <strong style="color: #ff003c;">[!] KÍCH HOẠT CHUỖI TỰ HỦY:</strong><br>
                    > Key này sẽ hết hạn sau đúng 12 giờ nữa.<br>
                    > Đường link này là tạm thời và sẽ tự hủy ở lần cập nhật tới.<br>
                    > Tuyệt đối không lưu lại trang này. Hãy quay lại trang chủ để lấy Key mới khi cần.
                </div>
            </div></body></html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html><html lang="vi">${commonHead}
            <body><div class="box" style="margin-top: 10%; border-color: #ff003c; box-shadow: 0 0 15px rgba(255, 0, 60, 0.3);">
                <h2 style="color: #ff003c;">LỖI 403: MÃ KHÔNG HỢP LỆ</h2>
                <p style="color: #888; margin-bottom: 30px;">Mã bảo mật của bạn đã hết hạn hoặc không chính xác. Admin đã cập nhật hệ thống Key mới.</p>
                <a href="/" class="btn btn-red">>> QUAY LẠI TRANG CHỦ <<</a>
            </div></body></html>
        `);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('HỆ THỐNG KRY MOD ĐANG CHẠY TẠI CỔNG ' + PORT));
