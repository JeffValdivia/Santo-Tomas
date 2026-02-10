export async function sendWhatsAppMessage({ to, body }) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION || "v20.0";

  if (!token || !phoneNumberId) {
    console.info("[WhatsApp] Configuración faltante. Mensaje simulado:", { to, body });
    return { ok: true, simulated: true };
  }

  const response = await fetch(
    `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[WhatsApp] Error al enviar:", errorText);
    return { ok: false, error: errorText };
  }

  return { ok: true };
}
