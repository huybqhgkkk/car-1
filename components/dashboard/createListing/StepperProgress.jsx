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

// Line runs from center of first circle to center of last circle
// Each step takes 1/N of the width, so center of first = 1/(2*N), center of last = 1 - 1/(2*N)
// As percentage: left = 100/(2*N)%, right = 100/(2*N)%
const LINE_INSET = `${100 / (2 * STEPS.length)}%`;

export default function StepperProgress({ currentStep, maxStepReached = 0, onStepClick }) {
    const fillPercent = STEPS.length > 1
        ? (currentStep / (STEPS.length - 1)) * 100
        : 0;

    return (
        <>
            <style>{`
        .wizard-stepper { display: flex; justify-content: space-between; margin-bottom: 30px; position: relative; }
        .wizard-stepper-line { position: absolute; top: 18px; height: 3px; z-index: 0; }
        .wizard-stepper-line--bg { background: #e1e1e1; }
        .wizard-stepper-line--fill { background: var(--theme-color1, #405FF2); transition: width 0.4s ease; }
        .wizard-step { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; flex: 1; }
        .wizard-step-circle {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; transition: all 0.3s ease;
        }
        .wizard-step-label {
          margin-top: 6px; font-size: 11px; text-align: center;
          transition: all 0.3s ease; line-height: 1.3;
          max-width: 80px; word-wrap: break-word; white-space: normal;
        }
        @media (max-width: 767px) {
          .wizard-stepper { gap: 2px; margin-bottom: 20px; }
          .wizard-step-circle { width: 28px; height: 28px; font-size: 11px; }
          .wizard-stepper-line { top: 14px; height: 2px; }
          .wizard-step-label { font-size: 9px; max-width: 52px; }
        }
        @media (max-width: 480px) {
          .wizard-step-label { display: none; }
          .wizard-step-circle { width: 26px; height: 26px; font-size: 10px; }
          .wizard-stepper-line { top: 13px; }
          .wizard-stepper { margin-bottom: 16px; }
        }
      `}</style>

            <div className="wizard-stepper">
                {/* Background line */}
                <div
                    className="wizard-stepper-line wizard-stepper-line--bg"
                    style={{ left: LINE_INSET, right: LINE_INSET }}
                />
                {/* Filled line */}
                <div
                    className="wizard-stepper-line wizard-stepper-line--fill"
                    style={{ left: LINE_INSET, width: `calc(${fillPercent}% * (1 - 1 / ${STEPS.length}))` }}
                />

                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isClickable = index <= maxStepReached && index !== currentStep;

                    return (
                        <div
                            key={index}
                            className="wizard-step"
                            onClick={() => isClickable && onStepClick?.(index)}
                            style={{
                                cursor: isClickable ? "pointer" : "default",
                                opacity: !isClickable && !isActive ? 0.6 : 1,
                            }}
                        >
                            <div
                                className="wizard-step-circle"
                                style={{
                                    backgroundColor: isCompleted || isActive
                                        ? "var(--theme-color1, #405FF2)"
                                        : "#e1e1e1",
                                    color: isCompleted || isActive ? "#fff" : "#999",
                                    boxShadow: isActive ? "0 0 0 4px rgba(64,95,242,0.2)" : "none",
                                }}
                            >
                                {isCompleted ? (
                                    <i className="fa fa-check" style={{ fontSize: "12px" }} />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span
                                className="wizard-step-label"
                                style={{
                                    fontWeight: isActive ? "600" : "400",
                                    color: isCompleted || isActive ? "var(--theme-color1, #405FF2)" : "#999",
                                }}
                            >
                {step.label}
              </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
