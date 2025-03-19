import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/ApiService";
import "../styles/create_invitation.css";

const CreateInvitationPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [formData, setFormData] = useState({
    occasion: "",
    theme: "",
    venue: "",
    date: "",
    startTime: "",
    plusOnes: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInviteGuests = async () => {
    if (!selectedItinerary) {
      alert("Please select an itinerary before inviting guests.");
      return;
    }
    try {
      const response = await apiService.post(`/api/invitation/notify-all/${selectedItinerary.id}`);
      alert("Guests invited successfully!");
    } catch (error) {
      alert("Failed to invite guests.");
    }
  };

  const handleCreateInvitation = async () => {
    alert("Creating invitation...");
  };

  return (
    <div className="container full-height no-background">
      {/* Left Side - Form */}
      <div className="form-container expanded">
        <h2 className="title">Let's Create Your Invitation!</h2>
        <InvitationForm
          setSelectedTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
          setSelectedItinerary={setSelectedItinerary}
          selectedItinerary={selectedItinerary}
          formData={formData}
          handleFormChange={handleFormChange}
        />
      </div>

      {/* Right Side - Preview Box */}
      <div className="preview-container expanded">
        <PreviewBox selectedTemplate={selectedTemplate} formData={formData} />
        <div className="button-wrapper">
          <PrimaryButton text="Create Invitation" onClick={handleCreateInvitation} />
          <PrimaryButton text="Invite Guests" onClick={handleInviteGuests} />
        </div>
      </div>
    </div>
  );
};

const InvitationForm = ({ setSelectedTemplate, selectedTemplate, setSelectedItinerary, selectedItinerary, formData, handleFormChange }) => {
  const { customData, currentUser } = useAuth();
  const userId = customData?.id;

  const [itineraryList, setItineraryList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchItineraries() {
      setLoading(true);
      try {
        const response = await apiService.get(`/api/itinerary/created-by/${userId}`);
        setItineraryList(response.data);
        if (response.data.length > 0) {
          setSelectedItinerary(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
        setError("Failed to fetch itineraries. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchTemplates() {
      setLoading(true);
      try {
        const response = await apiService.post(`/api/invitation/templates`, { authId: currentUser.uid });
        setTemplateList(response.data);
        if (response.data.length > 0) {
          setSelectedTemplate(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        setError("Failed to fetch templates. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchItineraries();
    fetchTemplates();
  }, [userId, currentUser, setSelectedItinerary, setSelectedTemplate]);

  if (loading) return <div className="loading">Loading your data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label htmlFor="itinerary">Itinerary</label>
        <select
          id="itinerary"
          className="input"
          value={selectedItinerary?.id || ""}
          onChange={(e) => {
            const selected = itineraryList.find((itinerary) => itinerary.id.toString() === e.target.value);
            setSelectedItinerary(selected || null);
          }}
        >
          <option value="" disabled>
            Select Itinerary
          </option>
          {itineraryList.map((itinerary) => (
            <option key={itinerary.id} value={itinerary.id}>
              {itinerary.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="template">Template</label>
        <select
          id="template"
          className="input"
          value={selectedTemplate?.id || ""}
          onChange={(e) => {
            const selected = templateList.find((template) => template.id.toString() === e.target.value);
            setSelectedTemplate(selected || null);
          }}
        >
          <option value="" disabled>
            Select Template
          </option>
          {templateList.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="occasion">Occasion</label>
        <input type="text" id="occasion" name="occasion" placeholder="Enter occasion" className="input" value={formData.occasion} onChange={handleFormChange} />
      </div>

      <div className="form-group">
        <label htmlFor="theme">Theme</label>
        <input type="text" id="theme" name="theme" placeholder="Enter theme" className="input" value={formData.theme} onChange={handleFormChange} />
      </div>

      <div className="form-group">
        <label htmlFor="venue">Venue</label>
        <input type="text" id="venue" name="venue" placeholder="Enter venue" className="input" value={formData.venue} onChange={handleFormChange} />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type={focusedField === "date" || formData.date ? "date" : "text"}
          name="date"
          value={formData.date}
          onChange={handleFormChange}
          onFocus={() => setFocusedField("date")}
          onBlur={() => setFocusedField(null)}
          placeholder="Select date"
          className="input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="startTime">Start Time</label>
        <input
          id="startTime"
          type={focusedField === "startTime" || formData.startTime ? "time" : "text"}
          name="startTime"
          value={formData.startTime}
          onChange={handleFormChange}
          onFocus={() => setFocusedField("startTime")}
          onBlur={() => setFocusedField(null)}
          placeholder="Select time"
          className="input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="plusOnes">Plus Ones Allowed</label>
        <div className="number-input-wrapper">
          <button
            type="button"
            className="number-decrement"
            onClick={() => {
              const newValue = Math.max(0, parseInt(formData.plusOnes || "0") - 1);
              handleFormChange({
                target: { name: "plusOnes", value: newValue.toString() },
              });
            }}
            disabled={!formData.plusOnes || parseInt(formData.plusOnes) <= 0}
          >
            −
          </button>
          <input id="plusOnes" type="number" name="plusOnes" value={formData.plusOnes} onChange={handleFormChange} placeholder="0" className="input number-input" min="0" />
          <button
            type="button"
            className="number-increment"
            onClick={() => {
              const newValue = parseInt(formData.plusOnes || "0") + 1;
              handleFormChange({
                target: { name: "plusOnes", value: newValue.toString() },
              });
            }}
          >
            +
          </button>
        </div>
      </div>
    </form>
  );
};

const PreviewBox = ({ selectedTemplate, formData }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // If we have a template, customize it with form data
  const getCustomizedTemplate = () => {
    if (!selectedTemplate) {
      return (
        <div className="empty-preview">
          <h3>Preview Your Invitation</h3>
          <p>Select a template and fill in details to see your invitation</p>
        </div>
      );
    }

    // Get the template HTML
    let customizedHTML = selectedTemplate.rawHTML || "";

    // Replace placeholders with actual data
    const replacements = {
      "{eventName}": formData.occasion || "Event Name",
      "{eventDate}": formatDate(formData.date) || "Event Date",
      "{eventTime}": formatTime(formData.startTime) || "Event Time",
      "{venue}": formData.venue || "Event Location",
    };

    // Replace each placeholder in the HTML
    Object.entries(replacements).forEach(([placeholder, value]) => {
      customizedHTML = customizedHTML.replace(new RegExp(placeholder, "g"), value);
    });

    return <div dangerouslySetInnerHTML={{ __html: customizedHTML }} />;
  };

  return (
    <div className="preview-box">
      <div className="preview-header">
        <h3>Invitation Preview</h3>
      </div>
      <div className="preview-content">{getCustomizedTemplate()}</div>
    </div>
  );
};

const PrimaryButton = ({ text, onClick }) => {
  return (
    <button className="button primary" onClick={onClick} disabled={!onClick}>
      {text}
    </button>
  );
};

export default CreateInvitationPage;
