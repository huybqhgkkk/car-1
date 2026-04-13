"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  brands,
  bodyTypes,
  getModels,
  getYears,
  getVersions,
} from "@/data/vehicleMockData";

const MODAL_MODES = {
  BRAND: "brand",
  MODEL: "model",
  YEAR: "year",
  VERSION: "version",
  BODY_TYPE: "bodyType",
};

const FLOW_STEPS = [
  MODAL_MODES.BRAND,
  MODAL_MODES.MODEL,
  MODAL_MODES.YEAR,
  MODAL_MODES.VERSION,
];

export default function VehicleSelectModal({
  isOpen,
  onClose,
  onConfirm,
  mode = MODAL_MODES.BRAND,
  initialSelection = {},
  initialFlowStep = 0,
}) {
  const [flowStep, setFlowStep] = useState(0);
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState({
    brand: null,
    model: null,
    year: null,
    version: null,
    bodyType: null,
  });
  const backdropRef = useRef(null);

  const isFlow = mode === MODAL_MODES.BRAND;
  const isSinglePick = mode === MODAL_MODES.BODY_TYPE;

  // Compute the highest step reachable given current selection
  const getMaxReachable = (sel) => {
    if (sel.brand && sel.model && sel.year) return 3;
    if (sel.brand && sel.model) return 2;
    if (sel.brand) return 1;
    return 0;
  };

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      if (isFlow) {
        const sel = { ...initialSelection };
        const maxReachable = getMaxReachable(sel);
        setFlowStep(Math.min(initialFlowStep, maxReachable));
        setSelection(sel);
      } else if (isSinglePick) {
        setSelection((prev) => ({ ...prev, bodyType: initialSelection.bodyType || null }));
      }
    }
  }, [isOpen]);

  const currentMode = isFlow ? FLOW_STEPS[flowStep] : mode;

  const items = useMemo(() => {
    switch (currentMode) {
      case MODAL_MODES.BRAND:
        return brands;
      case MODAL_MODES.MODEL:
        return selection.brand ? getModels(selection.brand.id) : [];
      case MODAL_MODES.YEAR:
        return selection.model
          ? getYears(selection.model.id).map((y) => ({ id: y, name: y }))
          : [];
      case MODAL_MODES.VERSION:
        return selection.model && selection.year
          ? getVersions(selection.model.id, selection.year.id)
          : [];
      case MODAL_MODES.BODY_TYPE:
        return bodyTypes;
      default:
        return [];
    }
  }, [currentMode, selection.brand, selection.model, selection.year]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, search]);

  const title = (() => {
    switch (currentMode) {
      case MODAL_MODES.BRAND: return "Chọn thương hiệu xe";
      case MODAL_MODES.MODEL: return `Chọn dòng xe ${selection.brand?.name || ""}`;
      case MODAL_MODES.YEAR: return `Chọn năm sản xuất`;
      case MODAL_MODES.VERSION: return `Chọn phiên bản`;
      case MODAL_MODES.BODY_TYPE: return "Chọn kiểu dáng xe";
      default: return "Chọn";
    }
  })();

  const handleSelect = (item) => {
    const newSelection = { ...selection };

    switch (currentMode) {
      case MODAL_MODES.BRAND:
        newSelection.brand = item;
        // Reset dependent fields
        if (selection.brand?.id !== item.id) {
          newSelection.model = null;
          newSelection.year = null;
          newSelection.version = null;
        }
        break;
      case MODAL_MODES.MODEL:
        newSelection.model = item;
        if (selection.model?.id !== item.id) {
          newSelection.year = null;
          newSelection.version = null;
        }
        break;
      case MODAL_MODES.YEAR:
        newSelection.year = item;
        if (selection.year?.id !== item.id) {
          newSelection.version = null;
        }
        break;
      case MODAL_MODES.VERSION:
        newSelection.version = item;
        break;
      case MODAL_MODES.BODY_TYPE:
        newSelection.bodyType = item;
        break;
    }

    setSelection(newSelection);

    // Auto-advance in flow mode
    if (isFlow && flowStep < FLOW_STEPS.length - 1) {
      setFlowStep(flowStep + 1);
      setSearch("");
    } else if (isSinglePick) {
      // Single pick: confirm immediately
      onConfirm(newSelection);
    }
  };

  const handleBack = () => {
    if (isFlow && flowStep > 0) {
      setFlowStep(flowStep - 1);
      setSearch("");
    }
  };

  const handleConfirm = () => {
    onConfirm(selection);
  };

  const canConfirm = isFlow
    ? selection.brand && selection.model && selection.year && selection.version
    : selection.bodyType;

  const getSelectedForMode = () => {
    switch (currentMode) {
      case MODAL_MODES.BRAND: return selection.brand;
      case MODAL_MODES.MODEL: return selection.model;
      case MODAL_MODES.YEAR: return selection.year;
      case MODAL_MODES.VERSION: return selection.version;
      case MODAL_MODES.BODY_TYPE: return selection.bodyType;
      default: return null;
    }
  };

  if (!isOpen) return null;

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
      <div
        style={{
          background: "#fff", borderRadius: "12px", width: "90%",
          maxWidth: "560px", maxHeight: "80vh", display: "flex",
          flexDirection: "column", overflow: "hidden",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isFlow && flowStep > 0 && (
              <button
                onClick={handleBack}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px", fontSize: "18px", color: "#666",
                }}
                aria-label="Quay lại"
              >
                <i className="fa fa-arrow-left" />
              </button>
            )}
            <h5 style={{ margin: 0, fontSize: "16px" }}>{title}</h5>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "20px", color: "#999", padding: "4px",
            }}
            aria-label="Đóng"
          >
            <i className="fa fa-times" />
          </button>
        </div>

        {/* Flow breadcrumb */}
        {isFlow && (
          <div style={{
            padding: "10px 24px", background: "#f8f9fa",
            display: "flex", gap: "8px", flexWrap: "wrap", fontSize: "13px",
          }}>
            {FLOW_STEPS.map((step, i) => {
              const labels = { brand: "Hãng", model: "Dòng", year: "Năm", version: "Phiên bản" };
              const val = selection[step]?.name;
              const isCurrentFlow = i === flowStep;
              // Can navigate to step i if all prerequisites are met
              const canNavigate = i !== flowStep && i <= getMaxReachable(selection);
              return (
                <span key={step} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {i > 0 && <i className="fa fa-chevron-right" style={{ fontSize: "10px", color: "#ccc" }} />}
                  <span
                    onClick={() => { if (canNavigate) { setFlowStep(i); setSearch(""); } }}
                    style={{
                      padding: "3px 10px", borderRadius: "20px",
                      background: isCurrentFlow ? "var(--theme-color1, #405FF2)" : val ? "#e8eeff" : "transparent",
                      color: isCurrentFlow ? "#fff" : val ? "var(--theme-color1, #405FF2)" : "#999",
                      fontWeight: isCurrentFlow ? "600" : "400",
                      cursor: canNavigate ? "pointer" : "default",
                      opacity: !canNavigate && !isCurrentFlow && !val ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {val || labels[step]}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div style={{ padding: "12px 24px 8px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            border: "1px solid #e1e1e1", borderRadius: "8px", padding: "8px 14px",
          }}>
            <i className="fa fa-search" style={{ color: "#999", fontSize: "14px" }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none", outline: "none", flex: 1,
                fontSize: "14px", background: "transparent",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}
              >
                <i className="fa fa-times" style={{ fontSize: "12px" }} />
              </button>
            )}
          </div>
        </div>

        {/* Items list */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "8px 24px 16px",
        }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#999" }}>
              Không tìm thấy kết quả
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: currentMode === MODAL_MODES.BRAND ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
              gap: "10px",
            }}>
              {filtered.map((item) => {
                const selected = getSelectedForMode();
                const isSelected = selected?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{
                      padding: currentMode === MODAL_MODES.BRAND ? "14px 10px" : "12px 16px",
                      border: isSelected ? "2px solid var(--theme-color1, #405FF2)" : "1px solid #e8e8e8",
                      borderRadius: "8px", cursor: "pointer",
                      background: isSelected ? "#f0f4ff" : "#fff",
                      textAlign: currentMode === MODAL_MODES.BRAND ? "center" : "left",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: currentMode === MODAL_MODES.BRAND ? "column" : "row",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {currentMode === MODAL_MODES.BRAND && item.logo && (
                      <Image src={item.logo} width={40} height={40} alt={item.name} style={{ objectFit: "contain" }} />
                    )}
                    <span style={{
                      fontSize: "14px",
                      fontWeight: isSelected ? "600" : "400",
                      color: isSelected ? "var(--theme-color1, #405FF2)" : "#333",
                    }}>
                      {item.name}
                    </span>
                    {isSelected && (
                      <i className="fa fa-check-circle" style={{
                        color: "var(--theme-color1, #405FF2)", fontSize: "14px",
                        marginLeft: currentMode !== MODAL_MODES.BRAND ? "auto" : undefined,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {isFlow && (
          <div style={{
            padding: "16px 24px", borderTop: "1px solid #f0f0f0",
            display: "flex", justifyContent: "flex-end", gap: "12px",
          }}>
            <button
              onClick={onClose}
              className="theme-btn"
              style={{ background: "#f0f0f0", color: "#333", padding: "10px 24px" }}
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="theme-btn"
              disabled={!canConfirm}
              style={{
                padding: "10px 24px",
                opacity: canConfirm ? 1 : 0.5,
                cursor: canConfirm ? "pointer" : "not-allowed",
              }}
            >
              Xác nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { MODAL_MODES };
