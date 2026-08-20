'use client';

import { useState, useCallback, useRef } from 'react';
import type { PageId } from '@/data/portal-config';
import PortalHeader from '@/components/PortalHeader';
import LandingView from '@/components/LandingView';
import LookupView from '@/components/LookupView';
import AccessView from '@/components/AccessView';
import VerifyView from '@/components/VerifyView';
import FinalView from '@/components/FinalView';
import AdminView from '@/components/AdminView';
import StaffView from '@/components/StaffView';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageId>("landing");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const navigate = useCallback((page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleReset = useCallback(() => {
    setSelectedAsset(null);
    sessionStorage.clear();
    navigate("landing");
  }, [navigate]);

  return (
    <>
      <PortalHeader currentPage={currentPage} onNavigate={navigate} />

      {currentPage === "landing" && (
        <LandingView
          selectedAsset={selectedAsset}
          onSelectAsset={(id) => { setSelectedAsset(id); showToast(`Asset type selected: ${id}`); }}
          onNavigateToLookup={() => navigate("lookup")}
        />
      )}
      {currentPage === "lookup" && (
        <LookupView onNavigateToAccess={() => navigate("access")} showToast={showToast} />
      )}
      {currentPage === "access" && (
        <AccessView onNavigateToVerify={() => navigate("verify")} showToast={showToast} />
      )}
      {currentPage === "verify" && (
        <VerifyView onNavigateToFinal={() => navigate("final")} showToast={showToast} />
      )}
      {currentPage === "final" && (
        <FinalView onReset={handleReset} />
      )}
      {currentPage === "admin" && (
        <AdminView showToast={showToast} />
      )}
      {currentPage === "staff" && (
        <StaffView showToast={showToast} />
      )}

      {/* Toast notification */}
      <div className={`toast ${toast.visible ? "" : "hidden"}`} role="alert" aria-live="polite">
        {toast.message}
      </div>
    </>
  );
}