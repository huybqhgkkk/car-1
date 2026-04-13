"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";

const MOCK_SELLER = {
  name: "Nguyễn Văn A",
  phone: "0912 345 678",
  address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
  type: "Cá nhân",
};

const INSPECTION_DAYS = [
  { key: "mon", label: "Thứ 2" },
  { key: "tue", label: "Thứ 3" },
  { key: "wed", label: "Thứ 4" },
  { key: "thu", label: "Thứ 5" },
  { key: "fri", label: "Thứ 6" },
  { key: "sat", label: "Thứ 7" },
  { key: "sun", label: "Chủ nhật" },
];

const INSPECTION_HOURS = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", padding: "9px 0",
      borderBottom: "1px solid #f0f0f0",
    }}>
      <span style={{ color: "#888", fontSize: "13px" }}>{label}</span>
      <span style={{ fontWeight: "500", fontSize: "13px", color: "#333", textAlign: "right", maxWidth: "60%" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div style={{
      background: "#f8f9fa", borderRadius: "10px", padding: "20px",
      marginBottom: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        {icon && <i className={icon} style={{ color: "var(--theme-color1, #405FF2)", fontSize: "14px" }} />}
        <h6 style={{ margin: 0, fontSize: "15px" }}>{title}</h6>
      </div>
      {children}
    </div>
  );
}

function InspectionModal({ isOpen, onClose, formData, setFormData }) {
  const backdropRef = useRef(null);
  const selectedDays = formData.inspectionDays || [];
  const selectedHour = formData.inspectionHour || "";

  if (!isOpen) return null;

  const toggleDay = (key) => {
    const next = selectedDays.includes(key)
      ? selectedDays.filter((d) => d !== key)
      : [...selectedDays, key];
    setFormData((prev) => ({ ...prev, inspectionDays: next }));
  };

  const selectHour = (h) => {
    setFormData((prev) => ({ ...prev, inspectionHour: h }));
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: "12px", width: "90%",
        maxWidth: "520px", maxHeight: "85vh", overflow: "auto",
      }} role="dialog" aria-modal="true" aria-label="Đặt lịch kiểm tra xe">
        {/* Header */}
        <div style={{
          padding: "20px 24px 14px", borderBottom: "1px solid #f0f0f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h5 style={{ margin: 0, fontSize: "16px" }}>Đặt lịch kiểm tra xe</h5>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#999",
          }} aria-label="Đóng"><i className="fa fa-times" /></button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Service info */}
          <div style={{
            background: "#f8faff", borderRadius: "8px", padding: "14px 16px",
            border: "1px solid #e8eeff", marginBottom: "20px",
          }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <i className="fa fa-shield" style={{ color: "var(--theme-color1, #405FF2)", fontSize: "16px", marginTop: "2px" }} />
              <div>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>Dịch vụ kiểm tra xe chuyên nghiệp</span>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
                  Đội ngũ kỹ thuật viên sẽ kiểm tra toàn diện 150+ hạng mục bao gồm động cơ, hộp số, gầm, thân vỏ, điện, nội thất. Báo cáo chi tiết sẽ được gửi cho cả người bán và người mua.
                </p>
              </div>
            </div>
          </div>

          {/* Day selection */}
          <label style={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px", display: "block" }}>
            Chọn ngày có thể kiểm tra
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {INSPECTION_DAYS.map((day) => {
              const checked = selectedDays.includes(day.key);
              return (
                <span
                  key={day.key}
                  onClick={() => toggleDay(day.key)}
                  style={{
                    padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
                    border: checked ? "2px solid var(--theme-color1, #405FF2)" : "1px solid #e1e1e1",
                    background: checked ? "#f0f4ff" : "#fff",
                    fontSize: "13px", fontWeight: checked ? "600" : "400",
                    color: checked ? "var(--theme-color1, #405FF2)" : "#666",
                    transition: "all 0.2s", userSelect: "none",
                  }}
                >
                  {day.label}
                </span>
              );
            })}
          </div>

          {/* Hour selection */}
          <label style={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px", display: "block" }}>
            Chọn khung giờ
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
            {INSPECTION_HOURS.map((h) => {
              const active = selectedHour === h;
              return (
                <span
                  key={h}
                  onClick={() => selectHour(h)}
                  style={{
                    padding: "8px 18px", borderRadius: "20px", cursor: "pointer",
                    border: active ? "2px solid var(--theme-color1, #405FF2)" : "1px solid #e1e1e1",
                    background: active ? "#f0f4ff" : "#fff",
                    fontSize: "13px", fontWeight: active ? "600" : "400",
                    color: active ? "var(--theme-color1, #405FF2)" : "#666",
                    transition: "all 0.2s", userSelect: "none",
                  }}
                >
                  {h}
                </span>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid #f0f0f0",
          display: "flex", justifyContent: "flex-end", gap: "12px",
        }}>
          <button onClick={onClose} className="theme-btn" style={{ background: "#f0f0f0", color: "#333", padding: "10px 24px" }}>
            Đóng
          </button>
          <button
            onClick={onClose}
            className="theme-btn"
            disabled={selectedDays.length === 0 || !selectedHour}
            style={{
              padding: "10px 24px",
              opacity: selectedDays.length > 0 && selectedHour ? 1 : 0.5,
              cursor: selectedDays.length > 0 && selectedHour ? "pointer" : "not-allowed",
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Step6Confirmation({ formData, setFormData }) {
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  const thumbnail = formData.thumbnail;
  const gallery = formData.galleryImages || [];
  const totalImages = (thumbnail ? 1 : 0) + gallery.length;

  const handleInspectionToggle = () => {
    const next = !formData.requestInspection;
    setFormData((prev) => ({ ...prev, requestInspection: next }));
    if (next) setInspectionModalOpen(true);
  };

  return (
    <div className="tab-pane fade show active">
      <div style={{ marginBottom: "20px" }}>
        <h6 style={{ marginBottom: "5px" }}>Xác nhận thông tin đăng bán</h6>
        <p style={{ color: "#999", fontSize: "14px" }}>
          Vui lòng kiểm tra lại toàn bộ thông tin trước khi đăng tin.
        </p>
      </div>

      {/* Inspection checkbox */}
      <div style={{
        padding: "16px 20px", borderRadius: "10px", marginBottom: "20px",
        border: formData.requestInspection
          ? "2px solid var(--theme-color1, #405FF2)"
          : "1px solid #e1e1e1",
        background: formData.requestInspection ? "#f8faff" : "#fff",
        cursor: "pointer", transition: "all 0.2s",
      }} onClick={handleInspectionToggle}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <span style={{
            width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
            border: formData.requestInspection ? "none" : "2px solid #ccc",
            background: formData.requestInspection ? "var(--theme-color1, #405FF2)" : "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginTop: "1px",
          }}>
            {formData.requestInspection && <i className="fa fa-check" style={{ color: "#fff", fontSize: "11px" }} />}
          </span>
          <div>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Gửi yêu cầu kiểm tra xe sau khi tạo bài đăng
            </span>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#666" }}>
              Tăng độ tin cậy cho bài đăng với báo cáo kiểm tra chuyên nghiệp.
            </p>
            {formData.requestInspection && formData.inspectionDays?.length > 0 && formData.inspectionHour && (
              <div style={{
                marginTop: "8px", padding: "8px 12px", background: "#e8f5e9",
                borderRadius: "6px", fontSize: "12px", color: "#2e7d32",
              }}>
                <i className="fa fa-check-circle" style={{ marginRight: "6px" }} />
                Đã chọn: {formData.inspectionDays.map((d) =>
                  INSPECTION_DAYS.find((x) => x.key === d)?.label
                ).join(", ")} — {formData.inspectionHour}
                <span
                  onClick={(e) => { e.stopPropagation(); setInspectionModalOpen(true); }}
                  style={{ marginLeft: "10px", color: "var(--theme-color1, #405FF2)", cursor: "pointer", fontWeight: "500" }}
                >
                  Thay đổi
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seller info */}
      <SectionCard title="Thông tin người bán" icon="fa fa-user">
        <InfoRow label="Loại tài khoản" value={MOCK_SELLER.type} />
        <InfoRow label="Họ tên" value={MOCK_SELLER.name} />
        <InfoRow label="Số điện thoại" value={MOCK_SELLER.phone} />
        <InfoRow label="Địa chỉ" value={MOCK_SELLER.address} />
        <div style={{ marginTop: "12px" }}>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            style={{
              background: "none", border: "1px solid #e1e1e1", borderRadius: "6px",
              padding: "6px 16px", fontSize: "13px", color: "var(--theme-color1, #405FF2)",
              cursor: "pointer", fontWeight: "500",
            }}
          >
            <i className="fa fa-pencil" style={{ marginRight: "6px", fontSize: "11px" }} />
            Sửa thông tin
          </button>
        </div>
      </SectionCard>

      {/* Vehicle info */}
      <SectionCard title="Thông tin xe" icon="fa fa-car">
        <InfoRow label="Thương hiệu" value={formData.brand?.name} />
        <InfoRow label="Model" value={formData.model?.name} />
        <InfoRow label="Phiên bản" value={formData.version?.name} />
        <InfoRow label="Năm sản xuất" value={formData.year?.name} />
        <InfoRow label="Kiểu dáng" value={formData.bodyType?.name} />
        <InfoRow label="Hộp số" value={formData.transmission} />
        <InfoRow label="Xuất xứ" value={formData.origin} />
        <InfoRow label="Nhiên liệu" value={formData.fuel} />
        <InfoRow label="Tình trạng" value={formData.condition} />
        <InfoRow label="Số KM" value={formData.mileage ? `${Number(formData.mileage).toLocaleString("vi-VN")} km` : null} />
        <InfoRow label="Tự đánh giá" value={formData.selfRating} />
      </SectionCard>

      {/* Price */}
      <SectionCard title="Giá bán" icon="fa fa-tag">
        <div style={{ fontSize: "26px", fontWeight: "700", color: "var(--theme-color1, #405FF2)", marginBottom: "6px" }}>
          {formData.price ? `${Number(formData.price).toLocaleString("vi-VN")} Triệu VNĐ` : "—"}
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#666" }}>
          {formData.installment && <span><i className="fa fa-check-circle" style={{ color: "#4caf50", marginRight: "4px" }} />Hỗ trợ trả góp</span>}
          {formData.allowBargain !== false && <span><i className="fa fa-check-circle" style={{ color: "#4caf50", marginRight: "4px" }} />Cho phép trả giá</span>}
        </div>
      </SectionCard>

      {/* Images */}
      {totalImages > 0 && (
        <SectionCard title={`Ảnh xe (${totalImages} ảnh)`} icon="fa fa-camera">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {thumbnail && (
              <div style={{ position: "relative" }}>
                <Image src={thumbnail.url} width={110} height={82} alt="Thumbnail"
                  style={{ objectFit: "cover", borderRadius: "6px" }} />
                <span style={{
                  position: "absolute", top: "4px", left: "4px", background: "var(--theme-color1, #405FF2)",
                  color: "#fff", padding: "1px 6px", borderRadius: "3px", fontSize: "9px",
                }}>Thumbnail</span>
              </div>
            )}
            {gallery.slice(0, 4).map((img, i) => (
              <Image key={i} src={img.url} width={110} height={82} alt={`Ảnh ${i + 1}`}
                style={{ objectFit: "cover", borderRadius: "6px" }} />
            ))}
            {gallery.length > 4 && (
              <div style={{
                width: "110px", height: "82px", borderRadius: "6px", background: "#f0f0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", color: "#666",
              }}>
                +{gallery.length - 4} ảnh
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Description */}
      {formData.conditionDescription && (
        <SectionCard title="Mô tả" icon="fa fa-file-text-o">
          <p style={{ fontSize: "13px", color: "#444", whiteSpace: "pre-wrap", lineHeight: "1.6", margin: 0 }}>
            {formData.conditionDescription}
          </p>
        </SectionCard>
      )}

      {/* Warning */}
      <div style={{
        background: "#fff8e1", borderRadius: "8px", padding: "14px 18px",
        border: "1px solid #ffe082",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="fa fa-exclamation-triangle" style={{ color: "#f9a825" }} />
          <span style={{ fontSize: "13px", color: "#666" }}>
            Sau khi đăng tin, bạn vẫn có thể chỉnh sửa thông tin trong mục "My Listings".
          </span>
        </div>
      </div>

      {/* Inspection Modal */}
      <InspectionModal
        isOpen={inspectionModalOpen}
        onClose={() => setInspectionModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
