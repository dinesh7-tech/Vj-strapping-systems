import { Lead } from "./db";

/**
 * Sends an email notification to the sales team about a new lead.
 * If RESEND_API_KEY is not configured, it will simulate the email by logging to the console.
 */
export async function sendLeadEmailNotification(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || "sales@vjstrapping.com";
  const fromEmail = "VJ Strapping Systems <onboarding@resend.dev>";
  
  const subject = `🔥 New Lead Captured: ${lead.name} (${lead.company || "No Company"})`;
  
  // Format UTM and Referrer sources for display
  const utmSource = lead.source.utm_source || "None";
  const utmMedium = lead.source.utm_medium || "None";
  const utmCampaign = lead.source.utm_campaign || "None";
  const referrer = lead.source.referrer || "Direct (None)";
  const userAgent = lead.source.userAgent || "Unknown";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead Notification</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f6f9fc; color: #333333; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f6; overflow: hidden; margin: 0 auto; }
          .header { background-color: #0b1220; padding: 24px; text-align: center; border-bottom: 3px solid #f59e0b; }
          .header h1 { color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.1em; text-transform: uppercase; }
          .content { padding: 32px; }
          .lead-id { font-size: 11px; color: #94a3b8; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; text-align: right; }
          .section-title { font-size: 12px; font-weight: bold; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #eef2f6; padding-bottom: 8px; margin-top: 0; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          td { padding: 10px 0; vertical-align: top; border-bottom: 1px solid #fafafa; }
          td.label { width: 30%; font-weight: 600; color: #4a5568; font-size: 14px; }
          td.value { width: 70%; color: #1a202c; font-size: 14px; }
          .requirement-box { background-color: #f7fafc; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; font-style: italic; font-size: 14px; color: #4a5568; margin-bottom: 24px; line-height: 1.5; white-space: pre-wrap; }
          .footer { background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #eef2f6; font-size: 12px; color: #718096; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VJ Strapping Systems</h1>
          </div>
          <div class="content">
            <div class="lead-id">Lead ID: ${lead.id}</div>
            
            <h2 class="section-title">Contact Information</h2>
            <table>
              <tr>
                <td class="label">Name</td>
                <td class="value">${lead.name}</td>
              </tr>
              <tr>
                <td class="label">Email</td>
                <td class="value"><a href="mailto:${lead.email}">${lead.email}</a></td>
              </tr>
              <tr>
                <td class="label">Phone</td>
                <td class="value"><a href="tel:${lead.phone}">${lead.phone}</a></td>
              </tr>
              <tr>
                <td class="label">Company</td>
                <td class="value">${lead.company || "Not Provided"}</td>
              </tr>
            </table>

            <h2 class="section-title">Requirements</h2>
            <div class="requirement-box">${lead.requirement}</div>

            <h2 class="section-title">Acquisition Source</h2>
            <table>
              <tr>
                <td class="label">UTM Source</td>
                <td class="value">${utmSource}</td>
              </tr>
              <tr>
                <td class="label">UTM Medium</td>
                <td class="value">${utmMedium}</td>
              </tr>
              <tr>
                <td class="label">UTM Campaign</td>
                <td class="value">${utmCampaign}</td>
              </tr>
              <tr>
                <td class="label">Referrer</td>
                <td class="value"><span style="word-break: break-all;">${referrer}</span></td>
              </tr>
              <tr>
                <td class="label">User Agent</td>
                <td class="value" style="font-size: 12px; color: #718096;">${userAgent}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            Received on ${new Date(lead.timestamp).toLocaleString()} · VJ Strapping Lead System
          </div>
        </div>
      </body>
    </html>
  `;

  if (!apiKey) {
    console.log("\n=======================================================");
    console.log("📨  MOCK EMAIL SENT (No RESEND_API_KEY in .env)");
    console.log(`To:      ${toEmail}`);
    console.log(`From:    ${fromEmail}`);
    console.log(`Subject: ${subject}`);
    console.log("----------------------- CONTENT -----------------------");
    console.log(`Name:        ${lead.name}`);
    console.log(`Email:       ${lead.email}`);
    console.log(`Phone:       ${lead.phone}`);
    console.log(`Company:     ${lead.company || "Not Provided"}`);
    console.log(`Requirement: ${lead.requirement}`);
    console.log(`Source:      utm_source=${utmSource}, utm_medium=${utmMedium}`);
    console.log("=======================================================\n");
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Resend API Error details: ${errorText}`);
      throw new Error(`Resend API responded with status ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return false;
  }
}
