"use client";
import React, { useMemo, useEffect } from "react";

function generateMockPricing(formData) {
  // Mock AI pricing based on brand/model/year
  const yearVal = parseInt(formData.year?.name) || 2022;
  const ageFactor = Math.max(0.5, 1 - (2025 - yearVal) * 0.08);
  const brandPremium = {
    mercedes: 1.8, bmw: 1.7, audi: 1.6, vinfast: 0.9,
    toyota: 1.2, honda: 1.1, hyundai: 0.95, kia: 0.9,
    mazda: 1.05, ford: 1.0, mitsubishi: 0.85, nissan: 0.9,
  };
  const multiplier = brandPremium[formData.brand?.id] || 1.0;
  const base = 600; // triệu
  const mid = Math.round(base * multiplier * ageFactor);
  const low = Math.round(mid * 0.85);
  const high = Math.round(mid * 1.12);
  return { low, mid, high };
}

function generateMockChartData(pricing) {
  const { low, mid, high } = pricing;
  const step = Math.round((high - low) / 6);
  return [
    { range: `${low}`, count: 3 },
    { range: `${low + step}`, count: 8 },
    { range: `${low + step * 2}`, count: 14 },
    { range: `${mid}`, count: 18 },
    { range: `${mid + step}`, count: 11 },
    { range: `${high - step}`, count: 6 },
    { range: `${high}`, count: 2 },
  ];
}

function SimpleBarChart({ data, currentPrice }) {
  const maxCount = Math.max(...data.map((d) => d.count));
  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
        {data.map((d, i) => {
          const h = Math.max(8, (d.count / maxCount) * 100);
          const priceVal = parseInt(d.range);
          const isNear = currentPrice && Math.abs(priceVal - currentPrice) <= 50;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "10px", color: "#999", marginBottom: "4px" }}>{d.count}</span>
              <div style={{
                width: "100%", height: `${h}%`, borderRadius: "4px 4px 0 0",
                background: isNear
                  ? "var(--theme-color1, #405FF2)"
                  : "#e0e7ff",
                transition: "all 0.3s",
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "10px", color: "#999" }}>
            {d.range}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: "11px", color: "#999", marginTop: "4px" }}>
        Đơn vị: Triệu VNĐ — Số lượng tin đăng
      </div>
    </div>
  );
}

function ToggleOption({ label, description, checked, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "14px",
      padding: "16px 18px", borderRadius: "10px",
      border: checked ? "2px solid var(--theme-color1, #405FF2)" : "1px solid #e1e1e1",
      background: checked ? "#f8faff" : "#fff",
      transition: "all 0.2s", cursor: "pointer",
    }}
      onClick={onChange}
    >
      <span style={{
        width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
        border: checked ? "none" : "2px solid #ccc",
        background: checked ? "var(--theme-color1, #405FF2)" : "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginTop: "1px",
      }}>
        {checked && <i className="fa fa-check" style={{ color: "#fff", fontSize: "11px" }} />}
      </span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: "14px", fontWeight: "500" }}>{label}</span>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#666", lineHeight: "1.5" }}>
          {description}{" "}
          <a href="#" onClick={(e) => e.preventDefault()} style={{
            color: "var(--theme-color1, #405FF2)", fontWeight: "500",
          }}>
            Tìm hiểu thêm
          </a>
        </p>
      </div>
    </div>
  );
}

