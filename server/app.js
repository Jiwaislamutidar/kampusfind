import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import path from "path";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import db from "./db.js";

// =====================================================
// SETUP
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// UPLOADS
// =====================================================

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

// =====================================================
// MULTER
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

// =====================================================
// DATABASE
// =====================================================

function databaseErrorResponse(res, error, context) {
  console.error(`${context}:`, error);

  return res.status(503).json({
    success: false,
    message: "Database sedang tidak tersedia. Coba lagi beberapa saat lagi.",
  });
}

// =====================================================
// TEST DATABASE
// =====================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT 1 AS berhasil"
    );

    res.json({
      success: true,
      message: "Backend berhasil terhubung ke MySQL",
      data: rows,
    });
  } catch (error) {
    databaseErrorResponse(res, error, "Database error");
  }
});

// =====================================================
// REGISTER ADMIN
// =====================================================

app.post("/api/admin/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO admins (email, password) VALUES (?, ?)",
      [email, hash]
    );

    res.json({
      success: true,
      message: "Admin berhasil dibuat",
    });
  } catch (error) {
    console.error("Register admin error:", error);

    databaseErrorResponse(res, error, "Register admin database error");
  }
});

// =====================================================
// LOGIN ADMIN
// =====================================================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    res.json({
      success: true,
      message: "Login berhasil!",
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login admin error:", error);

    databaseErrorResponse(res, error, "Login admin database error");
  }
});

// =====================================================
// FUNGSI SIMPAN REPORT
// =====================================================

async function saveReport(req, res, type) {
  try {
    const {
      nama_pelapor,
      no_whatsapp,
      jenis_barang,
      warna,
      nama_barang,
      deskripsi,
      ciri_khas,
      tanggal,
      jam,
      lokasi,
      detail_lokasi,
    } = req.body;

    if (
      !nama_barang ||
      !jenis_barang ||
      !lokasi
    ) {
      return res.status(400).json({
        success: false,
        message: "Data laporan belum lengkap",
      });
    }

    const foto = req.file
      ? req.file.filename
      : null;

    const query = `
      INSERT INTO reports (
        type,
        item_name,
        category,
        color,
        description,
        distinctive_features,
        date_seen,
        time_seen,
        location,
        location_detail,
        status,
        image_url,
        reporter_name,
        reporter_contact
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(
      query,
      [
        type,
        nama_barang,
        jenis_barang,
        warna || null,
        deskripsi || null,
        ciri_khas || null,
        tanggal || null,
        jam || null,
        lokasi,
        detail_lokasi || null,

        // SEMUA LAPORAN BARU
        // MASUK SEBAGAI MENUNGGU
        "MENUNGGU",

        foto,
        nama_pelapor || null,
        no_whatsapp || null,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Laporan berhasil disimpan dan menunggu verifikasi admin",

      id: result.insertId,

      foto: foto,

      photoUrl: foto
        ? `/uploads/${foto}`
        : null,

      status: "MENUNGGU",
    });
  } catch (error) {
    console.error(
      `Error menyimpan laporan ${type}:`,
      error
    );

    databaseErrorResponse(res, error, `Error menyimpan laporan ${type}`);
  }
}

// =====================================================
// LAPOR BARANG HILANG
// =====================================================

app.post(
  "/api/barang-hilang",
  upload.single("foto"),
  async (req, res) => {
    await saveReport(
      req,
      res,
      "HILANG"
    );
  }
);

// =====================================================
// ALIAS LAMA
// SUPAYA ENDPOINT LAMA TETAP BISA DIPAKAI
// =====================================================

app.post(
  "/api/lapor-hilang",
  upload.single("foto"),
  async (req, res) => {
    await saveReport(
      req,
      res,
      "HILANG"
    );
  }
);

// =====================================================
// LAPOR BARANG DITEMUKAN
// =====================================================

app.post(
  "/api/barang-ditemukan",
  upload.single("foto"),
  async (req, res) => {
    await saveReport(
      req,
      res,
      "DITEMUKAN"
    );
  }
);

// =====================================================
// TAMBAH REPORT UMUM
// =====================================================

app.post(
  "/api/reports",
  upload.single("foto"),
  async (req, res) => {
    try {
      const {
        type,
        nama_pelapor,
        no_whatsapp,
        jenis_barang,
        warna,
        nama_barang,
        deskripsi,
        ciri_khas,
        tanggal,
        jam,
        lokasi,
        detail_lokasi,
      } = req.body;

      if (
        !type ||
        !nama_barang ||
        !jenis_barang ||
        !lokasi
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Data laporan belum lengkap",
        });
      }

      if (
        type !== "HILANG" &&
        type !== "DITEMUKAN"
      ) {
        return res.status(400).json({
          success: false,
          message: "Type laporan tidak valid",
        });
      }

      const foto = req.file
        ? req.file.filename
        : null;

      const query = `
        INSERT INTO reports (
          type,
          item_name,
          category,
          color,
          description,
          distinctive_features,
          date_seen,
          time_seen,
          location,
          location_detail,
          status,
          image_url,
          reporter_name,
          reporter_contact
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(
        query,
        [
          type,
          nama_barang,
          jenis_barang,
          warna || null,
          deskripsi || null,
          ciri_khas || null,
          tanggal || null,
          jam || null,
          lokasi,
          detail_lokasi || null,
          "MENUNGGU",
          foto,
          nama_pelapor || null,
          no_whatsapp || null,
        ]
      );

      res.status(201).json({
        success: true,
        message:
          "Laporan berhasil disimpan",
        id: result.insertId,
        foto: foto,
        photoUrl: foto
          ? `/uploads/${foto}`
          : null,
        status: "MENUNGGU",
      });
    } catch (error) {
      console.error(
        "Error /api/reports:",
        error
      );

      databaseErrorResponse(res, error, "Error /api/reports");
    }
  }
);

