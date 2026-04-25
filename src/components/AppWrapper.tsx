"use client";

import { useState, useEffect } from "react";
import AcceptanceModal, { hasAcceptedTerms } from "@/components/acceptance-modal";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!hasAcceptedTerms()) {
      setShowModal(true);
    }
  }, []);

  return (
    <>
      {children}
      <AcceptanceModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
