import { MessageCircle } from "lucide-react";

export function Whatsapp() {
  const phone = "919876543210"; // Replace with your WhatsApp number

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us"
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="whatsapp-wrapper">
        <div className="whatsapp-glow"></div>

        <div className="whatsapp-button">
          <MessageCircle size={36} strokeWidth={2.5} className="text-white" />
        </div>
      </div>
    </a>
  );
}