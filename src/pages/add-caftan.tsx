'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { createCaftan, uploadImage } from '../api/api';
import './caftan-form.css';
type CaftanFormData = {
  caftanName: string;
  caftanCategory: string;
  caftanDescription: string;
  caftanPublisherName: string;
  keyWords: string[];
  image_url?: string;
};

const CAFTAN_CATEGORIES = [
  'قفطان مغربي تقليدي',
  'قفطان عصري',
  'قفطان للأعراس',
  'قفطان يومي',
  'قفطان رسمي',
  'قفطان صيفي',
  'قفطان شتوي',
];

export function AddCaftan() {
  const [formData, setFormData] = useState<CaftanFormData>({
    caftanName: '',
    caftanCategory: '',
    caftanDescription: '',
    caftanPublisherName: '',
    keyWords: [],
    image_url: '',
  });

  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Partial<CaftanFormData>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<CaftanFormData> = {};

    if (!formData.caftanName.trim()) {
      newErrors.caftanName = 'اسم القفطان مطلوب';
    }

    if (!formData.caftanCategory.trim()) {
      newErrors.caftanCategory = 'فئة القفطان مطلوبة';
    }

    if (!formData.caftanDescription.trim()) {
      newErrors.caftanDescription = 'وصف القفطان مطلوب';
    }

    if (!formData.caftanPublisherName.trim()) {
      newErrors.caftanPublisherName = 'اسم الناشر مطلوب';
    }

    if (formData.keyWords.length === 0) {
      newErrors.keyWords = ['يجب إضافة كلمة مفتاحية واحدة على الأقل'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CaftanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت');
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageFile = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadImage(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      return response.image_url || response.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('حدث خطأ أثناء رفع الصورة');
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const addKeyword = () => {
    if (
      currentKeyword.trim() &&
      !formData.keyWords.includes(currentKeyword.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        keyWords: [...prev.keyWords, currentKeyword.trim()],
      }));
      setCurrentKeyword('');
      if (errors.keyWords) {
        setErrors((prev) => ({ ...prev, keyWords: undefined }));
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keyWords: prev.keyWords.filter((k) => k !== keyword),
    }));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if file is selected
      if (selectedFile) {
        imageUrl = await uploadImageFile();
        if (!imageUrl) {
          throw new Error('فشل في رفع الصورة');
        }
      }

      // Create caftan data
      const caftanData = {
        ...formData,
        image_url: imageUrl,
      };

      // Submit to server
      const response = await createCaftan(caftanData);

      console.log('Caftan created successfully:', response);

      // Reset form after successful submission
      setFormData({
        caftanName: '',
        caftanCategory: '',
        caftanDescription: '',
        caftanPublisherName: '',
        keyWords: [],
        image_url: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('تم إنشاء القفطان بنجاح!');
    } catch (error) {
      console.error('Error creating caftan:', error);
      alert(
        `حدث خطأ أثناء إنشاء القفطان: ${
          error instanceof Error ? error.message : 'خطأ غير معروف'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='caftan-form-container'>
      <div className='caftan-form-card'>
        <div className='caftan-form-header'>
          <h1 className='caftan-form-title'>
            <span className='title-icon'>✨</span>
            إنشاء قفطان جديد
          </h1>
        </div>

        <div className='caftan-form-content'>
          <form onSubmit={handleSubmit} className='caftan-form'>
            {/* Caftan Name */}
            <div className='form-group'>
              <label htmlFor='caftanName' className='form-label'>
                اسم القفطان *
              </label>
              <input
                id='caftanName'
                type='text'
                value={formData.caftanName}
                onChange={(e) =>
                  handleInputChange('caftanName', e.target.value)
                }
                className={`form-input ${errors.caftanName ? 'error' : ''}`}
                placeholder='أدخل اسم القفطان'
                dir='rtl'
              />
              {errors.caftanName && (
                <span className='error-message'>{errors.caftanName}</span>
              )}
            </div>

            {/* Caftan Category */}
            <div className='form-group'>
              <label htmlFor='caftanCategory' className='form-label'>
                فئة القفطان *
              </label>
              <select
                id='caftanCategory'
                value={formData.caftanCategory}
                onChange={(e) =>
                  handleInputChange('caftanCategory', e.target.value)
                }
                className={`form-select ${
                  errors.caftanCategory ? 'error' : ''
                }`}
                dir='rtl'
              >
                <option value=''>اختر فئة القفطان</option>
                {CAFTAN_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.caftanCategory && (
                <span className='error-message'>{errors.caftanCategory}</span>
              )}
            </div>

            {/* Publisher Name */}
            <div className='form-group'>
              <label htmlFor='publisherName' className='form-label'>
                اسم الناشر *
              </label>
              <input
                id='publisherName'
                type='text'
                value={formData.caftanPublisherName}
                onChange={(e) =>
                  handleInputChange('caftanPublisherName', e.target.value)
                }
                className={`form-input ${
                  errors.caftanPublisherName ? 'error' : ''
                }`}
                placeholder='أدخل اسم الناشر'
                dir='rtl'
              />
              {errors.caftanPublisherName && (
                <span className='error-message'>
                  {errors.caftanPublisherName}
                </span>
              )}
            </div>

            {/* Image Upload */}
            <div className='form-group'>
              <label className='form-label'>
                <span className='label-icon'>📷</span>
                صورة القفطان
              </label>

              <div className='image-upload-container'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileSelect}
                  className='file-input-hidden'
                />

                <button
                  type='button'
                  onClick={triggerFileInput}
                  className='file-upload-btn'
                  disabled={isUploading}
                >
                  <span className='upload-icon'>📁</span>
                  {selectedFile ? 'تغيير الصورة' : 'اختيار صورة'}
                </button>

                {selectedFile && (
                  <div className='file-info'>
                    <span className='file-name'>{selectedFile.name}</span>
                    <span className='file-size'>
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}

                {isUploading && (
                  <div className='upload-progress'>
                    <div className='progress-bar'>
                      <div
                        className='progress-fill'
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span className='progress-text'>{uploadProgress}%</span>
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className='image-preview'>
                  <img
                    src={previewUrl || '/placeholder.svg'}
                    alt='معاينة الصورة'
                    className='preview-image'
                  />
                </div>
              )}
            </div>

            {/* Keywords */}
            <div className='form-group'>
              <label className='form-label'>الكلمات المفتاحية *</label>
              <div className='keywords-input-container'>
                <input
                  type='text'
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  className='keyword-input'
                  placeholder='أدخل كلمة مفتاحية'
                  dir='rtl'
                />
                <button
                  type='button'
                  onClick={addKeyword}
                  className='add-keyword-btn'
                  disabled={!currentKeyword.trim()}
                >
                  <span className='btn-icon'>+</span>
                  إضافة
                </button>
              </div>

              {formData.keyWords.length > 0 && (
                <div className='keywords-display'>
                  {formData.keyWords.map((keyword, index) => (
                    <span key={index} className='keyword-badge'>
                      {keyword}
                      <button
                        type='button'
                        onClick={() => removeKeyword(keyword)}
                        className='remove-keyword-btn'
                      >
                        <span className='remove-icon'>×</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors.keyWords && (
                <span className='error-message'>{errors.keyWords[0]}</span>
              )}
            </div>

            {/* Description */}
            <div className='form-group'>
              <label htmlFor='description' className='form-label'>
                وصف القفطان *
              </label>
              <textarea
                id='description'
                value={formData.caftanDescription}
                onChange={(e) =>
                  handleInputChange('caftanDescription', e.target.value)
                }
                className={`form-textarea ${
                  errors.caftanDescription ? 'error' : ''
                }`}
                placeholder='أدخل وصفاً مفصلاً للقفطان...'
                rows={5}
                dir='rtl'
              />
              {errors.caftanDescription && (
                <span className='error-message'>
                  {errors.caftanDescription}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='submit-btn'
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء القفطان'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
