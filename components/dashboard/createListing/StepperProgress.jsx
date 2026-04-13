"use client";
import React from "react";

const STEPS = [
  { label: "Thông tin cơ bản", icon: "flaticon-car" },
  { label: "Upload ảnh", icon: "fa fa-camera" },
  { label: "Tình trạng xe", icon: "fa fa-check-circle" },
  { label: "Thông tin bổ sung", icon: "fa fa-list" },
  { label: "Thiết lập giá bán", icon: "fa fa-tag" },
  { label: "Xác nhận", icon: "fa fa-eye" },
  { label: "Hoàn thành", icon: "fa fa-flag-checkered" },
];

export default function StepperProgress({ currentStep, maxStepReached = 0, onStepClick }) {
  return (
    <div className="stepper-wrapper" style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "30px",
      position: "relative",
    }}>
      {/* Progress line background */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "5%",
        right: "5%",
        height: "3px",
        backgroundColor: "#e1e1e1",
        zIndex: 0,
      }} />
      {/* Progress line filled */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "5%",
        width: `${(currentStep / (STEPS.length - 1)) * 90}%`,
        height: "3px",
        backgroundColor: "var(--theme-color1, #405FF2)",
        zIndex: 1,
        transition: "width 0.4s ease",
      }} />

      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isClickable = index <= maxStepReached && index !== currentStep;

        return (
          <div
            key={index}
            onClick={() => isClickable && onStepClick?.(index)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
              flex: 1,
              cursor: isClickable ? "pointer" : "default",
              opacity: !isClickable && !isActive ? 0.7 : 1,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isCompleted
                  ? "var(--theme-color1, #405FF2)"
                  : isActive
                  ? "var(--theme-color1, #405FF2)"
                  : "#e1e1e1",
                color: isCompleted || isActive ? "#fff" : "#999",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                border: isActive ? "3px solid rgba(64,95,242,0.3)" : "none",
              }}
            >
              {isCompleted ? (
                <i className="fa fa-check" style={{ fontSize: "14px" }} />
              ) : (
                <span style={{ fontSize: "13px" }}>{index + 1}</span>
              )}
            </div>
            <span
              style={{
                marginTop: "8px",
                fontSize: "12px",
                fontWeight: isActive ? "600" : "400",
                color: isCompleted || isActive ? "var(--theme-color1, #405FF2)" : "#999",
                textAlign: "center",
                whiteSpace: "nowrap",
                transition: "all 0.3s ease",
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
