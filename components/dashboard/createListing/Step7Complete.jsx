"use client";
import React from "react";
import Link from "next/link";

export default function Step7Complete({ formData = {} }) {
  const brand = formData.brand?.name || "";
  const model = formData.model?.name || "";
  const version = formData.version?.name || "";
  const year = formData.year?.name || "";
  const listingTitle = [brand, model, version, year].filter(Boolean).join(" ") || "Tin đăng của bạn";

  return (
    <div className="tab-pane fade show active" style={{ textAlign: "center", padding: "50px 20px" }}>
      <div style={{
        width: "80px", height: "80px", borderRadius: "50%",
        background: "#e8f5e9", display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 24px",
      }}>
        <i className="fa fa-check" style={{ fontSize: "36px", color: "#4caf50" }} />
      </div>

      <h4 style={{ marginBottom: "10px" }}>Hoàn tất tạo tin đăng</h4>
      <p style={{ color: "#666", fontSize: "15px", maxWidth: "520px", margin: "0 auto 24px", lineHeight: "1.6" }}>
        Tin đăng bán xe của bạn đã được gửi thành công và đang chờ phê duyệt.
      </p>

      {/* Listing link */}
      <div style={{
        background: "#f8f9fa", borderRadius: "10px", padding: "18px 24px",
        maxWidth: "440px", margin: "0 auto 28px",
      }}>
        <span style={{ fontSize: "13px", color: "#999", display: "block", marginBottom: "6px" }}>
          Bài đăng của bạn
        </span>
        <Link
          href="/inventory-page-single-v1/1"
          style={{
            fontSize: "17px", fontWeight: "600",
            color: "var(--theme-color1, #405FF2)",
            textDecoration: "none",
          }}
        >
          {listingTitle}
          <i className="fa fa-external-link" style={{ marginLeft: "8px", fontSize: "13px" }} />
        </Link>
      </div>

      {/* CTA */}
      <Link href="/my-listings" className="theme-btn" style={{ padding: "12px 32px" }}>
        Danh sách tin đăng
        <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none">
          <g clipPath="url(#clip0_s7)">
            <path d="M13.6106 0H5.05509C4.84013 0 4.66619 0.173943 4.66619 0.388901C4.66619 0.603859 4.84013 0.777802 5.05509 0.777802H12.6719L0.113453 13.3362C-0.0384687 13.4881 -0.0384687 13.7342 0.113453 13.8861C0.189396 13.962 0.288927 14 0.388422 14C0.487917 14 0.587411 13.962 0.663391 13.8861L13.2218 1.3277V8.94447C13.2218 9.15943 13.3957 9.33337 13.6107 9.33337C13.8256 9.33337 13.9996 9.15943 13.9996 8.94447V0.388901C13.9995 0.173943 13.8256 0 13.6106 0Z" fill="white" />
          </g>
          <defs>
            <clipPath id="clip0_s7"><rect width={14} height={14} fill="white" /></clipPath>
          </defs>
        </svg>
      </Link>
    </div>
  );
}
