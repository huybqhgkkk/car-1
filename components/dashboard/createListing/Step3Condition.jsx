"use client";
import React, { useState } from "react";

function RadioGroup({ label, name, options, value, onChange, required, error }) {
  return (
    <div className="form_boxes">
      <label>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
        {options.map((opt) => (
          <label
            key={opt}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
              border: value === opt
                ? "2px solid var(--theme-color1, #405FF2)"
                : "1px solid #e1e1e1",
              background: value === opt ? "#f0f4ff" : "#fff",
              fontSize: "14px", transition: "all 0.2s",
            }}
          >
            <input
              type="radio" name={name} value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              style={{ display: "none" }}
            />
            <span style={{
              width: "16px", height: "16px", borderRadius: "50%",
              border: value === opt
                ? "5px solid var(--theme-color1, #405FF2)"
                : "2px solid #ccc",
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

function generateMockDescription(formData) {
  const brand = formData.brand?.name || "xe";
  const model = formData.model?.name || "";
  const year = formData.year?.name || "";
  const version = formData.version?.name || "";
  const fuel = formData.fuel || "";
  const transmission = formData.transmission || "";
  const origin = formData.origin || "";
  const bodyType = formData.bodyType?.name || "";
  const mileage = formData.mileage || "";
  const condition = formData.condition || "";
  const selfRating = formData.selfRating || "";
  const imgCount = (formData.thumbnail ? 1 : 0) + (formData.galleryImages?.length || 0);

  return `${brand} ${model} ${version} ${year} — ${condition || "xe đã qua sử dụng"}, ${origin ? origin.toLowerCase() : "lắp ráp trong nước"}.

Xe sử dụng động cơ ${fuel ? fuel.toLowerCase() : "xăng"}, hộp số ${transmission ? transmission.toLowerCase() : "tự động"}, kiểu dáng ${bodyType ? bodyType.toLowerCase() : "sedan"}${mileage ? `, đã đi ${Number(mileage).toLocaleString("vi-VN")} km` : ""}.

Tình trạng tổng thể: ${selfRating || "tốt"}. Xe được bảo dưỡng định kỳ, nội ngoại thất sạch sẽ, máy móc vận hành ổn định. Cam kết không đâm đụng, không ngập nước.

${imgCount > 0 ? `Đã có ${imgCount} ảnh thực tế kèm theo để quý khách tham khảo.` : ""}

Liên hệ trực tiếp để xem xe và lái thử. Hỗ trợ trả góp lên đến 80% giá trị xe.`.trim();
}

export default function Step3Condition({ formData, setFormData, errors }) {
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateAI = () => {
    setAiLoading(true);
    // Mock API call
    setTimeout(() => {
      const text = generateMockDescription(formData);
      setFormData((prev) => ({ ...prev, conditionDescription: text }));
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div className="tab-pane fade show active">
      <form onSubmit={(e) => e.preventDefault()} className="row">
        {/* Tình trạng xe */}
        <div className="form-column col-lg-12">
          <RadioGroup
            label="Tình trạng xe"
            name="condition"
            options={["Xe cũ", "Xe mới", "Xe cổ"]}
            value={formData.condition}
            onChange={(val) => handleChange("condition", val)}
            required
            error={errors?.condition}
          />
        </div>

        {/* Số KM đã đi */}
        <div className="form-column col-lg-6" style={{ marginTop: "10px" }}>
          <div className="form_boxes">
            <label>Số KM đã đi <span style={{ color: "red" }}>*</span></label>
            <div className="drop-menu">
              <input
                type="text"
                placeholder="VD: 35.000"
                value={formData.mileage ? Number(formData.mileage).toLocaleString("vi-VN") : ""}
                onChange={(e) => handleChange("mileage", e.target.value.replace(/\D/g, ""))}
                className="form-control"
                style={{ border: errors?.mileage ? "1px solid red" : undefined }}
              />
            </div>
            {errors?.mileage && <small style={{ color: "red" }}>{errors.mileage}</small>}
          </div>
        </div>

        {/* Lịch sử sửa chữa */}
        <div className="form-column col-lg-6" style={{ marginTop: "10px" }}>
          <div className="form_boxes">
            <label>Lịch sử sửa chữa <span style={{ color: "red" }}>*</span></label>
            <div className="drop-menu">
              <textarea
                placeholder="VD: Thay dầu định kỳ, chưa sửa chữa lớn..."
                value={formData.repairHistory || ""}
                onChange={(e) => handleChange("repairHistory", e.target.value)}
                rows={3}
                style={{
                  width: "100%", padding: "10px", borderRadius: "8px",
                  border: errors?.repairHistory ? "1px solid red" : "1px solid #e1e1e1",
                  resize: "vertical",
                }}
              />
            </div>
            {errors?.repairHistory && <small style={{ color: "red" }}>{errors.repairHistory}</small>}
          </div>
        </div>

        {/* Tình trạng bảo hiểm */}
        <div className="form-column col-lg-6" style={{ marginTop: "10px" }}>
          <div className="form_boxes">
            <label>Tình trạng bảo hiểm <span style={{ color: "red" }}>*</span></label>
            <div className="drop-menu">
              <input
                type="text"
                placeholder="VD: Còn bảo hiểm thân vỏ đến 12/2025"
                value={formData.insurance || ""}
                onChange={(e) => handleChange("insurance", e.target.value)}
                className="form-control"
                style={{ border: errors?.insurance ? "1px solid red" : undefined }}
              />
            </div>
            {errors?.insurance && <small style={{ color: "red" }}>{errors.insurance}</small>}
          </div>
        </div>

        {/* Tình trạng đăng kiểm */}
        <div className="form-column col-lg-6" style={{ marginTop: "10px" }}>
          <div className="form_boxes">
            <label>Tình trạng đăng kiểm <span style={{ color: "red" }}>*</span></label>
            <div className="drop-menu">
              <input
                type="text"
                placeholder="VD: Còn hạn đến 06/2026"
                value={formData.registration || ""}
                onChange={(e) => handleChange("registration", e.target.value)}
                className="form-control"
                style={{ border: errors?.registration ? "1px solid red" : undefined }}
              />
            </div>
            {errors?.registration && <small style={{ color: "red" }}>{errors.registration}</small>}
          </div>
        </div>

        {/* Thang điểm tự đánh giá */}
        <div className="form-column col-lg-12" style={{ marginTop: "10px" }}>
          <RadioGroup
            label="Thang điểm tự đánh giá"
            name="selfRating"
            options={["Như mới", "Tương đối mới", "Trung bình", "Cũ", "Rất cũ"]}
            value={formData.selfRating}
            onChange={(val) => handleChange("selfRating", val)}
            required
            error={errors?.selfRating}
          />
        </div>

        {/* Mô tả + AI button */}
        <div className="form-column col-lg-12" style={{ marginTop: "10px" }}>
          <div className="form_boxes v2">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ margin: 0 }}>Mô tả</label>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "20px", fontSize: "13px",
                  border: "1px solid var(--theme-color1, #405FF2)",
                  background: aiLoading ? "#f0f0f0" : "#fff",
                  color: "var(--theme-color1, #405FF2)",
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {aiLoading ? (
                  <>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: "12px" }} />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <i className="fa fa-magic" style={{ fontSize: "12px" }} />
                    Tạo nội dung tự động bằng AI
                  </>
                )}
              </button>
            </div>
            <div className="drop-menu">
              <textarea
                placeholder="Mô tả chi tiết tình trạng xe, hoặc bấm nút AI để tạo tự động..."
                value={formData.conditionDescription || ""}
                onChange={(e) => handleChange("conditionDescription", e.target.value)}
                rows={6}
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px",
                  border: "1px solid #e1e1e1", resize: "vertical",
                  lineHeight: "1.6", fontSize: "14px",
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
