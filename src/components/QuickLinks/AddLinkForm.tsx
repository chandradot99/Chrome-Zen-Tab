import React, { useState } from 'react';

interface AddLinkFormProps {
  onSubmit: (formData: { name: string; url: string; icon: string }) => void;
  onCancel: () => void;
}

const AddLinkForm: React.FC<AddLinkFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '🔗'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.url.trim()) {
      return;
    }

    // Add https:// if no protocol specified
    let url = formData.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    onSubmit({
      name: formData.name.trim(),
      url: url,
      icon: formData.icon
    });

    // Reset form
    setFormData({ name: '', url: '', icon: '🔗' });
  };

  const handleCancel = () => {
    setFormData({ name: '', url: '', icon: '🔗' });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                Icon
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-center outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                placeholder="🔗"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter link name..."
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                required
                autoFocus
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
              required
            />
            <div className="text-white/40 text-xs mt-1 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              You can omit https:// - it will be added automatically
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-4">
          <button
            type="submit"
            disabled={!formData.name.trim() || !formData.url.trim()}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/20"
          >
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Add Link</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg"
          >
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Cancel</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddLinkForm;