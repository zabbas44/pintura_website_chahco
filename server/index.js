const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;

const pageMap = {
  "/": "index.html",
  "/services": "services.html",
  "/projects": "projects.html",
  "/about": "about.html",
  "/contact": "contact.html"
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use(express.static(path.join(__dirname, "..", "public")));

Object.entries(pageMap).forEach(([route, fileName]) => {
  app.get(route, (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "pages", fileName));
  });
});

async function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return {
      transporter: nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      }),
      mode: "smtp"
    };
  }

  return {
    transporter: nodemailer.createTransport({
      jsonTransport: true
    }),
    mode: "local"
  };
}

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      ok: false,
      message: "Please complete all contact form fields."
    });
  }

  try {
    const { transporter, mode } = await createTransporter();
    const recipient = process.env.CONTACT_TO || "example@amjadpintura.com";

    const info = await transporter.sendMail({
      from: process.env.CONTACT_FROM || "Amjad Pintura Website <no-reply@amjadpintura.com>",
      to: recipient,
      replyTo: `${name} <${email}>`,
      subject: `New quote request from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #10233b;">
          <h2>New quote request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `
    });

    if (mode === "local") {
      console.log("Local email payload:");
      console.log(info.message.toString());
    }

    return res.json({
      ok: true,
      message:
        mode === "smtp"
          ? "Your request has been sent. We will contact you shortly."
          : "Your request was captured in local mode. Configure SMTP variables to send real emails."
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      ok: false,
      message: "Unable to send your request right now. Please try again later."
    });
  }
});

app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
  <url><loc>${SITE_URL}/services</loc></url>
  <url><loc>${SITE_URL}/projects</loc></url>
  <url><loc>${SITE_URL}/about</loc></url>
  <url><loc>${SITE_URL}/contact</loc></url>
</urlset>`);
});

app.listen(PORT, () => {
  console.log(`Amjad Pintura running at http://localhost:${PORT}`);
});
