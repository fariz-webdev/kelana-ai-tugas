const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SourceItem {
  document_id?: string | null;
  location?: {
    s3Location?: {
      uri?: string | null;
    } | null;
    type?: string | null;
  } | null;
  metadata?: {
    _document_title?: string | null;
    _source_uri?: string | null;
    [key: string]: unknown;
  } | null;
  score?: number | null;
}

export interface AskResponse {
  answer: string;
  question?: string;
  source: SourceItem[];
}

export async function askAssistant(question: string): Promise<AskResponse> {
  const res = await fetch(`${API_URL}/api/v1/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed (${res.status})`);
  }

  return res.json();
}
