"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import StepperProgress from "./createListing/StepperProgress";
import Step1BasicInfo from "./createListing/Step1BasicInfo";
import Step2UploadImages from "./createListing/Step2UploadImages";
import Step3Condition from "./createListing/Step3Condition";
import Step4AdditionalInfo from "./createListing/Step4AdditionalInfo";
import Step5Pricing from "./createListing/Step5Pricing";
import Step6Confirmation from "./createListing/Step6Confirmation";
import Step7Complete from "./createListing/Step7Complete";

const TOTAL_STEPS = 7;
const DRAFT_KEY = "createListingDraft";

const STEP_TITLES = [
  "Thông tin cơ bản",
  "Upload ảnh",
  "Tình trạng xe",
  "Thông tin bổ sung",
  "Thiết lập giá bán",
  "Xác nhận",
  "Hoàn thành",
];

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveDraft(data) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      formData: data.formData,
      currentStep: data.currentStep,
      maxStepReached: data.maxStepReached,
      savedAt: Date.now(),
    }));
  } catch { /* ignore */ }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}

export default function CreateListingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [hasDraft, setHasDraft] = useState(false);
  const autoSaveTimer = useRef(null);

  // Check for existing draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
      setHasDraft(true);
    }
  }, []);

  // Auto-save draft when formData or currentStep changes
  useEffect(() => {
    if (currentStep === TOTAL_STEPS - 1) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        saveDraft({ formData, currentStep, maxStepReached });
      }
    }, 1000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [formData, currentStep, maxStepReached]);

  const handleRestoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft.formData || {});
      setCurrentStep(draft.currentStep || 0);
      setMaxStepReached(draft.maxStepReached || 0);
      setHasDraft(false);
    }
  };

  const handleDismissDraft = () => {
    clearDraft();
    setHasDraft(false);
  };

  const validateStep = useCallback((step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.brand) newErrors.brand = "Vui lòng chọn thương hiệu xe";
        if (!formData.model) newErrors.model = "Vui lòng chọn model xe";
        if (!formData.year) newErrors.year = "Vui lòng chọn năm sản xuất";
        if (!formData.version) newErrors.version = "Vui lòng chọn phiên bản";
        if (!formData.bodyType) newErrors.bodyType = "Vui lòng chọn kiểu dáng";
        if (!formData.transmission) newErrors.transmission = "Vui lòng chọn hộp số";
        if (!formData.origin) newErrors.origin = "Vui lòng chọn xuất xứ";
        if (!formData.fuel) newErrors.fuel = "Vui lòng chọn nhiên liệu";
        break;
      case 1: {
        if (!formData.thumbnail) {
          newErrors.thumbnail = "Vui lòng tải lên ảnh thumbnail (ảnh đại diện)";
        }
        const totalImgs = (formData.thumbnail ? 1 : 0) + (formData.galleryImages?.length || 0);
        if (totalImgs < 2) {
          newErrors.galleryImages = "Tổng số ảnh (thumbnail + ảnh xe) phải ít nhất 2 ảnh";
        }
        if (formData._imageErrors?.length > 0) {
          newErrors._imageErrors = "Vui lòng sửa các lỗi ảnh trước khi tiếp tục";
        }
        break;
      }
      case 2:
        if (!formData.condition) newErrors.condition = "Vui lòng chọn tình trạng xe";
        if (!formData.mileage?.toString().trim()) newErrors.mileage = "Vui lòng nhập số KM đã đi";
        if (!formData.repairHistory?.trim()) newErrors.repairHistory = "Vui lòng nhập lịch sử sửa chữa";
        if (!formData.insurance?.trim()) newErrors.insurance = "Vui lòng nhập tình trạng bảo hiểm";
        if (!formData.registration?.trim()) newErrors.registration = "Vui lòng nhập tình trạng đăng kiểm";
        if (!formData.selfRating) newErrors.selfRating = "Vui lòng chọn thang điểm tự đánh giá";
        break;
      case 4:
        if (!formData.price?.toString().trim() || parseInt(formData.price) <= 0) {
          newErrors.price = "Vui lòng nhập giá bán hợp lệ (> 0)";
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = () => {
    if (currentStep >= TOTAL_STEPS - 1) return;
    if (currentStep === 5) {
      console.log("Submitting form data:", formData);
      clearDraft();
      setCurrentStep(6);
      setMaxStepReached((prev) => Math.max(prev, 6));
      return;
    }
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep <= 0) return;
    setErrors({});
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (step) => {
    if (step <= maxStepReached && step !== currentStep) {
      setErrors({});
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isStep1Complete = formData.brand && formData.model && formData.year
    && formData.version && formData.bodyType && formData.transmission
    && formData.origin && formData.fuel;

  const isStep2Complete = formData.thumbnail
    && ((formData.thumbnail ? 1 : 0) + (formData.galleryImages?.length || 0)) >= 2
    && !(formData._imageErrors?.length > 0);

  const isStep3Complete = formData.condition && formData.mileage?.toString().trim()
    && formData.repairHistory?.trim() && formData.insurance?.trim()
    && formData.registration?.trim() && formData.selfRating;

  const isStep5Complete = formData.price?.toString().trim() && parseInt(formData.price) > 0;

  const isNextDisabled =
    (currentStep === 0 && !isStep1Complete) ||
    (currentStep === 1 && !isStep2Complete) ||
    (currentStep === 2 && !isStep3Complete) ||
    (currentStep === 4 && !isStep5Complete);

  const renderStep = () => {
    const props = { formData, setFormData, errors };
    switch (currentStep) {
      case 0: return <Step1BasicInfo {...props} />;
      case 1: return <Step2UploadImages {...props} />;
      case 2: return <Step3Condition {...props} />;
      case 3: return <Step4AdditionalInfo {...props} />;
      case 4: return <Step5Pricing {...props} />;
      case 5: return <Step6Confirmation {...props} />;
      case 6: return <Step7Complete formData={formData} />;
      default: return null;
    }
  };

  return (
    <section className="dashboard-widget">
      {/* Global placeholder styling for wizard */}
      <style>{`
        .dashboard-widget .form-box input::placeholder,
        .dashboard-widget .form-box textarea::placeholder {
          color: #bbb !important;
          opacity: 1;
        }
      `}</style>
      <div className="right-box">
        <Sidebar />
        <div className="content-column">
          <div className="inner-column">
            <div className="list-title">
              <h3 className="title">Tạo tin đăng bán xe</h3>
              <div className="text">
                Điền đầy đủ thông tin để đăng tin bán xe của bạn
              </div>
            </div>

            {/* Draft restore banner */}
            {hasDraft && currentStep === 0 && Object.keys(formData).length === 0 && (
              <div style={{
                background: "#e8f5e9", border: "1px solid #a5d6a7",
                borderRadius: "8px", padding: "14px 20px", marginBottom: "20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "10px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <i className="fa fa-file-text" style={{ color: "#4caf50", fontSize: "18px" }} />
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    Bạn có tin đăng chưa hoàn thành. Bạn muốn tiếp tục?
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleRestoreDraft}
                    className="theme-btn small"
                    style={{ padding: "6px 16px", fontSize: "13px" }}
                  >
                    Khôi phục tin đăng trước
                  </button>
                  <button
                    onClick={handleDismissDraft}
                    className="theme-btn small"
                    style={{ padding: "6px 16px", fontSize: "13px", background: "#f0f0f0", color: "#333" }}
                  >
                    Bỏ qua
                  </button>
                </div>
              </div>
            )}

            <div className="form-box">
              <StepperProgress
                currentStep={currentStep}
                maxStepReached={maxStepReached}
                onStepClick={handleStepClick}
              />

              {currentStep < TOTAL_STEPS - 1 && (
                <div style={{ marginBottom: "25px" }}>
                  <h5 style={{ marginBottom: "5px" }}>
                    Bước {currentStep + 1}: {STEP_TITLES[currentStep]}
                  </h5>
                  <div style={{
                    height: "3px", width: "50px",
                    background: "var(--theme-color1, #405FF2)",
                    borderRadius: "2px",
                  }} />
                </div>
              )}

              {renderStep()}

              {currentStep < TOTAL_STEPS - 1 && (
                <div className="col-lg-12" style={{ marginTop: "30px" }}>
                  <div className="form-submit" style={{
                    display: "flex",
                    justifyContent: currentStep === 0 ? "flex-end" : "space-between",
                    gap: "15px",
                  }}>
                    {currentStep > 0 && (
                      <button
                        type="button"
                        className="theme-btn"
                        onClick={handlePrev}
                        style={{ background: "#f0f0f0", color: "#333" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ marginRight: "8px", transform: "rotate(180deg)" }}>
                          <g clipPath="url(#clip_prev)">
                            <path d="M13.6106 0H5.05509C4.84013 0 4.66619 0.173943 4.66619 0.388901C4.66619 0.603859 4.84013 0.777802 5.05509 0.777802H12.6719L0.113453 13.3362C-0.0384687 13.4881 -0.0384687 13.7342 0.113453 13.8861C0.189396 13.962 0.288927 14 0.388422 14C0.487917 14 0.587411 13.962 0.663391 13.8861L13.2218 1.3277V8.94447C13.2218 9.15943 13.3957 9.33337 13.6107 9.33337C13.8256 9.33337 13.9996 9.15943 13.9996 8.94447V0.388901C13.9995 0.173943 13.8256 0 13.6106 0Z" fill="#333" />
                          </g>
                          <defs>
                            <clipPath id="clip_prev"><rect width={14} height={14} fill="white" /></clipPath>
                          </defs>
                        </svg>
                        Quay lại
                      </button>
                    )}
                    <button
                      type="button"
                      className="theme-btn"
                      onClick={handleNext}
                      disabled={isNextDisabled}
                      style={{
                        opacity: isNextDisabled ? 0.5 : 1,
                        cursor: isNextDisabled ? "not-allowed" : "pointer",
                      }}
                    >
                      {currentStep === 5 ? "Đăng tin" : "Tiếp tục"}
                      <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none">
                        <g clipPath="url(#clip_next)">
                          <path d="M13.6106 0H5.05509C4.84013 0 4.66619 0.173943 4.66619 0.388901C4.66619 0.603859 4.84013 0.777802 5.05509 0.777802H12.6719L0.113453 13.3362C-0.0384687 13.4881 -0.0384687 13.7342 0.113453 13.8861C0.189396 13.962 0.288927 14 0.388422 14C0.487917 14 0.587411 13.962 0.663391 13.8861L13.2218 1.3277V8.94447C13.2218 9.15943 13.3957 9.33337 13.6107 9.33337C13.8256 9.33337 13.9996 9.15943 13.9996 8.94447V0.388901C13.9995 0.173943 13.8256 0 13.6106 0Z" fill="white" />
                        </g>
                        <defs>
                          <clipPath id="clip_next"><rect width={14} height={14} fill="white" /></clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
