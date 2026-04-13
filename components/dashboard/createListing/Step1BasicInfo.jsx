"use client";
import React, { useEffect, useState } from "react";
import VehicleSelectModal, { MODAL_MODES } from "./VehicleSelectModal";
import { exteriorColors, interiorColors } from "@/data/vehicleMockData";

const PLACEHOLDER_STYLE = { color: "#bbb" };

const COLOR_MAP = {
  "Trắng": "#fff", "Đen": "#222", "Bạc": "#c0c0c0", "Xám": "#808080",
  "Đỏ": "#e53935", "Xanh dương": "#1e88e5", "Xanh lá": "#43a047",
  "Nâu": "#795548", "Vàng": "#fdd835", "Cam": "#fb8c00",
  "Be (Kem)": "#f5f0e1",
};

function ModalTriggerField({ label, value, placeholder, required, error, onClick }) {
  return (
    <div className="form_boxes">
      <label>{label} {required && <span style={{ color: "red" }}>*</span>}</label>
      <div className="drop-menu" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="select" style={{ border: error ? "1px solid red" : undefined, borderRadius: "8px" }}>
          <span style={value ? undefined : PLACEHOLDER_STYLE}>{value || placeholder}</span>
          <i className="fa fa-angle-right" />
        </div>
      </div>
      {error && <small style={{ color: "red" }}>{error}</small>}
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange, required, error }) {
  return (
    <div className="form_boxes">
      <label>{label} {required && <span style={{ color: "red" }}>*</span>}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
        {options.map((opt) => (
          <label key={opt} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
            border: value === opt ? "2px solid var(--theme-color1, #405FF2)" : "1px solid #e1e1e1",
            background: value === opt ? "#f0f4ff" : "#fff", fontSize: "14px", transition: "all 0.2s",
          }}>
            <input type="radio" name={name} value={opt} checked={value === opt}
              onChange={() => onChange(opt)} style={{ display: "none" }} />
            <span style={{
              width: "16px", height: "16px", borderRadius: "50%",
              border: value === opt ? "5px solid var(--theme-color1, #405FF2)" : "2px solid #ccc",
              display: "inline-block", flexShrink: 0,
            }} />
            {opt}
          </label>
        ))}
      </div>
      {error && <small style={{ color: "red", marginTop: "4px", display: "block" }}>{error}</small>}
    </div>
  );
}

