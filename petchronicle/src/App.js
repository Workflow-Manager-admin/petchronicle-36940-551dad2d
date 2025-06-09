import React, { useState, useRef } from 'react';
import './App.css';

// PUBLIC_INTERFACE
// Helper color CSS variables for custom theme
function ThemeVars() {
  return (
    <style>{`
      :root {
        --primary: #F7C59F;
        --secondary: #A3D2CA;
        --accent: #5EAAA8;
        --bg: #fffdfa;
        --text: #394644;
        --border: #dfdfdf;
        --appbar-height: 64px;
      }
      body {
        background: var(--bg);
        color: var(--text);
      }
    `}</style>
  );
}

// PUBLIC_INTERFACE
function Navbar({ current, onNavigate }) {
  return (
    <nav className="navbar" style={{ background: 'var(--primary)', color: 'var(--text)' }}>
      <div className="container nav-inner">
        <div className="logo">
          <span style={{ fontSize: 28, color: 'var(--accent)', marginRight: 7 }}>🐾</span>
          <span style={{ fontWeight: 600 }}>PetChronicle</span>
        </div>
        <ul className="nav-links">
          {['Profile', 'Timeline', 'Photos', 'Milestones', 'Scrapbook', 'Shareable'].map(key => (
            <li
              key={key}
              className={current === key.toLowerCase() ? 'active' : ''}
              onClick={() => onNavigate(key.toLowerCase())}
              tabIndex={0}
            >
              {key}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function PetProfile({ profile, setProfile }) {
  const inputRef = useRef(null);

  // Handle image upload and live preview
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile({ ...profile, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = e => setProfile({ ...profile, name: e.target.value });

  return (
    <section className="profile-section">
      <div className="paw-bg">
        <span role="img" aria-label="paw" style={{ fontSize: 62, opacity: 0.22 }}>
          🐾
        </span>
      </div>
      <div className="profile-avatar" onClick={() => inputRef.current.click()}>
        {profile.image ? (
          <img src={profile.image} alt="Pet profile" />
        ) : (
          <span role="img" aria-label="pet" className="avatar-default">
            🐶
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>
      <input
        className="profile-name"
        type="text"
        placeholder="Your Pet's Name"
        maxLength={24}
        value={profile.name}
        onChange={handleNameChange}
        aria-label="Pet name"
      />
      <div className="profile-hint">
        <span>Click the image to upload your pet's photo.</span>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function AddMemoryModal({ show, onClose, onAdd }) {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);

  if (!show) return null;

  const handleChange = e => setText(e.target.value);

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto({ name: file.name, url: reader.result });
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setText('');
    setPhoto(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!text && !photo) return;
    const createdAt = new Date();
    onAdd({
      text,
      photo,
      createdAt
    });
    reset();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <h2>Add Memory</h2>
        <form className="memory-form" onSubmit={handleSubmit}>
          <textarea
            className="memory-input"
            rows={4}
            placeholder="Write your memory here..."
            value={text}
            onChange={handleChange}
            maxLength={500}
            aria-label="Memory description"
          />
          <div className="form-row">
            <input
              type="file"
              accept="image/*"
              id="memory-photo"
              onChange={handlePhoto}
              style={{ display: 'none' }}
            />
            <label htmlFor="memory-photo" className="btn-outline" tabIndex={0}>
              {photo ? "Change Photo" : "Upload Photo"}
            </label>
            {photo && (
              <img src={photo.url} alt="Selected" className="photo-preview" />
            )}
          </div>
          <button className="btn" type="submit" style={{ width: '100%' }}>
            Add Memory
          </button>
        </form>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Timeline({ memories, onAddMemory }) {
  const [showModal, setShowModal] = useState(false);

  // Most recent first
  const sorted = [...memories].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section>
      <div className="page-header">
        <h2>Timeline</h2>
        <button className="btn" onClick={() => setShowModal(true)}>Add Memory</button>
      </div>
      <AddMemoryModal show={showModal} onClose={() => setShowModal(false)} onAdd={onAddMemory} />
      <div className="timeline">
        {sorted.length === 0 && (
          <div className="empty-state">No memories yet. Add your first one!</div>
        )}
        {sorted.map((m, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-date">{m.createdAt.toLocaleDateString()} {m.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            {m.photo && <img src={m.photo.url} className="timeline-photo" alt="Memory visual" />}
            <div className="timeline-text">{m.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Photos({ photos, onAddPhoto }) {
  const inputRef = useRef(null);

  const handleUpload = e => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onAddPhoto({ name: file.name, url: reader.result, createdAt: new Date() });
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  return (
    <section>
      <div className="page-header">
        <h2>Photos</h2>
        <button className="btn-outline" onClick={() => inputRef.current.click()}>Upload Photo</button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>
      <div className="photo-grid">
        {photos.length === 0 && <div className="empty-state">You haven't added any photos yet!</div>}
        {photos.map((p, i) => (
          <div className="photo-card" key={i}>
            <img src={p.url} alt="Uploaded" className="photo-img" />
          </div>
        ))}
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Milestones({ milestones, onAddMilestone }) {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!text || !date) return;
    onAddMilestone({
      text, date: new Date(date)
    });
    setShowForm(false);
    setText('');
    setDate('');
  };

  // Chronological order
  const sorted = [...milestones].sort((a, b) => a.date - b.date);

  return (
    <section>
      <div className="page-header">
        <h2>Milestones</h2>
        <button className="btn-outline" onClick={() => setShowForm(v => !v)}>
          {showForm ? "Cancel" : "Add Milestone"}
        </button>
      </div>
      {showForm && (
        <form className="milestone-form" onSubmit={handleSubmit}>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setDate(e.target.value)}
            className="milestone-date"
            required
          />
          <input
            type="text"
            value={text}
            maxLength={75}
            onChange={e => setText(e.target.value)}
            className="milestone-text"
            placeholder="Describe the milestone..."
            required
          />
          <button className="btn" type="submit">Add</button>
        </form>
      )}
      <ul className="milestone-list">
        {sorted.length === 0 && <div className="empty-state">No milestones yet.</div>}
        {sorted.map((m, idx) => (
          <li className="milestone-item" key={idx}>
            <span className="milestone-dot"></span>
            <span className="milestone-date-txt">{m.date.toLocaleDateString()}</span>
            <span className="milestone-desc">{m.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// PUBLIC_INTERFACE
function Scrapbook({ profile, memories, photos, milestones }) {
  // Compose scrapbook content: timeline memories, milestones, photo grid
  // Allow user to trigger Print.
  const contentRef = useRef();

  function handlePrint() {
    window.print();
  }

  const sortedMemories = [...memories].sort((a, b) => a.createdAt - b.createdAt);
  const sortedMilestones = [...milestones].sort((a, b) => a.date - b.date);

  return (
    <section>
      <div className="page-header">
        <h2>Scrapbook</h2>
        <button className="btn-outline" onClick={handlePrint}>Print This Scrapbook</button>
      </div>
      <div className="scrapbook-content" ref={contentRef}>
        <div className="scrapbook-header">
          <div className="scrapbook-avatar">
            {profile.image 
              ? <img src={profile.image} alt="Pet" />
              : <span className="scrapbook-avatar-default">🐾</span>}
          </div>
          <h2 className="scrapbook-title">{profile.name ? profile.name + "'s Memory Book" : "My Pet's Scrapbook"}</h2>
        </div>
        <div className="scrapbook-section">
          <h3>Timeline Memories</h3>
          {sortedMemories.length === 0 && <div className="empty-state">No memories yet!</div>}
          <ul className="scrapbook-memories">
            {sortedMemories.map((m, idx) => (
              <li key={idx} className="scrapbook-memory-item">
                {m.photo && <img src={m.photo.url} alt="Scrapbook memory" className="scrapbook-memory-photo" />}
                <div>
                  <div className="scrapbook-memory-date">{m.createdAt.toLocaleDateString()}</div>
                  <div className="scrapbook-memory-text">{m.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="scrapbook-section">
          <h3>Milestones</h3>
          {sortedMilestones.length === 0 && <div className="empty-state">No milestones added!</div>}
          <ul className="scrapbook-milestones">
            {sortedMilestones.map((m, idx) => (
              <li key={idx} className="scrapbook-milestone-item">
                <span className="scrapbook-milestone-date">{m.date.toLocaleDateString()}</span>
                <span className="scrapbook-milestone-text">{m.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="scrapbook-section">
          <h3>Photo Gallery</h3>
          <div className="scrapbook-photo-grid">
            {photos.length === 0 && <div className="empty-state">No photos yet!</div>}
            {photos.map((p, i) => (
              <img key={i} src={p.url} alt="Pet" className="scrapbook-photo-img" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function ShareableStory({ profile, memories, milestones, photos }) {
  // Frontend-only: Generate a shareable link, but for demo, mock story modal (copy link, or local download JSON)
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");

  // Simulate a link generation.
  const handleShare = () => {
    // This would generate a unique URL if backend existed; instead, download JSON.
    setShow(true);
    setUrl(window.location.href + "#/share/" + Math.random().toString(36).slice(2,10));
  };

  const handleDownload = () => {
    const data = {
      profile, 
      memories: memories.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString()
      })),
      milestones: milestones.map(m => ({
        ...m,
        date: m.date.toISOString()
      })),
      photos
    };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name || "pet"}-story.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="page-header">
        <h2>Shareable Story</h2>
        <button className="btn-outline" onClick={handleShare}>Generate Link</button>
      </div>
      {show && (
        <div className="modal-backdrop">
          <div className="modal" style={{minWidth:320, textAlign:'center'}}>
            <button className="modal-close" onClick={()=>setShow(false)}>&times;</button>
            <h3>Your Shareable Story Link</h3>
            <div className="share-link">
              <input type="text" value={url} readOnly style={{width:"97%"}} />
              <button className="btn btn-mini"
                onClick={() => { navigator.clipboard&&navigator.clipboard.writeText(url); }}>
                Copy
              </button>
            </div>
            <p style={{fontSize:12, color:"var(--accent)", marginTop:7}}>
              <b>Note:</b> This is a mock (local only). To physically share your pet's story, download below!
            </p>
            <button className="btn-outline" onClick={handleDownload}>Download Story as JSON</button>
          </div>
        </div>
      )}
      <div className="description">
        Generate a shareable story link (local only in this demo). Or, download your pet's story as a file to share or print!
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function MainContainer() {
  // App State: all user-driven, held in-memory (no backend)
  const [section, setSection] = useState('profile');
  const [profile, setProfile] = useState({ name: '', image: '' });
  const [memories, setMemories] = useState([]); // [{text, photo, createdAt}]
  const [photos, setPhotos] = useState([]); // [{name,url,createdAt}]
  const [milestones, setMilestones] = useState([]); // [{text,date}]

  // When a new memory is added, extract photo to photos if present
  const onAddMemory = m => {
    setMemories(items => [{ ...m, createdAt: new Date(m.createdAt) }, ...items]);
    if (m.photo) setPhotos(items => [{ ...m.photo, createdAt: new Date() }, ...items]);
  };

  const onAddPhoto = p => setPhotos(items => [{ ...p, createdAt: new Date() }, ...items]);
  const onAddMilestone = m => setMilestones(items => [...items, { ...m, date: new Date(m.date) }]);

  // For navigation, reset scroll
  const handleNavigate = sec => {
    setSection(sec); 
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-root">
      <ThemeVars />
      <Navbar current={section} onNavigate={handleNavigate} />
      <main className="main-content" style={{ marginTop: 'var(--appbar-height)' }}>
        <div className="container">
          {section === 'profile' && (
            <PetProfile profile={profile} setProfile={setProfile} />
          )}
          {section === 'timeline' && (
            <Timeline memories={memories} onAddMemory={onAddMemory} />
          )}
          {section === 'photos' && (
            <Photos photos={photos} onAddPhoto={onAddPhoto} />
          )}
          {section === 'milestones' && (
            <Milestones milestones={milestones} onAddMilestone={onAddMilestone} />
          )}
          {section === 'scrapbook' && (
            <Scrapbook profile={profile} memories={memories} photos={photos} milestones={milestones} />
          )}
          {section === 'shareable' && (
            <ShareableStory profile={profile} memories={memories} photos={photos} milestones={milestones} />
          )}
        </div>
      </main>
    </div>
  );
}

export default MainContainer;
