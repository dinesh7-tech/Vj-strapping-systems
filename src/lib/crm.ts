import { Lead } from "./db";

/**
 * Synchronizes lead data to a CRM (e.g. HubSpot or a custom Webhook URL).
 * If no credentials exist in .env, it outputs a mock CRM payload block to the dev console.
 */
export async function syncLeadToCrm(lead: Lead): Promise<boolean> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;

  // Split name into first and last name for CRMs
  const nameParts = lead.name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const payload = {
    crm_lead_source: "Website Lead Form",
    lead_id: lead.id,
    first_name: firstName,
    last_name: lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company || "",
    notes: lead.requirement,
    submitted_at: lead.timestamp,
    utm_source: lead.source.utm_source || "",
    utm_medium: lead.source.utm_medium || "",
    utm_campaign: lead.source.utm_campaign || "",
    utm_content: lead.source.utm_content || "",
    utm_term: lead.source.utm_term || "",
    referrer: lead.source.referrer || "Direct",
    user_agent: lead.source.userAgent || "",
  };

  if (!webhookUrl && !hubspotToken) {
    console.log("\n=======================================================");
    console.log("💼  MOCK CRM SYNCED (No CRM credentials in .env)");
    console.log("CRM Payload Structure:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=======================================================\n");
    return true;
  }

  let success = true;

  // 1. Sync to Custom Webhook (Zapier / Make.com)
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error(`CRM Webhook returned status ${res.status}`);
        success = false;
      }
    } catch (error) {
      console.error("Failed to sync lead to CRM Webhook:", error);
      success = false;
    }
  }

  // 2. Sync to HubSpot
  if (hubspotToken) {
    try {
      const hubspotPayload = {
        properties: {
          firstname: firstName,
          lastname: lastName,
          email: lead.email,
          phone: lead.phone,
          company: lead.company || "",
          message: lead.requirement, // custom single-line or notes field
          hs_lead_status: "NEW",
          utm_source: lead.source.utm_source || "",
          utm_medium: lead.source.utm_medium || "",
          utm_campaign: lead.source.utm_campaign || "",
        },
      };

      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify(hubspotPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`HubSpot CRM Error details: ${errorText}`);
        success = false;
      }
    } catch (error) {
      console.error("Failed to sync lead to HubSpot CRM:", error);
      success = false;
    }
  }

  return success;
}