function ColorField({ label, colors, value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const isCustom = value && !colors.filter((c) => c !== "Khác").includes(value);

  return (
    <div className="form_boxes">
      <label>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
        {colors.map((color) => {
          const isActive = value === color || (color === "Khác" && isCustom);
          const dotColor = COLOR_MAP[color];
          return (
            <span
              key={color}
              onClick={() => {
                if (color === "Khác") { setShowCustom(true); onChange(""); }
                else { setShowCustom(false); onChange(color); }
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "20px", cursor: "pointer",
                border: isActive ? "2px solid var(--theme-color1, #405FF2)" : "1px solid #e1e1e1",
                background: isActive ? "#f0f4ff" : "#fff", fontSize: "13px", transition: "all 0.2s",
              }}
            >
              {dotColor && (
                <span style={{
                  width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                  background: dotColor,
                  border: color === "Trắng" ? "1px solid #ddd" : "1px solid transparent",
                  display: "inline-block",
                }} />
              )}
              {color}
            </span>
          );
        })}
      </div>
      {(showCustom || isCustom) && (
        <input
          type="text" placeholder="Nhập màu khác..."
          value={isCustom ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="form-control"
          style={{ marginTop: "10px", maxWidth: "250px", color: "#333" }}
        />
      )}
    </div>
  );
}

export default function Step1BasicInfo({ formData, setFormData, errors }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(MODAL_MODES.BRAND);
  const [modalFlowStep, setModalFlowStep] = useState(0);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openVehicleModal = (flowStep = 0) => {
    setModalMode(MODAL_MODES.BRAND);
    setModalFlowStep(flowStep);
    setModalOpen(true);
  };

  const openBodyTypeModal = () => {
    setModalMode(MODAL_MODES.BODY_TYPE);
    setModalFlowStep(0);
    setModalOpen(true);
  };

  const handleModalConfirm = (selection) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (selection.brand) next.brand = selection.brand;
      if (selection.model) next.model = selection.model;
      if (selection.year) next.year = selection.year;
      if (selection.version) next.version = selection.version;
      if (selection.bodyType) next.bodyType = selection.bodyType;
      if (selection.brand && prev.brand?.id !== selection.brand.id) {
        next.model = selection.model || null;
        next.year = selection.year || null;
        next.version = selection.version || null;
      }
      return next;
    });
    setModalOpen(false);
  };

  return (
    <div className="tab-pane fade show active">
      <form onSubmit={(e) => e.preventDefault()} className="row">
        <div className="form-column col-lg-6">
          <ModalTriggerField label="Thương hiệu xe" value={formData.brand?.name}
            placeholder="Chọn thương hiệu xe" required error={errors?.brand}
            onClick={() => openVehicleModal(0)} />
        </div>
        <div className="form-column col-lg-6">
          <ModalTriggerField label="Model xe" value={formData.model?.name}
            placeholder="Chọn model xe" required error={errors?.model}
            onClick={() => openVehicleModal(formData.brand ? 1 : 0)} />
        </div>
        <div className="form-column col-lg-6">
          <ModalTriggerField label="Năm sản xuất" value={formData.year?.name}
            placeholder="Chọn năm sản xuất" required error={errors?.year}
            onClick={() => openVehicleModal(formData.model ? 2 : formData.brand ? 1 : 0)} />
        </div>
        <div className="form-column col-lg-6">
          <ModalTriggerField label="Phiên bản" value={formData.version?.name}
            placeholder="Chọn phiên bản" required error={errors?.version}
            onClick={() => openVehicleModal(formData.year ? 3 : formData.model ? 2 : formData.brand ? 1 : 0)} />
        </div>
        <div className="form-column col-lg-6">
          <ModalTriggerField label="Kiểu dáng" value={formData.bodyType?.name}
            placeholder="Chọn kiểu dáng xe" required error={errors?.bodyType}
            onClick={openBodyTypeModal} />
        </div>
        <div className="form-column col-lg-6">
          <div className="form_boxes">
            <label>Số ghế</label>
            <div className="drop-menu">
              <div className="select" style={{ display: "flex", alignItems: "center" }}>
                <input type="number" min="2" max="50"
                  placeholder="VD: 5"
                  value={formData.seats || ""}
                  onChange={(e) => handleChange("seats", e.target.value)}
                  style={{
                    border: "none", outline: "none", background: "transparent",
                    width: "100%", fontSize: "inherit", padding: 0,
                    color: formData.seats ? "#333" : undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-column col-lg-12">
          <RadioGroup label="Hộp số" name="transmission"
            options={["Tự động", "Số sàn", "Hỗn hợp"]}
            value={formData.transmission}
            onChange={(val) => handleChange("transmission", val)}
            required error={errors?.transmission} />
        </div>
        <div className="form-column col-lg-12">
          <RadioGroup label="Xuất xứ" name="origin"
            options={["Trong nước", "Nhập khẩu"]}
            value={formData.origin}
            onChange={(val) => handleChange("origin", val)}
            required error={errors?.origin} />
        </div>
        <div className="form-column col-lg-12">
          <RadioGroup label="Nhiên liệu" name="fuel"
            options={["Xăng", "Diesel", "Điện", "Hybrid", "Khác"]}
            value={formData.fuel}
            onChange={(val) => handleChange("fuel", val)}
            required error={errors?.fuel} />
        </div>
        <div className="form-column col-lg-6">
          <ColorField label="Màu xe" colors={exteriorColors}
            value={formData.exteriorColor}
            onChange={(val) => handleChange("exteriorColor", val)} />
        </div>
        <div className="form-column col-lg-6">
          <ColorField label="Màu nội thất" colors={interiorColors}
            value={formData.interiorColor}
            onChange={(val) => handleChange("interiorColor", val)} />
        </div>
      </form>

      <VehicleSelectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        mode={modalMode}
        initialFlowStep={modalFlowStep}
        initialSelection={{
          brand: formData.brand || null, model: formData.model || null,
          year: formData.year || null, version: formData.version || null,
          bodyType: formData.bodyType || null,
        }}
      />
    </div>
  );
}
