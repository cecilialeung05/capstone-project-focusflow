import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';
import './DraggableTagList.scss';

function DraggableTagList({ tags, onTagDrop }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const tagId = parseInt(result.draggableId);
    const destinationType = result.destination.droppableId; // 'task' or 'note'
    const destinationId = parseInt(destinationType.split('-')[1]);
    
    onTagDrop(tagId, destinationType, destinationId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tags-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="draggable-tags"
          >
            {tags.map((tag, index) => (
              <Draggable
                key={tag.id}
                draggableId={tag.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`draggable-tags__item ${
                      snapshot.isDragging ? 'draggable-tags__item--dragging' : ''
                    }`}
                  >
                    <span {...provided.dragHandleProps} className="draggable-tags__handle">
                      <FaGripVertical />
                    </span>
                    <span className="draggable-tags__name">{tag.name}</span>
                    <span className="draggable-tags__count">({tag.taskCount})</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableTagList; 