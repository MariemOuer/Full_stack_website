import React, { useState, useEffect } from "react";
//backend sends json of template name and template of all avaliable templates.
// then, user can edit fields that are customizable.
// Then user presses save to send changed fields and chosen invitation to backend
const InvitationView = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("");
  const [eventName, setEventName] = useState("Birthday Bash");
  const [eventDate, setEventDate] = useState("2025-05-12");
  const [eventTime, setEventTime] = useState("00:00");
  const [venue, setVenue] = useState("The Grand Hall, City Center");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/templates") //backend sends json of template name and template of all avaliable templates.
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplateKey(Object.keys(data)[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
      });
  }, []);

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const time = timeString;

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return { formattedDate, time };
  };

  const renderTemplate = () => {
    if (!selectedTemplateKey) return "Loading preview...";

    const selectedTemplate = templates[selectedTemplateKey]; // Use the template by key
    const { formattedDate, time } = formatDateTime(eventDate, eventTime);

    return selectedTemplate.replace("{eventName}", eventName).replace("{eventDate}", formattedDate).replace("{eventTime}", time).replace("{venue}", venue);
  };

  const sendEditedInvitation = () => {
    const updatedInvitation = {
      eventName,
      eventDate,
      eventTime,
      venue,
      selectedTemplateKey,
    };

    console.log(updatedInvitation);

    fetch("http://localhost:5000/api/save-invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInvitation),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error sending invitation:", error);
        setMessage("Error sending invitation.");
      });
  };

  return (
    <div>
      <div>
        <h2>Edit Invitation</h2>
        <form>
          <div>
            <label>Event Name:</label>
            <input value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </div>
          <div>
            <label>Event Date:</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div>
            <label>Event Time:</label>
            <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
          </div>
          <div>
            <label>Venue:</label>
            <input value={venue} onChange={(e) => setVenue(e.target.value)} />
          </div>
          <div>
            <label>Select Template:</label>
            <select value={selectedTemplateKey} onChange={(e) => setSelectedTemplateKey(e.target.value)}>
              {Object.entries(templates).map(([key, template], index) => (
                <option key={index} value={key}>
                  {key} {/* Display the key (template name) */}
                </option>
              ))}
            </select>
          </div>
        </form>
        <button onClick={sendEditedInvitation}>Save Invitation</button>
        {message && <p>{message}</p>}
      </div>

      <div style={{ border: "1px solid #ccc", marginTop: "20px" }} dangerouslySetInnerHTML={{ __html: renderTemplate() }} />
    </div>
  );
};

export default InvitationView;
