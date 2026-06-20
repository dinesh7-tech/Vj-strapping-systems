import fs from "fs";
import path from "path";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  requirement: string;
  timestamp: string;
  source: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
    userAgent?: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

/**
 * Ensures that the data directory and leads file exist.
 */
function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

/**
 * Saves a new lead submission to the local database file.
 */
export async function saveLead(leadInput: Omit<Lead, "id" | "timestamp">): Promise<Lead> {
  ensureDatabase();

  const rawData = fs.readFileSync(LEADS_FILE, "utf-8");
  const leads: Lead[] = JSON.parse(rawData);

  // Generate unique ID (8-char alphanumeric string)
  const id = Math.random().toString(36).substring(2, 10).toUpperCase();
  const timestamp = new Date().toISOString();

  const newLead: Lead = {
    ...leadInput,
    id,
    timestamp,
  };

  leads.push(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");

  return newLead;
}

/**
 * Retrieves all saved leads from the local database file.
 */
export async function getLeads(): Promise<Lead[]> {
  ensureDatabase();
  try {
    const rawData = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading leads database:", error);
    return [];
  }
}