// =====================================================
// AMBIL SEMUA LAPORAN
// =====================================================

app.get("/api/reports", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        type,
        item_name,
        category,
        color,
        description,
        distinctive_features,
        date_seen,
        time_seen,
        location,
        location_detail,
        status,
        image_url,
        reporter_name,
        reporter_contact,
        created_at,
        updated_at
      FROM reports
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "Error mengambil reports:",
      error
    );

    databaseErrorResponse(res, error, "Error mengambil reports");
  }
});

// =====================================================
// AMBIL SATU LAPORAN
// =====================================================

app.get(
  "/api/reports/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        `
        SELECT
          id,
          type,
          item_name,
          category,
          color,
          description,
          distinctive_features,
          date_seen,
          time_seen,
          location,
          location_detail,
          status,
          image_url,
          reporter_name,
          reporter_contact,
          created_at,
          updated_at
        FROM reports
        WHERE id = ?
        `,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Laporan tidak ditemukan",
        });
      }

      res.json({
        success: true,
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "Error mengambil detail:",
        error
      );

      databaseErrorResponse(res, error, "Error mengambil detail");
    }
  }
);

// =====================================================
// UPDATE STATUS
// =====================================================

app.put(
  "/api/reports/:id/status",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "MENUNGGU",
        "DIVERIFIKASI",
        "DITEMUKAN",
        "PROSES_KLAIM",
        "PROSES_PENGEMBALIAN",
        "SUDAH_KEMBALI",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status tidak valid",
        });
      }

      const [result] = await db.query(
        `
        UPDATE reports
        SET
          status = ?,
          updated_at = NOW()
        WHERE id = ?
        `,
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Laporan tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message:
          "Status laporan berhasil diperbarui",
        status,
      });
    } catch (error) {
      console.error(
        "Error update status:",
        error
      );

      databaseErrorResponse(res, error, "Error update status");
    }
  }
);

// =====================================================
// SERVER
// =====================================================

// Vercel manages the HTTP server. Local development still uses Express listen().
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server berjalan di http://localhost:${PORT}`
    );
  });
}

export default app;