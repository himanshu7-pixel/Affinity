import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrisisOverlay() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "oklch(0.30 0.18 25 / 0.97)" }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl relative"
        >
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>

          <div className="mb-4">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-3 fill-red-100" />
            <h2 className="font-display text-2xl font-black text-gray-900 mb-2">
              You Are Not Alone
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We noticed signs of distress. Reaching out is a sign of strength.
              Trained counselors are available right now — please connect.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <a
              href="tel:988"
              className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-4 font-bold transition-colors"
            >
              <Phone className="h-5 w-5" />
              Call 988 — Suicide &amp; Crisis Lifeline
            </a>
            <a
              href="sms:741741?body=HOME"
              className="flex items-center justify-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 font-semibold transition-colors text-sm"
            >
              Text HOME to 741741 — Crisis Text Line
            </a>
            <a
              href="tel:911"
              className="flex items-center justify-center gap-3 w-full border-2 border-red-300 hover:bg-red-50 text-red-700 rounded-xl py-3 font-semibold transition-colors text-sm"
            >
              Call 911 — Emergency Services
            </a>
          </div>

          <Button
            variant="ghost"
            className="text-gray-400 text-xs"
            onClick={() => setDismissed(true)}
          >
            I am safe right now — close this
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
