import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const defaultScheme = {
  title: "",
  description: "",
  category: "Subsidy",
  state: "Pan India",
  eligibility: "",
};

const AdminSchemeForm = ({ onSave, editingScheme }) => {
  const { user } = useAuth();
  const [scheme, setScheme] = useState(defaultScheme);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (editingScheme) setScheme(editingScheme);
    else setScheme(defaultScheme);
    
    // Clear messages and errors when switching between edit/create
    setErrors({});
    setFormMessage({ type: '', text: '' });
  }, [editingScheme]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!scheme.title.trim()) {
      newErrors.title = "Title is required";
    } else if (scheme.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    if (!scheme.description.trim()) {
      newErrors.description = "Description is required";
    } else if (scheme.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    if (!scheme.state.trim()) {
      newErrors.state = "State is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheme({ ...scheme, [name]: value });
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Clear any success/error messages when form is being edited
    if (formMessage.text) {
      setFormMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setFormMessage({ 
        type: 'error', 
        text: 'Please correct the errors before submitting' 
      });
      return;
    }
    
    setIsSubmitting(true);
    setFormMessage({ type: '', text: '' });
    
    try {
      await onSave(scheme);
      setFormMessage({ 
        type: 'success', 
        text: editingScheme ? 'Scheme updated successfully!' : 'New scheme created successfully!' 
      });
      if (!editingScheme) {
        setScheme(defaultScheme);
      }
    } catch (error) {
      console.error("Error saving scheme:", error);
      setFormMessage({ 
        type: 'error', 
        text: `Failed to ${editingScheme ? 'update' : 'create'} scheme. Please try again.` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white shadow-md">
      {/* Form header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-green-800">
          {editingScheme ? "Edit Scheme" : "Create New Scheme"}
        </h3>
        {editingScheme && (
          <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
            Editing ID: {editingScheme._id?.substring(0, 8)}...
          </span>
        )}
      </div>
      
      {/* Form message display */}
      {formMessage.text && (
        <div className={`p-3 rounded-md ${
          formMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
          {formMessage.text}
        </div>
      )}

      {/* Title field */}
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Scheme Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={scheme.title}
          onChange={handleChange}
          placeholder="Enter scheme title"
          className={`w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="text-red-600 text-xs">{errors.title}</p>
        )}
      </div>
      
      {/* Description field */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={scheme.description}
          onChange={handleChange}
          placeholder="Provide a detailed description of the scheme"
          rows="4"
          className={`w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="text-red-600 text-xs">{errors.description}</p>
        )}
      </div>

      {/* Eligibility field */}
      <div className="space-y-1">
        <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700">
          Eligibility Criteria
        </label>
        <textarea
          id="eligibility"
          name="eligibility"
          value={scheme.eligibility}
          onChange={handleChange}
          placeholder="Who is eligible for this scheme?"
          rows="2"
          className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category field */}
        <div className="space-y-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={scheme.category}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Subsidy">Subsidy</option>
            <option value="Credit">Credit</option>
            <option value="Insurance">Insurance</option>
            <option value="Educational">Educational</option>
            <option value="Certification">Certification</option>
            <option value="Technology">Technology</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* State field */}
        <div className="space-y-1">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={scheme.state}
            onChange={handleChange}
            placeholder="e.g., Jharkhand or Pan India"
            className={`w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.state ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.state && (
            <p className="text-red-600 text-xs">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-3">
        {editingScheme && (
          <button 
            type="button"
            onClick={() => setScheme(defaultScheme)}
            className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting 
            ? (editingScheme ? 'Updating...' : 'Creating...') 
            : (editingScheme ? 'Update Scheme' : 'Create Scheme')
          }
        </button>
      </div>
    </form>
  );
};

export default AdminSchemeForm;
