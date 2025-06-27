import React, { useState } from 'react';

interface CaftanFormData {
  name: string;
  description: string;
  price: string;
  image: File | null;
}

const AddCaftan: React.FC = () => {
  const [form, setForm] = useState<CaftanFormData>({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      image: file,
    }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here (e.g., API call)
    alert('Caftan added!');
    setForm({
      name: '',
      description: '',
      price: '',
      image: null,
    });
    setPreview(null);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Add New Caftan</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              name='name'
              value={form.name}
              onChange={handleChange}
              required
              type='text'
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              name='price'
              value={form.price}
              onChange={handleChange}
              required
              type='number'
              min='0'
              step='0.01'
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div>
          <label>
            Image:
            <input
              name='image'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
            />
          </label>
          {preview && (
            <div>
              <img
                src={preview}
                alt='Preview'
                style={{ width: 120, marginTop: 8 }}
              />
            </div>
          )}
        </div>
        <button type='submit' style={{ marginTop: 16 }}>
          Add Caftan
        </button>
      </form>
    </div>
  );
};

export default AddCaftan;
