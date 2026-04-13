"use client";
import React, { useRef } from "react";
import Image from "next/image";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGES = 30;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_EXT_LABEL = "JPG, JPEG, PNG";

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `"${file.name}" — Định dạng không hợp lệ. Chỉ chấp nhận ${ALLOWED_EXT_LABEL}.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `"${file.name}" — Dung lượng vượt quá 10MB (${(file.size / 1024 / 1024).toFixed(1)}MB).`;
  }
  return null;
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function UploadRules() {
  return (
    <div style={{
      background: "#f8f9fa", borderRadius: "8px", padding: "14px 18px",
      marginBottom: "20px", fontSize: "13px", color: "#666",
      display: "flex", flexWrap: "wrap", gap: "6px 24px",
    }}>
      <span><i className="fa fa-info-circle" style={{ marginRight: "5px", color: "var(--theme-color1, #405FF2)" }} />Tối thiểu 2 ảnh</span>
      <span><i className="fa fa-info-circle" style={{ marginRight: "5px", color: "var(--theme-color1, #405FF2)" }} />Tối đa {MAX_IMAGES} ảnh</span>
      <span><i className="fa fa-info-circle" style={{ marginRight: "5px", color: "var(--theme-color1, #405FF2)" }} />Mỗi ảnh ≤ 10MB</span>
      <span><i className="fa fa-info-circle" style={{ marginRight: "5px", color: "var(--theme-color1, #405FF2)" }} />Định dạng: {ALLOWED_EXT_LABEL}</span>
    </div>
  );
}

function ImageCard({ img, onRemove, badge }) {
  return (
    <div style={{
      position: "relative", width: "180px", height: "160px",
      borderRadius: "8px", overflow: "hidden", border: "1px solid #e8e8e8",
      flexShrink: 0,
    }}>
      <Image
        width={180} height={160} src={img.url} alt={img.name || "Ảnh xe"}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      {badge && (
        <span style={{
          position: "absolute", top: "6px", left: "6px",
          background: "var(--theme-color1, #405FF2)", color: "#fff",
          padding: "2px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "500",
        }}>
          {badge}
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Xóa ảnh"
        style={{
          position: "absolute", top: "6px", right: "6px",
          width: "26px", height: "26px", borderRadius: "50%",
          background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <i className="fa fa-times" style={{ color: "#fff", fontSize: "12px" }} />
      </button>
    </div>
  );
}

function UploadBox({ id, label, onUpload, multiple, disabled }) {
  const inputRef = useRef(null);
  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      style={{
        width: "180px", height: "160px",
        border: "2px dashed #d0d0d0", borderRadius: "8px",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1, transition: "all 0.2s", flexShrink: 0,
      }}
    >
      <Image width={30} height={30} src="/images/resource/uplode.svg" alt="Upload" />
      <span style={{ marginTop: "8px", fontSize: "13px", color: "#999", textAlign: "center" }}>
        {label}
      </span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple={multiple}
        onChange={onUpload}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default function Step2UploadImages({ formData, setFormData, errors }) {
  const thumbnail = formData.thumbnail || null;
  const galleryImages = formData.galleryImages || [];
  const fileErrors = formData._imageErrors || [];

  const totalImages = (thumbnail ? 1 : 0) + galleryImages.length;

  const setFileErrors = (errs) => {
    setFormData((prev) => ({ ...prev, _imageErrors: errs }));
  };

  // --- Thumbnail ---
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const err = validateFile(file);
    if (err) { setFileErrors([err]); return; }

    setFileErrors([]);
    const url = await readFileAsDataURL(file);
    setFormData((prev) => ({ ...prev, thumbnail: { name: file.name, url, size: file.size } }));
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: null }));
  };

  // --- Gallery ---
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = "";

    const currentCount = galleryImages.length;
    const remaining = MAX_IMAGES - (thumbnail ? 1 : 0) - currentCount;

    if (remaining <= 0) {
      setFileErrors([`Đã đạt tối đa ${MAX_IMAGES} ảnh.`]);
      return;
    }

    const toProcess = files.slice(0, remaining);
    const newErrors = [];
    const validFiles = [];

    for (const file of toProcess) {
      const err = validateFile(file);
      if (err) { newErrors.push(err); continue; }
      validFiles.push(file);
    }

    if (files.length > remaining) {
      newErrors.push(`Chỉ có thể thêm ${remaining} ảnh nữa (tối đa ${MAX_IMAGES}).`);
    }

    setFileErrors(newErrors);

    if (validFiles.length > 0) {
      const results = await Promise.all(
        validFiles.map(async (file) => ({
          name: file.name,
          url: await readFileAsDataURL(file),
          size: file.size,
        }))
      );
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...results],
      }));
    }
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const gallerySlotsFull = totalImages >= MAX_IMAGES;

  return (
    <div className="tab-pane fade show active gallery-sec style1">
      <UploadRules />

      {/* File-level errors */}
      {fileErrors.length > 0 && (
        <div style={{
          background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "8px",
          padding: "12px 16px", marginBottom: "18px",
        }}>
          {fileErrors.map((err, i) => (
            <div key={i} style={{ fontSize: "13px", color: "#d32f2f", marginBottom: i < fileErrors.length - 1 ? "4px" : 0 }}>
              <i className="fa fa-exclamation-circle" style={{ marginRight: "6px" }} />{err}
            </div>
          ))}
        </div>
      )}

      {/* Wizard-level errors */}
      {errors?.thumbnail && (
        <div style={{ color: "red", marginBottom: "10px", fontSize: "13px" }}>
          <i className="fa fa-exclamation-circle" style={{ marginRight: "6px" }} />{errors.thumbnail}
        </div>
      )}
      {errors?.galleryImages && (
        <div style={{ color: "red", marginBottom: "10px", fontSize: "13px" }}>
          <i className="fa fa-exclamation-circle" style={{ marginRight: "6px" }} />{errors.galleryImages}
        </div>
      )}

      {/* Section 1: Thumbnail */}
      <div style={{ marginBottom: "30px" }}>
        <h6 style={{ marginBottom: "6px" }}>
          Ảnh thumbnail (ảnh đại diện) <span style={{ color: "red" }}>*</span>
        </h6>
        <p style={{ color: "#999", fontSize: "13px", marginBottom: "14px" }}>
          Ảnh đại diện sẽ hiển thị ở danh sách kết quả tìm kiếm.
        </p>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {thumbnail ? (
            <ImageCard img={thumbnail} onRemove={removeThumbnail} badge="Thumbnail" />
          ) : (
            <UploadBox
              id="upload-thumbnail"
              label="Chọn ảnh đại diện"
              onUpload={handleThumbnailUpload}
              multiple={false}
            />
          )}
        </div>
      </div>

      {/* Section 2: Gallery */}
      <div>
        <h6 style={{ marginBottom: "6px" }}>
          Ảnh xe <span style={{ color: "red" }}>*</span>
        </h6>
        <p style={{ color: "#999", fontSize: "13px", marginBottom: "14px" }}>
          Thêm ảnh chi tiết các góc của xe. Đã chọn: {galleryImages.length}/{MAX_IMAGES - (thumbnail ? 1 : 0)} ảnh.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {galleryImages.map((img, index) => (
            <ImageCard
              key={index}
              img={img}
              onRemove={() => removeGalleryImage(index)}
            />
          ))}
          <UploadBox
            id="upload-gallery"
            label="Thêm ảnh xe"
            onUpload={handleGalleryUpload}
            multiple
            disabled={gallerySlotsFull}
          />
        </div>
      </div>

      {/* Counter */}
      <div style={{
        marginTop: "20px", padding: "10px 16px", background: "#f8f9fa",
        borderRadius: "8px", fontSize: "13px", color: "#666",
        display: "flex", justifyContent: "space-between",
      }}>
        <span>Tổng số ảnh: {totalImages} / {MAX_IMAGES}</span>
        <span style={{
          color: totalImages >= 2 ? "#4caf50" : "#f9a825",
          fontWeight: "500",
        }}>
          {totalImages >= 2 ? "✓ Đủ điều kiện" : `Cần thêm ${2 - totalImages} ảnh nữa`}
        </span>
      </div>
    </div>
  );
}
