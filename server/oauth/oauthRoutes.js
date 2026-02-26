import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Config via environment variables
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  JWT_SECRET = "dev_secret_change_me",
  OAUTH_REDIRECT_BASE = "http://localhost:5000", // server base for callbacks
} = process.env;

function postMessageHtml(payload) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return `<!doctype html>
<html>
  <body>
    <script>
      (function(){
        const data = ${json};
        try { window.opener && window.opener.postMessage(data, "*"); } catch {}
        window.close();
        document.write("You can close this window.");
      })();
    </script>
  </body>
</html>`;
}

// ---------- GitHub ----------
router.get("/github/start", (req, res) => {
  if (!GITHUB_CLIENT_ID) return res.status(500).send("GitHub not configured");
  const role = (req.query.role || "student").toString();
  const redirectUri = `${OAUTH_REDIRECT_BASE}/oauth/github/callback`;
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state: role, // lightweight role pass-through
    allow_signup: "true",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

router.get("/github/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const role = (req.query.state || "student").toString();
    if (!code) return res.status(400).send("Missing code");
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return res.status(500).send("GitHub not configured");
    }
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${OAUTH_REDIRECT_BASE}/oauth/github/callback`,
      }),
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) return res.status(400).send("Token exchange failed");

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "byan-app" },
    });
    const user = await userRes.json();

    let email = null;
    try {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "byan-app" },
      });
      const emails = await emailsRes.json();
      const primary = Array.isArray(emails) ? emails.find(e => e.primary && e.verified) : null;
      email = (primary && primary.email) || (Array.isArray(emails) && emails[0] && emails[0].email) || null;
    } catch {}

    const name = user?.name || user?.login || "GitHub User";
    const payload = {
      id: `gh_${user?.id || ""}`,
      name,
      email: email || null,
      role,
      avatar: user?.avatar_url || null,
      provider: "github",
    };
    const token = jwt.sign({ userId: payload.id, role }, JWT_SECRET, { expiresIn: "7d" });
    res.send(postMessageHtml({ source: "byan-oauth", provider: "github", token, user: payload }));
  } catch (err) {
    res.send(postMessageHtml({ source: "byan-oauth", provider: "github", error: "oauth_failed" }));
  }
});

// ---------- LinkedIn ----------
router.get("/linkedin/start", (req, res) => {
  if (!LINKEDIN_CLIENT_ID) return res.status(500).send("LinkedIn not configured");
  const role = (req.query.role || "student").toString();
  const redirectUri = `${OAUTH_REDIRECT_BASE}/oauth/linkedin/callback`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "r_liteprofile r_emailaddress",
    state: role,
  });
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
});

router.get("/linkedin/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const role = (req.query.state || "student").toString();
    if (!code) return res.status(400).send("Missing code");
    if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
      return res.status(500).send("LinkedIn not configured");
    }
    const redirectUri = `${OAUTH_REDIRECT_BASE}/oauth/linkedin/callback`;
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) return res.status(400).send("Token exchange failed");

    const meRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const me = await meRes.json();

    const emailRes = await fetch("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emailJson = await emailRes.json();
    const email = emailJson?.elements?.[0]?.["handle~"]?.emailAddress || null;

    const first = me?.localizedFirstName || "";
    const last = me?.localizedLastName || "";
    const name = `${first} ${last}`.trim() || "LinkedIn User";

    const payload = {
      id: `li_${me?.id || ""}`,
      name,
      email,
      role,
      provider: "linkedin",
    };
    const token = jwt.sign({ userId: payload.id, role }, JWT_SECRET, { expiresIn: "7d" });
    res.send(postMessageHtml({ source: "byan-oauth", provider: "linkedin", token, user: payload }));
  } catch (err) {
    res.send(postMessageHtml({ source: "byan-oauth", provider: "linkedin", error: "oauth_failed" }));
  }
});

export default router;

