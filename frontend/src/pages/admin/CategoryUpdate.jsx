import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function CategoryUpdate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageSaving, setImageSaving] = useState(false);

  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);

  const currentImages = useMemo(() => category?.image || [], [category]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/getbyId/${categoryId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to fetch category');
        }
        const data = await res.json();
        setCategory(data);
        setName(data?.name || '');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!categoryId) return;

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/update/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update category');
      }
      const updated = await res.json();
      setCategory(updated);
      toast.success('Category updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateImages = async (e) => {
    e.preventDefault();
    if (!categoryId) return;
    if (!images.length) {
      toast.error('Please select images');
      return;
    }

    setImageSaving(true);
    try {
      const fd = new FormData();
      images.forEach((file) => fd.append('files', file));
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/updateimg/${categoryId}`, {
        method: 'PUT',
        body: fd
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update images');
      }
      const updated = await res.json();
      setCategory(updated);
      setImages([]);
      toast.success('Category images updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setImageSaving(false);
    }
  };

  const handleRemoveImage = async (imageFilename) => {
    if (!categoryId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/removeImage/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageFilename })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to remove image');
      }
      const updated = await res.json();
      setCategory(updated);
      toast.success('Image removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!categoryId) {
    return <div className="p-4">No category selected</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Update Category</h2>
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => navigate('/dashboard?tab=categories')}
        >
          Back
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <form onSubmit={handleUpdateName} className="bg-white p-4 rounded shadow space-y-4">
            <h3 className="font-semibold">Name</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="border rounded p-2 w-full md:w-1/2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update Name'}
            </button>
          </form>

          <form onSubmit={handleUpdateImages} className="bg-white p-4 rounded shadow space-y-4">
            <h3 className="font-semibold">Images</h3>
            {currentImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {currentImages.map((filename) => (
                  <div key={filename} className="border rounded overflow-hidden relative group">
                    <img
                      src={`/${filename}`}
                      alt={filename}
                      className="w-full h-24 object-cover"
                      onError={(e) => (e.target.src = '/ErrorImage.png')}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(filename)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 3);
                setImages(files);
              }}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={imageSaving}
            >
              {imageSaving ? 'Saving...' : 'Update Images'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default CategoryUpdate;
