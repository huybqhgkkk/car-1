import CreateListingWizard from "@/components/dashboard/CreateListingWizard";
import Footer1 from "@/components/footers/Footer1";
import HeaderDashboard from "@/components/headers/HeaderDashboard";
import React from "react";

export const metadata = {
  title: "Tạo tin đăng bán xe || Boxcar",
  description: "Boxcar - Tạo tin đăng bán xe",
};

export default function CreateListingPage() {
  return (
    <>
      <div style={{ background: "var(--theme-color-dark)" }}>
        <HeaderDashboard />
        <CreateListingWizard />
        <Footer1 parentClass="boxcar-footer footer-style-one v2" />
      </div>
    </>
  );
}
