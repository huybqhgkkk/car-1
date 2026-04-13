"use client";
import React, { useEffect } from "react";

const WEEKDAYS = [
  { key: "mon", label: "Thứ 2" },
  { key: "tue", label: "Thứ 3" },
  { key: "wed", label: "Thứ 4" },
  { key: "thu", label: "Thứ 5" },
  { key: "fri", label: "Thứ 6" },
  { key: "sat", label: "Thứ 7" },
  { key: "sun", label: "Chủ nhật" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, "0");
  return `${h}:00`;
});

const DEFAULT_DAYS = WEEKDAYS.map((d) => d.key);
const DEFAULT_FROM = "10:00";
const DEFAULT_TO = "18:00";

function FeatureBanner({ icon, title, description }) {
  return (
    <div style={{
      display: "flex", gap: "16px", alignItems: "flex-start",
      padding: "18px 20px", borderRadius: "10px",
      border: "1px solid #e8eeff", background: "#f8faff",
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "10px",
        background: "var(--theme-color1, #405FF2)", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={icon} style={{ color: "#fff", fontSize: "18px" }} />
      </div>
      <div style={{ flex: 1 }}>
        <h6 style={{ margin: "0 0 4px", fontSize: "15px" }}>{title}</h6>
        <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.5" }}>{description}</p>
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          display: "inline-block", marginTop: "8px", fontSize: "13px",
          color: "var(--theme-color1, #405FF2)", fontWeight: "500",
        }}>
          Tìm hiểu thêm <i className="fa fa-arrow-right" style={{ fontSize: "11px", marginLeft: "4px" }} />
        </a>
      </div>
    </div>
  );
}

export default function Step4AdditionalInfo({ formData, setFormData }) {
  // Initialize defaults on first render if not set
  useEffect(() => {
    setFormData((prev) => {
      const updates = {};
      if (!prev.scheduleDays) updates.scheduleDays = DEFAULT_DAYS;
      if (!prev.scheduleFrom) updates.scheduleFrom = DEFAULT_FROM;
      if (!prev.scheduleTo) updates.scheduleTo = DEFAULT_TO;
      if (Object.keys(updates).length > 0) return { ...prev, ...updates };
      return prev;
    });
  }, []);

  const scheduleDays = formData.scheduleDays || DEFAULT_DAYS;
  const scheduleFrom = formData.scheduleFrom || DEFAULT_FROM;
  const scheduleTo = formData.scheduleTo || DEFAULT_TO;

  const toggleDay = (key) => {
    setFormData((prev) => {
      const current = prev.scheduleDays || DEFAULT_DAYS;
      const next = current.includes(key)
        ? current.filter((d) => d !== key)
        : [...current, key];
      return { ...prev, scheduleDays: next };
    });
  };

  const toggleAll = () => {
    const allSelected = scheduleDays.length === WEEKDAYS.length;
    setFormData((prev) => ({
      ...prev,
      scheduleDays: allSelected ? [] : DEFAULT_DAYS,
    }));
  };

  const handleTimeChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="tab-pane fade show active">
      {/* Feature banners */}
      <div style={{ marginBottom: "30px" }}>
        <h6 style={{ marginBottom: "14px" }}>Tính năng nâng cao</h6>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <FeatureBanner
            icon="fa fa-thumb-tack"
            title="Ghim bài đăng lên đầu danh sách"
            description="Tin đăng của bạn sẽ luôn hiển thị ở vị trí đầu tiên trong kết quả tìm kiếm, giúp tăng khả năng tiếp cận người mua."
          />
          <FeatureBanner
            icon="fa fa-bullhorn"
            title="Quảng cáo nâng cao"
            description="Tin đăng sẽ được hiển thị tại các vị trí nổi bật trên trang chủ và trang danh mục, tiếp cận hàng nghìn người mua tiềm năng mỗi ngày."
          />
        </div>
      </div>

      {/* Schedule config */}
      <div>
        <h6 style={{ marginBottom: "6px" }}>Cấu hình lịch hẹn xem xe / lái thử</h6>
        <p style={{ color: "#999", fontSize: "13px", marginBottom: "20px" }}>
          Chọn ngày và khung giờ bạn có thể tiếp khách xem xe.
        </p>

        {/* Days */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>
              Cho phép đặt lịch vào ngày nào?
            </label>
            <button
              type="button"
              onClick={toggleAll}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", color: "var(--theme-color1, #405FF2)", fontWeight: "500",
              }}
            >
              {scheduleDays.length === WEEKDAYS.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>
          </div>
          <div className="right-box-two">
            <div className="cheak-box" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {WEEKDAYS.map((day) => {
                const checked = scheduleDays.includes(day.key);
                return (
                  <label
                    key={day.key}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
                      border: checked
                        ? "2px solid var(--theme-color1, #405FF2)"
                        : "1px solid #e1e1e1",
                      background: checked ? "#f0f4ff" : "#fff",
                      fontSize: "14px", transition: "all 0.2s", userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDay(day.key)}
                      style={{ display: "none" }}
                    />
                    <span style={{
                      width: "18px", height: "18px", borderRadius: "4px",
                      border: checked ? "none" : "2px solid #ccc",
                      background: checked ? "var(--theme-color1, #405FF2)" : "#fff",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {checked && <i className="fa fa-check" style={{ color: "#fff", fontSize: "10px" }} />}
                    </span>
                    {day.label}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time range */}
        <div>
          <label style={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px", display: "block" }}>
            Cho phép đặt lịch vào thời gian nào?
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div className="form_boxes" style={{ width: "160px" }}>
              <label style={{ fontSize: "13px", color: "#666" }}>Từ giờ</label>
              <div className="drop-menu">
                <select
                  value={scheduleFrom}
                  onChange={(e) => handleTimeChange("scheduleFrom", e.target.value)}
                  className="form-control"
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e1e1e1", fontSize: "14px" }}
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
            <span style={{ fontSize: "18px", color: "#999", marginTop: "20px" }}>→</span>
            <div className="form_boxes" style={{ width: "160px" }}>
              <label style={{ fontSize: "13px", color: "#666" }}>Đến giờ</label>
              <div className="drop-menu">
                <select
                  value={scheduleTo}
                  onChange={(e) => handleTimeChange("scheduleTo", e.target.value)}
                  className="form-control"
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e1e1e1", fontSize: "14px" }}
                >
                  {HOURS.filter((h) => h > scheduleFrom).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
