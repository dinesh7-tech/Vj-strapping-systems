import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { saveLead, getLeads as getLeadsFromDb } from "./db";
import { sendLeadEmailNotification } from "./email";
import { syncLeadToCrm } from "./crm";

// Schema for client-side form validation and server-side sanitation
const leadSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  company: z.string().optional().default(""),
  phone: z.string().min(5, { message: "Phone number is required" }),
  requirement: z.string().min(10, { message: "Requirement must be at least 10 characters long" }),
  source: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_content: z.string().optional(),
    utm_term: z.string().optional(),
    referrer: z.string().optional(),
    userAgent: z.string().optional(),
  }),
});

/**
 * Server Function: Submit an Enquiry
 * Receives the validated lead and source tracking details,
 * saves to local DB, and triggers Resend & CRM sync.
 */
export const submitEnquiry = createServerFn()
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Save to local JSON database
    const savedLead = await saveLead(data);
    console.log(`[ServerAction] Saved lead ${savedLead.id} for ${savedLead.name}`);

    // 2. Send email notification asynchronously
    try {
      await sendLeadEmailNotification(savedLead);
    } catch (err) {
      console.error(`[ServerAction] Failed to send email for lead ${savedLead.id}:`, err);
    }

    // 3. Sync to CRM asynchronously
    try {
      await syncLeadToCrm(savedLead);
    } catch (err) {
      console.error(`[ServerAction] Failed to sync lead ${savedLead.id} to CRM:`, err);
    }

    return {
      success: true,
      leadId: savedLead.id,
    };
  });

/**
 * Server Function: Verify Admin Password
 * Simple check against the configured ADMIN_PASSWORD in environment.
 */
export const verifyAdminPassword = createServerFn()
  .inputValidator((data: string) => z.string().parse(data))
  .handler(async ({ data: password }) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "vjadmin2026";
    if (password === adminPassword) {
      return { success: true };
    }
    return { success: false, error: "Invalid password" };
  });

/**
 * Server Function: Get Leads
 * Returns all leads from database if provided password is correct.
 */
export const getLeads = createServerFn()
  .inputValidator((data: string) => z.string().parse(data))
  .handler(async ({ data: password }) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "vjadmin2026";
    if (password !== adminPassword) {
      throw new Error("Unauthorized access to leads database.");
    }
    
    return await getLeadsFromDb();
  });
