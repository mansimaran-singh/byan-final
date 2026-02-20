export async function uploadAuthDoc(req, res) {
  try {
    const { file } = req;
    const { type, email } = req.body;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!type || !["roc", "gst"].includes(String(type).toLowerCase())) {
      return res.status(400).json({ error: "Invalid document type" });
    }
    // Demo: accept and return meta; real storage can be S3/GridFS
    return res.json({
      ok: true,
      type,
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      email: email || null,
    });
  } catch (err) {
    console.error("uploadAuthDoc error", err);
    return res.status(500).json({ error: "server_error" });
  }
}