export default function Step5Pricing({ formData, setFormData, errors }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Initialize defaults
  useEffect(() => {
    setFormData((prev) => {
      if (prev.allowBargain === undefined) return { ...prev, allowBargain: true };
      return prev;
    });
  }, []);

  const pricing = useMemo(() => generateMockPricing(formData), [formData.brand, formData.model, formData.year]);
  const chartData = useMemo(() => generateMockChartData(pricing), [pricing]);

  const priceNum = parseInt(formData.price) || 0;

  const handlePriceInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    handleChange("price", raw);
  };

  const applyPrice = (val) => {
    handleChange("price", String(val));
  };

  const formatDisplay = (val) => {
    if (!val) return "";
    return Number(val).toLocaleString("vi-VN");
  };

  return (
    <div className="tab-pane fade show active">
      <form onSubmit={(e) => e.preventDefault()} className="row">
        {/* Price input */}
        <div className="col-lg-12">
          <div className="form_boxes v2">
            <label>Nhập giá bán (Triệu VNĐ) <span style={{ color: "red" }}>*</span></label>
            <div className="drop-menu">
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="VD: 850"
                  value={formData.price ? formatDisplay(formData.price) : ""}
                  onChange={handlePriceInput}
                  className="form-control"
                  style={{
                    fontSize: "28px", fontWeight: "700", paddingRight: "120px",
                    border: errors?.price ? "1px solid red" : undefined,
                  }}
                />
                <span style={{
                  position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "16px", color: "#999", fontWeight: "500",
                }}>
                  Triệu VNĐ
                </span>
              </div>
            </div>
            {errors?.price && <small style={{ color: "red" }}>{errors.price}</small>}
          </div>
        </div>

        {/* AI suggested pricing */}
        <div className="col-lg-12" style={{ marginTop: "24px" }}>
          <div style={{
            background: "#f8faff", borderRadius: "12px", padding: "22px 24px",
            border: "1px solid #e8eeff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <i className="fa fa-magic" style={{ color: "var(--theme-color1, #405FF2)", fontSize: "16px" }} />
              <h6 style={{ margin: 0, fontSize: "15px" }}>Giá bán gợi ý bằng AI</h6>
            </div>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "18px", lineHeight: "1.6" }}>
              Dựa trên phân tích dữ liệu lớn từ hàng nghìn tin đăng tương tự ({formData.brand?.name || "xe"} {formData.model?.name || ""} {formData.year?.name || ""}),
              khoảng giá trung bình trên thị trường hiện tại là <strong>{pricing.low} – {pricing.high} triệu VNĐ</strong>.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {/* Competitive price */}
              <div style={{
                flex: "1 1 220px", padding: "16px", borderRadius: "10px",
                background: "#fff", border: "1px solid #e1e1e1",
              }}>
                <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Giá cạnh tranh
                </div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#4caf50", marginBottom: "6px" }}>
                  {pricing.low} <span style={{ fontSize: "14px", fontWeight: "400" }}>triệu</span>
                </div>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px" }}>Bán nhanh, giá thấp hơn thị trường</p>
                <button
                  type="button"
                  onClick={() => applyPrice(pricing.low)}
                  style={{
                    width: "100%", padding: "8px", borderRadius: "6px", fontSize: "13px",
                    border: "1px solid #4caf50", background: "#fff", color: "#4caf50",
                    cursor: "pointer", fontWeight: "500", transition: "all 0.2s",
                  }}
                >
                  Sử dụng giá bán này
                </button>
              </div>

              {/* Profit price */}
              <div style={{
                flex: "1 1 220px", padding: "16px", borderRadius: "10px",
                background: "#fff", border: "1px solid #e1e1e1",
              }}>
                <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Giá lợi nhuận tốt
                </div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--theme-color1, #405FF2)", marginBottom: "6px" }}>
                  {pricing.high} <span style={{ fontSize: "14px", fontWeight: "400" }}>triệu</span>
                </div>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px" }}>Lợi nhuận cao, cần thời gian bán lâu hơn</p>
                <button
                  type="button"
                  onClick={() => applyPrice(pricing.high)}
                  style={{
                    width: "100%", padding: "8px", borderRadius: "6px", fontSize: "13px",
                    border: "1px solid var(--theme-color1, #405FF2)", background: "#fff",
                    color: "var(--theme-color1, #405FF2)", cursor: "pointer", fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  Sử dụng giá bán này
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="col-lg-12" style={{ marginTop: "24px" }}>
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "22px 24px",
            border: "1px solid #e8e8e8",
          }}>
            <h6 style={{ margin: "0 0 4px", fontSize: "15px" }}>Phân tích giá xe tương tự trên thị trường</h6>
            <p style={{ fontSize: "13px", color: "#999", marginBottom: "8px" }}>
              Biểu đồ phân bố giá bán của các xe cùng phân khúc
              {priceNum > 0 && <> — Giá bạn chọn: <strong style={{ color: "var(--theme-color1, #405FF2)" }}>{formatDisplay(formData.price)} triệu</strong></>}
            </p>
            <SimpleBarChart data={chartData} currentPrice={priceNum} />
          </div>
        </div>

        {/* Toggle options */}
        <div className="col-lg-12" style={{ marginTop: "24px" }}>
          <h6 style={{ marginBottom: "14px" }}>Tùy chọn bổ sung</h6>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <ToggleOption
              label="Hỗ trợ trả góp"
              description="Cho phép người mua liên hệ tư vấn trả góp qua ngân hàng đối tác."
              checked={!!formData.installment}
              onChange={() => handleChange("installment", !formData.installment)}
            />
            <ToggleOption
              label="Cho phép trả giá"
              description="Người mua có thể gửi đề xuất giá khác cho bạn xem xét."
              checked={formData.allowBargain !== false}
              onChange={() => handleChange("allowBargain", !formData.allowBargain)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
