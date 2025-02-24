// import React from 'react';
// import { Link } from 'react-router-dom';
// import { formatDate } from '../../utils/dateUtils';
// import TagBadges from '../Tags/TagBadges';

// function NoteCard({ note, onEdit, onDelete, showActions = true }) {
//   return (
//     <div className="note-card">
//       <div className="note-card__header">
//         <h3><Link to={`/notes/${note.id}`}>{note.title}</Link></h3>
//         <span className="note-card__date">{formatDate(note.created_at)}</span>
//       </div>
//       <div className="note-card__content">
//         <TagBadges 
//           tags={note.tags} 
//           itemTags={note.note_tags}
//         />
//         {note.content.substring(0, 100)}...
//       </div>
//       {showActions && (
//         <div className="note-card__actions">
//           <button onClick={onEdit}>Edit</button>
//           <button onClick={onDelete}>Delete</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default NoteCard; 