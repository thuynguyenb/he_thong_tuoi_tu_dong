const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ========================================
// KẾT NỐI FIREBASE
// ========================================

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Firebase Realtime Database
const db = getDatabase();

// ========================================
// API TEST
// ========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Irrigation Backend đang hoạt động!",
    });
});

// ========================================
// LẤY DỮ LIỆU HỆ THỐNG TƯỚI
// ========================================

app.get("/api/irrigation", async (req, res) => {
    try {
        const snapshot = await db.ref("irrigation").get();

        res.json({
            success: true,
            data: snapshot.val(),
        });
    } catch (error) {
        console.error("Firebase error:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy dữ liệu Firebase",
            error: error.message,
        });
    }
});

// ========================================
// KHỞI ĐỘNG SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend đang chạy tại http://localhost:${PORT}`);
});